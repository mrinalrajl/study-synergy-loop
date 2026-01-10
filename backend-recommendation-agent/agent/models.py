import os
from sqlalchemy import Table, Column, Integer, String, MetaData, DateTime, Float, JSON
from sqlalchemy import create_engine, select, func
from sqlalchemy.sql import and_
from datetime import datetime
import databases

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./loopbot_agent.db')

database = databases.Database(DATABASE_URL)
metadata = MetaData()

events = Table(
    'events', metadata,
    Column('id', Integer, primary_key=True),
    Column('user_id', String, index=True),
    Column('event_type', String),
    Column('timestamp', DateTime, default=datetime.utcnow),
    Column('duration', Float, default=0.0),
    Column('metadata', JSON, default={}),
)

user_progress = Table(
    'user_progress', metadata,
    Column('id', Integer, primary_key=True),
    Column('user_id', String, index=True),
    Column('course_id', String),
    Column('completed_modules', Integer, default=0),
    Column('total_modules', Integer, default=0),
)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith('sqlite') else {})

async def init_db():
    # create database and tables if not present
    metadata.create_all(engine)
    await database.connect()

async def close_db():
    await database.disconnect()

async def insert_event(user_id: str, event_type: str, timestamp: datetime, duration: float, metadata_obj: dict):
    query = events.insert().values(user_id=user_id, event_type=event_type, timestamp=timestamp, duration=duration, metadata=metadata_obj)
    last_id = await database.execute(query)
    return last_id

async def get_recent_events(user_id: str, limit: int = 200):
    query = select([events]).where(events.c.user_id == user_id).order_by(events.c.timestamp.desc()).limit(limit)
    rows = await database.fetch_all(query)
    result = []
    for r in rows:
        result.append({
            'id': r['id'],
            'user_id': r['user_id'],
            'event_type': r['event_type'],
            'timestamp': r['timestamp'].isoformat() if r['timestamp'] else None,
            'duration': r['duration'],
            'metadata': r['metadata']
        })
    return result

async def get_progress(user_id: str):
    # Basic: aggregate progress across user's courses
    query = select([func.sum(user_progress.c.completed_modules).label('completed'), func.sum(user_progress.c.total_modules).label('total')]).where(user_progress.c.user_id == user_id)
    row = await database.fetch_one(query)
    if not row:
        return {'completed': 0, 'total': 0}
    return {'completed': int(row['completed'] or 0), 'total': int(row['total'] or 0)}
