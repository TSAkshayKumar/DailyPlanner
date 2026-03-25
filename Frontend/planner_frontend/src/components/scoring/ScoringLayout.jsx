// import { NavLink, Outlet } from "react-router-dom";

// export default function ScoringLayout() {
//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="flex gap-3 mb-4">
//         {["daily", "weekly", "growth"].map(tab => (
//           <NavLink
//             key={tab}
//             to={tab}
//             className={({ isActive }) =>
//               `px-4 py-2 rounded-xl text-sm font-medium ${
//                 isActive
//                   ? "bg-indigo-600 text-white"
//                   : "bg-white border"
//               }`
//             }
//           >
//             {tab.toUpperCase()} REPORT
//           </NavLink>
//         ))}
//       </div>

//       <Outlet />
//     </div>
//   );
// }

import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function ScoringLayout() {
  const location = useLocation();

  // Check if user is on base route (/scoring)
  const isBaseRoute = location.pathname === "/analysis";

  const tabs = ["daily", "weekly", "growth"];

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100">

      {/* 🔹 BASE ROUTE → FULL SIZE BUTTONS */}
      {isBaseRoute ? (
        <div className="grid gap-4 mx-[10%]">
          {tabs.map(tab => (
            <NavLink
              key={tab}
              to={tab}
              className="h-[11rem] flex items-center justify-center rounded-2xl
           bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600
           text-white text-lg font-semibold
           shadow-md border border-white/20
           hover:shadow-xl hover:scale-[1.02] hover:font-bold
           transition-all duration-300"
            >
              {tab.toUpperCase()} REPORT
            </NavLink>
          ))}
        </div>
      ) : (
        /* 🔹 SUB ROUTE → SMALL TABS */
        <div className="flex gap-4 mb-4 justify-center">
          {tabs.map(tab => (
            <NavLink
              key={tab}
              to={tab}
              className={({ isActive }) =>
                `px-4 py-2 w-[20%] text-center rounded-xl text-sm font-medium transition ${isActive
                  ? "bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white hover:font-bold"
                  : "bg-white border hover:bg-gray-200 hover:font-bold"
                }`
              }
            >
              {tab.toUpperCase()} REPORT
            </NavLink>
          //  text-white text-lg font-semibold
          //  shadow-md border border-white/20
          //  hover:shadow-xl hover:scale-[1.02] hover:font-bold
          //  transition-all duration-300"
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}

