import { useState } from "react";
import Navbar from "../components/layout/Navbar.js";
import SideBar from "../components/layout/SideBar.js";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex min-h-0 flex-1">
        <SideBar isOpen={isSidebarOpen} />
        <main className="min-w-0 flex-1 space-y-4 overflow-auto bg-gradient-to-br from-primary-300 to-primary-400 p-6 transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
