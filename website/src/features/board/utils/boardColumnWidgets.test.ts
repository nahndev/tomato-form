import { WidgetType } from "@/types/widget";
import {
  getMockTemplateVersionSnapshot,
  getMockWidget,
} from "@/features/template/testing/template.factory";
import { getDataFieldWidgets, getWidgetOptionLabel } from "./boardColumnWidgets";

describe("getDataFieldWidgets", () => {
  it("excludes widgets with no selectable display type", () => {
    const textWidget = getMockWidget({ type: WidgetType.TEXT });
    const buttonWidget = getMockWidget({ type: WidgetType.BUTTON });
    const snapshot = getMockTemplateVersionSnapshot({
      widgets: {
        [textWidget.id]: textWidget,
        [buttonWidget.id]: buttonWidget,
      },
    });

    expect(getDataFieldWidgets(snapshot)).toEqual([textWidget]);
  });
});

describe("getWidgetOptionLabel", () => {
  it("returns bare widget label when there is no session", () => {
    const widget = getMockWidget({ label: "Full Name" });
    const snapshot = getMockTemplateVersionSnapshot({
      widgets: { [widget.id]: widget },
    });

    expect(getWidgetOptionLabel(snapshot, widget.id)).toBe("Full Name");
  });

  it("prefixes the session name when the widget belongs to one", () => {
    const widget = getMockWidget({ label: "Full Name" });
    const sessionId = "session-1";
    const snapshot = getMockTemplateVersionSnapshot({
      widgets: { [widget.id]: widget },
      widgetToSession: { [widget.id]: sessionId },
      sessions: { [sessionId]: { id: sessionId, name: "Personal Info" } },
    });

    expect(getWidgetOptionLabel(snapshot, widget.id)).toBe(
      "Personal Info/Full Name",
    );
  });

  it("returns a fallback label for an unknown widget id", () => {
    const snapshot = getMockTemplateVersionSnapshot();
    expect(getWidgetOptionLabel(snapshot, "missing")).toBe("Unknown widget");
  });
});
