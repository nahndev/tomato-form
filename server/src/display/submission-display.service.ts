import { Submission } from "@/database/prisma-client";
import type { TemplateSnapshot } from "@/template/template.types";
import {
  MappingContext,
  MappingSource,
  WidgetValueFactory,
} from "@/widget-value";
import { Injectable } from "@nestjs/common";
import { SubmissionDisplayDoc } from "./display.types";

@Injectable()
export class SubmissionDisplayService {
  /** Maps a submission's current values to a `SubmissionDisplayDoc` for rendering, iterating the snapshot's widgets (not the submission's data) so every widget gets an entry - backfilled with its value contract's default when the submission has no value. A widget type with no registered `WidgetValueInterface` falls back to `UnSupportWidgetValue` (string coercion). */
  buildDisplayDoc(
    submission: Submission,
    snapshot: TemplateSnapshot,
  ): SubmissionDisplayDoc {
    const data = submission.data as MappingSource["data"];
    const meta = { createdAt: submission.createdAt } as MappingSource["meta"];

    const context = new MappingContext({ data, meta });
    const widgets = snapshot.widgets ?? {};

    for (const widget of Object.values(widgets)) {
      const widgetValue = WidgetValueFactory.getValue(widget.type);
      widgetValue.map(context, widget);
    }

    return context.getDoc();
  }
}
