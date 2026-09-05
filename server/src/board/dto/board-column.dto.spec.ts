import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BoardColumnDto } from "./board-column.dto";

async function validateColumn(payload: unknown) {
  const instance = plainToInstance(BoardColumnDto, payload);
  return validate(instance);
}

describe("BoardColumnDto", () => {
  const validPayload = {
    id: "col-1",
    type: "text",
    size: { width: 150 },
    items: [{ templateId: "template-1", widgetId: "widget-1" }],
  };

  it("accepts a fully valid column", async () => {
    const errors = await validateColumn(validPayload);
    expect(errors).toHaveLength(0);
  });

  it("rejects a column missing type", async () => {
    const errors = await validateColumn({ ...validPayload, type: undefined });
    expect(errors.some((e) => e.property === "type")).toBe(true);
  });

  it("rejects a column with an unknown type", async () => {
    const errors = await validateColumn({ ...validPayload, type: "boolean" });
    expect(errors.some((e) => e.property === "type")).toBe(true);
  });

  it("rejects a column whose size is not a width/flex object", async () => {
    const errors = await validateColumn({ ...validPayload, size: "150px" });
    expect(errors.some((e) => e.property === "size")).toBe(true);
  });

  it("rejects a column whose size sets both width and flex", async () => {
    const errors = await validateColumn({
      ...validPayload,
      size: { width: 150, flex: 2 },
    });
    expect(errors.some((e) => e.property === "size")).toBe(true);
  });

  it("rejects a column with a non-positive size", async () => {
    const errors = await validateColumn({ ...validPayload, size: { width: 0 } });
    expect(errors.some((e) => e.property === "size")).toBe(true);
  });

  it("accepts a column with a flex size", async () => {
    const errors = await validateColumn({ ...validPayload, size: { flex: 2 } });
    expect(errors).toHaveLength(0);
  });

  it("rejects a column whose item is missing a widgetId", async () => {
    const errors = await validateColumn({
      ...validPayload,
      items: [{ templateId: "template-1" }],
    });
    expect(errors.some((e) => e.property === "items")).toBe(true);
  });
});
