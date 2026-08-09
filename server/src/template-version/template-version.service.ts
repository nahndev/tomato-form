import * as grpc from "@grpc/grpc-js";
import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from "@nestjs/common";
import * as semver from "semver";
import { TemplateVersion } from "@/database/prisma-client";
import { PrismaService } from "../database/prisma.service";
import { TemplateFileClient } from "./template-file.client";

@Injectable()
export class TemplateVersionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templateFileClient: TemplateFileClient,
  ) {}

  async publish(templateId: string): Promise<TemplateVersion> {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true },
    });
    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found`);
    }

    const existing = await this.prisma.templateVersion.findMany({
      where: { templateId },
      select: { version: true },
    });
    const latest = existing.reduce<string | null>(
      (max, v) => (!max || semver.gt(v.version, max) ? v.version : max),
      null,
    );
    const version = latest ? (semver.inc(latest, "patch") ?? "1.0.0") : "1.0.0";

    await this.makeVersionFile(templateId, version);

    return this.prisma.templateVersion.create({
      data: { templateId, version },
    });
  }

  private async makeVersionFile(
    templateId: string,
    version: string,
  ): Promise<string> {
    try {
      return await this.templateFileClient.makeVersionFile(
        templateId,
        version,
      );
    } catch (err) {
      const error = err as grpc.ServiceError;

      if (error.code === grpc.status.NOT_FOUND) {
        throw new UnprocessableEntityException(error.message);
      }

      throw new ServiceUnavailableException(
        `Could not reach yjs-server to publish template ${templateId}: ${error.message}`,
      );
    }
  }
}
