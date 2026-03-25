import { usePlanner } from "../../context/PlannerContext";
import { Star, Save } from "lucide-react";

export default function ScorePanel() {
    const {
        score,
        threshold,
        setThreshold,
        reward,
        punishment,
        setReward,
        setPunishment,
        saveRewardPunishmentToExcel
    } = usePlanner();

    return (
        <div
            className="bg-gradient-to-br from-yellow-100 to-orange-100
      rounded-2xl p-5 border border-orange-300 shadow-sm h-fit space-y-4"
        >

            {/* Header */}
            <div className="flex justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-700">
                    <Star size={18} />
                    Daily Score
                </h3>
                {/* Eligibility */}
                <div className="text-sm font-medium">
                    {Number(score) >= Number(threshold) ? (
                        <span className="text-green-600">🎉 You Did It!</span>
                    ) : (
                        <span className="text-red-500">🔥 Almost there — Keep the fire going!</span>
                    )}
                </div>
            </div>

            {/* Score */}
            <div className="text-4xl font-bold text-orange-600">
                {score}%
            </div>

            {/* Threshold + Save */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-700">
                    Threshold :
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    className="border rounded-lg px-3 py-1 w-24 text-sm cursor-pointer"
                    placeholder="Threshold"
                />

                <button
                    onClick={saveRewardPunishmentToExcel}
                    className="flex items-center gap-1 cursor-pointer bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-orange-600"
                >
                    <Save size={16} />
                    Save
                </button>
            </div>


            {/* Punishment */}
            <div>
                <label className="text-xs font-semibold text-gray-700">
                    Punishment
                </label>
                <input
                    type="text"
                    value={punishment}
                    onChange={e => setPunishment(e.target.value)}
                    placeholder="Enter punishment..."
                    className="w-full border rounded-lg px-3 py-2 text-sm break-words"
                />
            </div>

            {/* Reward */}
            <div>
                <label className="text-xs font-semibold text-gray-700">
                    Reward
                </label>
                <input
                    type="text"
                    value={reward}
                    onChange={e => setReward(e.target.value)}
                    placeholder="Enter reward..."
                    className="w-full border rounded-lg px-3 py-2 text-sm break-words"
                />
            </div>
        </div>
    );
}
