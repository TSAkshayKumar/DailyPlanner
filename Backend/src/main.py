from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.tasks_router import router as tasks_router
from routers.goals_router import router as goals_router
from routers.analysis_router import router as analysis_router
from routers.reports_router import router as reports_router

# --------------------------------------------------
# APP INITIALIZATION
# --------------------------------------------------

app = FastAPI(
    title="Planner Backend API",
    description="Personal Planner API using FastAPI + Excel",
    version="1.0.0"
)


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

origins = [
    "http://localhost:3000",   
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://daily-planner-three-sand.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# ROUTERS
# --------------------------------------------------

app.include_router(tasks_router, prefix="/api", tags=["Tasks"])
app.include_router(goals_router, prefix="/api", tags=["Goals"])
app.include_router(analysis_router, prefix="/api", tags=["Analysis"])
app.include_router(reports_router, prefix="/api", tags=["Reports"])


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "Planner API running",
        "version": "1.0.0"
    }

# from fastapi import FastAPI, Query
# from pydantic import BaseModel
# from typing import List, Optional , Dict, Any
# from datetime import datetime, timedelta
# import pytz
# from dateutil.relativedelta import relativedelta
# from collections import defaultdict
# from fastapi.middleware.cors import CORSMiddleware

# from openpyxl import load_workbook
# from openpyxl.utils import range_boundaries, get_column_letter
# from util.excel_cleanup import remove_empty_rows_from_all_tables

# from util.constant import (
#     EXCEL_FILE,
#     DAILY_TASK_SHEET_NAME,
#     IST_TIMEZONE,
#     PRIORITY_TABLE,
#     PRIORITY_COLUMNS,
#     REMINDER_TABLE,
#     REMINDER_COLUMNS,
#     SCORE_TABLE,
#     SCORE_COLUMNS,
#     TRACKER_TABLE,
#     TRACKER_COLUMNS,
#     TRACKER_START_COL,
#     GOAL_TABLE,
#     GOAL_COLUMNS,
#     GOAL_SHEET_NAME,
#     ANALYSIS_TABLE,
#     ANALYSIS_SHEET_NAME,
#     ANALYSIS_COLUMNS,
#     DO_ANALYSIS_TABLE,
#     DO_ANALYSIS_START_COL
# )

# app = FastAPI()
# IST = pytz.timezone(IST_TIMEZONE)

# # --------------------------------------------------
# # CORS Middleware
# # --------------------------------------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",   # CRA
#         "http://localhost:5173",   # Vite
#         "http://127.0.0.1:5173",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # --------------------------------------------------
# # MODELS
# # --------------------------------------------------

# class TaskItem(BaseModel):
#     task_id: str
#     task_name: str
#     status: str


# class SaveTaskRequest(BaseModel):
#     task_type: str
#     tasks: List[TaskItem]


# class ReminderItem(BaseModel):
#     reminder_id: str
#     reminder: str


# class SaveReminderRequest(BaseModel):
#     reminders: List[ReminderItem]

# class SaveScoreRequest(BaseModel):
#     date: str              # YYYY-MM-DD (IST)
#     score_id: str
#     threshold: float
#     current_score: float
#     rewards: str = ""
#     punishment: str = ""

# class SaveTrackerRequest(BaseModel):
#     tracker_id: str
#     values: dict  # key = TRACKER_COLUMNS key, value = string

# class GoalItem(BaseModel):
#     goal_id: str
#     goal: str
#     goal_type: str      # High / Medium / Low
#     last_date: str      # YYYY-MM-DD
#     status: str         # yet / progress / done


# class SaveGoalRequest(BaseModel):
#     goals: List[GoalItem]

# class SaveAnalysisRequest(BaseModel):
#     entry_id: str
#     analysis: str
#     improvement: str
#     status: str

# class AnalysisCheckItem(BaseModel):
#     id: int
#     entry: str

# # # --------------------------------------------------
# # # HELPERS
# # # --------------------------------------------------

# # def get_ist_datetime():
# #     return datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S")


# # def get_table(ws, table_name):
# #     if table_name not in ws.tables:
# #         raise ValueError(f"Excel table '{table_name}' not found")
# #     return ws.tables[table_name]


