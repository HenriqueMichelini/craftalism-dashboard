import { AlignEndVertical, Box, Database } from "lucide-react";

function SideBar() {
  return (
    <nav className="flex h-full w-[100px] flex-col items-center gap-6 bg-primary-500 py-6">
      <button className="flex size-10 items-center justify-center rounded-md text-default hover:bg-primary-400">
        <Database className="size-6" />
      </button>

      <button className="flex size-10 items-center justify-center rounded-md text-default hover:bg-primary-400">
        <AlignEndVertical className="size-6" />
      </button>

      <button className="flex size-10 items-center justify-center rounded-md text-default hover:bg-primary-400">
        <Box className="size-6" />
      </button>
    </nav>
  );
}

export default SideBar;
