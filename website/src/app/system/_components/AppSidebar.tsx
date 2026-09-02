"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AccountMenu } from "@/features/setting";
import { cn } from "@/lib/utils";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: TomatoIconKey;
}
const NAV_ITEMS: NavItem[] = [
  { href: "/system", label: "Home", icon: TomatoIconKey.Home },
  { href: "/system/templates", label: "Templates", icon: TomatoIconKey.Document },
  { href: "/system/boards", label: "Boards", icon: TomatoIconKey.LayoutGrid },
  { href: "/system/users", label: "Users", icon: TomatoIconKey.Users },
  { href: "/system/documents", label: "Documents", icon: TomatoIconKey.Database },
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
        <AccountMenu />
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
    item.href === "/system"
      ? pathname === "/system"
      : pathname.startsWith(item.href);
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
      <TomatoIcon icon={item.icon} className="size-4" />
      {item.label}
    </Link>
  );
};
