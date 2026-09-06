import {
  readDocFromFile,
  resolveDocumentFile,
} from "@/collaboration/document-file.util";
import { DocumentStrategy } from "@/collaboration/document-strategy";
import {
  SUBMISSION_VALUES_CHANGED_EVENT,
  SubmissionValueEntry,
} from "@/collaboration/submission-value.contract";
import { EnvironmentVariables } from "@/config/env.schema";
import { SERVER_CLIENT } from "@/rabbitmq/rabbitmq.constants";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import * as fs from "fs";
import * as path from "path";
import * as Y from "yjs";

/** A Yjs `Item`'s id, as internally tracked by `Y.Map`'s private `_map`. */
interface YMapItem {
  id: { client: number; clock: number };
}

interface YMapInternals {
  _map: Map<string, YMapItem>;
}

/**
 * Persists a submission's live doc as a raw `.yjs` file (same as
 * `TemplateStrategy`), and additionally emits its `values` map onto
 * `server_queue` so `server` can save them to the `Submission` entity.
 */
@Injectable()
export class SubmissionStrategy implements DocumentStrategy {
  private readonly dataDir: string;

  constructor(
    configService: ConfigService<EnvironmentVariables, true>,
    @Inject(SERVER_CLIENT) private readonly serverClient: ClientProxy,
  ) {
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

    const [, submissionId] = documentName.split("/");
    const values = this.extractValuesWithClock(document);
    if (Object.keys(values).length === 0) return;

    this.serverClient.emit(SUBMISSION_VALUES_CHANGED_EVENT, {
      submissionId,
      values,
    });
  }

  /**
   * Each key's `clock` is the Yjs item clock that last set it - an
   * incrementing per-key version `server` uses as an optimistic lock, to
   * drop stale, out-of-order event deliveries.
   */
  private extractValuesWithClock(
    document: Y.Doc,
  ): Record<string, SubmissionValueEntry> {
    const map = document.getMap<unknown>("values");
    const internals = map as unknown as YMapInternals;

    const result: Record<string, SubmissionValueEntry> = {};
    for (const key of map.keys()) {
      const item = internals._map.get(key);
      if (!item) continue;
      result[key] = { key, value: map.get(key), clock: item.id.clock };
    }
    return result;
  }
}
