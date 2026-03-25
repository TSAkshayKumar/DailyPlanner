import { useMemo } from "react";
import { usePlanner } from "../../context/PlannerContext";

const statusLabel = { yet: "Incomplete", progress: "In Progress", done: "Completed" };
const statusBadge = {
    yet:      "bg-red-100 text-red-600",
    progress: "bg-yellow-100 text-yellow-700",
    done:     "bg-green-100 text-green-700"
};
const typeBadge = {
    high:   "bg-pink-100 text-pink-700",
    medium: "bg-purple-100 text-purple-700",
    low:    "bg-blue-100 text-blue-700"
};
const typeLabel = { high: "High", medium: "Medium", low: "Low" };

export default function GoalTable({ filters = {} }) {
    const { goals } = usePlanner();
    const { search = "", filterStatus = "all", filterDeadline = "", sortDir = "asc" } = filters;

    const allGoals = useMemo(() => {
        const rows = [];
        ["high", "medium", "low"].forEach(type => {
            (goals[type]?.list || []).forEach((g, i) => {
                rows.push({ ...g, _type: type, _idx: i });
            });
        });
        return rows;
    }, [goals]);

    const filtered = useMemo(() => {
        let entries = [...allGoals];

        if (search.trim())
            entries = entries.filter(g => g.text?.toLowerCase().includes(search.toLowerCase()));

        if (filterStatus !== "all")
            entries = entries.filter(g => g.status === filterStatus);

        if (filterDeadline)
            entries = entries.filter(g => g.lastDate && g.lastDate <= filterDeadline);

        const priorityOrder = { high: 0, medium: 1, low: 2 };

        entries.sort((a, b) => {
            const pa = priorityOrder[a._type];
            const pb = priorityOrder[b._type];
            if (pa !== pb) return pa - pb;
            const da = a.lastDate ? new Date(a.lastDate) : new Date("9999-12-31");
            const db = b.lastDate ? new Date(b.lastDate) : new Date("9999-12-31");
            return sortDir === "asc" ? da - db : db - da;
        });

        return entries;
    }, [allGoals, search, filterStatus, filterDeadline, sortDir]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* ── DESKTOP TABLE (sm and above) ── */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                            <th className="px-4 py-3 text-left w-8">#</th>
                            <th className="px-4 py-3 text-left">Goal</th>
                            <th className="px-4 py-3 text-left w-24">Priority</th>
                            <th className="px-4 py-3 text-left w-28">Status</th>
                            <th className="px-4 py-3 text-left w-28">Deadline</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400 italic">
                                    {search || filterStatus !== "all" || filterDeadline ? "No goals match the current filters." : "No goals found."}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((g, i) => (
                                <tr key={`${g._type}-${g._idx}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                                    <td className="px-4 py-3 text-gray-800 max-w-xs">
                                        <span className={g.status === "done" ? "line-through text-gray-400" : ""}>
                                            {g.text || <span className="italic text-gray-300">—</span>}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[g._type]}`}>
                                            {typeLabel[g._type]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[g.status]}`}>
                                            {statusLabel[g.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {g.lastDate || <span className="text-gray-300">—</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Footer count */}
                {filtered.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
                        {filtered.length} of {allGoals.length} goals
                    </div>
                )}
            </div>

            {/* ── MOBILE LIST (below sm) ── */}
            <div className="sm:hidden divide-y divide-gray-100">
                {filtered.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-400 italic">
                        {search || filterStatus !== "all" || filterDeadline ? "No goals match the current filters." : "No goals found."}
                    </p>
                ) : (
                    filtered.map((g, i) => (
                        <div key={`${g._type}-${g._idx}`} className="px-4 py-3 space-y-1">
                            {/* Goal text */}
                            <p className={`text-sm text-gray-800 leading-snug ${g.status === "done" ? "line-through text-gray-400" : ""}`}>
                                {g.text || <span className="italic text-gray-300">—</span>}
                            </p>
                            {/* Badges row */}
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[g._type]}`}>
                                    {typeLabel[g._type]}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[g.status]}`}>
                                    {statusLabel[g.status]}
                                </span>
                                {g.lastDate && (
                                    <span className="text-xs text-gray-400">📅 {g.lastDate}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Footer count */}
                {filtered.length > 0 && (
                    <div className="px-4 py-2 text-xs text-gray-400">
                        {filtered.length} of {allGoals.length} goals
                    </div>
                )}
            </div>
        </div>
    );
}
