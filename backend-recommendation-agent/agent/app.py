from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime
import asyncio

from . import models, snr, recommendations

app = FastAPI(title="Loopbot Agent API")

# Pydantic schemas
class EventIn(BaseModel):
    user_id: str
    event_type: str
    timestamp: Optional[datetime] = None
    duration: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None

class ProgressOut(BaseModel):
    user_id: str
    completed_modules: int
    total_modules: int
    percent: float

@app.on_event("startup")
async def startup():
    await models.init_db()

@app.post("/events/track")
async def track_event(ev: EventIn):
    ts = ev.timestamp or datetime.utcnow()
    rec = await models.insert_event(ev.user_id, ev.event_type, ts, ev.duration or 0.0, ev.metadata or {})
    return {"status": "ok", "id": rec}

@app.get("/users/{user_id}/snr")
async def get_snr(user_id: str):
    events = await models.get_recent_events(user_id, limit=500)
    if not events:
        raise HTTPException(status_code=404, detail="No events for user")
    score, breakdown = snr.compute_snr(events)
    return {"user_id": user_id, "snr": score, "breakdown": breakdown}

@app.get("/users/{user_id}/recommendations")
async def get_recommendations(user_id: str):
    # pull user progress
    progress = await models.get_progress(user_id)
    recs = recommendations.generate_recommendations(user_id, progress)
    return {"user_id": user_id, "recommendations": recs}

@app.get("/users/{user_id}/progress", response_model=ProgressOut)
async def get_progress(user_id: str):
    p = await models.get_progress(user_id)
    return ProgressOut(user_id=user_id, completed_modules=p['completed'], total_modules=p['total'], percent=(p['completed']/p['total']*100) if p['total']>0 else 0.0)

@app.get('/health')
async def health():
    return {"status":"ok"}
