import AnalysisImprovementCard from "../../components/scoring/AnalysisImprovementCard";
import { useState, useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";

/* =======================
   CONSTANTS
======================= */
const COLORS = {
    completed: "#22c55e",
    pending: "#e5e7eb"
};

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/* =======================
   HELPERS
======================= */
function getPastFiveMonths() {
    const today = new Date();
    const months = [];

    for (let i = 0; i < 5; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
            label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
            month: d.getMonth(),
            year: d.getFullYear()
        });
    }
    return months;
}

/* =======================
   COMPONENT
======================= */
export default function MonthlyReport() {
    const monthOptions = useMemo(() => getPastFiveMonths(), []);
    const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
    const [weeks, setWeeks] = useState([]);
    const [pendingGoals, setPendingGoals] = useState([]);

    /* =======================
       FETCH MONTHLY DATA
       (Replace MOCK with Goals Sheet logic)
    ======================= */
    const fetchMonthlySummary = () => {
        /* ---------- WEEKLY SUMMARY (MOCK) ---------- */
        const weeklyData = [
            {
                label: "Week 1 [29/12/2025 : 04/01/2026]",
                total: 3,
                completed: 1
            },
            {
                label: "Week 2 [05/01/2026 : 11/01/2026]",
                total: 4,
                completed: 3
            },
            {
                label: "Week 3 [12/01/2026 : 18/01/2026]",
                total: 2,
                completed: 1
            },
            {
                label: "Week 4 [19/01/2026 : 25/01/2026]",
                total: 5,
                completed: 4
            },
            {
                label: "Week 5 [26/01/2026 : 31/01/2026]",
                total: 1,
                completed: 0
            }
        ];

        /* ---------- NOT COMPLETED GOALS (MOCK) ---------- */
        const notCompletedGoals = [
            {
                type: "High",
                task: "Finish system design documentation",
                createdAt: "02/01/2026",
                deadline: "06/01/2026",
                status: "In Progress"
            },
            {
                type: "Medium",
                task: "Improve growth report visualization",
                createdAt: "05/01/2026",
                deadline: "12/01/2026",
                status: "Yet To Start"
            },
            {
                type: "Low",
                task: "Refactor reminder logic",
                createdAt: "10/01/2026",
                deadline: "20/01/2026",
                status: "In Progress"
            }
        ];

        setWeeks(weeklyData);
        setPendingGoals(notCompletedGoals);
    };

    return (
        <div className="space-y-10">

            {/* 🔹 REUSED INPUT CARD */}
            <AnalysisImprovementCard />

            {/* =======================
          MONTHLY GOAL SUMMARY
      ======================= */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h2 className="text-lg font-semibold">
                        Monthly Goal Summary
                    </h2>

                    <div className="flex items-center gap-3">
                        <select
                            value={`${selectedMonth.month}-${selectedMonth.year}`}
                            onChange={(e) => {
                                const [month, year] = e.target.value.split("-");
                                setSelectedMonth(
                                    monthOptions.find(
                                        (m) =>
                                            m.month === Number(month) &&
                                            m.year === Number(year)
                                    )
                                );
                            }}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            {monthOptions.map((m) => (
                                <option
                                    key={`${m.month}-${m.year}`}
                                    value={`${m.month}-${m.year}`}
                                >
                                    {m.label}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={fetchMonthlySummary}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
                        >
                            Fetch
                        </button>
                    </div>
                </div>

                <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2 text-left">Week</th>
                            <th className="border px-3 py-2 text-center">Goals Set</th>
                            <th className="border px-3 py-2 text-center">Completed</th>
                            <th className="border px-3 py-2 text-center">% Completion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((w, i) => {
                            const percent =
                                w.total === 0
                                    ? 0
                                    : Math.round((w.completed / w.total) * 100);
                            return (
                                <tr key={i}>
                                    <td className="border px-3 py-2">{w.label}</td>
                                    <td className="border px-3 py-2 text-center">{w.total}</td>
                                    <td className="border px-3 py-2 text-center">{w.completed}</td>
                                    <td className="border px-3 py-2 text-center font-medium">
                                        {percent}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* =======================
          WEEKLY DONUT CHARTS
      ======================= */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h2 className="text-lg font-semibold mb-6">
                    Weekly Completion Charts
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {weeks.map((w, i) => {
                        const pending = w.total - w.completed;
                        const percent =
                            w.total === 0
                                ? 0
                                : Math.round((w.completed / w.total) * 100);

                        return (
                            <div
                                key={i}
                                className="border rounded-xl p-4 flex flex-col items-center"
                            >
                                <p className="text-sm font-medium mb-3">
                                    Week {i + 1}
                                </p>

                                <div className="w-36 h-36 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { value: w.completed },
                                                    { value: pending }
                                                ]}
                                                innerRadius={45}
                                                outerRadius={65}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                <Cell fill={COLORS.completed} />
                                                <Cell fill={COLORS.pending} />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="font-bold text-lg text-green-600">
                                            {percent}%
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs mt-3 text-center space-y-1">
                                    <p>Total Goals: {w.total}</p>
                                    <p className="text-green-600">Completed: {w.completed}</p>
                                    <p className="text-gray-500">Pending: {pending}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* =======================
    NOT COMPLETED GOALS
======================= */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                    Goals Not Completed (Selected Month)
                </h2>

                {/* Mobile horizontal scroll wrapper */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Type of Goal
                                </th>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Task
                                </th>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Creation Date
                                </th>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Deadline Date
                                </th>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Current Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pendingGoals.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No pending goals 🎉
                                    </td>
                                </tr>
                            ) : (
                                pendingGoals.map((g, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="border px-3 py-2 whitespace-nowrap">
                                            {g.type}
                                        </td>

                                        <td className="border px-3 py-2 min-w-[240px]">
                                            {g.task}
                                        </td>

                                        <td className="border px-3 py-2 whitespace-nowrap">
                                            {g.createdAt}
                                        </td>

                                        <td className="border px-3 py-2 whitespace-nowrap">
                                            {g.deadline}
                                        </td>

                                        <td className="border px-3 py-2 font-medium whitespace-nowrap">
                                            {g.status}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile hint */}
                <p className="mt-2 text-xs text-gray-400 md:hidden">
                    ← Swipe horizontally to view all columns
                </p>
            </div>

        </div>
    );
}
