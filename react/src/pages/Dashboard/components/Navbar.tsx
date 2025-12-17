import { Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="flex h-[75px] items-center bg-gradient-to-r from-primary-500 to-primary-400">
      <div className="flex items-center">
        <div className="flex h-full w-[100px] items-center justify-center">
          <Menu className="size-8 text-default" />
        </div>
        <span className="text-navbar font-semibold text-default">
          Craftalism Dashboard
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
