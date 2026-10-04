import { SyncDoc } from "@tomato/sync";
import { WidgetType } from "@/types/widget";
import { LayoutUpdatedEvent } from "../events";
import { LayoutHandler } from "./LayoutHandler";
import { SessionHandler } from "./SessionHandler";
import { WidgetHandler } from "./WidgetHandler";

function createHandlers() {
  const syncDoc = new SyncDoc();
  const sessionHandler = syncDoc.registerHandler(new SessionHandler(syncDoc));
  const widgetHandler = syncDoc.registerHandler(new WidgetHandler(syncDoc));
  const layoutHandler = syncDoc.registerHandler(new LayoutHandler(syncDoc));
  sessionHandler.addSession("s1", { name: "Section 1" });
  sessionHandler.addSession("s2", { name: "Section 2" });
  return { syncDoc, widgetHandler, layoutHandler };
}

/** w1, w2, w3 in order, all in the default session (the first one added). */
function createThreeWidgets() {
  const handlers = createHandlers();
  handlers.widgetHandler.addWidget("w1", WidgetType.TEXT, null);
  handlers.widgetHandler.addWidget("w2", WidgetType.TEXT, handlers.widgetHandler.getWidget("w1")!);
  handlers.widgetHandler.addWidget("w3", WidgetType.TEXT, handlers.widgetHandler.getWidget("w2")!);
  return handlers;
}

function orderedIds(layoutHandler: LayoutHandler, ids: string[]): string[] {
  return [...ids].sort((a, b) =>
    layoutHandler.getLayout(a)!.idx > layoutHandler.getLayout(b)!.idx ? 1 : -1,
  );
}

describe("LayoutHandler.placeWidget", () => {
  it("changes only the given grid fields and keeps the order and session", () => {
    const { layoutHandler } = createThreeWidgets();
    const before = layoutHandler.getLayout("w2")!;

    layoutHandler.placeWidget("w2", { layout: { column: 3, span: 4 } });

    expect(layoutHandler.getLayout("w2")).toEqual({
      ...before,
      column: 3,
      span: 4,
    });
    expect(layoutHandler.getSessionId("w2")).toBe(layoutHandler.getSessionId("w1"));
  });

  it("puts the widget right after the given widget", () => {
    const { layoutHandler } = createThreeWidgets();

    layoutHandler.placeWidget("w1", { position: { after: "w2" } });

    expect(orderedIds(layoutHandler, ["w1", "w2", "w3"])).toEqual(["w2", "w1", "w3"]);
  });

  it("puts the widget at the end", () => {
    const { layoutHandler } = createThreeWidgets();

    layoutHandler.placeWidget("w1", { position: "last" });

    expect(orderedIds(layoutHandler, ["w1", "w2", "w3"])).toEqual(["w2", "w3", "w1"]);
  });

  it("puts the widget at the start", () => {
    const { layoutHandler } = createThreeWidgets();

    layoutHandler.placeWidget("w3", { position: "first" });

    expect(orderedIds(layoutHandler, ["w1", "w2", "w3"])).toEqual(["w3", "w1", "w2"]);
  });

  it("moves the widget to another session", () => {
    const { layoutHandler } = createThreeWidgets();

    layoutHandler.placeWidget("w2", { sessionId: "s2" });

    expect(layoutHandler.getSessionId("w2")).toBe("s2");
  });

  it("emits a layout update for the session the widget ends up in", () => {
    const { syncDoc, layoutHandler } = createThreeWidgets();
    const listener = jest.fn();
    syncDoc.on(LayoutUpdatedEvent, listener);

    layoutHandler.placeWidget("w2", { sessionId: "s2" });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ widgetId: "w2", sessionId: "s2" }),
    );
  });

  it("does nothing for a widget that has no layout", () => {
    const { layoutHandler } = createHandlers();

    layoutHandler.placeWidget("missing", { layout: { column: 1 } });

    expect(layoutHandler.getLayout("missing")).toBeUndefined();
  });
});
