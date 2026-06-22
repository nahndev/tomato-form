import { parseExpression } from "cron-parser";

export function isCronExpression(value: string): boolean {
  try {
    parseExpression(value);
    return true;
  } catch {
    return false;
  }
}
