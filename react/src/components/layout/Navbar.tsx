import { Menu } from "lucide-react";

type NavbarProps = {
  onToggleSidebar: () => void;
};

function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <nav className="flex h-16 items-center bg-gradient-to-tr from-primary-500 to-primary-400">
      <div className="flex items-center">
        <div className="flex h-full w-20 items-center justify-center">
          <SideBarButton onClick={onToggleSidebar} />
        </div>

        <span className="text-navbar font-semibold text-default">
          Craftalism Dashboard
        </span>
      </div>
    </nav>
  );
}

function SideBarButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle sidebar"
      className="flex size-10 items-center justify-center rounded-md hover:bg-primary-300"
    >
      <Menu className="size-6 text-default" />
    </button>
  );
}

export default Navbar;