# # def get_table_column_index_map(ws, table):
# #     min_col, min_row, max_col, _ = range_boundaries(table.ref)
# #     headers = [
# #         ws.cell(row=min_row, column=col).value
# #         for col in range(min_col, max_col + 1)
# #     ]
# #     return {header: idx + min_col for idx, header in enumerate(headers)}


# # def get_table_rows(ws, table, col_map):
# #     min_col, min_row, max_col, max_row = range_boundaries(table.ref)
# #     rows = []

# #     for r in range(min_row + 1, max_row + 1):
# #         row_data = {
# #             col: ws.cell(row=r, column=idx).value
# #             for col, idx in col_map.items()
# #         }
# #         row_data["_row"] = r
# #         rows.append(row_data)

# #     return rows


# # def insert_row_into_table(ws, table, col_map, values_dict):
# #     """
# #     Inserts row respecting table start column
# #     """
# #     min_col, min_row, max_col, max_row = range_boundaries(table.ref)
# #     new_row = max_row + 1

# #     for column_name, value in values_dict.items():
# #         ws.cell(
# #             row=new_row,
# #             column=col_map[column_name],
# #             value=value
# #         )

# #     table.ref = (
# #         f"{get_column_letter(min_col)}{min_row}:"
# #         f"{get_column_letter(max_col)}{new_row}"
# #     )

# # def upsert_score_for_today(
# #     ws,
# #     score_table,
# #     score_col_map,
# #     rows,
# #     today_date,
# #     current_score
# # ):
# #     """
# #     If today's date exists → update score
# #     Else → insert new row with defaults
# #     """

# #     # ---------- UPDATE ----------
# #     for row in rows:
# #         row_date = str(row[SCORE_COLUMNS["date"]])[:10]

# #         if row_date == today_date:
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=score_col_map[SCORE_COLUMNS["score"]],
# #                 value=current_score
# #             )
# #             return

# #     # ---------- INSERT ----------
# #     insert_row_into_table(
# #         ws,
# #         score_table,
# #         score_col_map,
# #         {
# #             SCORE_COLUMNS["date"]: today_date,
# #             SCORE_COLUMNS["score_id"]: f"S-{today_date}",
# #             SCORE_COLUMNS["threshold"]: 0,
# #             SCORE_COLUMNS["score"]: current_score,
# #             SCORE_COLUMNS["rewards"]: "",
# #             SCORE_COLUMNS["punishment"]: ""
# #         }
# #     )

# # def get_tracker_column_index_map():
# #     """
# #     Returns:
# #     {
# #       "Date & Time (IST)": 18,
# #       "Tracker Id": 19,
# #       "05:00 AM Set Task": 20,
# #       ...
# #     }
# #     """
# #     col_map = {}
# #     current_col = TRACKER_START_COL

# #     for header in TRACKER_COLUMNS.values():
# #         col_map[header] = current_col
# #         current_col += 1

# #     return col_map

# # def find_tracker_row(ws, col_map, tracker_id):
# #     tracker_id_col = col_map[TRACKER_COLUMNS["tracker_id"]]

# #     for row in range(2, ws.max_row + 1):
# #         if ws.cell(row=row, column=tracker_id_col).value == tracker_id:
# #             return row

# #     return None

# # def get_goal_rows(ws):
# #     table = get_table(ws, GOAL_TABLE)
# #     col_map = get_table_column_index_map(ws, table)
# #     rows = get_table_rows(ws, table, col_map)
# #     return table, col_map, rows

# # def get_last_three_month_window(month: int, year: int, tz):
# #     """
# #     Returns:
# #     start_date = first day of (current month - 2)
# #     end_date   = last day of current month
# #     """

# #     current_month_start = datetime(year, month, 1, tzinfo=tz)

# #     start_date = current_month_start - relativedelta(months=2)

# #     end_date = (
# #         current_month_start
# #         + relativedelta(months=1)
# #         - relativedelta(seconds=1)
# #     )

# #     return start_date, end_date

# # def get_last_7_days_range(current_date_str: str):
# #     IST = pytz.timezone(IST_TIMEZONE)

