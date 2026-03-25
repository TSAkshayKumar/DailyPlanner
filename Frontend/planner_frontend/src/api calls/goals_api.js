import api from "./axios";
import { v4 as uuidv4 } from "uuid";

export const fetchGoals = async () => {
    try {
        const response = await api.get("/api/goals");
        return { data: response.data, status: response.status };
    } catch (error) {
        return { error: error.response || error, status: error.response?.status || 500 };
    }
};

export const saveGoalsApi = async (goals) => {
    try {
        const payload = { goals: [] };

        ["high", "medium", "low"].forEach(type => {
            (goals[type]?.list || []).forEach(g => {
                if (!g.text?.trim()) return;
                payload.goals.push({
                    goal_id: g.goal_id || uuidv4(),
                    goal: g.text,
                    goal_type: type,
                    last_date: g.lastDate || "",
                    status: g.status
                });
            });
        });

        const response = await api.post("/api/save-goals", payload);
        return { data: response.data, status: response.status };
    } catch (error) {
        return { error: error.response || error, status: error.response?.status || 500 };
    }
};
