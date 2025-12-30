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
      className={`flex h-full flex-col items-center
        gap-6
        bg-gradient-to-br from-primary-500 to-primary-400 py-6
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
        flex items-center rounded-md text-default
        hover:bg-primary-400
        ${isOpen ? "w-full gap-3 px-6 py-2" : "size-10 justify-center"}
      `}
    >
      <Icon className="size-6 shrink-0" />

      {isOpen && (
        <span className="whitespace-nowrap text-sm font-medium">{label}</span>
      )}
    </button>
  );
}

export default SideBar;
