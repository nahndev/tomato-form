import type { TemplateVersionSnapshot } from "@/template/template.types";
import { Injectable } from "@nestjs/common";
import { DisplayMapperFactory } from "./display-mapper.factory";
import { DisplayMapperSubmission, SubmissionDisplayDoc } from "./display-mapper.types";

@Injectable()
export class SubmissionDisplayService {
  /** Maps a submission's current values to a `SubmissionDisplayDoc` for rendering, iterating the snapshot's widgets (not the submission's data) so every displayable field gets an entry - backfilled with its display-type default when the submission has no value. */
  buildDisplayDoc(submission: DisplayMapperSubmission, snapshot: TemplateVersionSnapshot): SubmissionDisplayDoc {
    let doc: SubmissionDisplayDoc = {};
    const widgets = snapshot.widgets ?? {};

    for (const widget of Object.values(widgets)) {
      const mapper = DisplayMapperFactory.getMapper(widget);
      if (!mapper) continue;

      doc = mapper.map(doc, widget, { submission, snapshot });
    }

    return doc;
  }
}