# #     current_date = datetime.strptime(current_date_str, "%Y-%m-%d")
# #     current_date = IST.localize(current_date)

# #     start_date = current_date - timedelta(days=6)
# #     start_date = start_date.replace(hour=0, minute=0, second=0)

# #     end_date = current_date.replace(hour=23, minute=59, second=59)

# #     return start_date, end_date

# # # --------------------------------------------------
# # # PRIORITY TASK APIs
# # # --------------------------------------------------
# # @app.post("/save-priority-tasks")
# # def save_priority_tasks(payload: SaveTaskRequest):
# #     """
# #     Save or update priority tasks for the current day in the Excel tracker.

# #     This API performs the following operations:

# #     1. Loads the Excel workbook and accesses the daily task sheet.
# #     2. Reads the existing priority task table.
# #     3. Compares incoming tasks with the existing tasks for the current date.
# #     4. Deletes tasks that were removed from the frontend.
# #     5. Updates tasks that already exist.
# #     6. Inserts new tasks that do not exist in the table.
# #     7. Calculates the current daily score based on the number of tasks.
# #     8. Updates or inserts the score for today's date in the score table.
# #     9. Saves the workbook after all modifications.

# #     Parameters
# #     ----------
# #     payload : SaveTaskRequest
# #         Request body containing:
# #         - task_type : Type/category of tasks (e.g., Priority, Secondary)
# #         - tasks : List of tasks with task_id, task_name, and status

# #     Returns
# #     -------
# #     dict
# #         JSON response containing:
# #         - message : Confirmation message
# #         - date : Current date (IST)
# #         - current_score : Calculated score for today
# #     """

# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[DAILY_TASK_SHEET_NAME]

# #     # ---------------- PRIORITY ----------------
# #     table = get_table(ws, PRIORITY_TABLE)
# #     col_map = get_table_column_index_map(ws, table)
# #     rows = get_table_rows(ws, table, col_map)

# #     ist_datetime = get_ist_datetime()
# #     today = ist_datetime[:10]

# #     incoming_ids = {t.task_id for t in payload.tasks}

# #     # DELETE removed tasks
# #     for row in reversed(rows):
# #         row_date = str(row[PRIORITY_COLUMNS["datetime"]])[:10]

# #         if (
# #             row_date == today
# #             and row[PRIORITY_COLUMNS["task_type"]] == payload.task_type
# #             and row[PRIORITY_COLUMNS["task_id"]] not in incoming_ids
# #         ):
# #             ws.delete_rows(row["_row"])

# #     # INSERT / UPDATE
# #     for task in payload.tasks:
# #         matched = False

# #         for row in rows:
# #             row_date = str(row[PRIORITY_COLUMNS["datetime"]])[:10]

# #             if (
# #                 row_date == today
# #                 and row[PRIORITY_COLUMNS["task_type"]] == payload.task_type
# #                 and row[PRIORITY_COLUMNS["task_id"]] == task.task_id
# #             ):
# #                 ws.cell(row=row["_row"], column=col_map[PRIORITY_COLUMNS["datetime"]], value=ist_datetime)
# #                 ws.cell(row=row["_row"], column=col_map[PRIORITY_COLUMNS["task_name"]], value=task.task_name)
# #                 ws.cell(row=row["_row"], column=col_map[PRIORITY_COLUMNS["status"]], value=task.status)
# #                 matched = True
# #                 break

# #         if not matched:
# #             insert_row_into_table(
# #                 ws,
# #                 table,
# #                 col_map,
# #                 {
# #                     PRIORITY_COLUMNS["datetime"]: ist_datetime,
# #                     PRIORITY_COLUMNS["task_id"]: task.task_id,
# #                     PRIORITY_COLUMNS["task_type"]: payload.task_type,
# #                     PRIORITY_COLUMNS["task_name"]: task.task_name,
# #                     PRIORITY_COLUMNS["status"]: task.status
# #                 }
# #             )

# #     # ---------------- SCORE UPDATE ----------------
# #     score_table = get_table(ws, SCORE_TABLE)
# #     score_col_map = get_table_column_index_map(ws, score_table)
# #     score_rows = get_table_rows(ws, score_table, score_col_map)

