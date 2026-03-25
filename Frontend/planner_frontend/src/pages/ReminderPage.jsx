import { Trash2, Bell } from "lucide-react";
import { usePlanner } from "../context/PlannerContext";

export default function ReminderSection() {
  const { remindersNotification, checkForReminders, removeReminder } = usePlanner();

  return (
    <div className="bg-gradient-to-br from-sky-100 to-indigo-100
      rounded-2xl p-4 border shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-gray-700">
          <Bell size={18} />
          Reminder Section
        </h3>

        <button
          onClick={checkForReminders}
          className="px-3 py-1 text-xs rounded-lg bg-indigo-500 text-white"
        >
          Check for Reminders
        </button>
      </div>

      {/* List */}
      {remindersNotification.length === 0 ? (
        <p className="text-sm text-gray-500">
          No reminders available
        </p>
      ) : (
        <div className="space-y-3">
          {remindersNotification.map(r => (
            <div
              key={r.id}
              className="bg-white rounded-xl p-3 border flex justify-between gap-3"
            >
              <div className="text-sm">
                <p className="font-medium break-words">{r.task}</p>

                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <p>Created: {r.creationDate}</p>
                  <p>Deadline: {r.lastDate}</p>
                  <p>Status: {r.status}</p>
                </div>
              </div>

              <button
                onClick={() => removeReminder(r.id)}
                className="text-red-500 hover:bg-red-100 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
