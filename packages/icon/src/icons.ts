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

/** Every icon the system supports, keyed by the stable name persisted on entities. */
export const TOMATO_ICON_MAP = {
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
} satisfies Record<string, LucideIcon>;

export type TomatoIconKey = keyof typeof TOMATO_ICON_MAP;

export const DEFAULT_TOMATO_ICON_KEY: TomatoIconKey = "clock";