# #     # 👉 decide how current score is calculated
# #     current_score = len(payload.tasks)  # or any logic you want

# #     upsert_score_for_today(
# #         ws=ws,
# #         score_table=score_table,
# #         score_col_map=score_col_map,
# #         rows=score_rows,
# #         today_date=today,
# #         current_score=current_score
# #     )

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "message": "Priority tasks & score updated",
# #         "date": today,
# #         "current_score": current_score
# #     }

# # # --------------------------------------------------
# # # REMINDER APIs (FIXED)
# # # --------------------------------------------------

# # @app.post("/save-reminders")
# # def save_reminders(payload: SaveReminderRequest):
# #     """
# #     Save or update daily reminders in the Excel reminder table.

# #     This API performs the following operations:

# #     1. Loads the Excel workbook and accesses the daily task sheet.
# #     2. Reads the reminder table and existing reminder rows.
# #     3. Identifies reminders received from the frontend request.
# #     4. Deletes reminders that were removed from the frontend for the current day.
# #     5. Updates existing reminders if their reminder_id already exists.
# #     6. Inserts new reminders if they do not exist in the table.
# #     7. Saves the updated workbook.

# #     Parameters
# #     ----------
# #     payload : SaveReminderRequest
# #         Request body containing:
# #         - reminders : List of reminders with reminder_id and reminder text.

# #     Returns
# #     -------
# #     dict
# #         JSON response containing:
# #         - message : Confirmation message
# #         - count : Number of reminders processed
# #     """

# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[DAILY_TASK_SHEET_NAME]

# #     table = get_table(ws, REMINDER_TABLE)
# #     col_map = get_table_column_index_map(ws, table)
# #     rows = get_table_rows(ws, table, col_map)

# #     ist_datetime = get_ist_datetime()
# #     today = ist_datetime[:10]

# #     incoming_ids = {r.reminder_id for r in payload.reminders}

# #     # DELETE removed reminders
# #     for row in reversed(rows):
# #         row_date = str(row[REMINDER_COLUMNS["datetime"]])[:10]

# #         if (
# #             row_date == today
# #             and row[REMINDER_COLUMNS["reminder_id"]] not in incoming_ids
# #         ):
# #             ws.delete_rows(row["_row"])

# #     # INSERT / UPDATE
# #     for reminder in payload.reminders:
# #         matched = False

# #         for row in rows:
# #             row_date = str(row[REMINDER_COLUMNS["datetime"]])[:10]

# #             if (
# #                 row_date == today
# #                 and row[REMINDER_COLUMNS["reminder_id"]] == reminder.reminder_id
# #             ):
# #                 ws.cell(row=row["_row"], column=col_map[REMINDER_COLUMNS["datetime"]], value=ist_datetime)
# #                 ws.cell(row=row["_row"], column=col_map[REMINDER_COLUMNS["reminder"]], value=reminder.reminder)
# #                 matched = True
# #                 break

# #         if not matched:
# #             insert_row_into_table(
# #                 ws,
# #                 table,
# #                 col_map,
# #                 {
# #                     REMINDER_COLUMNS["datetime"]: ist_datetime,
# #                     REMINDER_COLUMNS["reminder_id"]: reminder.reminder_id,
# #                     REMINDER_COLUMNS["reminder"]: reminder.reminder
# #                 }
# #             )

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "message": "Reminders saved successfully",
# #         "count": len(payload.reminders)
# #     }


# # # --------------------------------------------------
# # # SCORE APIs
# # # --------------------------------------------------
# # @app.post("/save-score")
# # def save_score(payload: SaveScoreRequest):
# #     """
# #     Save or update the daily score record in the Excel score table.

# #     This API manages the daily scoring information used for tracking
# #     productivity or performance metrics.

# #     Workflow:
# #     1. Loads the Excel workbook and accesses the score table.
# #     2. Checks whether a score record already exists for the given date.
# #     3. If a record exists, updates the score details.
# #     4. If no record exists, inserts a new row into the score table.
# #     5. Expands the Excel table range if a new row is inserted.
# #     6. Saves the workbook.

