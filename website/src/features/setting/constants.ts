import { TomatoIconKey } from "@tomato/icon";
import AccountSetting from "./components/content/AccountSetting";
import GeneralSetting from "./components/content/GeneralSetting";
import InformationSetting from "./components/content/InformationSetting";
import SecuritySetting from "./components/content/SecuritySetting";

export interface SettingTab {
  value: string;
  label: string;
  icon: TomatoIconKey;
  content: React.ComponentType;
}

export const SETTING_TABS: SettingTab[] = [
  {
    value: "general",
    label: "General",
    icon: TomatoIconKey.SlidersHorizontal,
    content: GeneralSetting,
  },
  {
    value: "account",
    label: "Account",
    icon: TomatoIconKey.UserRound,
    content: AccountSetting,
  },
  {
    value: "security",
    label: "Security",
    icon: TomatoIconKey.ShieldCheck,
    content: SecuritySetting,
  },
  {
    value: "language",
    label: "Language",
    icon: TomatoIconKey.Languages,
    content: InformationSetting,
  },
  {
    value: "information",
    label: "Information",
    icon: TomatoIconKey.Info,
    content: InformationSetting,
  },
];

export const DEFAULT_SETTING_TAB = SETTING_TABS[0].value;
