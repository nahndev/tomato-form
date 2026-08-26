import { DisplayType } from "@/types/display-type";

export const MOCK_VALUE: Record<DisplayType, string> = {
  [DisplayType.TEXT]: "Sample text",
  [DisplayType.DATE]: new Date().toLocaleDateString(),
  [DisplayType.NUMBER]: "123",
};