# #     Parameters
# #     ----------
# #     payload : SaveScoreRequest
# #         Request body containing:
# #         - date : Date for which the score is recorded
# #         - score_id : Unique identifier for the score entry
# #         - threshold : Target score threshold
# #         - current_score : Actual score achieved
# #         - rewards : Reward description for achieving the threshold
# #         - punishment : Punishment description if threshold is not met

# #     Returns
# #     -------
# #     dict
# #         JSON response containing:
# #         - message : Confirmation message
# #         - date : Date of the score entry
# #         - updated : Boolean indicating whether the record was updated or newly created
# #     """

# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[DAILY_TASK_SHEET_NAME]

# #     table = get_table(ws, SCORE_TABLE)
# #     col_map = get_table_column_index_map(ws, table)
# #     rows = get_table_rows(ws, table, col_map)

# #     matched = False

# #     # ---------- UPDATE if date exists ----------
# #     for row in rows:
# #         cell_value = row[SCORE_COLUMNS["date"]]

# #         if not cell_value:
# #             continue

# #         row_date = str(cell_value)[:10]

# #         if row_date == payload.date:
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[SCORE_COLUMNS["date"]],
# #                 value=payload.date
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[SCORE_COLUMNS["score_id"]],
# #                 value=payload.score_id
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[SCORE_COLUMNS["threshold"]],
# #                 value=payload.threshold
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[SCORE_COLUMNS["score"]],
# #                 value=payload.current_score
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[SCORE_COLUMNS["rewards"]],
# #                 value=payload.rewards
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[SCORE_COLUMNS["punishment"]],
# #                 value=payload.punishment
# #             )

# #             matched = True
# #             break

# #     # ---------- INSERT if date not found ----------
# #     if not matched:
# #         ws.append([
# #             payload.date,
# #             payload.score_id,
# #             payload.threshold,
# #             payload.current_score,
# #             payload.rewards,
# #             payload.punishment
# #         ])

# #         # expand table range
# #         min_col, min_row, max_col, _ = range_boundaries(table.ref)
# #         table.ref = (
# #             f"{ws.cell(min_row, min_col).coordinate}:"
# #             f"{ws.cell(ws.max_row, max_col).coordinate}"
# #         )

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "message": "Score saved successfully",
# #         "date": payload.date,
# #         "updated": matched
# #     }

# # # --------------------------------------------------
# # # Tracker APIs
# # # --------------------------------------------------
# # @app.post("/save-tracker")
# # def save_tracker(payload: SaveTrackerRequest):
# #     """
# #     Save or update time tracker data in the Excel tracker table.

# #     This API records planned vs actual time values for different
# #     time slots throughout the day.

# #     Workflow:
# #     1. Loads the Excel workbook and accesses the tracker sheet.
# #     2. Retrieves the column mapping for tracker fields.
# #     3. Checks if a tracker entry already exists using tracker_id.
# #     4. If the tracker entry exists, updates the corresponding row.
# #     5. If the tracker entry does not exist, inserts a new row.
# #     6. Stores the timestamp of the update.
# #     7. Saves the workbook.

# #     Parameters
# #     ----------
# #     payload : SaveTrackerRequest
# #         Request body containing:
# #         - tracker_id : Unique identifier for the tracker record
# #         - values : Dictionary of time-slot values (planned vs actual)

# #     Returns
# #     -------
# #     dict
# #         JSON response containing:
# #         - message : Confirmation message
# #         - tracker_id : Identifier of the tracker record
# #         - updated : Boolean indicating whether the record was updated or newly created
# #     """

# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[DAILY_TASK_SHEET_NAME]

# #     col_map = get_tracker_column_index_map()
# #     ist_datetime = get_ist_datetime()

# #     existing_row = find_tracker_row(ws, col_map, payload.tracker_id)

# #     # ---------------- UPDATE ----------------
# #     if existing_row:
# #         ws.cell(
# #             row=existing_row,
# #             column=col_map[TRACKER_COLUMNS["datetime"]],
# #             value=ist_datetime
# #         )

# #         for key, value in payload.values.items():
# #             if key in TRACKER_COLUMNS:
# #                 ws.cell(
# #                     row=existing_row,
# #                     column=col_map[TRACKER_COLUMNS[key]],
# #                     value=value
# #                 )

