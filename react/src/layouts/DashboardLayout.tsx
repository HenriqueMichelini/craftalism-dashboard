import Navbar from "../pages/Dashboard/components/Navbar";
import SideBar from "../pages/Dashboard/components/SideBar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <SideBar isOpen={false} />
        <main className="flex-1 space-y-4 bg-primary-200 p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
