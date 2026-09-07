import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import { EnvironmentVariables } from "@/config/env.schema";
import { readDocFromFile } from "@/collaboration/document-file.util";
import { GetTemplateSnapshotResult } from "@/template-file/template-file.contract";

@Injectable()
export class TemplateFileService {
  private readonly dataDir: string;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.dataDir = configService.get("FILE_DIR", { infer: true });
  }

  /** Reads the live `default.yjs` draft's Y.Maps, without touching the file. */
  getCurrentSnapshot(templateId: string): GetTemplateSnapshotResult {
    const file = `${this.dataDir}/template/${templateId}/default.yjs`;

    if (!fs.existsSync(file)) {
      return { ok: false, message: "No draft to publish" };
    }

    const doc = readDocFromFile(file);
    return {
      ok: true,
      widgets: Object.fromEntries(doc.getMap("widgets").entries()),
      layouts: Object.fromEntries(doc.getMap("layouts").entries()),
      widgetToSession: Object.fromEntries(doc.getMap("widgetToSession").entries()),
      sessions: Object.fromEntries(doc.getMap("sessions").entries()),
    };
  }
}
