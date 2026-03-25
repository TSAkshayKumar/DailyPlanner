from pydantic import BaseModel
from typing import List


# --------------------------------------------------
# GOALS
# --------------------------------------------------

class GoalItem(BaseModel):
    goal_id: str
    goal: str
    goal_type: str      # High / Medium / Low
    last_date: str      # YYYY-MM-DD
    status: str         # yet / progress / done


class SaveGoalRequest(BaseModel):
    goals: List[GoalItem]