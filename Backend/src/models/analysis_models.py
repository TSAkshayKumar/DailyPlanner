from pydantic import BaseModel
from typing import List


# --------------------------------------------------
# ANALYSIS
# --------------------------------------------------

class SaveAnalysisRequest(BaseModel):
    entry_id: str
    analysis: str
    improvement: str
    status: str


class AnalysisCheckItem(BaseModel):
    id: int
    entry: str