# #         wb.save(EXCEL_FILE)

# #         return {
# #             "message": "Tracker updated successfully",
# #             "tracker_id": payload.tracker_id,
# #             "updated": True
# #         }

# #     # ---------------- INSERT ----------------
# #     insert_row = ws.max_row + 1

# #     ws.cell(
# #         row=insert_row,
# #         column=col_map[TRACKER_COLUMNS["datetime"]],
# #         value=ist_datetime
# #     )

# #     ws.cell(
# #         row=insert_row,
# #         column=col_map[TRACKER_COLUMNS["tracker_id"]],
# #         value=payload.tracker_id
# #     )

# #     for key, value in payload.values.items():
# #         if key in TRACKER_COLUMNS:
# #             ws.cell(
# #                 row=insert_row,
# #                 column=col_map[TRACKER_COLUMNS[key]],
# #                 value=value
# #             )

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "message": "Tracker created successfully",
# #         "tracker_id": payload.tracker_id,
# #         "updated": False
# #     }


# # --------------------------------------------------
# # Gaol APIs
# # --------------------------------------------------
# # @app.get("/goals")
# # def get_goals(
# #     date: str = Query(..., description="YYYY-MM-DD (IST)")
# # ):
# #     wb = load_workbook(EXCEL_FILE, data_only=True)
# #     ws = wb[GOAL_SHEET_NAME]

# #     table, col_map, rows = get_goal_rows(ws)

# #     goals = []

# #     for row in rows:
# #         cell_value = row[GOAL_COLUMNS["datetime"]]
# #         if not cell_value:
# #             continue

# #         if str(cell_value)[:10] == date:
# #             goals.append({
# #                 "goal_id": row[GOAL_COLUMNS["goal_id"]],
# #                 "goal": row[GOAL_COLUMNS["goal"]],
# #                 "goal_type": row[GOAL_COLUMNS["goal_type"]],
# #                 "last_date": row[GOAL_COLUMNS["last_date"]],
# #                 "status": row[GOAL_COLUMNS["status"]],
# #             })

# #     return {
# #         "date": date,
# #         "goals": goals
# #     }


# # @app.post("/save-goals")
# # def save_goals(payload: SaveGoalRequest):

# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[GOAL_SHEET_NAME]

# #     table, col_map, rows = get_goal_rows(ws)

# #     ist_datetime = get_ist_datetime()
# #     today = ist_datetime[:10]

# #     incoming_ids = {g.goal_id for g in payload.goals}

# #     # ---------------- DELETE REMOVED GOALS ----------------
# #     for row in reversed(rows):
# #         row_date = str(row[GOAL_COLUMNS["datetime"]])[:10]

# #         if (
# #             row_date == today
# #             and row[GOAL_COLUMNS["goal_id"]] not in incoming_ids
# #         ):
# #             ws.delete_rows(row["_row"])

# #     # ---------------- INSERT / UPDATE ----------------
# #     for goal in payload.goals:
# #         matched = False

# #         for row in rows:
# #             row_date = str(row[GOAL_COLUMNS["datetime"]])[:10]

# #             if (
# #                 row_date == today
# #                 and row[GOAL_COLUMNS["goal_id"]] == goal.goal_id
# #             ):
# #                 ws.cell(row=row["_row"], column=col_map[GOAL_COLUMNS["datetime"]], value=ist_datetime)
# #                 ws.cell(row=row["_row"], column=col_map[GOAL_COLUMNS["goal"]], value=goal.goal)
# #                 ws.cell(row=row["_row"], column=col_map[GOAL_COLUMNS["goal_type"]], value=goal.goal_type)
# #                 ws.cell(row=row["_row"], column=col_map[GOAL_COLUMNS["last_date"]], value=goal.last_date)
# #                 ws.cell(row=row["_row"], column=col_map[GOAL_COLUMNS["status"]], value=goal.status)
# #                 matched = True
# #                 break

