import { SyncDoc, SyncHandler } from "@tomato/sync";
import { TemplateNameChangedEvent } from "../events";

const READY_KEY = "ready";

/** Owns the `name` text and the `meta` "is this doc seeded" flag. */
@SyncHandler()
export class TemplateHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get name() {
    return this.syncDoc.doc.getText("name");
  }

  private get meta() {
    return this.syncDoc.doc.getMap<number>("meta");
  }

  setName(name: string): void {
    const yName = this.name;
    yName.delete(0, yName.length);
    yName.insert(0, name);
    this.syncDoc.emit(new TemplateNameChangedEvent(name));
  }

  /** True once `TemplateInitHandler` has seeded this doc's default system widgets. */
  isReady(): boolean {
    return typeof this.meta.get(READY_KEY) === "number";
  }

  markReady(): void {
    this.meta.set(READY_KEY, Date.now());
  }
}
