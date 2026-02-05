import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "success",
    title: "Topic Assigned",
    message: "You’ve been assigned a new topic under Web Development.",
    time: "Just now",
    read: false
  },
  {
    id: 2,
    type: "warning",
    title: "Pending Topics",
    message: "Some subjects still have unassigned topics. Review them.",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    type: "info",
    title: "Profile Updated",
    message: "Your profile details were updated successfully.",
    time: "Yesterday",
    read: true
  }
];

const styles = {
  success: {
    icon: <CheckCircle2 className="text-emerald-600" size={22} />,
    bg: "bg-emerald-50/80 border-emerald-200"
  },
  warning: {
    icon: <AlertTriangle className="text-amber-600" size={22} />,
    bg: "bg-amber-50/80 border-amber-200"
  },
  info: {
    icon: <Info className="text-blue-600" size={22} />,
    bg: "bg-blue-50/80 border-blue-200"
  }
};

function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <Bell size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Notifications
            </h1>
            <p className="text-sm text-gray-500">
              Stay up to date with system activity
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium px-4 py-2 rounded-xl
            bg-white border shadow-sm hover:bg-gray-50 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            You’re all caught up
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            No new notifications at the moment
          </p>
        </div>
      )}

      {/* NOTIFICATIONS */}
      <div className="space-y-5">
        {notifications.map((item) => {
          const style = styles[item.type];

          return (
            <div
              key={item.id}
              className={`group relative rounded-3xl border p-6 shadow-sm
              backdrop-blur transition-all duration-300
              hover:shadow-md hover:-translate-y-0.5
              ${style.bg}
              ${item.read ? "opacity-70" : ""}`}
            >
              <div className="flex gap-4">
                {/* ICON */}
                <div className="mt-1">
                  {style.icon}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {!item.read && (
                    <span className="inline-flex items-center mt-3 text-xs font-medium
                    text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* DELETE */}
                <button
                  onClick={() => removeNotification(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition
                  p-2 rounded-xl hover:bg-red-100"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifications;
