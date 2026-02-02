import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PlusCircle,
  Link2,
  Bell,
  Settings,
  UserCircle,
  Menu,
  X
} from "lucide-react";

function Sidebar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 no-underline 
     ${
       isActive
         ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
         : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
     }`;

  return (
    <>
      {/* 🔹 MOBILE TOP BAR (ICON LEFT) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white/90 backdrop-blur border-b flex items-center px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={26} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-2 ml-3">
          <BookOpen className="text-blue-600" size={20} />
          <span className="font-bold text-blue-600 text-lg">
            TrainerHub
          </span>
        </div>
      </div>

      {/* 🔹 OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔹 SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64
        bg-white/90 backdrop-blur-xl border-r border-gray-200
        flex flex-col justify-between
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* LOGO + CLOSE */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
                <BookOpen size={18} />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TrainerHub
              </h2>
            </div>

            {/* CLOSE ICON (MOBILE) */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <X size={22} className="text-gray-600" />
            </button>
          </div>

          {/* MENU */}
          <nav className="mt-6 space-y-1 px-3">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>

            <NavLink to="/trainers" className={linkClass} onClick={() => setOpen(false)}>
              <Users size={18} /> Trainers
            </NavLink>

            <NavLink to="/subjects" className={linkClass} onClick={() => setOpen(false)}>
              <BookOpen size={18} /> Subjects
            </NavLink>

            <NavLink to="/add-subject" className={linkClass} onClick={() => setOpen(false)}>
              <PlusCircle size={18} /> Add Subject
            </NavLink>

            <NavLink to="/assign" className={linkClass} onClick={() => setOpen(false)}>
              <Link2 size={18} /> Assign
            </NavLink>

            <NavLink to="/topics" className={linkClass} onClick={() => setOpen(false)}>
              <BookOpen size={18} /> Topics
            </NavLink>

            <NavLink to="/manage-topics" className={linkClass} onClick={() => setOpen(false)}>
              <BookOpen size={18} /> Manage Topics
            </NavLink>
          </nav>

          {/* SETTINGS */}
          <div className="mt-8 px-6 text-[11px] text-gray-400 uppercase tracking-widest">
            Settings
          </div>

          <nav className="mt-2 px-3 space-y-1">
            <NavLink to="/notifications" className={linkClass} onClick={() => setOpen(false)}>
              <Bell size={18} /> Notifications
            </NavLink>

            <NavLink to="/settings" className={linkClass} onClick={() => setOpen(false)}>
              <Settings size={18} /> Preferences
            </NavLink>
          </nav>
        </div>

        {/* PROFILE */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition cursor-pointer">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-full text-white">
              <UserCircle size={28} />
            </div>
            <div>
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

      {/* 🔹 MOBILE CONTENT SPACER */}
      <div className="h-14 lg:hidden" />
    </>
  );
}

export default Sidebar;