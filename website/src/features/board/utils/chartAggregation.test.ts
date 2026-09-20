import { getMockBoardChartViewConfig, getMockSubmission } from "@/features/board/testing/board.factory";
import { ChartAggregation } from "@/types/board-view";
import { aggregateSubmissionsForChart } from "./chartAggregation";

const GROUP_BY = { "template-1": "widget-1:default" };
const VALUE_FIELD = { "template-1": "widget-2:default" };

function submissionWithLabel(label: string, extra?: Record<string, Record<string, unknown>>) {
  return getMockSubmission({
    templateId: "template-1",
    dataDisplays: { "widget-1": { default: { text: label } }, ...extra },
  });
}

describe("aggregateSubmissionsForChart", () => {
  it("counts submissions per group-by label", () => {
    const config = getMockBoardChartViewConfig({
      groupBy: GROUP_BY,
      aggregation: ChartAggregation.COUNT,
    });
    const submissions = [
      submissionWithLabel("Open"),
      submissionWithLabel("Open"),
      submissionWithLabel("Closed"),
    ];

    expect(aggregateSubmissionsForChart(submissions, config)).toEqual([
      { label: "Open", value: 2 },
      { label: "Closed", value: 1 },
    ]);
  });

  it("sums a numeric value field per group-by label", () => {
    const config = getMockBoardChartViewConfig({
      groupBy: GROUP_BY,
      aggregation: ChartAggregation.SUM,
      valueField: VALUE_FIELD,
    });
    const submissions = [
      submissionWithLabel("Open", { "widget-2": { default: { text: "10" } } }),
      submissionWithLabel("Open", { "widget-2": { default: { text: "5" } } }),
      submissionWithLabel("Closed", { "widget-2": { default: { text: "3" } } }),
    ];

    expect(aggregateSubmissionsForChart(submissions, config)).toEqual([
      { label: "Open", value: 15 },
      { label: "Closed", value: 3 },
    ]);
  });

  it("averages a numeric value field per group-by label", () => {
    const config = getMockBoardChartViewConfig({
      groupBy: GROUP_BY,
      aggregation: ChartAggregation.AVG,
      valueField: VALUE_FIELD,
    });
    const submissions = [
      submissionWithLabel("Open", { "widget-2": { default: { text: "10" } } }),
      submissionWithLabel("Open", { "widget-2": { default: { text: "20" } } }),
      submissionWithLabel("Closed", { "widget-2": { default: { text: "6" } } }),
    ];

    expect(aggregateSubmissionsForChart(submissions, config)).toEqual([
      { label: "Open", value: 15 },
      { label: "Closed", value: 6 },
    ]);
  });

  it("buckets submissions with no group-by value under \"(empty)\"", () => {
    const config = getMockBoardChartViewConfig({
      groupBy: GROUP_BY,
      aggregation: ChartAggregation.COUNT,
    });
    const submissions = [
      submissionWithLabel("Open"),
      getMockSubmission({ templateId: "template-1", dataDisplays: {} }),
    ];

    expect(aggregateSubmissionsForChart(submissions, config)).toEqual([
      { label: "Open", value: 1 },
      { label: "(empty)", value: 1 },
    ]);
  });

  it("excludes submissions with no numeric value from sum/avg", () => {
    const config = getMockBoardChartViewConfig({
      groupBy: GROUP_BY,
      aggregation: ChartAggregation.SUM,
      valueField: VALUE_FIELD,
    });
    const submissions = [
      submissionWithLabel("Open", { "widget-2": { default: { text: "10" } } }),
      submissionWithLabel("Open", {}),
    ];

    expect(aggregateSubmissionsForChart(submissions, config)).toEqual([
      { label: "Open", value: 10 },
    ]);
  });

  it("resolves the group-by field per the submission's own template", () => {
    const config = getMockBoardChartViewConfig({
      groupBy: { "template-1": "widget-1:default", "template-2": "widget-9:default" },
      aggregation: ChartAggregation.COUNT,
    });
    const submissions = [
      submissionWithLabel("Open"),
      getMockSubmission({
        templateId: "template-2",
        dataDisplays: { "widget-9": { default: { text: "Open" } } },
      }),
    ];

    expect(aggregateSubmissionsForChart(submissions, config)).toEqual([
      { label: "Open", value: 2 },
    ]);
  });

  it("returns an empty array for no submissions", () => {
    const config = getMockBoardChartViewConfig();

    expect(aggregateSubmissionsForChart([], config)).toEqual([]);
  });
});