# #         if not matched:
# #             insert_row_into_table(
# #                 ws,
# #                 table,
# #                 col_map,
# #                 {
# #                     GOAL_COLUMNS["datetime"]: ist_datetime,
# #                     GOAL_COLUMNS["goal_id"]: goal.goal_id,
# #                     GOAL_COLUMNS["goal"]: goal.goal,
# #                     GOAL_COLUMNS["goal_type"]: goal.goal_type,
# #                     GOAL_COLUMNS["last_date"]: goal.last_date,
# #                     GOAL_COLUMNS["status"]: goal.status
# #                 }
# #             )

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "message": "Goals saved successfully",
# #         "count": len(payload.goals)
# #     }


# # --------------------------------------------------
# # Scoring APIs
# # --------------------------------------------------
# # @app.get("/analysis")
# # def get_analysis(
# #     date: Optional[str] = Query(
# #         None, description="YYYY-MM-DD (IST). If provided, analysis entries will be filtered by date"
# #     )
# # ):
# #     wb = load_workbook(EXCEL_FILE, data_only=True)
# #     ws = wb[ANALYSIS_SHEET_NAME]

# #     # -------------------------------
# #     # PART 1: Analysis Checks (Table6 / DO_ANALYSIS_TABLE)
# #     # -------------------------------
# #     checks_table = ws.tables[DO_ANALYSIS_TABLE]
# #     start_cell, end_cell = checks_table.ref.split(":")
# #     start_row = ws[start_cell].row + 1  # skip header
# #     end_row = ws[end_cell].row

# #     analysis_checks = []

# #     for row in range(start_row, end_row + 1):
# #         check_id = ws.cell(row=row, column=DO_ANALYSIS_START_COL).value
# #         entry = ws.cell(row=row, column=DO_ANALYSIS_START_COL + 1).value

# #         if check_id is None and entry is None:
# #             continue

# #         analysis_checks.append({
# #             "id": check_id,
# #             "entry": entry
# #         })

# #     # -------------------------------
# #     # PART 2: Analysis Entries (ANALYSIS_TABLE)
# #     # -------------------------------
# #     table = get_table(ws, ANALYSIS_TABLE)
# #     col_map = get_table_column_index_map(ws, table)
# #     rows = get_table_rows(ws, table, col_map)

# #     analysis_entries = []

# #     for row in rows:
# #         cell_value = row[ANALYSIS_COLUMNS["datetime"]]
# #         if not cell_value:
# #             continue

# #         analysis_entries.append({
# #             "entry_id": row[ANALYSIS_COLUMNS["entry_id"]],
# #             "analysis": row[ANALYSIS_COLUMNS["analysis"]],
# #             "improvement": row[ANALYSIS_COLUMNS["improvement"]],
# #             "status": row[ANALYSIS_COLUMNS["status"]],
# #             "datetime": row[ANALYSIS_COLUMNS["datetime"]]
# #         })

# #     # -------------------------------
# #     # FINAL RESPONSE
# #     # -------------------------------
# #     return {
# #         "date": date,
# #         "analysis_checks": analysis_checks,
# #         "analysis_entries": analysis_entries
# #     }

# # @app.post("/save-analysis")
# # def save_analysis(payload: SaveAnalysisRequest):

# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[ANALYSIS_SHEET_NAME]

# #     table = get_table(ws, ANALYSIS_TABLE)
# #     col_map = get_table_column_index_map(ws, table)
# #     rows = get_table_rows(ws, table, col_map)

# #     ist_datetime = get_ist_datetime()
# #     today = ist_datetime[:10]

# #     matched = False

# #     # -------- UPDATE if entry_id exists for today --------
# #     for row in rows:
# #         cell_value = row[ANALYSIS_COLUMNS["datetime"]]
# #         if not cell_value:
# #             continue

# #         row_date = str(cell_value)[:10]

# #         if row_date == today and row[ANALYSIS_COLUMNS["entry_id"]] == payload.entry_id:
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[ANALYSIS_COLUMNS["datetime"]],
# #                 value=ist_datetime
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[ANALYSIS_COLUMNS["analysis"]],
# #                 value=payload.analysis
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[ANALYSIS_COLUMNS["improvement"]],
# #                 value=payload.improvement
# #             )
# #             ws.cell(
# #                 row=row["_row"],
# #                 column=col_map[ANALYSIS_COLUMNS["status"]],
# #                 value=payload.status
# #             )
# #             matched = True
# #             break

