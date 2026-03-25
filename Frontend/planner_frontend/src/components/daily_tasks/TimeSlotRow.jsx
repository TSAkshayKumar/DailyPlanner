import { Copy, Check } from "lucide-react";
import { useState } from "react";

// Contrast levels:
// empty   → dark slate bg, muted text   (low highlight)
// filled  → vivid indigo bg+border      (medium highlight)
// current → bright orange bg+border+ring (max highlight)
const getRowStyle = (isCurrent, isFilled) => {
  if (isCurrent) return "bg-orange-400 border-orange-500 ring-2 ring-orange-300 shadow-lg";
  if (isFilled)  return "bg-green-200 border-green-800 shadow-sm";
  return "bg-slate-600 border-slate-600";
};

const getTimeStyle = (isCurrent, isFilled) => {
  if (isCurrent) return "text-white font-bold";
  if (isFilled)  return "text-indigo-700 font-bold";
  return "text-slate-300 font-semibold";
};

const getTextStyle = (isCurrent, isFilled) => {
  if (isCurrent) return "text-white border-orange-300 placeholder-orange-200";
  if (isFilled)  return "text-indigo-900 border-indigo-300 placeholder-indigo-300";
  return "text-slate-400 border-slate-500 placeholder-slate-500";
};

export default function TimeSlotRow({
  time,
  planned,
  actual,
  isCurrent = false,
  isFilled = false,
  groupPosition = null, // "first" | "middle" | "last" | null
  onPlannedChange,
  onActualChange
}) {
  const [copied, setCopied] = useState(null);

  const handleCopy = async (text, type) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1000);
  };

  // Border-radius: flatten adjacent edges for grouped rows
  const radiusClass =
    groupPosition === "first"  ? "rounded-t-xl rounded-b-sm" :
    groupPosition === "middle" ? "rounded-none" :
    groupPosition === "last"   ? "rounded-t-sm rounded-b-xl" :
    "rounded-xl";

  // Left accent bar color for grouped slots (not shown on current)
  const accentClass =
    !isCurrent && groupPosition
      ? "border-l-4 border-l-violet-500"
      : "";

  return (
    <div className={`${radiusClass} p-3 border space-y-2 transition-colors duration-300 ${accentClass} ${getRowStyle(isCurrent, isFilled)}`}>

      {/* Current time indicator badge */}
      {isCurrent && (
        <div className="flex items-center gap-1 text-xs text-white font-bold mb-1">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
          Now
        </div>
      )}

      {/* Planned */}
      <div className="flex items-start gap-3">
        <div className={`w-20 text-sm ${getTimeStyle(isCurrent, isFilled)}`}>
          {time}
        </div>

        <textarea
          value={planned}
          onChange={e => onPlannedChange(e.target.value)}
          rows={1}
          placeholder="Write task..."
          className={`flex-1 resize-none bg-transparent text-sm outline-none whitespace-pre-wrap break-words border-b ${getTextStyle(isCurrent, isFilled)}`}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />

        <button
          onClick={() => handleCopy(planned, "planned")}
          className="p-1 rounded hover:bg-black/10 cursor-pointer"
        >
          {copied === "planned"
            ? <Check size={16} className="text-green-600" />
            : <Copy size={16} className="text-gray-500" />
          }
        </button>
      </div>

      {/* Actual */}
      <div className="flex items-start gap-3 pl-[5.5rem]">
        <span className="text-gray-400 text-sm">:</span>

        <textarea
          value={actual}
          onChange={e => onActualChange(e.target.value)}
          rows={1}
          placeholder="Actually did..."
          className={`flex-1 resize-none bg-transparent text-sm outline-none whitespace-pre-wrap break-words border-b ${getTextStyle(isCurrent, isFilled)}`}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />

        <button
          onClick={() => handleCopy(actual, "actual")}
          className="p-1 rounded hover:bg-black/10 cursor-pointer"
        >
          {copied === "actual"
            ? <Check size={16} className="text-green-600" />
            : <Copy size={16} className="text-gray-500" />
          }
        </button>
      </div>
    </div>
  );
}
