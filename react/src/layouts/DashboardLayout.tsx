import Navbar from "../pages/Dashboard/components/Navbar";
import SideBar from "../pages/Dashboard/components/SideBar";
import SideBarOpened from "../pages/Dashboard/components/SideBarOpened";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <SideBar />
        <SideBarOpened />
        <main className="flex-1 bg-primary-200 p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
