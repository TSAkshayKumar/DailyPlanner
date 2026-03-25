from fastapi import APIRouter, Query
from typing import Optional
from services.report_service import (
    daily_report_last_7_days_service,
    cleanup_empty_rows_service
)

router = APIRouter(prefix="", tags=["Reports"])


@router.get("/past-days")
def get_past_days(current_date: str = Query(..., example="2026-01-07")):
    return daily_report_last_7_days_service(current_date)


@router.post("/cleanup-empty-rows")
def cleanup_empty_rows():
    return cleanup_empty_rows_service()