import type { Widget } from "@/template/template.types";
import { SubmissionSearchDoc } from "./submission-search.types";
import { WidgetMapperFactory } from "./widget-mapper";

/** Input for `buildSubmissionSearchDoc` - a submission's flat `data` (widget id -> value) plus the `widgets` map from its template snapshot, needed to look up each value's widget type. */
export interface SubmissionSearchDocContext {
  submissionId: string;
  data: Record<string, unknown>;
  widgets: Record<string, Widget>;
}

/** Converts a submission's flat `data` into the shape MeiliSearch indexes, delegating each value to the `WidgetMapperFactory`-resolved mapper for its widget type. */
export function buildSubmissionSearchDoc(context: SubmissionSearchDocContext): SubmissionSearchDoc {
  const { submissionId, data, widgets } = context;
  let doc: SubmissionSearchDoc = { id: submissionId, tags: [], date: [], text: [] };

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    const widgetType = widgets[key]?.type;
    if (!widgetType) continue;

    const mapper = WidgetMapperFactory.getMapper(widgetType);
    if (!mapper) continue;

    doc = mapper.map(doc, key, value);
  }

  return doc;
}
