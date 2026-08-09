"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Calendar,
  ClipboardCheck,
  Clock,
  Code,
  Coffee,
  FileText,
  Flag,
  GraduationCap,
  Handshake,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Mic,
  Phone,
  Presentation,
  Star,
  Users,
  Video,
} from "lucide-react";

/** Curated set of icons a user can assign to an entity (e.g. a session). */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  building: Building2,
  calendar: Calendar,
  "clipboard-check": ClipboardCheck,
  clock: Clock,
  code: Code,
  coffee: Coffee,
  document: FileText,
  flag: Flag,
  "graduation-cap": GraduationCap,
  handshake: Handshake,
  "map-pin": MapPin,
  message: MessageSquare,
  mic: Mic,
  phone: Phone,
  presentation: Presentation,
  star: Star,
  users: Users,
  video: Video,
};

const DEFAULT_ICON = Clock;

export interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  className?: string;
}

/** Trigger button showing the selected icon; opens a grid to pick another. */
export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const SelectedIcon = (value && ICON_REGISTRY[value]) || DEFAULT_ICON;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("rounded-md", className)}
        >
          <SelectedIcon
            className={cn("size-3.5", !value && "text-muted-foreground")}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto p-2">
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(ICON_REGISTRY).map(([key, Icon]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                value === key && "bg-primary/10 text-primary",
              )}
            >
              <Icon className="size-4" />
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
