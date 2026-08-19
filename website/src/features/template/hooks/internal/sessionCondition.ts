import { SessionConditionType, type SessionCondition } from "@/types/template";

/** Whether a widget's value counts as "set" for `WIDGET_HAS_VALUE`. */
function hasValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Evaluates a session's visibility condition against live submission `data`. */
export function evaluateSessionCondition(
  condition: SessionCondition | undefined,
  data: Record<string, unknown>,
): boolean {
  if (!condition || condition.type === SessionConditionType.ALWAYS) return true;
  if (condition.type === SessionConditionType.BUTTON_CLICKED) {
    return Boolean(data[condition.widgetId]);
  }
  return hasValue(data[condition.widgetId]);
}
