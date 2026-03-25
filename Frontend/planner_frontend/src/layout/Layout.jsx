import { NavLink, Outlet } from "react-router-dom";
import { CalendarCheck, Target, Bell, BarChart, Activity } from "lucide-react";
import { handleHealthCheck } from "../api calls/healthCheck";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">

      {/* ✅ Desktop Top Nav */}
      <nav className="hidden md:flex items-center justify-center gap-8
        bg-white border-b p-3 sticky top-0 z-50">
        
        <NavItem to="/today" icon={<CalendarCheck size={18} />} label="Daily" />
        <NavItem to="/goals" icon={<Target size={18} />} label="Goals" />
        <NavItem to="/reminders" icon={<Bell size={18} />} label="Reminders" />
        <NavItem to="/analysis" icon={<BarChart size={18} />} label="Analysis" />

        <button
          onClick={handleHealthCheck}
          className="ml-4 w-9 h-9 rounded-full cursor-pointer bg-green-100 text-green-700 hover:bg-green-200"
          title="Health Check"
        >
          <Activity size={18} className="mx-auto" />
        </button>
      </nav>

      {/* ✅ Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden
        bg-white border-t flex justify-around items-center py-2 z-50">

        <MobileNavItem to="/today" icon={<CalendarCheck size={20} />} />
        <MobileNavItem to="/goals" icon={<Target size={20} />} />
        <MobileNavItem to="/reminders" icon={<Bell size={20} />} />
        <MobileNavItem to="/analysis" icon={<BarChart size={20} />} />

        {/* Health Check */}
        <button
          onClick={handleHealthCheck}
          className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center"
        >
          <Activity size={20} />
        </button>

      </nav>

      <main className="p-3 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1 px-3 py-2 rounded-lg text-sm
        ${isActive ? "bg-orange-100 text-orange-600" : "text-gray-600"}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function MobileNavItem({ to, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center text-xs
        ${isActive ? "text-orange-600" : "text-gray-500"}`
      }
    >
      {icon}
    </NavLink>
  );
}