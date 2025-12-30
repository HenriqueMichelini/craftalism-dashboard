import { Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="flex h-16 items-center bg-gradient-to-tr from-primary-500 to-primary-400">
      <div className="flex items-center">
        <div className="flex h-full w-20 items-center justify-center">
          {SideBarButton()}
        </div>
        <span className="text-navbar font-semibold text-default">
          Craftalism Dashboard
        </span>
      </div>
    </nav>
  );
}

function SideBarButton() {
  return (
    <button>
      <Menu className="size-6 text-default" />
    </button>
  );
}

export default Navbar;
