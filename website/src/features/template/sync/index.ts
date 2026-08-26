import { SyncDoc } from "@tomato/sync";
import { LayoutHandler } from "./handlers/LayoutHandler";
import { SessionHandler } from "./handlers/SessionHandler";
import { TemplateHandler } from "./handlers/TemplateHandler";
import { TemplateInitHandler } from "./handlers/TemplateInitHandler";
import { WidgetHandler } from "./handlers/WidgetHandler";

export { LayoutHandler } from "./handlers/LayoutHandler";
export { SessionHandler } from "./handlers/SessionHandler";
export { TemplateHandler } from "./handlers/TemplateHandler";
export { TemplateInitHandler } from "./handlers/TemplateInitHandler";
export { WidgetHandler } from "./handlers/WidgetHandler";
export * from "./events";

/** Constructs a `SyncDoc` with every Handler the template feature needs already registered. */
export function createSyncDoc(): SyncDoc {
  const syncDoc = new SyncDoc();
  syncDoc.registerHandler(new SessionHandler(syncDoc));
  syncDoc.registerHandler(new WidgetHandler(syncDoc));
  syncDoc.registerHandler(new LayoutHandler(syncDoc));
  syncDoc.registerHandler(new TemplateHandler(syncDoc));
  syncDoc.registerHandler(new TemplateInitHandler(syncDoc));
  return syncDoc;
}
