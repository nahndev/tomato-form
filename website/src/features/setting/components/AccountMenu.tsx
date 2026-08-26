"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHashMatch } from "@/hooks/useHashEqual";
import { usePrincipalStore } from "@/store/principal.store";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VisuallyHidden } from "radix-ui";
import { SETTING_HASH } from "../constants/settingTabs";
import SettingContent from "./SettingContent";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * Bottom-of-sidebar account menu shared by /system and /workspace:
 * principal info, a settings entry, and a link to switch between the two apps.
 */
export function AccountMenu() {
  const principal = usePrincipalStore((s) => s.principal);
  const pathname = usePathname();
  const [isSettingOpen, toggleSetting] = useHashMatch(SETTING_HASH);

  if (!principal) return null;

  const switchTarget = pathname.startsWith("/workspace")
    ? { href: "/system", label: "Switch to System", icon: TomatoIconKey.Home }
    : {
        href: "/workspace",
        label: "Switch to Workspace",
        icon: TomatoIconKey.LayoutDashboard,
      };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2 border-t border-border p-3 text-left hover:bg-accent"
          >
            <Avatar size="sm">
              <AvatarFallback>{initials(principal.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-none">
                {principal.name}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {principal.email}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-56">
          <DropdownMenuLabel>
            <p className="truncate font-medium">{principal.name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {principal.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={toggleSetting}>
            <TomatoIcon icon={TomatoIconKey.Settings2} className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={switchTarget.href}>
              <TomatoIcon icon={switchTarget.icon} className="size-4" />
              {switchTarget.label}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isSettingOpen} onOpenChange={toggleSetting}>
        <DialogContent className="min-w-min">
          <VisuallyHidden.Root asChild>
            <DialogTitle>Settings</DialogTitle>
          </VisuallyHidden.Root>
          <SettingContent />
        </DialogContent>
      </Dialog>
    </>
  );
}
