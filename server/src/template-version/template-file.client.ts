import { callUnary, createGrpcClient } from "@/common/utils/grpc-client.util";
import { EnvironmentVariables } from "@/config/env.schema";
import { TemplateFileClient as TemplateFileGrpcClient } from "@/proto/generated/template-file";
import type {
  GridLayout,
  Session,
  Widget,
  WidgetProperties,
} from "@/template/template.types";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface TemplateVersionSnapshot {
  path: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
}

@Injectable()
export class TemplateFileClient implements OnModuleDestroy {
  private readonly client: TemplateFileGrpcClient;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.client = createGrpcClient(
      TemplateFileGrpcClient,
      configService.get("YJS_RPC_URL", { infer: true }),
    );
  }

  /** Publishes the template's live draft as `version`, returning the new snapshot's path and widget records. */
  async makeVersionFile(
    id: string,
    version: string,
  ): Promise<TemplateVersionSnapshot> {
    const response = await callUnary(
      this.client.makeVersionFile.bind(this.client),
      {
        templateId: id,
        version,
      },
    );
    return {
      path: response.path,
      widgets: (response.widgets ?? {}) as Record<string, Widget>,
      layouts: (response.layouts ?? {}) as Record<string, GridLayout>,
      widgetToSession: (response.widgetToSession ?? {}) as Record<string, string>,
      properties: (response.properties ?? {}) as Record<string, WidgetProperties>,
      sessions: (response.sessions ?? {}) as Record<string, Session>,
    };
  }

  onModuleDestroy(): void {
    this.client.close();
  }
}
