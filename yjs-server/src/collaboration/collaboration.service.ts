import { Server } from "@hocuspocus/server";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import * as Y from "yjs";
import { EnvironmentVariables } from "@/config/env.schema";
import { resolveDocumentFile, readDocFromFile } from "@/collaboration/document-file.util";

/** Hocuspocus WebSocket collaboration server, persisting each Yjs doc as a raw `.yjs` file under `FILE_DIR`. */
@Injectable()
export class CollaborationService implements OnModuleInit, OnModuleDestroy {
  private readonly dataDir: string;
  private readonly port: number;
  private server: Server | undefined;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.dataDir = configService.get("FILE_DIR", { infer: true });
    this.port = configService.get("PORT", { infer: true });
  }

  async onModuleInit(): Promise<void> {
    fs.mkdirSync(this.dataDir, { recursive: true });

    this.server = new Server({
      port: this.port,
      onLoadDocument: async ({ documentName }) => {
        const file = resolveDocumentFile(this.dataDir, documentName);
        if (!fs.existsSync(file)) {
          return new Y.Doc();
        }
        return readDocFromFile(file);
      },
      onStoreDocument: async ({ documentName, document }) => {
        const file = resolveDocumentFile(this.dataDir, documentName);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        const update = Y.encodeStateAsUpdate(document);
        fs.writeFileSync(file, Buffer.from(update));
      },
    });

    await this.server.listen();
  }

  async onModuleDestroy(): Promise<void> {
    await this.server?.destroy();
  }
}
