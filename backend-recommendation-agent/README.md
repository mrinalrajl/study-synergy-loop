Python Agent scaffold — Loopbot + Course Recommendations + SNR

Overview
- FastAPI service that ingests user activity events, stores them in SQLite/Postgres, computes a simple SNR concentration metric, and provides course recommendation and progress endpoints.

Quick start

1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

2. Run the app:

```bash
uvicorn agent.app:app --reload --port 8001
```

Endpoints
- POST /events/track — send user events (type, duration, metadata)
- GET /users/{user_id}/snr — returns latest SNR score and breakdown
- GET /users/{user_id}/recommendations — simple recommendations stub
- GET /users/{user_id}/progress — course progress summary

Notes
- This scaffold uses SQLite for simplicity. Swap to Postgres by updating the DATABASE_URL env var.
- The SNR metric here is a heuristic baseline. You should validate with real telemetry and refine weights.
