import {
  Info,
  LanguagesIcon,
  LucideIcon,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import AccountSetting from "./components/content/AccountSetting";
import GeneralSetting from "./components/content/GeneralSetting";
import InformationSetting from "./components/content/InformationSetting";
import SecuritySetting from "./components/content/SecuritySetting";

export interface SettingTab {
  value: string;
  label: string;
  icon: LucideIcon;
  content: React.ComponentType;
}

export const SETTING_TABS: SettingTab[] = [
  {
    value: "general",
    label: "General",
    icon: SlidersHorizontal,
    content: GeneralSetting,
  },
  {
    value: "account",
    label: "Account",
    icon: UserRound,
    content: AccountSetting,
  },
  {
    value: "security",
    label: "Security",
    icon: ShieldCheck,
    content: SecuritySetting,
  },
  {
    value: "language",
    label: "Language",
    icon: LanguagesIcon,
    content: InformationSetting,
  },
  {
    value: "information",
    label: "Information",
    icon: Info,
    content: InformationSetting,
  },
];

export const DEFAULT_SETTING_TAB = SETTING_TABS[0].value;
