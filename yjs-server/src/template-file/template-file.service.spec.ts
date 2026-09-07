import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as Y from "yjs";
import { TemplateFileService } from "@/template-file/template-file.service";

function getService(dataDir: string): TemplateFileService {
  const configService = { get: () => dataDir } as unknown as ConfigService<never, true>;
  return new TemplateFileService(configService);
}

describe("TemplateFileService", () => {
  let dataDir: string;

  beforeEach(() => {
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "template-file-test-"));
  });

  afterEach(() => {
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it("returns a not-ok result when there is no live draft", () => {
    const service = getService(dataDir);

    const result = service.getCurrentSnapshot("template-1");

    expect(result).toEqual({
      ok: false,
      message: "No draft to publish",
    });
  });

  it("reads the live draft's Y.Maps without touching the file", () => {
    const draftDir = path.join(dataDir, "template", "template-1");
    fs.mkdirSync(draftDir, { recursive: true });
    const doc = new Y.Doc();
    doc.getMap("widgets").set("w1", { label: "Text" });
    doc.getMap("sessions").set("s1", { id: "s1" });
    fs.writeFileSync(
      path.join(draftDir, "default.yjs"),
      Buffer.from(Y.encodeStateAsUpdate(doc)),
    );

    const service = getService(dataDir);
    const result = service.getCurrentSnapshot("template-1");

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok result");
    expect(result.widgets).toEqual({ w1: { label: "Text" } });
    expect(result.sessions).toEqual({ s1: { id: "s1" } });
    expect(fs.readdirSync(draftDir)).toEqual(["default.yjs"]);
  });
});
