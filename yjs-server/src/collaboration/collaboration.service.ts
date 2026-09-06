import { DocumentStrategy } from "@/collaboration/document-strategy";
import { SubmissionStrategy } from "@/collaboration/submission.strategy";
import { TemplateStrategy } from "@/collaboration/template.strategy";
import { EnvironmentVariables } from "@/config/env.schema";
import { Server } from "@hocuspocus/server";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/** Hocuspocus WebSocket collaboration server, delegating load/store per document type to a `DocumentStrategy`. */
@Injectable()
export class CollaborationService implements OnModuleInit, OnModuleDestroy {
  private readonly port: number;
  private server: Server | undefined;

  constructor(
    configService: ConfigService<EnvironmentVariables, true>,
    private readonly templateStrategy: TemplateStrategy,
    private readonly submissionStrategy: SubmissionStrategy,
  ) {
    this.port = configService.get("PORT", { infer: true });
  }

  async onModuleInit(): Promise<void> {
    this.server = new Server({
      port: this.port,
      onLoadDocument: async ({ documentName }) => {
        return this.resolveStrategy(documentName).load(documentName);
      },
      onStoreDocument: async ({ documentName, document }) => {
        await this.resolveStrategy(documentName).store(documentName, document);
      },
    });

    await this.server.listen();
  }

  async onModuleDestroy(): Promise<void> {
    await this.server?.destroy();
  }

  /** documentName is `{type}/{id}/{version?}` - see `document-file.util.ts`. */
  private resolveStrategy(documentName: string): DocumentStrategy {
    const [type] = documentName.split("/");
    return type === "submission" ? this.submissionStrategy : this.templateStrategy;
  }
}
