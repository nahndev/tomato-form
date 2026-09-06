import type { Widget } from "@/template/template.types";
import { Injectable } from "@nestjs/common";
import { MeilisearchService } from "./meilisearch.service";
import { buildSubmissionSearchDoc } from "./submission-search-doc.mapper";

@Injectable()
export class SubmissionSearchService {
  constructor(private readonly meilisearch: MeilisearchService) {}

  /** Maps a submission's current values to a `SubmissionSearchDoc` and upserts it into MeiliSearch. */
  async indexSubmission(
    submissionId: string,
    data: Record<string, unknown>,
    widgets: Record<string, Widget>,
  ): Promise<void> {
    const doc = buildSubmissionSearchDoc({ submissionId, data, widgets });
    await this.meilisearch.indexSubmission(doc);
  }
}
