import {
  readDocFromFile,
  resolveDocumentFile,
} from "@/collaboration/document-file.util";
import { DocumentStrategy } from "@/collaboration/document-strategy";
import { EnvironmentVariables } from "@/config/env.schema";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import * as Y from "yjs";

/** Persists a template's live draft / published snapshots as raw `.yjs` files under `FILE_DIR`. */
@Injectable()
export class TemplateStrategy implements DocumentStrategy {
  private readonly dataDir: string;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.dataDir = configService.get("FILE_DIR", { infer: true });
  }

  async load(documentName: string): Promise<Y.Doc> {
    const file = resolveDocumentFile(this.dataDir, documentName);
    if (!fs.existsSync(file)) {
      return new Y.Doc();
    }
    return readDocFromFile(file);
  }

  async store(documentName: string, document: Y.Doc): Promise<void> {
    const file = resolveDocumentFile(this.dataDir, documentName);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(Y.encodeStateAsUpdate(document)));
  }
}
