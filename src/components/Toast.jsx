import { useEffect } from "react";

const variants = {
  success: {
    ring: "ring-blue-200",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "✓",
    iconBg: "bg-blue-600",
  },
  error: {
    ring: "ring-red-200",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: "!",
    iconBg: "bg-red-600",
  },

  /* ✅ ADDED (NO EXISTING BEHAVIOR CHANGED) */
  warning: {
    ring: "ring-yellow-200",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    icon: "!",
    iconBg: "bg-yellow-500",
  },
  info: {
    ring: "ring-sky-200",
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-800",
    icon: "i",
    iconBg: "bg-sky-600",
  },
};

/* ✅ SAFE FALLBACK (prevents ALL crashes) */
const DEFAULT_VARIANT = variants.success;

export function Toast({
  id,
  type = "success",
  title,
  message,
  onClose,
  duration = 3500,
}) {
  const v = variants[type] || DEFAULT_VARIANT;

  useEffect(() => {
    const t = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onClose]);

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border
        ${v.border} ${v.bg} shadow-xl ring-1 ${v.ring}
        animate-[slideIn_.25s_ease-out]`}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${v.iconBg} text-white`}
        >
          {v.icon}
        </div>

        <div className="flex-1">
          {title && (
            <p className={`text-sm font-semibold ${v.text}`}>{title}</p>
          )}
          {message && (
            <p className="mt-0.5 text-sm text-gray-700">{message}</p>
          )}
        </div>

        <button
          onClick={() => onClose(id)}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
