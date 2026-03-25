import { useMemo, useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { FaFlag } from "react-icons/fa";
import { usePlanner } from "../../context/PlannerContext";

const cardColors = {
    high: "bg-pink-100 border-pink-300",
    medium: "bg-purple-100 border-purple-300",
    low: "bg-blue-100 border-blue-300"
};

const statusColors = {
    yet: "bg-red-400",
    progress: "bg-yellow-400",
    done: "bg-green-500"
};

export default function GoalSection({ filters = {} }) {
    const { goals, addGoal, updateGoal, saveGoals, deleteGoal } = usePlanner();
    const [copied, setCopied] = useState(null);

    const { search = "", filterStatus = "all", filterDeadline = "", sortDir = "asc" } = filters;

    const getStats = (type) => {
        const list = goals[type].list;
        return {
            yet: list.filter(g => g.status === "yet").length,
            progress: list.filter(g => g.status === "progress").length,
            done: list.filter(g => g.status === "done").length,
            total: list.length
        };
    };

    const getFilteredList = (type) => {
        let entries = goals[type].list.map((g, i) => ({ ...g, _idx: i }));

        if (search.trim())
            entries = entries.filter(g => g.text?.toLowerCase().includes(search.toLowerCase()));

        if (filterStatus !== "all")
            entries = entries.filter(g => g.status === filterStatus);

        if (filterDeadline)
            entries = entries.filter(g => g.lastDate && g.lastDate <= filterDeadline);

        entries.sort((a, b) => {
            const da = a.lastDate ? new Date(a.lastDate) : new Date("9999-12-31");
            const db = b.lastDate ? new Date(b.lastDate) : new Date("9999-12-31");
            return sortDir === "asc" ? da - db : db - da;
        });

        return entries;
    };

    const renderSection = (type, title) => {
        const stats = getStats(type);
        const filteredList = getFilteredList(type);

        return (
            <div className={`p-4 rounded-2xl border ${cardColors[type]} mb-6`}>

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-700">
                        <FaFlag /> {title}
                    </h3>

                    {stats.total > 0 && (
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-red-400 rounded-full" />
                                {stats.yet}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                                {stats.progress}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                {stats.done}
                            </span>
                            <span className="font-semibold">{stats.total}</span>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => addGoal(type)}
                        className="px-3 py-1 text-xs bg-white border rounded-full"
                    >
                        + Add Goal
                    </button>
                </div>

                {/* Goals */}
                {filteredList.length === 0 && stats.total > 0 && (
                    <p className="text-xs text-gray-400 italic mb-2">No goals match the current filters.</p>
                )}

                {filteredList.map((g) => (
                    <div
                        key={g._idx}
                        className="bg-white/70 rounded-xl p-3 mb-3"
                    >
                        {/* ROW 1 — checkbox + textarea (both layouts) */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                className="mt-2 shrink-0"
                                checked={g.status === "done"}
                                onChange={() =>
                                    updateGoal(type, g._idx, { ...g, status: g.status === "done" ? "yet" : "done" })
                                }
                            />

                            <textarea
                                value={g.text}
                                onChange={e => updateGoal(type, g._idx, { ...g, text: e.target.value })}
                                placeholder="Write goal..."
                                rows={1}
                                className={`w-full resize-none bg-transparent border-b outline-none text-sm ${
                                    g.status === "done" ? "line-through text-gray-400" : ""
                                }`}
                                onInput={e => {
                                    e.target.style.height = "auto";
                                    e.target.style.height = e.target.scrollHeight + "px";
                                }}
                            />

                            {/* deadline + status + copy + delete — inline on sm+ */}
                            <div className="hidden sm:flex items-start gap-3 shrink-0">
                                <div className="flex flex-col text-xs">
                                    <input
                                        type="date"
                                        value={g.lastDate}
                                        onChange={e => updateGoal(type, g._idx, { ...g, lastDate: e.target.value })}
                                        className="border rounded-md px-2 py-1"
                                    />
                                    <label className="text-xs text-left text-gray-500">Deadline</label>
                                </div>

                                <div className="flex gap-1 mt-2">
                                    {["yet", "progress", "done"].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateGoal(type, g._idx, { ...g, status: s })}
                                            className={`w-3 h-3 rounded-full ${
                                                g.status === s ? statusColors[s] : "bg-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    className="mt-2"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(g.text);
                                        setCopied(g._idx);
                                        setTimeout(() => setCopied(null), 1000);
                                    }}
                                >
                                    {copied === g._idx
                                        ? <Check size={14} className="text-green-600" />
                                        : <Copy size={14} />}
                                </button>

                                <button
                                    className="mt-2 ml-2 text-red-600 hover:text-red-800"
                                    onClick={() => deleteGoal(type, g._idx)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* ROW 2 — controls stacked below on mobile only */}
                        <div className="flex sm:hidden items-center justify-between mt-3 pt-2 border-t border-gray-200">

                            {/* deadline */}
                            <div className="flex flex-col text-xs">
                                <input
                                    type="date"
                                    value={g.lastDate}
                                    onChange={e => updateGoal(type, g._idx, { ...g, lastDate: e.target.value })}
                                    className="border rounded-md px-2 py-1 text-xs"
                                />
                                <label className="text-xs text-gray-500">Deadline</label>
                            </div>

                            {/* status dots */}
                            <div className="flex gap-2">
                                {["yet", "progress", "done"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateGoal(type, g._idx, { ...g, status: s })}
                                        className={`w-4 h-4 rounded-full ${
                                            g.status === s ? statusColors[s] : "bg-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* copy + delete */}
                            <div className="flex gap-3">
                                <button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(g.text);
                                        setCopied(g._idx);
                                        setTimeout(() => setCopied(null), 1000);
                                    }}
                                >
                                    {copied === g._idx
                                        ? <Check size={16} className="text-green-600" />
                                        : <Copy size={16} className="text-gray-500" />}
                                </button>

                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteGoal(type, g._idx)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {renderSection("high", "High Priority Goals")}
            {renderSection("medium", "Medium Priority Goals")}
            {renderSection("low", "Low Priority Goals")}
        </>
    );
}