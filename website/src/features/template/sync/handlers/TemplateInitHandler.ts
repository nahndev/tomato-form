import { WidgetItems } from "@/features/template/constants/widget/widgetItems";
import type { Widget } from "@/types/template";
import { WidgetType } from "@/types/widget";
import { SyncDoc, SyncHandler, type OnSynced } from "@tomato/sync";
import { v4 } from "uuid";
import { TemplateHandler } from "./TemplateHandler";

const DEFAULT_SYSTEM_WIDGET_TYPES: WidgetType[] = [
  WidgetType.CREATED_AT,
  WidgetType.TEMPLATE,
  WidgetType.SUBMITTED_BY,
];

/**
 * Seeds system widgets directly on the `widgets` map, bypassing
 * `WidgetHandler.addWidget` on purpose - going through it would emit
 * `WidgetAddedEvent` and make `LayoutHandler` place these in `layouts`, which
 * system widgets have never had.
 *
 * Registered up front with every other Handler in `createSyncDoc`, but its
 * `onSynced` only actually runs when `TemplateDocProvider` calls
 * `syncDoc.synced()` - after Hocuspocus reports "synced". Seeding can't run
 * at registration time because it must wait for the doc to merge with the
 * server first; `isReady()` makes a second `synced()` call (e.g. after a
 * reconnect) a no-op. `onSynced` running outside any transaction is also why
 * this is the one Handler allowed to open its own `transact`.
 */
@SyncHandler()
export class TemplateInitHandler implements OnSynced {
  constructor(private readonly syncDoc: SyncDoc) {}

  onSynced(): void {
    const templateHandler = this.syncDoc.getHandler(TemplateHandler);
    if (templateHandler.isReady()) return;

    const yWidgets = this.syncDoc.doc.getMap<Widget>("widgets");

    this.syncDoc.doc.transact(() => {
      for (const type of DEFAULT_SYSTEM_WIDGET_TYPES) {
        const def = WidgetItems[type];

        const id = v4();
        yWidgets.set(id, { id, type, ...def.defaultSettings });
      }
      templateHandler.markReady();
    });
  }
}
