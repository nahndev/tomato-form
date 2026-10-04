import { ValueType } from "@/features/board/constants/column/valueTypes";
import { groupWidgetOptions } from "@/features/board/utils/widgetOptionGroups";
import { DisplayType } from "@/types/display-type";
import type { Template, Widget } from "@/types/template";
import { WidgetType } from "@/types/widget";

function getMockWidget(overrides: Partial<Widget> = {}): Widget {
  return { id: "w1", type: WidgetType.TEXT, label: "Name", ...overrides } as Widget;
}

function getMockTemplate(
  widgets: Widget[],
  widgetToSession: Record<string, string> = {},
  sessions: Record<string, { id: string; name: string }> = {},
): Template {
  return {
    id: "t1",
    name: "Template",
    snapshot: {
      widgets: Object.fromEntries(widgets.map((widget) => [widget.id, widget])),
      layouts: {},
      widgetToSession,
      sessions,
    },
  };
}

describe("groupWidgetOptions", () => {
  it("keeps a single-value-type widget as an entry without variants", () => {
    const widget = getMockWidget();

    const [group] = groupWidgetOptions([widget], getMockTemplate([widget]).snapshot, null);

    expect(group.entries).toHaveLength(1);
    expect(group.entries[0].primary).toEqual({
      itemKey: "w1:default",
      widget,
      valueType: ValueType.DEFAULT,
    });
    expect(group.entries[0].variants).toEqual([]);
  });

  it("folds the extra value types of one widget under its first one", () => {
    const widget = getMockWidget({ id: "w2", type: WidgetType.DATETIME, label: "Meeting" });

    const [group] = groupWidgetOptions([widget], getMockTemplate([widget]).snapshot, null);

    expect(group.entries).toHaveLength(1);
    expect(group.entries[0].primary.valueType).toBe(ValueType.DEFAULT);
    expect(group.entries[0].variants.map((option) => option.itemKey)).toEqual([
      "w2:date",
      "w2:time",
    ]);
  });

  it("drops value types that do not fit the allowed display types", () => {
    const widget = getMockWidget({ id: "w2", type: WidgetType.DATETIME });

    const [group] = groupWidgetOptions(
      [widget],
      getMockTemplate([widget]).snapshot,
      [DisplayType.DATE],
    );

    expect(group.entries[0].variants.map((option) => option.valueType)).toEqual([
      ValueType.DATE,
    ]);
  });

  it("buckets widgets by session and leaves unplaced widgets ungrouped", () => {
    const placed = getMockWidget({ id: "a" });
    const loose = getMockWidget({ id: "b" });
    const template = getMockTemplate(
      [placed, loose],
      { a: "s1" },
      { s1: { id: "s1", name: "Personal" } },
    );

    const groups = groupWidgetOptions([placed, loose], template.snapshot, null);

    expect(groups.map((group) => group.sessionName)).toEqual(["Personal", null]);
    expect(groups[0].entries[0].primary.widget.id).toBe("a");
    expect(groups[1].entries[0].primary.widget.id).toBe("b");
  });

  it("skips widgets with no usable value type", () => {
    const widget = getMockWidget({ id: "w3", type: WidgetType.BUTTON });

    expect(groupWidgetOptions([widget], getMockTemplate([widget]).snapshot, null)).toEqual([]);
  });
});
