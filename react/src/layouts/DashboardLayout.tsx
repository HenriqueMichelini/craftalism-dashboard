import { useState } from "react";
import Navbar from "../pages/Dashboard/components/Navbar";
import SideBar from "../pages/Dashboard/components/SideBar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1">
        <SideBar isOpen={isSidebarOpen} />
        <main className="flex-1 space-y-4 bg-primary-200 p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
