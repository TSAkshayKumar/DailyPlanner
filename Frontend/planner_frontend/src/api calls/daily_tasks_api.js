// hooks/useSavePriorityTasks.js
import { usePlanner } from "../context/PlannerContext";
import api from "./axios"
import { v4 as uuidv4 } from "uuid";

export const fetchDailyTasks = async (date) => {
    try {
        const response = await api.get(`/api/daily-tasks?date=${date}`);
        return { data: response.data, status: response.status };
    } catch (error) {
        return { error: error.response || error, status: error.response?.status || 500 };
    }
};

export const useSavePriorityTasks = () => {
    const { tasks, loadDailyTasks } = usePlanner();
    
    const handleRefresh = async (selectedDate) => {
        try {
            await loadDailyTasks(true, selectedDate); // your existing function
            alert("Content refreshed successfully ✅");
        } catch (error) {
            alert("Failed to refresh ❌");
        }
    }

    const savePriorityTasks = async (type, selectedDate) => {
        try {
            const payload = {
                task_type: type,
                selected_date: selectedDate,
                tasks: tasks[type].map((t) => ({
                    task_id: t.task_id ? t.task_id : uuidv4(),
                    task_name: t.text,
                    status: t.status,
                })),
            };

            const response = await api.post("/api/save-priority-tasks", payload);
            if (response.status === 200) {
                loadDailyTasks(true, selectedDate);
            }
            const result = {
                data: response.data,
                status: response.status
            }
            return result;
        } catch (error) {
            const result = {
                error: error.response || error,
                status: error.response ? error.response.status : 500
            }
            return result;
        }
    };

    const saveTracker = async (timeTasks) => {
        try {
            const values = {};
            const payload = {};
            timeTasks?.values.forEach(({ time, planned, actual }) => {
                if (!time) return;

                const baseKey = time
                    .toLowerCase()
                    .replace(":", "_")
                    .replace(" ", "_");

                values[`${baseKey}_set`] = planned || "";
                values[`${baseKey}_actual`] = actual || "";
            });

            if (timeTasks.tracker_id !== null && timeTasks.tracker_id !== "") {
                payload['tracker_id'] = timeTasks.tracker_id
                payload['values'] = values
            } else {
                payload['tracker_id'] = uuidv4()
                payload['values'] = values
            }
            const response = await api.post("/api/save-tracker", payload);

            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                error: error.response || error
            };
        }
    };
    return { savePriorityTasks, saveTracker, handleRefresh }
};