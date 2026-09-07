import { PrismaService } from "@/database/prisma.service";
import { Prisma, Template, TemplateMigration } from "@/database/prisma-client";
import type { TemplateSnapshot } from "@/template/template.types";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import * as semver from "semver";
import { ResolveTemplateMigrationDto } from "./dto/resolve-template-migration.dto";
import { TemplateSnapshotClient } from "./template-snapshot.client";

export interface TemplateMigrationResult {
  migration: TemplateMigration;
  template: Template;
}

@Injectable()
export class TemplateMigrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templateSnapshotClient: TemplateSnapshotClient,
  ) {}

  async findOne(id: string): Promise<TemplateMigration> {
    const migration = await this.prisma.templateMigration.findUnique({ where: { id } });
    if (!migration) throw new NotFoundException(`TemplateMigration ${id} not found`);
    return migration;
  }

  /**
   * Fetches the template's live draft from yjs-server, records it as a
   * `TemplateMigration` against the template's current snapshot, and - since
   * conflict detection isn't implemented yet and always finds none - applies
   * it immediately. Once real conflict detection lands, a migration with
   * conflicts will instead stay pending until `resolve()` is called.
   */
  async publish(templateId: string): Promise<TemplateMigrationResult> {
    const template = await this.prisma.template.findUnique({ where: { id: templateId } });
    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found`);
    }

    const result = await this.templateSnapshotClient.getSnapshot(templateId);
    if (!result.ok) {
      throw new ConflictException(result.message);
    }

    const { widgets, layouts, widgetToSession, sessions } = result;
    const toSnapshot: TemplateSnapshot = { widgets, layouts, widgetToSession, sessions } as unknown as TemplateSnapshot;
    const conflicts = this.detectConflicts(template.snapshot as unknown as TemplateSnapshot, toSnapshot);

    const migration = await this.prisma.templateMigration.create({
      data: {
        templateId,
        fromSnapshot: template.snapshot as Prisma.InputJsonValue,
        toSnapshot: toSnapshot as unknown as Prisma.InputJsonValue,
        conflicts: conflicts as unknown as Prisma.InputJsonValue,
      },
    });

    if (conflicts.length === 0) {
      const applied = await this.applyMigration(migration, template);
      return applied;
    }

    return { migration, template };
  }

  async resolve(
    migrationId: string,
    dto: ResolveTemplateMigrationDto,
  ): Promise<TemplateMigrationResult> {
    const migration = await this.findOne(migrationId);
    if (migration.resolvedAt) {
      throw new ConflictException(`TemplateMigration ${migrationId} is already resolved`);
    }

    const template = await this.prisma.template.findUniqueOrThrow({
      where: { id: migration.templateId },
    });

    const resolved = await this.prisma.templateMigration.update({
      where: { id: migrationId },
      data: { resolutions: (dto.resolutions ?? {}) as Prisma.InputJsonValue },
    });

    return this.applyMigration(resolved, template);
  }

  /** Always returns no conflicts - real diffing between `from`/`to` is not implemented yet. */
  private detectConflicts(_from: TemplateSnapshot, _to: TemplateSnapshot): unknown[] {
    return [];
  }

  private async applyMigration(
    migration: TemplateMigration,
    template: Template,
  ): Promise<TemplateMigrationResult> {
    const nextVersion = template.version ? (semver.inc(template.version, "patch") ?? "1.0.0") : "1.0.0";

    const [updatedMigration, updatedTemplate] = await this.prisma.$transaction([
      this.prisma.templateMigration.update({
        where: { id: migration.id },
        data: { resolvedAt: new Date() },
      }),
      this.prisma.template.update({
        where: { id: template.id },
        data: {
          version: nextVersion,
          snapshot: migration.toSnapshot as Prisma.InputJsonValue,
        },
      }),
    ]);

    return { migration: updatedMigration, template: updatedTemplate };
  }
}
