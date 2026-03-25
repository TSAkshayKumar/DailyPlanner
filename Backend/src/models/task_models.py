from pydantic import BaseModel
from typing import List, Dict


# --------------------------------------------------
# TASKS
# --------------------------------------------------

class TaskItem(BaseModel):
    task_id: str
    task_name: str
    status: str


class SaveTaskRequest(BaseModel):
    task_type: str
    tasks: List[TaskItem]
    selected_date: str  # YYYY-MM-DD


# --------------------------------------------------
# REMINDERS
# --------------------------------------------------

class ReminderItem(BaseModel):
    reminder_id: str
    reminder: str


class SaveReminderRequest(BaseModel):
    reminders: List[ReminderItem]


# --------------------------------------------------
# SCORE
# --------------------------------------------------

class SaveScoreRequest(BaseModel):
    date: str              # YYYY-MM-DD (IST)
    score_id: str
    threshold: float
    current_score: float
    rewards: str = ""
    punishment: str = ""


# --------------------------------------------------
# TRACKER
# --------------------------------------------------

class SaveTrackerRequest(BaseModel):
    tracker_id: str
    values: Dict[str, str]   # key = TRACKER_COLUMNS key