import { useState, useMemo } from "react";
import { Copy, Check, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { FaFlag } from "react-icons/fa";
import { usePlanner } from "../../context/PlannerContext";
import { useSavePriorityTasks } from "../../api calls/daily_tasks_api";

const cardColors = {
    high: "bg-pink-100 border-pink-300",
    medium: "bg-purple-100 border-purple-300",
    low: "bg-blue-100 border-blue-300",
    growth: "bg-green-100 border-green-300",
    happiness: "bg-yellow-100 border-yellow-300",
    office: "bg-orange-100 border-orange-300"
};

const statusColors = {
    yet: "bg-red-400",
    progress: "bg-yellow-400",
    done: "bg-green-500"
};

export default function PriorityTask({ type, title, selectedDate }) {
    const { tasks, addTask, updateTask, deleteTask } = usePlanner();
    const { savePriorityTasks } = useSavePriorityTasks();

    const [copiedIndex, setCopiedIndex] = useState(null);
    const [showAll, setShowAll] = useState(false); // ✅ NEW
    const [saveState, setSaveState] = useState({
        status: "idle",
        message: ""
    });

    // ✅ Past date check
    const isPastDate = useMemo(() => {
        if (!selectedDate) return false;

        const today = new Date();
        const selected = new Date(selectedDate);

        today.setHours(0, 0, 0, 0);
        selected.setHours(0, 0, 0, 0);

        return selected < today;
    }, [selectedDate]);

    const list = tasks[type] || [];

    const counts = useMemo(() => {
        return {
            yet: list.filter(t => t.status === "yet").length,
            progress: list.filter(t => t.status === "progress").length,
            done: list.filter(t => t.status === "done").length,
            total: list.length
        };
    }, [list]);

    // ✅ Show only first 3 unless expanded
    const visibleTasks = showAll ? list : list.slice(0, 3);

    const handleCopy = async (text, index) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1200);
    };

    const handleSave = async () => {
        setSaveState({
            status: "loading",
            message: "Saving tasks to Excel..."
        });

        const result = await savePriorityTasks(type, selectedDate);

        if (result?.status >= 200 && result?.status < 300) {
            setSaveState({
                status: "success",
                message: "Saved successfully to Excel"
            });
        } else {
            setSaveState({
                status: "error",
                message: "Failed to save. Please try again."
            });
        }

        setTimeout(() => {
            setSaveState({ status: "idle", message: "" });
        }, 3000);
    };

    return (
        <div className={`rounded-2xl p-4 border shadow-sm hover:shadow-md transition ${cardColors[type]}`}>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                <h3 className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                    <FaFlag />
                    {title}
                </h3>

                <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        {counts.yet}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        {counts.progress}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        {counts.done}
                    </span>
                    <span className="font-semibold">
                        {counts.total}
                    </span>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mb-3">
                {!isPastDate && (
                    <button
                        onClick={() => addTask(type)}
                        className="text-xs px-3 py-1 rounded-full bg-white border shadow-sm hover:bg-gray-100"
                    >
                        + Add Task
                    </button>
                )}

                <button
                    onClick={handleSave}
                    disabled={saveState.status === "loading"}
                    className={`text-xs px-3 py-1 rounded-full flex items-center gap-1
                        ${saveState.status === "loading"
                            ? "bg-gray-400 text-white"
                            : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
                >
                    {saveState.status === "loading" && (
                        <Loader2 size={14} className="animate-spin" />
                    )}
                    Save
                </button>
            </div>

            {/* Past Hint */}
            {isPastDate && (
                <div className="mb-3 text-xs text-gray-500 italic">
                    Cannot add tasks for past dates
                </div>
            )}

            {/* Notification */}
            {saveState.status !== "idle" && (
                <div className={`mb-3 flex items-center gap-2 text-xs px-3 py-2 rounded-xl
                    ${saveState.status === "success" && "bg-green-100 text-green-700"}
                    ${saveState.status === "error" && "bg-red-100 text-red-700"}
                    ${saveState.status === "loading" && "bg-blue-100 text-blue-700"}`}
                >
                    {saveState.status === "loading" && <Loader2 size={14} className="animate-spin" />}
                    {saveState.status === "success" && <CheckCircle size={14} />}
                    {saveState.status === "error" && <XCircle size={14} />}
                    {saveState.message}
                </div>
            )}

            {/* Tasks */}
            {visibleTasks.map((task, i) => (
                <div
                    key={i}
                    className="flex items-start gap-3 mb-3 bg-white/60 rounded-xl px-3 py-2 hover:bg-white/80 transition"
                >
                    <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() =>
                            updateTask(type, i, {
                                ...task,
                                status: task.status === "done" ? "yet" : "done"
                            })
                        }
                        className="accent-indigo-500 mt-1"
                    />

                    <textarea
                        value={task.text}
                        onChange={e =>
                            updateTask(type, i, { ...task, text: e.target.value })
                        }
                        rows={1}
                        className={`w-full resize-none bg-transparent border-b border-gray-400 text-sm outline-none
                            ${task.status === "done" ? "line-through text-gray-400" : ""}`}
                        onInput={e => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                    />

                    <div className="flex items-center gap-2">
                        {["yet", "progress", "done"].map(s => (
                            <button
                                key={s}
                                onClick={() =>
                                    updateTask(type, i, { ...task, status: s })
                                }
                                className={`w-3 h-3 rounded-full ${
                                    task.status === s ? statusColors[s] : "bg-gray-300"
                                }`}
                            />
                        ))}

                        <button onClick={() => handleCopy(task.text, i)}>
                            {copiedIndex === i
                                ? <Check size={14} className="text-green-600" />
                                : <Copy size={14} className="text-gray-600" />}
                        </button>

                        <button onClick={() => deleteTask(type, i)}>
                            <Trash2 size={14} className="text-red-500" />
                        </button>
                    </div>
                </div>
            ))}

            {/* ✅ SHOW MORE / LESS */}
            {list.length > 3 && (
                <button
                    onClick={() => setShowAll(prev => !prev)}
                    className="text-xs text-indigo-600 hover:underline mt-2"
                >
                    {showAll ? "Show Less ▲" : `Show More (${list.length - 3}) ▼`}
                </button>
            )}
        </div>
    );
}