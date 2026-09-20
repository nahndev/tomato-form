import { ValueType } from "@/features/board/constants/column/valueTypes";
import {
  getMockBoardColumn,
  getMockSubmission,
} from "@/features/board/testing/board.factory";
import { JsonColumn } from "@/features/board/utils/column";
import { JsonSubmission } from "@/features/board/utils/submission";

describe("JsonSubmission.getDisplayValue", () => {
  it("returns undefined when the column has no item for the submission's template", () => {
    const column = getMockBoardColumn();
    const submission = getMockSubmission({ templateId: "template-1" });

    expect(JsonSubmission.getDisplayValue(submission, column)).toBeUndefined();
  });

  it("looks up dataDisplays by the widgetId:property compound key", () => {
    const column = JsonColumn.setItem(
      getMockBoardColumn(),
      "template-1",
      { widgetId: "widget-1", property: ValueType.DEFAULT },
    );
    const submission = getMockSubmission({
      templateId: "template-1",
      dataDisplays: { "widget-1": { default: { text: "hello" } } },
    });

    expect(JsonSubmission.getDisplayValue(submission, column)).toEqual({ text: "hello" });
  });

  it("distinguishes between properties of the same widget", () => {
    const column = JsonColumn.setItem(
      getMockBoardColumn(),
      "template-1",
      { widgetId: "widget-1", property: ValueType.TIME },
    );
    const submission = getMockSubmission({
      templateId: "template-1",
      dataDisplays: {
        "widget-1": {
          default: { date: 1700000000000 },
          date: { date: 1700000000000 },
          time: { date: 1700000000000 },
        },
      },
    });

    expect(JsonSubmission.getDisplayValue(submission, column)).toEqual({
      date: 1700000000000,
    });
  });
});
