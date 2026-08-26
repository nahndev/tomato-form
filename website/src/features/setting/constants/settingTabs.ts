import { TomatoIconKey } from "@tomato/icon";

export const SETTING_HASH = "#setting";

/**
 * Pure data describing every setting tab - value, label, and icon. Carries
 * no React component; see `SettingTabComponents` in
 * `components/content/registry.ts` for the rendering half.
 */
export interface SettingTabItem {
  value: string;
  label: string;
  icon: TomatoIconKey;
}

export const SettingTabItems: SettingTabItem[] = [
  {
    value: "general",
    label: "General",
    icon: TomatoIconKey.SlidersHorizontal,
  },
  {
    value: "account",
    label: "Account",
    icon: TomatoIconKey.UserRound,
  },
  {
    value: "security",
    label: "Security",
    icon: TomatoIconKey.ShieldCheck,
  },
  {
    value: "language",
    label: "Language",
    icon: TomatoIconKey.Languages,
  },
  {
    value: "information",
    label: "Information",
    icon: TomatoIconKey.Info,
  },
];

export const DEFAULT_SETTING_TAB = SettingTabItems[0].value;
