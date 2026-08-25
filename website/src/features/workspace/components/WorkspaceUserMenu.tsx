"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrincipalStore } from "@/store/principal.store";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Bottom-of-sidebar account menu: principal info + a way back to the main system app. */
export function WorkspaceUserMenu() {
  const principal = usePrincipalStore((s) => s.principal);

  if (!principal) return null;

  return (
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
        <DropdownMenuItem asChild>
          <Link href="/system">
            <TomatoIcon icon={TomatoIconKey.Home} className="size-4" />
            Switch to System
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
