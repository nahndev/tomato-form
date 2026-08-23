"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TOMATO_ICON_MAP, TomatoIcon, type TomatoIconKey } from "@tomato/icon";

export interface IconPickerProps {
  value?: TomatoIconKey;
  onChange: (icon: TomatoIconKey) => void;
  className?: string;
}

/** Trigger button showing the selected icon; opens a grid to pick another. */
export function IconPicker({ value, onChange, className }: IconPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("rounded-md", className)}
        >
          <TomatoIcon
            icon={value ?? "clock"}
            className={cn("size-3.5", !value && "text-muted-foreground")}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto p-2">
        <div className="grid grid-cols-5 gap-1">
          {Object.keys(TOMATO_ICON_MAP).map((key) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onChange(key as TomatoIconKey)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                value === key && "bg-primary/10 text-primary",
              )}
            >
              <TomatoIcon icon={key as TomatoIconKey} className="size-4" />
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
