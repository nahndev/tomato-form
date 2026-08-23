import fs from "fs";
import os from "os";
import path from "path";
import * as Y from "yjs";
import { readDocFromFile, resolveDocumentFile } from "@/collaboration/document-file.util";

describe("resolveDocumentFile", () => {
  it("resolves a versioned document name to its file path", () => {
    expect(resolveDocumentFile("/data", "template/abc/1.0.0")).toBe(
      "/data/template/abc/1.0.0.yjs",
    );
  });

  it("defaults to the live draft when no version segment is given", () => {
    expect(resolveDocumentFile("/data", "submission/abc")).toBe(
      "/data/submission/abc/default.yjs",
    );
  });
});

describe("readDocFromFile", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "yjs-server-test-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("reconstructs a Y.Doc from an encoded update file", () => {
    const original = new Y.Doc();
    original.getMap("widgets").set("w1", { label: "Text" });
    const update = Y.encodeStateAsUpdate(original);
    const file = path.join(dir, "default.yjs");
    fs.writeFileSync(file, Buffer.from(update));

    const restored = readDocFromFile(file);

    expect(restored.getMap("widgets").get("w1")).toEqual({ label: "Text" });
  });
});
