import AccountSetting from "./AccountSetting";
import GeneralSetting from "./GeneralSetting";
import InformationSetting from "./InformationSetting";
import SecuritySetting from "./SecuritySetting";

/**
 * The React component that renders each setting tab's content - the
 * rendering half of the split. See `SettingTabItems` in
 * `constants/settingTabs.ts` for the data half (value, label, icon).
 */
export const SettingTabComponents: Record<string, React.ComponentType> = {
  general: GeneralSetting,
  account: AccountSetting,
  security: SecuritySetting,
  language: InformationSetting,
  information: InformationSetting,
};
