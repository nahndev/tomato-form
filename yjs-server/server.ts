import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { Server } from "@hocuspocus/server";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as Y from "yjs";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = process.env.FILE_DIR;
if (!DATA_DIR) {
  throw new Error("FILE_DIR environment variable is required");
}
fs.mkdirSync(DATA_DIR, { recursive: true });

const server = new Server({
  port: Number(process.env.PORT ?? 3028),
  async onLoadDocument({ documentName }) {
    const file = resolveFile(documentName);
    if (!fs.existsSync(file)) {
      return new Y.Doc();
    }
    return YDocHelper.fromFile(file);
  },

  async onStoreDocument({ documentName, document }) {
    const file = resolveFile(documentName);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const update = Y.encodeStateAsUpdate(document);
    fs.writeFileSync(file, Buffer.from(update));
  },
});

server.listen();

startRpcServer();

/**
 * documentName is `{type}/{id}/{version}`, e.g. `template/{templateId}/default`
 * for the live draft, `template/{templateId}/{version}` for a published
 * snapshot, or `submission/{submissionId}/default`.
 */
function resolveFile(documentName: string): string {
  const [type, id, version] = documentName.split("/");
  return `${DATA_DIR}/${type}/${id}/${version ?? "default"}.yjs`;
}

class YDocHelper {
  static fromFile(file: string): Y.Doc {
    const doc = new Y.Doc();
    const data = fs.readFileSync(file);
    Y.applyUpdate(doc, new Uint8Array(data));
    return doc;
  }
}

interface MakeVersionFileRequest {
  templateId: string;
  version: string;
}

interface MakeVersionFileResponse {
  path: string;
  widgets: Record<string, unknown>;
  layouts: Record<string, unknown>;
  widgetToSession: Record<string, unknown>;
  properties: Record<string, unknown>;
  sessions: Record<string, unknown>;
  sessionProperties: Record<string, unknown>;
}

interface TemplateFilePackage {
  template: {
    TemplateFile: grpc.ServiceClientConstructor;
  };
}

/**
 * MakeVersionFile RPC: copies the live `default.yjs` into a `{version}.yjs`
 * snapshot, returning its path relative to DATA_DIR. Runs on its own port
 * since Hocuspocus owns the main WS server.
 */
function startRpcServer(): void {
  const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "proto/template-file.proto"),
    { keepCase: false },
  );
  const proto = grpc.loadPackageDefinition(
    packageDefinition,
  ) as unknown as TemplateFilePackage;

  const rpcServer = new grpc.Server();
  rpcServer.addService(proto.template.TemplateFile.service, {
    makeVersionFile(
      call: grpc.ServerUnaryCall<
        MakeVersionFileRequest,
        MakeVersionFileResponse
      >,
      callback: grpc.sendUnaryData<MakeVersionFileResponse>,
    ) {
      const { templateId, version } = call.request;

      const source = `${DATA_DIR}/template/${templateId}/default.yjs`;
      const relativePath = `template/${templateId}/${version}.yjs`;
      const dest = `${DATA_DIR}/${relativePath}`;

      if (!fs.existsSync(source)) {
        callback({
          name: "NotFoundError",
          message: "No draft to publish",
          code: grpc.status.NOT_FOUND,
        });
        return;
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(source, dest);

      const doc = YDocHelper.fromFile(dest);
      callback(null, {
        path: relativePath,
        widgets: Object.fromEntries(doc.getMap("widgets").entries()),
        layouts: Object.fromEntries(doc.getMap("layouts").entries()),
        widgetToSession: Object.fromEntries(doc.getMap("widgetToSession").entries()),
        properties: Object.fromEntries(doc.getMap("properties").entries()),
        sessions: Object.fromEntries(doc.getMap("sessions").entries()),
        sessionProperties: Object.fromEntries(
          doc.getMap("sessionProperties").entries(),
        ),
      });
    },
  });

  rpcServer.bindAsync(
    `0.0.0.0:${process.env.RPC_PORT ?? 3030}`,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) throw err;
    },
  );
}
