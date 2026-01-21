import { useState } from "react";
import {
  Bell,
  Sun,
  User,
  Save,
  ShieldCheck
} from "lucide-react";

function Preferences() {
  const [settings, setSettings] = useState({
    theme: "light",
    emailNotifications: true,
    trainerAlerts: true,
    autoAssign: false,
    profileVisibility: "public"
  });

  const update = (key, value) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const savePreferences = () => {
    console.log("Saved Preferences:", settings);
    alert("Preferences saved successfully ✅");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-blue-700">
          Preferences
        </h1>
        <p className="text-gray-500">
          Customize your TrainerHub experience
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* THEME */}
        <Card icon={<Sun />} title="Appearance">
          <Option
            label="Theme"
            description="Choose dashboard appearance"
          >
            <select
              value={settings.theme}
              onChange={e => update("theme", e.target.value)}
              className="input"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </Option>
        </Card>

        {/* NOTIFICATIONS */}
        <Card icon={<Bell />} title="Notifications">
          <Toggle
            label="Email Notifications"
            checked={settings.emailNotifications}
            onChange={v => update("emailNotifications", v)}
          />
          <Toggle
            label="Trainer Assignment Alerts"
            checked={settings.trainerAlerts}
            onChange={v => update("trainerAlerts", v)}
          />
        </Card>

        {/* TRAINER SETTINGS */}
        <Card icon={<ShieldCheck />} title="Trainer Controls">
          <Toggle
            label="Auto Assign Trainers"
            checked={settings.autoAssign}
            onChange={v => update("autoAssign", v)}
          />
          <p className="text-xs text-gray-400">
            Automatically assign trainers to new subjects
          </p>
        </Card>

        {/* PROFILE */}
        <Card icon={<User />} title="Profile Settings">
          <Option label="Profile Visibility">
            <select
              value={settings.profileVisibility}
              onChange={e => update("profileVisibility", e.target.value)}
              className="input"
            >
              <option value="public">Public</option>
              <option value="internal">Internal Only</option>
              <option value="private">Private</option>
            </select>
          </Option>
        </Card>

      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={savePreferences}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg
                     hover:bg-blue-700 transition"
        >
          <Save size={18} />
          Save Preferences
        </button>
      </div>

    </div>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

const Card = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow p-6 space-y-4">
    <div className="flex items-center gap-2 text-blue-600 font-semibold">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition
        ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full transition
          ${checked ? "translate-x-5" : ""}`}
      />
    </button>
  </div>
);

const Option = ({ label, description, children }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">
      {label}
    </label>
    {children}
    {description && (
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    )}
  </div>
);

export default Preferences;
