import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as semver from "semver";
import { Prisma, TemplateVersion } from "@/database/prisma-client";
import type { TemplateVersionSnapshot } from "@/template/template.types";
import { PrismaService } from "../database/prisma.service";
import { TemplateFileClient } from "./template-file.client";
import { VersionFileMadeEvent } from "./template-file.contract";

@Injectable()
export class TemplateVersionService {
  private readonly logger = new Logger(TemplateVersionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly templateFileClient: TemplateFileClient,
  ) {}

  async findOne(id: string) {
    const doc = await this.prisma.templateVersion.findUnique({
      where: { id },
      include: { template: { select: { id: true, name: true } } },
    });
    if (!doc) throw new NotFoundException(`TemplateVersion ${id} not found`);
    return doc;
  }

  /** Latest published version for a template, ordered by semver. */
  async findLatestByTemplateId(templateId: string): Promise<TemplateVersion> {
    const existing = await this.prisma.templateVersion.findMany({
      where: { templateId },
    });
    const latest = existing.reduce<TemplateVersion | null>(
      (max, v) => (!max || semver.gt(v.version, max.version) ? v : max),
      null,
    );
    if (!latest) {
      throw new NotFoundException(
        `Template ${templateId} has no published version`,
      );
    }
    return latest;
  }

  /**
   * Fire-and-forget: asks yjs-server to make the version file. The
   * `TemplateVersion` row is created later, when yjs-server's reply event
   * lands (see `createFromVersionFileEvent`) - callers don't get it back here.
   */
  async publish(templateId: string): Promise<void> {
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

    this.templateFileClient.makeVersionFile(templateId, version);
  }

  /** Handles yjs-server's `VERSION_FILE_MADE_EVENT`, creating the `TemplateVersion` row it describes. */
  async createFromVersionFileEvent(event: VersionFileMadeEvent): Promise<void> {
    const { templateId, version, widgets, layouts, widgetToSession, sessions } =
      event;

    const snapshot: TemplateVersionSnapshot = {
      widgets,
      layouts,
      widgetToSession,
      sessions,
    } as unknown as TemplateVersionSnapshot;

    try {
      await this.prisma.templateVersion.create({
        data: {
          templateId,
          version,
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (err) {
      this.logger.error(
        `Failed to create TemplateVersion ${templateId}@${version} from yjs-server event: ${(err as Error).message}`,
      );
    }
  }
}
