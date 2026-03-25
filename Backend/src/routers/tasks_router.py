from fastapi import APIRouter, Query
from models.task_models import SaveTaskRequest, SaveReminderRequest, SaveScoreRequest, SaveTrackerRequest
from services.task_service import (
    get_daily_tasks_service,
    save_priority_tasks_service,
    save_reminders_service,
    save_tracker_service,
    save_score_service
)

router = APIRouter(prefix="", tags=["Tasks"])


@router.get("/daily-tasks")
def get_daily_tasks(date: str = Query(..., description="YYYY-MM-DD (IST)")):
    return get_daily_tasks_service(date)


@router.post("/save-priority-tasks")
def save_priority_tasks(payload: SaveTaskRequest):
    print("Received payload for saving priority tasks:", payload)
    return save_priority_tasks_service(payload)


@router.post("/save-reminders")
def save_reminders(payload: SaveReminderRequest):
    return save_reminders_service(payload)


@router.post("/save-tracker")
def save_tracker(payload: SaveTrackerRequest):
    return save_tracker_service(payload)


@router.post("/save-score")
def save_score(payload: SaveScoreRequest):
    return save_score_service(payload)

@router.post("/save-tracker")
def save_tracker(payload: SaveTrackerRequest):
    return save_tracker_service(payload)