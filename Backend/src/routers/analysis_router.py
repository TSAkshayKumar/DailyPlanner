from fastapi import APIRouter, Query
from typing import Optional, List
from models.analysis_models import SaveAnalysisRequest, AnalysisCheckItem
from services.analysis_service import (
    get_analysis_service,
    save_analysis_service,
    save_analysis_checks_service,
    sync_analysis_service
)

router = APIRouter(prefix="", tags=["Analysis"])


@router.get("/analysis")
def get_analysis(date: Optional[str] = Query(None)):
    return get_analysis_service(date)


@router.post("/save-analysis")
def save_analysis(payload: SaveAnalysisRequest):
    return save_analysis_service(payload)


@router.post("/analysis-checks-save")
def save_analysis_checks(items: List[AnalysisCheckItem]):
    return save_analysis_checks_service(items)


@router.post("/sync-analysis")
def sync_analysis():
    return sync_analysis_service()