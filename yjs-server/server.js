import { Server } from "@hocuspocus/server";
import dotenv from "dotenv";
import fs from "fs";
import * as Y from "yjs";

dotenv.config();

const DATA_DIR = process.env.FILE_DIR;
fs.mkdirSync(DATA_DIR, { recursive: true });

const server = new Server({
  port: process.env.PORT ?? 3028,
  async onLoadDocument({ documentName }) {
    const file = `${DATA_DIR}/${documentName}.yjs`;
    if (!fs.existsSync(file)) {
      return new Y.Doc();
    }
    return YDocHelper.fromFile(file);
  },

  async onStoreDocument({ documentName, document }) {
    const file = `${DATA_DIR}/${documentName}.yjs`;
    const update = Y.encodeStateAsUpdate(document);
    fs.writeFileSync(file, Buffer.from(update));
  },
});

server.listen();

class YDocHelper {
  static fromFile(file) {
    const doc = new Y.Doc();
    const data = fs.readFileSync(file);
    Y.applyUpdate(doc, new Uint8Array(data));
    return doc;
  }
}
