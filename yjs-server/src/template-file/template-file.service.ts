import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fs from "fs";
import path from "path";
import { EnvironmentVariables } from "@/config/env.schema";
import { readDocFromFile } from "@/collaboration/document-file.util";
import { MakeVersionFileReply } from "@/template-file/template-file.contract";

@Injectable()
export class TemplateFileService {
  private readonly dataDir: string;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.dataDir = configService.get("FILE_DIR", { infer: true });
  }

  /** Copies the live `default.yjs` draft into a `{version}.yjs` snapshot, returning its Y.Maps. */
  makeVersionFile(templateId: string, version: string): MakeVersionFileReply {
    const source = `${this.dataDir}/template/${templateId}/default.yjs`;
    const relativePath = `template/${templateId}/${version}.yjs`;
    const dest = `${this.dataDir}/${relativePath}`;

    if (!fs.existsSync(source)) {
      return {
        ok: false,
        code: "NOT_FOUND",
        message: "No draft to publish",
      };
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(source, dest);

    const doc = readDocFromFile(dest);
    return {
      ok: true,
      path: relativePath,
      widgets: Object.fromEntries(doc.getMap("widgets").entries()),
      layouts: Object.fromEntries(doc.getMap("layouts").entries()),
      widgetToSession: Object.fromEntries(doc.getMap("widgetToSession").entries()),
      properties: Object.fromEntries(doc.getMap("properties").entries()),
      sessions: Object.fromEntries(doc.getMap("sessions").entries()),
      sessionProperties: Object.fromEntries(doc.getMap("sessionProperties").entries()),
    };
  }
}
