import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Today from "./pages/Today";
import GoalsPage from "./pages/GoalsPage";
import ReminderPage from "./pages/ReminderPage";
import ScoringLayout from "./components/scoring/ScoringLayout";
import DailyReport from "./pages/scoring/DailyReport";
import WeeklyReport from "./pages/scoring/WeeklyReport";
import GrowthReport from "./pages/scoring/GrowthReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/today" />} />
          <Route path="/today" element={<Today />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/reminders" element={<ReminderPage />} />
          <Route path="/analysis" element={<ScoringLayout />}>
            <Route path="daily" element={<DailyReport />} />
            <Route path="weekly" element={<WeeklyReport />} />
            <Route path="growth" element={<GrowthReport />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
