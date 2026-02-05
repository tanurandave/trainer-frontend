import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar + Page */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-5 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;
