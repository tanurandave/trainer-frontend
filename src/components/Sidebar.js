import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PlusCircle,
  Link2,
  Bell,
  Settings,
  UserCircle
} from "lucide-react";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
     }`;

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col justify-between">

      {/* LOGO */}
      <div>
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <BookOpen className="text-blue-600" size={26} />
          <h2 className="text-xl font-bold text-blue-600">TrainerHub</h2>
        </div>

        {/* MENU */}
        <nav className="mt-6 space-y-1 px-3">

          <NavLink to="/" className={linkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/trainers" className={linkClass}>
            <Users size={18} />
            Trainers
          </NavLink>

          <NavLink to="/subjects" className={linkClass}>
            <BookOpen size={18} />
            Subjects
          </NavLink>

          <NavLink to="/add-subject" className={linkClass}>
            <PlusCircle size={18} />
            Add Subject
          </NavLink>

          <NavLink to="/assign" className={linkClass}>
            <Link2 size={18} />
            Assign
          </NavLink>
        </nav>

        {/* SETTINGS */}
        <div className="mt-8 px-6 text-xs text-gray-400 uppercase tracking-wide">
          Settings
        </div>

        <nav className="mt-2 px-3 space-y-1">
          <NavLink to="/notifications" className={linkClass}>
            <Bell size={18} />
            Notifications
          </NavLink>

          <NavLink to="/settings" className={linkClass}>
            <Settings size={18} />
            Preferences
          </NavLink>
        </nav>
      </div>

      {/* PROFILE */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
          <UserCircle size={36} className="text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">
              John Anderson
            </p>
            <span className="text-xs text-gray-500">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