# #     # -------- INSERT if not found --------
# #     if not matched:
# #         insert_row_into_table(
# #             ws,
# #             table,
# #             col_map,
# #             {
# #                 ANALYSIS_COLUMNS["datetime"]: ist_datetime,
# #                 ANALYSIS_COLUMNS["entry_id"]: payload.entry_id,
# #                 ANALYSIS_COLUMNS["analysis"]: payload.analysis,
# #                 ANALYSIS_COLUMNS["improvement"]: payload.improvement,
# #                 ANALYSIS_COLUMNS["status"]: payload.status
# #             }
# #         )

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "message": "Analysis saved successfully",
# #         "entry_id": payload.entry_id,
# #         "updated": matched,
# #         "saved_at_ist": ist_datetime
# #     }



# # #  --------- Check For analysis Entry ID ---------
# # @app.post("/analysis-checks-save")
# # def save_analysis_checks(items: List[AnalysisCheckItem]):
# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[ANALYSIS_SHEET_NAME]

# #     # Find Table7
# #     table = ws.tables[DO_ANALYSIS_TABLE]

# #     # Get last row of the table
# #     start_row = ws[table.ref.split(":")[1]].row + 1

# #     for item in items:
# #         ws.cell(row=start_row, column=DO_ANALYSIS_START_COL).value = item.id
# #         ws.cell(row=start_row, column=DO_ANALYSIS_START_COL + 1).value = item.entry
# #         start_row += 1

# #     # Extend table range
# #     end_col_letter = table.ref.split(":")[1][0]
# #     table.ref = f"{table.ref.split(':')[0]}:{end_col_letter}{start_row - 1}"

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "status": "success",
# #         "rows_added": len(items)
# #     }

# # @app.post("/sync-analysis")
# # def sync_analysis(entries: List[Dict[str, Any]]):
# #     wb = load_workbook(EXCEL_FILE)
# #     ws = wb[ANALYSIS_SHEET_NAME]

# #     table = ws.tables[ANALYSIS_TABLE]

# #     # Table range
# #     start_row = ws[table.ref][0][0].row + 1
# #     end_row = ws[table.ref][-1][0].row

# #     # Current IST time
# #     ist = pytz.timezone(IST_TIMEZONE)
# #     now_ist = datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")

# #     # Header mapping
# #     header_row = ws[start_row - 1]
# #     col_index = {cell.value: idx + 1 for idx, cell in enumerate(header_row)}

# #     entry_id_col = col_index[ANALYSIS_COLUMNS["entry_id"]]

# #     # Input entry_ids (deduplicated)
# #     input_map = {
# #         item["entry_id"]: item
# #         for item in entries
# #         if "entry_id" in item
# #     }
# #     input_ids = set(input_map.keys())

# #     rows_to_delete = []

# #     # Iterate existing table rows
# #     for row in range(start_row, end_row + 1):
# #         excel_entry_id = ws.cell(row=row, column=entry_id_col).value

# #         # DELETE if not in input
# #         if excel_entry_id not in input_ids:
# #             rows_to_delete.append(row)
# #             continue

# #         # UPDATE if in input
# #         payload = input_map[excel_entry_id]

# #         # Update datetime
# #         ws.cell(
# #             row=row,
# #             column=col_index[ANALYSIS_COLUMNS["datetime"]],
# #             value=now_ist
# #         )

# #         # Update provided fields only
# #         for key, excel_col in ANALYSIS_COLUMNS.items():
# #             if key in payload and key != "datetime":
# #                 ws.cell(
# #                     row=row,
# #                     column=col_index[excel_col],
# #                     value=payload[key]
# #                 )

# #     # Delete rows bottom-up
# #     for row in sorted(rows_to_delete, reverse=True):
# #         ws.delete_rows(row)

# #     wb.save(EXCEL_FILE)

# #     return {
# #         "message": "Analysis table synced successfully",
# #         "updated": len(input_ids),
# #         "deleted": len(rows_to_delete)
# #     }



