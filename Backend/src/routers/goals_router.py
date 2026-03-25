from fastapi import APIRouter, Query
from typing import Optional
from util.constant import IST_TIMEZONE
import pytz
from util.excel_helpers import get_last_three_month_window
from models.goal_models import SaveGoalRequest
from services.goal_service import (
    get_goals_service,
    save_goals_service,
    get_goals_by_month_range_service
)

router = APIRouter(prefix="", tags=["Goals"])


@router.get("/goals")
def get_goals(date: Optional[str] = Query(None, description="YYYY-MM-DD (IST)")):
    return get_goals_service(date)


@router.post("/save-goals")
def save_goals(payload: SaveGoalRequest):
    return save_goals_service(payload)


@router.get("/goals-by-month-range")
def get_goals_by_month_range(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000)
):
    IST = pytz.timezone(IST_TIMEZONE)
    start_date, end_date = get_last_three_month_window(month, year, IST)
    return get_goals_by_month_range_service(start_date, end_date, year, month, IST)