import { AlignEndVertical, Box, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SideBarItemProps = {
  icon: LucideIcon;
  label: string;
};

function SideBarOpened() {
  return (
    <nav className="flex h-full w-64 flex-col gap-6 bg-gradient-to-br from-primary-500 to-primary-400 p-6">
      <SideBarItem icon={Database} label="Database" />
      <SideBarItem icon={AlignEndVertical} label="Analytics" />
      <SideBarItem icon={Box} label="Products" />
    </nav>
  );
}

function SideBarItem({ icon: Icon, label }: SideBarItemProps) {
  return (
    <button
      title={label}
      className="
        flex w-full items-center gap-3
        rounded-md px-3 py-2
        text-default
        hover:bg-primary-400 shadow-md hover:shadow-lg
        transition-colors
      "
    >
      <Icon className="size-6 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default SideBarOpened;
