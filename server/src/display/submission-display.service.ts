import { Submission } from "@/database/prisma-client";
import type { TemplateSnapshot } from "@/template/template.types";
import { UserService } from "@/user/user.service";
import {
  MappingContext,
  MappingSource,
  USER_REFERENCE_WIDGET_TYPES,
  WidgetValueFactory,
} from "@/widget-value";
import { Injectable } from "@nestjs/common";
import { SubmissionDisplayDoc } from "./display.types";

@Injectable()
export class SubmissionDisplayService {
  constructor(private readonly userService: UserService) {}

  /** Maps a submission's current values to a `SubmissionDisplayDoc` for rendering, iterating the snapshot's widgets (not the submission's data) so every widget gets an entry - backfilled with its value contract's default when the submission has no value. A widget type with no registered `WidgetValueInterface` falls back to `UnSupportWidgetValue` (string coercion). Users are only loaded when the snapshot has a widget that references them. */
  async buildDisplayDoc(
    submission: Submission,
    snapshot: TemplateSnapshot,
  ): Promise<SubmissionDisplayDoc> {
    const data = submission.data as MappingSource["data"];
    const meta = { createdAt: submission.createdAt } as MappingSource["meta"];
    const widgets = Object.values(snapshot.widgets ?? {});

    const users = widgets.some((widget) =>
      USER_REFERENCE_WIDGET_TYPES.includes(widget.type),
    )
      ? await this.loadUserNames()
      : undefined;

    const context = new MappingContext({ data, meta, users });

    for (const widget of widgets) {
      const widgetValue = WidgetValueFactory.getValue(widget.type);
      widgetValue.map(context, widget);
    }

    return context.getDoc();
  }

  private async loadUserNames(): Promise<Map<string, string>> {
    const users = await this.userService.findAll();
    return new Map(users.map((user) => [user.uuid, user.name]));
  }
}
