import { Submission } from "@/database/prisma-client";
import type { TemplateSnapshot } from "@/template/template.types";
import {
  MappingContext,
  MappingSource,
  WidgetValueFactory,
} from "@/widget-value";
import { Injectable } from "@nestjs/common";
import { SubmissionDisplayDoc } from "./display.types";
import { MappingContextLoader } from "./mapping-context.loader";

@Injectable()
export class SubmissionDisplayService {
  constructor(
    private readonly contextLoader: MappingContextLoader,
    private readonly widgetValueFactory: WidgetValueFactory,
  ) {}

  /** Maps a submission's current values to a `SubmissionDisplayDoc` for rendering, iterating the snapshot's widgets (not the submission's data) so every widget gets an entry - backfilled with its value contract's default when the submission has no value. A widget type with no registered `WidgetValueInterface` falls back to `UnSupportWidgetValue` (string coercion). Users are only loaded when the snapshot has a widget that references them. */
  async buildDisplayDoc(
    submission: Submission,
    snapshot: TemplateSnapshot,
  ): Promise<SubmissionDisplayDoc> {
    const data = submission.data as MappingSource["data"];
    const meta = { createdAt: submission.createdAt } as MappingSource["meta"];
    const widgets = Object.values(snapshot.widgets ?? {});

    const context = new MappingContext({ data, meta, widgets });
    await this.contextLoader.load(context);

    for (const widget of context.getWidgets()) {
      const widgetValue = this.widgetValueFactory.getValue(widget.type);
      widgetValue.map(context, widget);
    }

    return context.getDoc();
  }
}
