import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import AnalysisImprovementCard from "../../components/scoring/AnalysisImprovementCard";
import { getISTDate } from "../../utils/dateIST";

export default function GrowthReport() {
    // 🔹 Mock data (replace later with sheet data)
    const [rows, setRows] = useState([
        {
            id: 1,
            analysis: "Poor focus in morning hours",
            improvement: "Sleep earlier and wake up fresh",
            status: "progress",
            creationDate: getISTDate()
        },
        {
            id: 2,
            analysis: "Too much phone usage",
            improvement: "Enable app limits",
            status: "done",
            creationDate: getISTDate()
        }
    ]);

    const implemented = rows.filter(r => r.status === "done").length;
    const total = rows.length;
    const successRate = total === 0 ? 0 : Math.round((implemented / total) * 100);

    const updateRow = (id, key, value) => {
        setRows(prev =>
            prev.map(r => (r.id === id ? { ...r, [key]: value } : r))
        );
    };

    const removeRow = (id) => {
        setRows(prev => prev.filter(r => r.id !== id));
    };

    const saveAll = () => {
        const payload = rows.map(r => ({
            creationDate: r.creationDate,
            analysis: r.analysis,
            improvement: r.improvement,
            status: r.status
        }));

        console.log("Saving to Analysis & Improvement Sheet:", payload);
        alert("✅ Growth report saved successfully");
    };

    return (
        <div className="space-y-8">

            {/* 🔹 REUSED INPUT CARD */}
            <AnalysisImprovementCard />

            {/* 🔹 EDITABLE TABLE */}
            <div className="bg-white rounded-2xl p-4 border shadow-sm">
                <h3 className="font-semibold mb-4">
                    Analysis & Improvement Details
                </h3>

                {/* Horizontal scroll for mobile */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Analysis
                                </th>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Improvement
                                </th>
                                <th className="border px-3 py-2 text-left whitespace-nowrap">
                                    Status
                                </th>
                                <th className="border px-3 py-2 text-center whitespace-nowrap">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map(r => (
                                <tr
                                    key={r.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    {/* Analysis */}
                                    <td className="border px-3 py-2 min-w-[240px]">
                                        <textarea
                                            value={r.analysis}
                                            onChange={e =>
                                                updateRow(r.id, "analysis", e.target.value)
                                            }
                                            rows={2}
                                            className="w-full resize-none border rounded p-2 text-sm"
                                        />
                                    </td>

                                    {/* Improvement */}
                                    <td className="border px-3 py-2 min-w-[240px]">
                                        <textarea
                                            value={r.improvement}
                                            onChange={e =>
                                                updateRow(r.id, "improvement", e.target.value)
                                            }
                                            rows={2}
                                            className="w-full resize-none border rounded p-2 text-sm"
                                        />
                                    </td>

                                    {/* Status */}
                                    <td className="border px-3 py-2 whitespace-nowrap">
                                        <select
                                            value={r.status}
                                            onChange={e =>
                                                updateRow(r.id, "status", e.target.value)
                                            }
                                            className="border rounded px-3 py-1 text-sm w-full"
                                        >
                                            <option value="yet">Yet to Implement</option>
                                            <option value="progress">In Progress</option>
                                            <option value="done">Implemented</option>
                                        </select>
                                    </td>

                                    {/* Action */}
                                    <td className="border px-3 py-2 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => removeRow(r.id)}
                                            className="text-red-500 hover:bg-red-100 p-2 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile swipe hint */}
                <p className="mt-2 text-xs text-gray-400 md:hidden">
                    ← Swipe horizontally to view all columns
                </p>

                {/* Save button (unchanged) */}
                <button
                    onClick={saveAll}
                    className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl"
                >
                    <Save size={16} />
                    Save Changes
                </button>
            </div>


            {/* 🔹 GROWTH SUMMARY */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-5">

                <h3 className="font-semibold text-lg mb-0">Growth Summary</h3>


                {/* 🔹 PROGRESS BAR (IMAGE STYLE) */}
                <div className="w-full">
                    <p className="text-center mt-2 text-sm text-green-600 font-medium">
                        {successRate}% Improvements Implemented
                    </p>
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">

                        <div
                            className="h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
                            style={{
                                width: `${successRate}%`,
                                background: "linear-gradient(to right, #22c55e, #16a34a)"
                            }}
                        >
                            {successRate}%
                        </div>
                    </div>
                </div>
                <div className="space-y-1 text-sm">
                    <p><strong>Total Improvements:</strong> {total}</p>
                    <p><strong>Implemented:</strong> {implemented}</p>
                    <p><strong>Success Rate:</strong> {successRate}%</p>
                </div>
            </div>
        </div>
    );
}
