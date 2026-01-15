import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-header">
        <span className="logo-icon">📘</span>
        <h2>TrainerHub</h2>
      </div>

      {/* MAIN MENU */}
      <nav className="sidebar-menu">
        <NavLink to="/" className="menu-item">
          📊 <span>Dashboard</span>
        </NavLink>

        <NavLink to="/trainers" className="menu-item">
           <span>Trainers</span>
        </NavLink>

        <NavLink to="/subjects" className="menu-item">
           <span>Subjects</span>
        </NavLink>
      <NavLink to="/add-subject" className="menu-item">
           <span>Add Subject</span>
        </NavLink>

        <NavLink to="/assign" className="menu-item">
           <span>Assign </span>
        </NavLink>
      </nav>
<br/>
      {/* SETTINGS */}
      <div className="sidebar-section">
        <p className="section-title"> ⚙️ SETTINGS</p>


        <NavLink to="/notifications" className="menu-item">
          🔔 <span>Notifications</span>
        </NavLink>
      </div>
      {/* PROFILE (BOTTOM FIXED) */}
<div className="sidebar-profile">
  <NavLink to="#" className="profile-card">
    <img
      src="https://i.pravatar.cc/100?img=12"
      alt="Profile"
      className="profile-avatar-img"
    />

    <div className="profile-details">
      <p className="profile-name">John Anderson</p>
      <span className="profile-role">Administrator</span>
    </div>

    <span className="profile-menu">⋮</span>
  </NavLink>
</div>

    </aside>
  );
}

export default Sidebar;
