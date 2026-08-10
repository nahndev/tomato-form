"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Curated set of colors a user can pick without opening the custom picker. */
export const COLOR_PRESETS: string[] = [
  "#ffffff",
  "#f8fafc",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#64748b",
  "#0f172a",
];

const DEFAULT_COLOR = "#ffffff";

export interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

/** Trigger button showing the selected color; opens a swatch grid plus a custom picker. */
export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const color = value || DEFAULT_COLOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "size-9 rounded-md border border-input shadow-sm",
            className,
          )}
          style={{ backgroundColor: color }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto gap-2">
        <div className="grid grid-cols-6 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                "size-6 rounded-md border border-input transition-transform hover:scale-110",
                color.toLowerCase() === preset &&
                  "ring-2 ring-primary ring-offset-1",
              )}
              style={{ backgroundColor: preset }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="size-9 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
          />
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-full"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
