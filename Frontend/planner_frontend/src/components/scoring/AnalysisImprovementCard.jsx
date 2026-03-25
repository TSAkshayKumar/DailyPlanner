import { useState } from "react";
import { Trash2, X, Save } from "lucide-react";
import { getISTDate } from "../../utils/dateIST";

export default function AnalysisImprovementCard() {
    const [periods, setPeriods] = useState([]);
    const [periodInput, setPeriodInput] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [improvement, setImprovement] = useState("");
    const [status, setStatus] = useState("yet");
    const [showModal, setShowModal] = useState(false);

    const addPeriod = () => {
        if (!periodInput) return;

        setPeriods(prev => [
            ...prev,
            {
                id: Date.now(),      // internal use only
                entry: periodInput, // display only this
            }
        ]);

        setPeriodInput("");
    };

    const saveEntriesToBackend = () => {
        const payload = periods.map(p => ({
            id: p.id,
            entry: p.entry
        }));

        console.log("Analysis Period Save Payload:", payload);

        // 👉 BACKEND API CALL GOES HERE
        // fetch("/api/save-analysis-periods", { method: "POST", body: JSON.stringify(payload) })
    };


    const removePeriod = (id) => {
        setPeriods(prev => prev.filter(p => p.id !== id));
    };

    const save = () => {
        const payload = {
            creationTime: getISTDate(),
            periods,
            analysis,
            improvement,
            status
        };

        console.log("Save to Analysis & Improvement Sheet:", payload);
        alert("Saved successfully");
    };

    return (
        <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-700">
                Analysis & Improvement
            </h3>

            <label className="text-sm font-medium text-gray-600">
                Date or Month for which Analysis needed:
            </label>

            {/* Input + Buttons */}
            <div className="flex gap-2 items-center">
                <input
                    value={periodInput}
                    onChange={(e) => setPeriodInput(e.target.value)}
                    placeholder="dd/mm/yyyy or January"
                    className="border rounded-lg px-3 py-1 text-sm w-[11rem]"
                />

                <button
                    onClick={addPeriod}
                    className="bg-gray-200 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition cursor-pointer"
                >
                    Add
                </button>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-gray-200 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition cursor-pointer"
                >
                    Show
                </button>

                <button
                    onClick={saveEntriesToBackend}
                    className="bg-green-400 text-white p-1 rounded-lg hover:bg-green-500 transition cursor-pointer"
                    title="Save"
                >
                    <Save size={16} />
                </button>


                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="border rounded-lg px-2 py-1 text-sm ml-auto w-[6rem]"
                >
                    <option value="yet">Yet</option>
                    <option value="progress">Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {/* Analysis & Improvement */}
            <div className="grid md:grid-cols-2 gap-3">
                <textarea
                    placeholder="Analysis Point"
                    rows={8}
                    className="border rounded-lg p-2 text-sm"
                    onChange={e => setAnalysis(e.target.value)}
                />
                <textarea
                    placeholder="Improvement Point"
                    rows={8}
                    className="border rounded-lg p-2 text-sm"
                    onChange={e => setImprovement(e.target.value)}
                />
            </div>

            <button
                onClick={save}
                className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
            >
                Save
            </button>

            {/* ================= MODAL ================= */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[90%] max-w-md p-4 space-y-3">

                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-700">
                                Selected Entries
                            </h4>

                            <div className="flex gap-2 items-center">
                                <Save
                                    size={18}
                                    className="cursor-pointer text-green-400 hover:text-green-600"
                                    onClick={saveEntriesToBackend}
                                />
                                <X
                                    size={18}
                                    className="cursor-pointer"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                        </div>


                        {periods.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No entries added.
                            </p>
                        ) : (
                            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                                {periods.map(p => (
                                    <li
                                        key={p.id}
                                        className="flex justify-between items-center border rounded-lg px-3 py-2 text-sm"
                                    >
                                        <span>{p.entry}</span>
                                        <Trash2
                                            size={16}
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => removePeriod(p.id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
