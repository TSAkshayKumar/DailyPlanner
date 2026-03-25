import { useState } from "react";
import { RefreshCw, ArrowUpDown, Search, X, Save } from "lucide-react";
import GoalSection from "../components/Goals/GoalSection";
import GoalTable from "../components/Goals/GoalTable";
import { usePlanner } from "../context/PlannerContext";

const selectCls = "text-xs px-2 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 outline-none cursor-pointer";

export default function GoalsPage() {
  const { loadGoals, isGoalsLoading, saveGoals } = usePlanner();
  const [view, setView] = useState("card");

  // ── shared filter state ──────────────────────────────────
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterDeadline, setFilterDeadline] = useState("");
  const [sortDir, setSortDir]             = useState("asc");

  const isFiltered = filterStatus !== "all" || filterDeadline || sortDir !== "asc" || search;

  const resetFilters = () => {
    setSearch(""); setFilterStatus("all"); setFilterDeadline(""); setSortDir("asc");
  };

  const filters = { search, filterStatus, filterDeadline, sortDir };

  return (
    <div className="space-y-4">

      {/* ── Top bar: title + toggle + fetch ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LEFT: TITLE */}
        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Goals</h1>

        {/* CENTER: VIEW TOGGLE + FETCH (mobile: together) */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-xl p-1 shadow border border-gray-100">
            {["card", "table"].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
                  view === v ? "bg-indigo-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {v === "card" ? "Card View" : "Table View"}
              </button>
            ))}
          </div>

          {/* FETCH + SAVE icon-only on mobile, hidden on md+ */}
          <button
            onClick={() => loadGoals(true)}
            disabled={isGoalsLoading}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-400 cursor-pointer"
          >
            <RefreshCw size={15} className={isGoalsLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={saveGoals}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          >
            <Save size={15} />
          </button>
        </div>

        {/* RIGHT: FETCH + SAVE full buttons — desktop only */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => loadGoals(true)}
            disabled={isGoalsLoading}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-400 cursor-pointer"
          >
            <RefreshCw size={15} className={isGoalsLoading ? "animate-spin" : ""} />
            <span className="font-bold">Fetch Goals</span>
          </button>
          <button
            onClick={saveGoals}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          >
            <Save size={15} />
            <span className="font-bold">Save Goals</span>
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">

        {/* Search */}
        <div className="flex items-center gap-1 flex-1 min-w-[140px] border border-gray-300 rounded-lg px-2 py-1 bg-white">
          <Search size={13} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search goals..."
            className="flex-1 text-xs outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-red-500">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Status</span>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectCls}>
            <option value="all">All</option>
            <option value="yet">Incomplete</option>
            <option value="progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        {/* Deadline by */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Deadline by</span>
          <input
            type="date"
            value={filterDeadline}
            onChange={e => setFilterDeadline(e.target.value)}
            className={selectCls}
          />
          {filterDeadline && (
            <button onClick={() => setFilterDeadline("")} className="text-xs text-gray-400 hover:text-red-500">✕</button>
          )}
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortDir(prev => prev === "asc" ? "desc" : "asc")}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <ArrowUpDown size={12} />
          Deadline {sortDir === "asc" ? "↑" : "↓"}
        </button>

        {/* Reset */}
        {isFiltered && (
          <button onClick={resetFilters} className="text-xs text-indigo-500 hover:underline">
            Reset
          </button>
        )}
      </div>

      {/* ── Content ── */}
      {view === "card"
        ? <GoalSection filters={filters} />
        : <GoalTable filters={filters} />
      }
    </div>
  );
}

