import { useState } from "react";
import { Trash2, Save, Plus } from "lucide-react";
import { usePlanner } from "../../context/PlannerContext";

export default function ReminderSection() {
    const {
        reminders,
        addReminder,
        removeReminder,
        removeAllReminders,
        saveRemindersToExcel
    } = usePlanner();

    const [task, setTask] = useState("");

    const handleAdd = () => {
        addReminder(task);
        setTask("");
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md p-4">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Reminder Section
                </h2>

                <div className="flex gap-2">
                    <button
                        onClick={saveRemindersToExcel}
                        className="flex items-center gap-1 cursor-pointer px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                        <Save size={16} /> Save
                    </button>

                    <button
                        onClick={removeAllReminders}
                        className="flex items-center gap-1 cursor-pointer px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                        <Trash2 size={16} /> Remove All
                    </button>
                </div>
            </div>

            {/* Add Reminder */}
            <div className="flex gap-2 mb-4">
                <textarea
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    rows={1}
                    placeholder="Write reminder task..."
                    className="flex-1 resize-none rounded-lg px-3 py-2 bg-transparent border-b border-gray-400 text-sm outline-none whitespace-pre-wrap break-words"
                    onInput={e => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                />

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-1  cursor-pointer px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus size={18} /> Add
                </button>
            </div>

            {/* Reminder List */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scroll">
                {reminders.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                        No reminders added yet
                    </p>
                )}

                {reminders.map(reminder => (
                    <div
                        key={reminder.id}
                        className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm"
                    >
                        <p className="text-sm text-gray-800 break-words">
                            {reminder.task}
                        </p>

                        <button
                            onClick={() => removeReminder(reminder.id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}