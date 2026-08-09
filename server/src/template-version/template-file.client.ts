import { callUnary, createGrpcClient } from "@/common/utils/grpc-client.util";
import { EnvironmentVariables } from "@/config/env.schema";
import { TemplateFileClient as TemplateFileGrpcClient } from "@/proto/generated/template-file";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TemplateFileClient implements OnModuleDestroy {
  private readonly client: TemplateFileGrpcClient;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.client = createGrpcClient(
      TemplateFileGrpcClient,
      configService.get("YJS_RPC_URL", { infer: true }),
    );
  }

  /** Publishes the template's live draft as `version`, returning the new snapshot's path. */
  async makeVersionFile(id: string, version: string): Promise<string> {
    const response = await callUnary(
      this.client.makeVersionFile.bind(this.client),
      {
        templateId: id,
        version,
      },
    );
    return response.path;
  }

  onModuleDestroy(): void {
    this.client.close();
  }
}
