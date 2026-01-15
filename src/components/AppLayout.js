import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="page-content"><Outlet /></main>
    </div>
  );
};

export default AppLayout;
