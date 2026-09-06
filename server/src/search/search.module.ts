import { Module } from "@nestjs/common";
import { MeilisearchService } from "./meilisearch.service";
import { SubmissionSearchService } from "./submission-search.service";

@Module({
  providers: [MeilisearchService, SubmissionSearchService],
  exports: [SubmissionSearchService],
})
export class SearchModule {}
