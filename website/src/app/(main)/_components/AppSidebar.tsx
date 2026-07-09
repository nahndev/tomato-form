"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileText, Home, LayoutGrid, LucideIcon, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingPopup } from "./SettingPopup";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/boards", label: "Boards", icon: LayoutGrid },
  { href: "/users", label: "Users", icon: Users },
];

export function AppSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-background">
      <div className="px-4 py-5">
        <span className="text-lg font-bold text-primary">Tomato</span>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>
      <nav className="flex flex-col gap-1">
        <SettingPopup />
      </nav>
    </aside>
  );
}

export interface NavItemProps {
  item: NavItem;
}

const NavItem: React.FC<NavItemProps> = ({ item }) => {
  const pathname = usePathname();
  const isActive =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
};
