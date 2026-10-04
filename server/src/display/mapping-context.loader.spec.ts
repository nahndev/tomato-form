import type { Widget } from "@/template/template.types";
import type { UserService } from "@/user/user.service";
import { MappingContext } from "@/widget-value";
import { MappingContextLoader } from "./mapping-context.loader";

function getMockContext(widgets: Widget[] = []): MappingContext {
  return new MappingContext({
    data: {},
    meta: { createdAt: new Date(1700000000000) },
    widgets,
  });
}

function getMockWidget(type: string): Widget {
  return { id: `w-${type}`, type, label: "Field" };
}

describe("MappingContextLoader", () => {
  const findAll = jest.fn();
  const loader = new MappingContextLoader({ findAll } as unknown as UserService);

  beforeEach(() => {
    findAll.mockReset();
  });

  it("starts with no users on a context built without them", () => {
    expect(getMockContext().getUsers().size).toBe(0);
  });

  it("exposes the widgets it was built with", () => {
    const widgets = [getMockWidget("text")];

    expect(getMockContext(widgets).getWidgets()).toBe(widgets);
  });

  it.each(["users", "submitted-by"])(
    "loads the users into the context as a uuid -> name map when a '%s' widget is present",
    async (widgetType) => {
      findAll.mockResolvedValue([
        { uuid: "u1", name: "Alice" },
        { uuid: "u2", name: "Bob" },
      ]);
      const context = getMockContext([getMockWidget("text"), getMockWidget(widgetType)]);

      await loader.load(context);

      expect(context.getUsers().get("u1")).toBe("Alice");
      expect(context.getUsers().get("u2")).toBe("Bob");
    },
  );

  it("skips the user lookup when no widget references users", async () => {
    const context = getMockContext([getMockWidget("text"), getMockWidget("select")]);

    await loader.load(context);

    expect(findAll).not.toHaveBeenCalled();
    expect(context.getUsers().size).toBe(0);
  });

  it("propagates a user lookup failure instead of leaving the context half-loaded", async () => {
    findAll.mockRejectedValue(new Error("db down"));
    const context = getMockContext([getMockWidget("users")]);

    await expect(loader.load(context)).rejects.toThrow("db down");
    expect(context.getUsers().size).toBe(0);
  });
});
