import { EnvironmentVariables } from "@/config/env.schema";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubmissionSearchDoc } from "./submission-search.types";

const SUBMISSIONS_INDEX = "submissions";

/** Thin REST wrapper over MeiliSearch - no SDK dependency, just `fetch` against its HTTP API. */
@Injectable()
export class MeilisearchService {
  private readonly logger = new Logger(MeilisearchService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.baseUrl = configService.get("MEILISEARCH_URL", { infer: true });
    this.apiKey = configService.get("MEILISEARCH_API_KEY", { infer: true });
  }

  async indexSubmission(doc: SubmissionSearchDoc): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/indexes/${SUBMISSIONS_INDEX}/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify([doc]),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(
        `Failed to index submission ${doc.id} in MeiliSearch: ${response.status} ${body}`,
      );
    }
  }
}
