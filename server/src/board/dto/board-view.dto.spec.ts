import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BoardViewDto } from "./board-view.dto";

async function validateView(payload: unknown) {
  const instance = plainToInstance(BoardViewDto, payload);
  return validate(instance);
}

describe("BoardViewDto", () => {
  const validChartPayload = {
    id: "view-1",
    name: "Submissions by status",
    type: "chart",
    config: {
      groupBy: { "template-1": "widget-1:default" },
      aggregation: "count",
      chartKind: "bar",
    },
  };

  it("accepts a fully valid chart view with count aggregation", async () => {
    const errors = await validateView(validChartPayload);
    expect(errors).toHaveLength(0);
  });

  it("accepts a fully valid chart view with sum aggregation and a value field", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: {
        ...validChartPayload.config,
        aggregation: "sum",
        valueField: { "template-1": "widget-2:default" },
      },
    });
    expect(errors).toHaveLength(0);
  });

  it("accepts a fully valid chart view with avg aggregation and a value field", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: {
        ...validChartPayload.config,
        aggregation: "avg",
        valueField: { "template-1": "widget-2:default" },
      },
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects a view missing a name", async () => {
    const errors = await validateView({ ...validChartPayload, name: undefined });
    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("rejects a view missing a type", async () => {
    const errors = await validateView({ ...validChartPayload, type: undefined });
    expect(errors.some((e) => e.property === "type")).toBe(true);
  });

  it("rejects a view with an unknown type", async () => {
    const errors = await validateView({ ...validChartPayload, type: "map" });
    expect(errors.some((e) => e.property === "type")).toBe(true);
  });

  it("rejects a chart view with an unknown aggregation", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: { ...validChartPayload.config, aggregation: "median" },
    });
    expect(errors.some((e) => e.property === "config")).toBe(true);
  });

  it("rejects a chart view with an unknown chart kind", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: { ...validChartPayload.config, chartKind: "scatter" },
    });
    expect(errors.some((e) => e.property === "config")).toBe(true);
  });

  it("rejects a chart view with sum aggregation and no value field", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: { ...validChartPayload.config, aggregation: "sum" },
    });
    expect(errors.some((e) => e.property === "config")).toBe(true);
  });

  it("rejects a chart view with avg aggregation and no value field", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: { ...validChartPayload.config, aggregation: "avg" },
    });
    expect(errors.some((e) => e.property === "config")).toBe(true);
  });

  it("rejects a chart view whose groupBy is not a valid item map", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: { ...validChartPayload.config, groupBy: { "template-1": 123 } },
    });
    expect(errors.some((e) => e.property === "config")).toBe(true);
  });

  it("rejects a chart view with an empty groupBy", async () => {
    const errors = await validateView({
      ...validChartPayload,
      config: { ...validChartPayload.config, groupBy: {} },
    });
    expect(errors.some((e) => e.property === "config")).toBe(true);
  });
});
