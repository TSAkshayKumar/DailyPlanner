from openpyxl import load_workbook
import pytz
from util.excel_cleanup import remove_empty_rows_from_all_tables
from util.constant import (
    EXCEL_FILE,
    DAILY_TASK_SHEET_NAME,
    GOAL_SHEET_NAME,
    ANALYSIS_SHEET_NAME,
    PRIORITY_TABLE,
    SCORE_TABLE,
    SCORE_TABLE_SHEET_NAME,
    TRACKER_TABLE,
    TRACKER_TABLE_SHEET_NAME,
    IST_TIMEZONE,
    PRIORITY_COLUMNS,
    SCORE_COLUMNS,
    TRACKER_COLUMNS
)
from datetime import datetime
from util.excel_helpers import (
    get_last_7_days_range,
    get_table, 
    get_table_column_index_map, 
    get_table_rows
)
# @app.post("/cleanup-empty-rows")
# -----------------------------------------------------------
# Get Clean Table 
# -----------------------------------------------------------
def cleanup_empty_rows_service():
    cleaned = remove_empty_rows_from_all_tables(
        excel_file=EXCEL_FILE,
        sheet_names=[
            DAILY_TASK_SHEET_NAME,
            GOAL_SHEET_NAME,
            ANALYSIS_SHEET_NAME
        ]
    )

    return {
        "message": "Empty rows removed successfully from all tables",
        "cleaned_tables": cleaned
    }

# @app.get("/past-days")
# -----------------------------------------------------------
# Daily report for last 7 days 
# -----------------------------------------------------------
def daily_report_last_7_days_service(current_date):
    IST = pytz.timezone(IST_TIMEZONE)
    start_date, end_date = get_last_7_days_range(current_date)

    wb = load_workbook(EXCEL_FILE, data_only=True)
    ws = wb[DAILY_TASK_SHEET_NAME]
    ws_score = wb[SCORE_TABLE_SHEET_NAME]
    ws_tracker= wb[TRACKER_TABLE_SHEET_NAME]

    # ---- Load Tables ----
    priority_table = get_table(ws, PRIORITY_TABLE)
    score_table = get_table(ws_score, SCORE_TABLE)
    tracker_table = get_table(ws_tracker, TRACKER_TABLE)

    priority_map = get_table_column_index_map(ws, priority_table)
    score_map = get_table_column_index_map(ws_score, score_table)
    tracker_map = get_table_column_index_map(ws_tracker, tracker_table)

    priority_rows = get_table_rows(ws, priority_table, priority_map)
    score_rows = get_table_rows(ws_score, score_table, score_map)
    tracker_rows = get_table_rows(ws_tracker, tracker_table, tracker_map)

    result = {
        "range": {
            "from": start_date.strftime("%Y-%m-%d"),
            "to": end_date.strftime("%Y-%m-%d")
        },
        "priority_tasks": [],
        "scores": [],
        "tracker": []
    }

    # ---- PRIORITY TABLE ----
    for row in priority_rows:
        dt = row[PRIORITY_COLUMNS["datetime"]]
        if not dt:
            continue

        # --- NORMALIZE DATETIME ---
        if isinstance(dt, datetime):
            dt = dt

        elif isinstance(dt, str):
            try:
                # Adjust format if needed
                dt = datetime.strptime(dt.strip(), "%Y-%m-%d %H:%M:%S")
            except ValueError:
                # Skip invalid date formats
                continue
        else:
            continue

        if dt.tzinfo is None:
            dt = IST.localize(dt)

        if start_date <= dt <= end_date:
            result["priority_tasks"].append({
                "datetime": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "task_id": row[PRIORITY_COLUMNS["task_id"]],
                "task_type": row[PRIORITY_COLUMNS["task_type"]],
                "task": row[PRIORITY_COLUMNS["task_name"]],
                "status": row[PRIORITY_COLUMNS["status"]],
            })

    # ---- SCORE TABLE ----
    for row in score_rows:
        date_val = row[SCORE_COLUMNS["date"]]
        if not date_val:
            continue
        
        # --- NORMALIZE DATETIME ---
        if isinstance(date_val, datetime):
            date_val = date_val

        elif isinstance(date_val, str):
            try:
                # Adjust format if needed
                date_val = datetime.strptime(date_val.strip(), "%Y-%m-%d %H:%M:%S")
            except ValueError:
                # Skip invalid date formats
                continue
        else:
            continue

        date_val = IST.localize(
            datetime.combine(date_val, datetime.min.time())
        )

        if start_date <= date_val <= end_date:
            threshold = row[SCORE_COLUMNS["threshold"]] or 0
            score = row[SCORE_COLUMNS["score"]] or 0

            completion = (
                round((score / threshold) * 100, 2)
                if threshold else 0
            )

            result["scores"].append({
                "date": date_val.strftime("%Y-%m-%d"),
                "score_id": row[SCORE_COLUMNS["score_id"]],
                "threshold": threshold,
                "score": score,
                "completion_percent": completion
            })

    # ---- TRACKER TABLE ----
    for row in tracker_rows:
        dt = row[TRACKER_COLUMNS["datetime"]]
        if not dt:
            continue

        # --- NORMALIZE DATETIME ---
        if isinstance(dt, datetime):
            dt = dt

        elif isinstance(dt, str):
            try:
                # Adjust format if needed
                dt = datetime.strptime(dt.strip(), "%Y-%m-%d %H:%M:%S")
            except ValueError:
                # Skip invalid date formats
                continue
        else:
            continue

        if dt.tzinfo is None:
            dt = IST.localize(dt)

        if start_date <= dt <= end_date:
            tracker_entry = {
                "datetime": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "tracker_id": row[TRACKER_COLUMNS["tracker_id"]],
            }

            # include all hourly fields dynamically
            for key, col_name in TRACKER_COLUMNS.items():
                if key not in ["datetime", "tracker_id"]:
                    tracker_entry[key] = row[col_name]

            result["tracker"].append(tracker_entry)

    return result