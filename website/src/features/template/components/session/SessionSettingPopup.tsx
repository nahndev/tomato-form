"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useSessionId } from "@/features/template/components/session/SessionProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { useSessionActions } from "@/features/template/hooks/actions/useSessionActions";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import {
  SessionConditionType,
  type SessionCondition,
} from "@/types/template";
import { WidgetType } from "@/types/widget";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useState } from "react";

const CONDITION_LABELS: Record<SessionConditionType, string> = {
  [SessionConditionType.ALWAYS]: "Always",
  [SessionConditionType.BUTTON_CLICKED]: "When a button is clicked",
  [SessionConditionType.WIDGET_HAS_VALUE]: "When a widget has a value",
};

function defaultConditionFor(
  type: SessionConditionType,
  fallbackWidgetId: string | undefined,
): SessionCondition {
  if (type === SessionConditionType.ALWAYS) return { type };
  return { type, widgetId: fallbackWidgetId ?? "" };
}

/** Settings popup for a session - currently just its visibility condition. */
const SessionSettingPopup: React.FC = () => {
  const sessionId = useSessionId();
  const { session } = useSessionState();
  const { updateSession } = useSessionActions();
  const { widgets, sessions, widgetToSession } = useTemplateState();
  const [open, setOpen] = useState(false);

  const condition: SessionCondition =
    session?.condition ?? { type: SessionConditionType.ALWAYS };

  // Widgets eligible as the condition's target: right kind for the current
  // condition type, and not one of this session's own widgets (a session
  // can't gate its own visibility on its own, not-yet-shown contents).
  const widgetOptions = Object.values(widgets).filter((widget) => {
    if (widgetToSession[widget.id] === sessionId) return false;
    if (condition.type === SessionConditionType.BUTTON_CLICKED) {
      return widget.type === WidgetType.BUTTON;
    }
    if (condition.type === SessionConditionType.WIDGET_HAS_VALUE) {
      return WIDGET_REGISTRY[widget.type].isDataField;
    }
    return false;
  });

  function widgetOptionLabel(widgetId: string): string {
    const label = widgets[widgetId]?.label || "(no label)";
    const owningSessionId = widgetToSession[widgetId];
    const sessionName = owningSessionId
      ? (sessions[owningSessionId]?.name ?? "")
      : "";
    return sessionName ? `${sessionName} · ${label}` : label;
  }

  function updateConditionType(type: SessionConditionType) {
    updateSession(sessionId, {
      condition: defaultConditionFor(type, widgetOptions[0]?.id),
    });
  }

  function updateConditionWidget(widgetId: string) {
    if (condition.type === SessionConditionType.ALWAYS) return;
    updateSession(sessionId, { condition: { ...condition, widgetId } });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label="Session settings">
          <TomatoIcon icon={TomatoIconKey.Settings2} className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Show this session</Label>
            <Select
              value={condition.type}
              onChange={(e) =>
                updateConditionType(e.target.value as SessionConditionType)
              }
            >
              {Object.values(SessionConditionType).map((type) => (
                <option key={type} value={type}>
                  {CONDITION_LABELS[type]}
                </option>
              ))}
            </Select>
          </div>

          {condition.type !== SessionConditionType.ALWAYS && (
            <div className="flex flex-col gap-1.5">
              <Label>
                {condition.type === SessionConditionType.BUTTON_CLICKED
                  ? "Button"
                  : "Widget"}
              </Label>
              <Select
                value={condition.widgetId}
                onChange={(e) => updateConditionWidget(e.target.value)}
              >
                <option value="">Select…</option>
                {widgetOptions.map((widget) => (
                  <option key={widget.id} value={widget.id}>
                    {widgetOptionLabel(widget.id)}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionSettingPopup;
