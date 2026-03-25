# So that we can import the routers in main.py without circular imports
from . import tasks_router
from . import goals_router
from . import analysis_router
from . import reports_router