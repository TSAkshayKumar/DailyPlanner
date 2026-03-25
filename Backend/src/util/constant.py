# constants.py

EXCEL_FILE = "./resource/Planner_track.xlsx"
DAILY_TASK_SHEET_NAME = "daily_tasks"
GOAL_SHEET_NAME = "goal"
ANALYSIS_SHEET_NAME = "analysis"
DAILY_TASK_SHEET_NAME = "daily_tasks"
TRACKER_TABLE_SHEET_NAME = "tracker_table"
SCORE_TABLE_SHEET_NAME = "score_table"
REMINDER_TABLE_SHEET_NAME = "reminder_table"
TO_BE_CHECKED_TABLE_SHEET_NAME = "to_be_checked_table"
GOAL_SHEET_NAME = "goal"
ANALYSIS_SHEET_NAME = "analysis"


IST_TIMEZONE = "Asia/Kolkata"

# Excel TABLE NAMES (not sheet titles)
PRIORITY_TABLE = "Table1"
REMINDER_TABLE = "Table2"
SCORE_TABLE = "Table3"
TRACKER_TABLE = "Table4"
GOAL_TABLE = "Table5"
ANALYSIS_TABLE = "Table6"
DO_ANALYSIS_TABLE = "Table7"


# Start Column value for each table
PRIORITY_START_COL = 1
REMINDER_START_COL = 1
SCORE_START_COL = 1
TRACKER_START_COL = 1
GOAL_START_COL = 1
ANALYSIS_START_COL = 1
DO_ANALYSIS_START_COL = 1


# Column names MUST exactly match Excel headers
PRIORITY_COLUMNS = {
    "datetime": "Date & Time (IST)",
    "task_id": "Task Id Unique id",
    "task_type": "Task Type",
    "task_name": "Tasks",
    "status": "Status"
}


# ---- Reminder Columns (reserved) ----
REMINDER_COLUMNS = {
    "datetime": "Date & Time (IST)",
    "reminder_id": "Reminder Id",
    "reminder": "Reminder",
}

# ---- Scores & Result Columns (reserved) ----
SCORE_COLUMNS = {
    "date":"Date (IST)",
    "score_id":"Score Id",
    "threshold":"Threshold for Today",
    "score":"Current Score",
    "rewards":"Rewards",
    "punishment":"Punishment",
}

# ---- Tracker Columns  ----
TRACKER_COLUMNS = {
    "datetime":"Date & Time (IST)",
    "tracker_id":"Tracker Id",
    "05_00_am_set": "05:00 AM Set Task",
    "05_00_am_actual": "05:00 AM Actually did",

    "06_00_am_set": "06:00 AM Set Task",
    "06_00_am_actual": "06:00 AM Actually did",

    "07_00_am_set": "07:00 AM Set Task",
    "07_00_am_actual": "07:00 AM Actually did",

    "08_00_am_set": "08:00 AM Set Task",
    "08_00_am_actual": "08:00 AM Actually did",

    "09_00_am_set": "09:00 AM Set Task",
    "09_00_am_actual": "09:00 AM Actually did",

    "10_00_am_set": "10:00 AM Set Task",
    "10_00_am_actual": "10:00 AM Actually did",

    "11_00_am_set": "11:00 AM Set Task",
    "11_00_am_actual": "11:00 AM Actually did",

    "12_00_pm_set": "12:00 PM Set Task",
    "12_00_pm_actual": "12:00 PM Actually did",

    "01_00_pm_set": "01:00 PM Set Task",
    "01_00_pm_actual": "01:00 PM Actually did",

    "02_00_pm_set": "02:00 PM Set Task",
    "02_00_pm_actual": "02:00 PM Actually did",

    "03_00_pm_set": "03:00 PM Set Task",
    "03_00_pm_actual": "03:00 PM Actually did",

    "04_00_pm_set": "04:00 PM Set Task",
    "04_00_pm_actual": "04:00 PM Actually did",

    "05_00_pm_set": "05:00 PM Set Task",
    "05_00_pm_actual": "05:00 PM Actually did",

    "06_00_pm_set": "06:00 PM Set Task",
    "06_00_pm_actual": "06:00 PM Actually did",

    "07_00_pm_set": "07:00 PM Set Task",
    "07_00_pm_actual": "07:00 PM Actually did",

    "08_00_pm_set": "08:00 PM Set Task",
    "08_00_pm_actual": "08:00 PM Actually did",

    "09_00_pm_set": "09:00 PM Set Task",
    "09_00_pm_actual": "09:00 PM Actually did",

    "10_00_pm_set": "10:00 PM Set Task",
    "10_00_pm_actual": "10:00 PM Actually did",

    "11_00_pm_set": "11:00 PM Set Task",
    "11_00_pm_actual": "11:00 PM Actually did",

    "12_00_am_set": "12:00 AM Set Task",
    "12_00_am_actual": "12:00 AM Actually did",

    "01_00_am_set": "01:00 AM Set Task",
    "01_00_am_actual": "01:00 AM Actually did",

    "02_00_am_set": "02:00 AM Set Task",
    "02_00_am_actual": "02:00 AM Actually did"
}

# ---- Goal Columns ----
GOAL_COLUMNS = {
    "datetime": "Date & Time (IST)",
    "goal_id": "Goal Id",
    "goal": "Goal",
    "goal_type": "Type of Goal",
    "last_date": "Last Date to Achieve the Goal",
    "status": "Current Status of Goal"
}

# ---- Analysis Columns ----
ANALYSIS_COLUMNS = {
    "datetime": "Date & Time (IST)",
    "entry_id": "Entry Id",
    "analysis": "Analysis",
    "improvement": "Improvement",
    "status": "Status"
}