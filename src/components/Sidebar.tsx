import {
  LayoutDashboard,
  File,
  Activity,
  HelpCircle,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col">
      <div className="p-6">
        <h1 className="text-lg font-bold text-slate-900">KMRL Insights</h1>
      </div>
      <nav className="py-6">
        <ul>
          <li className="mb-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="mb-1">
            <NavLink
              to="/document-feed"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <File className="w-4 h-4 mr-3" />
              <span>Document Feed</span>
            </NavLink>
          </li>
          <li className="mb-1">
            <NavLink
              to="/communication"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <File className="w-4 h-4 mr-3" />
              <span>Communication</span>
            </NavLink>
          </li>
          <li className="mb-1">
            <NavLink
              to="/audit"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Activity className="w-4 h-4 mr-3" />
              <span>Audit Traceability</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-auto p-6">
      </div>
    </aside>
  );
};

export { Sidebar };
