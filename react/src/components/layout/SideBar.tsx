import { AlignEndVertical, Box, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SideBarState = {
  isOpen: boolean;
};

type SideBarItemProps = {
  icon: LucideIcon;
  label: string;
};

function SideBar({ isOpen }: SideBarState) {
  return (
    <nav
      className={`flex h-full shrink-0 flex-col items-center
        gap-6
        bg-gradient-to-br from-primary-500 to-primary-400 px-1 py-6
        transition-all
        ${isOpen ? "w-64" : "w-20"}`}
    >
      <SideBarItem icon={Database} label="Database" isOpen={isOpen} />
      <SideBarItem icon={AlignEndVertical} label="Analytics" isOpen={isOpen} />
      <SideBarItem icon={Box} label="Products" isOpen={isOpen} />
    </nav>
  );
}

function SideBarItem({
  icon: Icon,
  label,
  isOpen,
}: SideBarItemProps & { isOpen: boolean }) {
  return (
    <button
      title={label}
      className={`
        flex w-full items-center justify-start overflow-hidden rounded-md
        px-6 py-2 text-default transition-colors hover:bg-primary-400
      `}
    >
      <Icon className="size-6 shrink-0" />

      <span
        className={`
          overflow-hidden whitespace-nowrap text-sm font-medium
          transition-all duration-200
          ${isOpen ? "ml-3 max-w-32 opacity-100" : "ml-0 max-w-0 opacity-0"}
        `}
      >
        {label}
      </span>
    </button>
  );
}

export default SideBar;
