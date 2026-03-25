import { useState } from "react";
import AnalysisImprovementCard from "../../components/scoring/AnalysisImprovementCard";

/* ---------- MOCK DATA (replace later with sheet data) ---------- */

const days = [
  { date: "01/01", threshold: 50, score: 40 },
  { date: "02/01", threshold: 60, score: 70 },
  { date: "03/01", threshold: 30, score: 20 },
  { date: "04/01", threshold: 30, score: 20 },
  { date: "05/01", threshold: 50, score: 40 },
  { date: "06/01", threshold: 30, score: 60 },
  { date: "07/01", threshold: 30, score: 80 }
];

const priorityTasksByDate = {
  "01/01": {
    high: [{ task: "Finish report", status: "Pending" }, { task: "Finish report", status: "Pending" }, { task: "Finish report", status: "Pending" }, { task: "Finish report", status: "Pending" }, { task: "Finish report", status: "Pending" }, { task: "Finish report", status: "In Progress" }, { task: "Finish report", status: "In Progress" }, { task: "Finish report", status: "Done" }, { task: "Finish report", status: "Pending" }, { task: "Finish report", status: "Done" }, { task: "Finish report", status: "Done" }],
    medium: [{ task: "Workout", status: "Done" }],
    low: [{ task: "Read book", status: "Done" }]
  },
  "02/01": {
    high: [{ task: "Client follow-up", status: "In Progress" }],
    medium: [],
    low: [{ task: "Clean desk", status: "Pending" }]
  },
  "03/01": {
    high: [{ task: "Client follow-up", status: "In Progress" }],
    medium: [],
    low: [{ task: "Clean desk", status: "Pending" }]
  },
  "04/01": {
    high: [{ task: "Client follow-up", status: "In Progress" }],
    medium: [],
    low: [{ task: "Clean desk", status: "Pending" }]
  },
  "05/01": {
    high: [{ task: "Client follow-up", status: "In Progress" }],
    medium: [],
    low: [{ task: "Clean desk", status: "Pending" }]
  },
  "06/01": {
    high: [{ task: "Client follow-up", status: "In Progress" }],
    medium: [],
    low: [{ task: "Clean desk", status: "Pending" }]
  },
  "07/01": {
    high: [{ task: "Client follow-up", status: "In Progress" }],
    medium: [],
    low: [{ task: "Clean desk", status: "Pending" }]
  }
};

const todayTasksSheet = {
  "01/01": [
    { time: "05:00 AM", task: "Morning Study", actual: "Studied 1 hr" },
    { time: "07:00 AM", task: "Workout", actual: "Skipped" },
    { time: "09:00 AM", task: "", actual: "" }
  ],
  "03/01": [
    { time: "06:00 AM", task: "Planning", actual: "Completed" },
    { time: "08:00 AM", task: "Coding", actual: "2 hrs done" }
  ]
};


/* ------------------------------------------------------------- */

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState("");

  const failedDays = days.filter(
    d => d.threshold > 0 && d.score <= d.threshold
  );

  const timeData = todayTasksSheet[selectedDate] || [];
  const nonEmptyTimeData = timeData.filter(
    t => t.task || t.actual
  );


  const daysThresholdSet = days.filter(d => d.threshold > 0).length;
  const successDays = days.filter(d => d.score > d.threshold).length;
  const successPercent =
    daysThresholdSet === 0
      ? 0
      : Math.round((successDays / daysThresholdSet) * 100);

  const completedSlots = nonEmptyTimeData.filter(t => t.actual).length;
  const progressPercent =
    nonEmptyTimeData.length === 0
      ? 0
      : Math.round((completedSlots / nonEmptyTimeData.length) * 100);

  return (
    <div className="space-y-4">

      <AnalysisImprovementCard />

      {/* 🔹 DAILY PERFORMANCE */}
      <div className="bg-white rounded-2xl p-4 border">
        <h3 className="font-semibold mb-3">
          Daily Performance
        </h3>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th>Date</th>
              <th>Threshold</th>
              <th>Score</th>
              <th>% Completion</th>
            </tr>
          </thead>

          <tbody>
            {days.map((d, i) => (
              <tr key={i} className="text-center border-t">
                <td>{d.date}</td>
                <td>{d.threshold}</td>
                <td>{d.score}</td>
                <td>
                  {d.threshold === 0
                    ? "100%"
                    : Math.round((d.score / 100) * 100) + "%"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">
          Weekly Summary
        </h3>

        <div className="w-full">
          <p className="text-center text-sm text-green-600 font-medium">
            {successPercent}% Target Achieved
          </p>
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
              style={{
                width: `${successPercent}%`,
                background: "linear-gradient(to right, #22c55e, #16a34a)"
              }}
            >
              {successPercent}%
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p>Days Threshold Set: {daysThresholdSet}</p>
          <p>Days Score Greater than Threshold: {successDays}</p>
          <p>Success Rate: {successPercent}%</p>
        </div>
      </div>


      {/* 🔹 DROPDOWN */}
      <div className="border-1 p-6 rounded-2xl bg-white shadow-sm space-y-6">
        <div className="bg-whites">
          <label className="text-sm font-medium">
            Days Threshold Set but Not Met
          </label>

          <select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="mt-2 w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Date</option>
            {failedDays.map(d => (
              <option key={d.date} value={d.date}>
                {d.date}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          {/* 🔹 PRIORITY TASKS */}
          {selectedDate && (
            <div className="bg-white p-4 w-full md:w-[40%] rounded-2xl border space-y-3">
              <h3 className="font-semibold">
                Priority Tasks ({selectedDate})
              </h3>

              {["high", "medium", "low"].map(level => (
                <div key={level}>
                  <p className="font-medium capitalize">
                    {level} Priority
                  </p>

                  {priorityTasksByDate[selectedDate]?.[level]?.length ? (
                    <ul className="text-sm list-disc">
                      {priorityTasksByDate[selectedDate][level].map((t, i) => (
                        <li
                          key={i}
                          className="flex mb-1"
                        >
                          {t.status === "In Progress" ?
                            <span className="border-yellow-300 bg-yellow-100 border-1 rounded-md p-1 px-3">
                              {t.task}
                            </span>
                            : t.status === "Done" ?
                              <span className="border-green-300 bg-green-100 border-1 rounded-md p-1 px-3">
                                {t.task}
                              </span> : <span className="border-red-300 bg-red-100 border-1 rounded-md p-1 px-3">
                                {t.task}
                              </span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 ml-4">
                      No tasks
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 🔹 TIME BASED PLANNER */}
          {selectedDate && (
            <div className="bg-blue-50 p-4 w-full md:w-[60%] rounded-2xl border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">
                  Time-Based Planner (5 AM – 2 AM)
                </h3>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {nonEmptyTimeData.map((t, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border">
                    <p className="text-sm font-medium">{t.time}</p>

                    <div className="grid grid-cols-[80px_1fr] gap-x-2 text-sm text-gray-600">
                      <span className="font-medium">Task :</span>
                      <span>{t.task || "—"}</span>

                      <span className="font-medium">Actual :</span>
                      <span>{t.actual || "—"}</span>
                    </div>
                  </div>

                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
