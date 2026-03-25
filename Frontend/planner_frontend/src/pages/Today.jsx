import { RefreshCw, Bell, BarChart } from "lucide-react";
import { usePlanner } from "../context/PlannerContext";
import PriorityTask from "../components/daily_tasks/PriorityTask";
import ScorePanel from "../components/daily_tasks/ScorePanel";
import TimeSlotPlanner from "../components/daily_tasks/TimeSlotPlanner";
import ReminderSection from "../components/daily_tasks/ReminderBox";
import { useSavePriorityTasks } from "../api calls/daily_tasks_api";
import { useState } from "react";
import { getISTDate } from "../utils/dateIST";

export default function Today() {
    const today = getISTDate();
    const [selectedDate, setSelectedDate] = useState(today);
    const { isLoading } = usePlanner();
    const { handleRefresh } = useSavePriorityTasks();

    const [activeTab, setActiveTab] = useState("tasks");
    const [showReminder, setShowReminder] = useState(false);
    const [showScore, setShowScore] = useState(false);

    return (
        <div className="min-h-screen font-planner p-4 md:p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                {/* LEFT: TITLE */}
                <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                    Daily Planner
                </h1>

                {/* CENTER: TABS (DESKTOP ONLY) */}
                <div className="hidden md:flex bg-white rounded-xl p-1 shadow">
                    {["tasks", "planner"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                activeTab === tab
                                    ? "bg-indigo-500 text-white shadow-sm"
                                    : "text-gray-600"
                            }`}
                        >
                            {tab === "tasks" ? "Tasks" : "Planner"}
                        </button>
                    ))}
                </div>

                {/* RIGHT: CONTROLS */}
                <div className="flex items-center gap-2">

                    {/* DATE */}
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="text-sm px-2 py-2 rounded-md border border-gray-300"
                    />

                    {/* REFRESH */}
                    <button
                        onClick={() => handleRefresh(selectedDate)}
                        disabled={isLoading}
                        className="flex items-center gap-2 text-sm px-3 py-2 cursor-pointer rounded-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-400"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        <span className="hidden sm:inline font-bold">Fetch</span>
                    </button>

                    {/* SCORE */}
                    <button
                        onClick={() => setShowScore(true)}
                        className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200"
                    >
                        <BarChart size={18} />
                    </button>

                    {/* REMINDER */}
                    <button
                        onClick={() => setShowReminder(true)}
                        className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200"
                    >
                        <Bell size={18} />
                    </button>

                </div>
            </div>

            {/* MOBILE TABS (UNCHANGED) */}
            <div className="flex md:hidden mb-4 bg-white rounded-xl p-1 shadow">
                {["tasks", "planner"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-sm rounded-lg ${
                            activeTab === tab
                                ? "bg-indigo-500 text-white"
                                : "text-gray-600"
                        }`}
                    >
                        {tab === "tasks" ? "Tasks" : "Planner"}
                    </button>
                ))}
            </div>

            {/* TASKS */}
            {activeTab === "tasks" && (
                <div className="
                    space-y-6 
                    md:space-y-8 
                    lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0
                    xl:grid-cols-2 
                    2xl:grid-cols-3
                ">
                    <PriorityTask type="high" title="High Priority Tasks" selectedDate={selectedDate} />
                    <PriorityTask type="medium" title="Medium Priority Tasks" selectedDate={selectedDate} />
                    <PriorityTask type="low" title="Low Priority Tasks" selectedDate={selectedDate} />
                    <PriorityTask type="office" title="Office Related Task" selectedDate={selectedDate} />
                    <PriorityTask type="growth" title="Task for Growth" selectedDate={selectedDate} />
                    <PriorityTask type="happiness" title="Task for Happiness" selectedDate={selectedDate} />
                </div>
            )}

            {/* PLANNER */}
            {activeTab === "planner" && (
                <div className="w-full">

                    <div className="
                        w-full 
                        max-w-7xl 
                        mx-auto 
                        bg-white 
                        rounded-2xl 
                        shadow-sm 
                        border 
                        p-4 md:p-6 lg:p-8
                    ">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800">
                                Time Planner
                            </h3>

                            <span className="text-xs text-gray-400 hidden md:block">
                                Plan your day hour by hour
                            </span>
                        </div>

                        {/* CONTENT */}
                        <div className="
                            rounded-xl 
                            border 
                            bg-gradient-to-br from-blue-50 to-indigo-50 
                            p-3 md:p-4
                        ">
                            <TimeSlotPlanner />
                        </div>

                    </div>
                </div>
            )}

            {/* REMINDER MODAL */}
            {showReminder && (
                <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
                    <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4">
                        <div className="flex justify-between mb-3">
                            <h2 className="text-lg font-semibold">Reminders</h2>
                            <button onClick={() => setShowReminder(false)}>✕</button>
                        </div>
                        <ReminderSection />
                    </div>
                </div>
            )}

            {/* SCORE MODAL */}
            {showScore && (
                <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
                    <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4">
                        <div className="flex justify-between mb-3">
                            <h2 className="text-lg font-semibold">Productivity Score</h2>
                            <button onClick={() => setShowScore(false)}>✕</button>
                        </div>
                        <ScorePanel />
                    </div>
                </div>
            )}
        </div>
    );
}