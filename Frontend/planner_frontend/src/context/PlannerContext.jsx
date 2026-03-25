import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { getISTDate, getNextSundayIST } from "../utils/dateIST";
import { fetchDailyTasks } from "../api calls/daily_tasks_api";
import { fetchGoals, saveGoalsApi } from "../api calls/goals_api";

const CACHE_KEY = (date) => `planner_daily_${date}`;

// Hrs wise time slots from 5 AM to 2 AM
const generateTimeSlots = () => {
  const slots = [];

  // Start at 5 AM (24-hour format = 5)
  let hour = 5;

  // End at 2 AM next day (26 in 24h extended logic)
  while (hour <= 26) {
    const displayHour24 = hour % 24; // converts 24 → 0, 25 → 1, 26 → 2
    const isPM = displayHour24 >= 12;

    const displayHour12 =
      displayHour24 === 0
        ? 12
        : displayHour24 > 12
          ? displayHour24 - 12
          : displayHour24;

    const label = `${String(displayHour12).padStart(2, "0")}:00 ${isPM ? "PM" : "AM"
      }`;

    slots.push(label);
    hour++;
  }

  return slots;
};

const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {
  const [threshold, setThreshold] = useState(0);
  const [reward, setReward] = useState("");
  const [punishment, setPunishment] = useState("");
  const [notSaved, setNotSaved] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoalsLoading, setIsGoalsLoading] = useState(false);

  const [tasks, setTasks] = useState({
    high: [],
    medium: [],
    low: [],
    growth: [],
    happiness: [],
    office: [],
  });


  const [timeTasks, setTimeTasks] = useState({
    "tracker_id": "",
    "datetime": "",
    "values": generateTimeSlots().map(time => ({
      time,
      planned: "",
      actual: ""
    }))

  }
  );


  {/*Reminder Section*/ }
  const [reminders, setReminders] = useState([]);

  const hydrateFromData = (data) => {
    // Hydrate priority tasks
    const taskTypes = ["high", "medium", "low", "growth", "happiness", "office"];
    const newTasks = {};
    taskTypes.forEach(type => {
      newTasks[type] = (data.priority_tasks?.[type] || []).map(t => ({
        text: t.task_name,
        status: t.status,
        task_id: t.task_id,
        completed: t.status === "done"
      }));
    });
    setTasks(newTasks);

    // Hydrate score
    if (data.score) {
      setThreshold(data.score.threshold || 0);
      setReward(data.score.rewards || "");
      setPunishment(data.score.punishment || "");
    }

    // Hydrate tracker
    if (data.tracker?.values) {
      setTimeTasks(prev => ({
        tracker_id: data.tracker.tracker_id || "",
        datetime: data.tracker.datetime || "",
        values: prev.values.map(slot => {
          const baseKey = slot.time.toLowerCase().replace(":", "_").replace(" ", "_");
          return {
            ...slot,
            planned: data.tracker.values[`${baseKey}_set`] || "",
            actual: data.tracker.values[`${baseKey}_actual`] || ""
          };
        })
      }));
    }

    // Hydrate reminders
    if (data.reminders?.length) {
      setReminders(data.reminders.map(r => ({
        id: r.reminder_id,
        task: r.reminder
      })));
    }
  };

  const loadDailyTasks = async (forceRefresh = false, selectedDate = getISTDate()) => {
    const cacheKey = CACHE_KEY(selectedDate);

    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        hydrateFromData(JSON.parse(cached));
        return;
      }
    }

    setIsLoading(true);
    const result = await fetchDailyTasks(selectedDate);
    setIsLoading(false);

    if (result.status >= 200 && result.status < 300) {
      localStorage.setItem(cacheKey, JSON.stringify(result.data));
      hydrateFromData(result.data);
    }
  };


  useEffect(() => {
    loadDailyTasks();
  }, []);

  const hydrateGoals = (data) => {
    // API returns { date, goals: [ { goal_id, goal, goal_type, last_date, status } ] }
    const mapped = { high: { creationDate: getISTDate(), lastDate: getISTDate(), list: [] }, medium: { lastDate: getISTDate(), list: [] }, low: { list: [] } };
    (data.goals || []).forEach(g => {
      const type = g.goal_type?.toLowerCase();
      if (!mapped[type]) return;
      mapped[type].list.push({
        text: g.goal,
        status: g.status,
        goal_id: g.goal_id,
        creationDate: getISTDate(),
        lastDate: g.last_date ? String(g.last_date).slice(0, 10) : ""
      });
    });
    setGoals(mapped);
  };

  const GOALS_CACHE_KEY = `planner_goals_all`;

  const loadGoals = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = localStorage.getItem(GOALS_CACHE_KEY);
      if (cached) { hydrateGoals(JSON.parse(cached)); return; }
    }
    setIsGoalsLoading(true);
    const result = await fetchGoals();
    setIsGoalsLoading(false);
    if (result.status >= 200 && result.status < 300) {
      localStorage.setItem(GOALS_CACHE_KEY, JSON.stringify(result.data));
      hydrateGoals(result.data);
    }
  };

  const saveRewardPunishmentToExcel = () => {
    const value = Number(threshold);

    if (value < 0 || value > 100) {
      alert("Threshold must be between 0 and 100");
      return;
    }

    const payload = {
      threshold: value,
      reward,
      punishment
    };

    console.log("Saving Reward & Punishment:", payload);
    // FastAPI + Excel later
  };



  const updateTask = (type, index, updatedTask) => {
    setTasks(prev => {
      const copy = [...prev[type]];
      copy[index] = updatedTask;
      return { ...prev, [type]: copy };
    });
  };

  const addTask = (type) => {
    setTasks(prev => ({
      ...prev,
      [type]: [
        ...prev[type],
        { text: "", status: "yet", completed: false }
      ]
    }));
  };

  // delete Task
  const deleteTask = (type, index) => {
    setTasks(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };


  // ✅ Automated Scoring
  const score = useMemo(() => {
    const highCompleted = tasks.high.filter(t => t.completed).length;
    const mediumCompleted = tasks.medium.filter(t => t.completed).length;

    const highScore = tasks.high.length
      ? (highCompleted / tasks.high.length) * 60
      : 0;

    const mediumScore = tasks.medium.length
      ? (mediumCompleted / tasks.medium.length) * 40
      : 0;

    return Math.round(highScore + mediumScore);
  }, [tasks]);


  const updateTimeTask = (index, field, value) => {
    setTimeTasks(prev => ({
      ...prev,
      values: prev.values.map((task, i) =>
        i === index
          ? { ...task, [field]: value }
          : task
      )
    }));
  };


  const addReminder = (task) => {
    if (!task.trim()) return;

    setReminders(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        task
      }
    ]);
  };

  const removeReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const removeAllReminders = () => {
    setReminders([]);
  };

  const saveRemindersToExcel = () => {
    const payload = reminders.map(r => ({
      task: r.task
    }));

    console.log("Saving Reminder Sheet:", payload);
    // Excel integration later
  };

  // Goals Section ----------------------------------
  const [goals, setGoals] = useState({
    high: {
      creationDate: getISTDate(),
      lastDate: getISTDate(),
      list: []
    },
    medium: {
      lastDate: getISTDate(),
      list: []
    },
    low: {
      list: []
    }
  });

  const addGoal = (type) => {
    setGoals(prev => {
      let lastDate = "";

      if (type === "high") {
        lastDate = getISTDate();
      }

      if (type === "medium") {
        lastDate = getNextSundayIST();
      }

      return {
        ...prev,
        [type]: {
          ...prev[type],
          list: [
            ...prev[type].list,
            {
              text: "",
              status: "yet",
              creationDate: getISTDate(),
              lastDate // ❗ auto for high & medium, empty for low
            }
          ]
        }
      };
    });
  };

  const deleteGoal = (type, index) => {
    setGoals(prev => {
      const newList = [...prev[type].list];
      newList.splice(index, 1); // remove the goal at index
      return { ...prev, [type]: { ...prev[type], list: newList } };
    });
  };


  const updateGoal = (type, index, updated) => {
    setGoals(prev => {
      const list = [...prev[type].list];
      list[index] = updated;
      return { ...prev, [type]: { ...prev[type], list } };
    });
  };


  const saveGoals = async () => {
    for (const g of goals.low.list) {
      if (!g.lastDate) {
        alert("Low priority goals must have a deadline before saving.");
        return;
      }
    }

    const result = await saveGoalsApi(goals);

    if (result.status >= 200 && result.status < 300) {
      localStorage.removeItem(GOALS_CACHE_KEY);
      alert("✅ Goals saved successfully!");
    } else {
      alert("❌ Failed to save goals. Please try again.");
    }
  };

  // Goals Section end ----------------------------------


  //------------Reminder section ---------------------------
  const [remindersNotification, setRemindersNotification] = useState([]);
  const checkForReminders = () => {
    const today = new Date(getISTDate());
    const newReminders = [];

    // MEDIUM → always reminder
    goals.medium.list.forEach(g => {
      if (!g.text?.trim()) return;

      newReminders.push({
        id: crypto.randomUUID(),
        task: g.text,
        status: g.status,
        creationDate: g.creationDate,
        lastDate: g.lastDate,
        source: "medium"
      });
    });

    // LOW → reminder only if within 10 days
    goals.low.list.forEach(g => {
      if (!g.text?.trim() || !g.lastDate) return;

      const deadline = new Date(g.lastDate);
      const diffDays =
        (deadline - today) / (1000 * 60 * 60 * 24);

      if (diffDays <= 10) {
        newReminders.push({
          id: crypto.randomUUID(),
          task: g.text,
          status: g.status,
          creationDate: g.creationDate,
          lastDate: g.lastDate,
          source: "low"
        });
      }
    });

    // SORT BY LAST DATE ASC
    newReminders.sort(
      (a, b) => new Date(a.lastDate) - new Date(b.lastDate)
    );
    console.log(newReminders, " New Reminders Found");

    setRemindersNotification(prev => {
      const existingIds = new Set(prev.map(r => r.task + r.lastDate));
      const filtered = newReminders.filter(
        r => !existingIds.has(r.task + r.lastDate)
      );
      return [...prev, ...filtered];
    });
  };

  const removeReminderNotification = (id) => {
    console.log("Removing reminder notification with id:", id);
    setRemindersNotification(prev => prev.filter(r => r.id !== id));

    // TODO: Excel delete by id
  };

  //------------Reminder section end ------------------------
  return (
    <PlannerContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        updateTask,
        score,
        threshold,
        setThreshold,
        timeTasks,
        updateTimeTask,
        reminders,
        addReminder,
        removeReminder,
        removeAllReminders,
        saveRemindersToExcel,
        reward,
        setReward,
        punishment,
        setPunishment,
        saveRewardPunishmentToExcel,
        goals,
        addGoal,
        deleteGoal,
        updateGoal,
        saveGoals,
        remindersNotification,
        checkForReminders,
        removeReminderNotification,
        notSaved,
        setNotSaved,
        loadDailyTasks,
        isLoading,
        loadGoals,
        isGoalsLoading
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => useContext(PlannerContext);
