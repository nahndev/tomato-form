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

    const result = service.makeVersionFile("template-1", "1.0.0");

    expect(result).toEqual({
      ok: false,
      message: "No draft to publish",
    });
  });

  it("copies the draft to a versioned snapshot and returns its Y.Maps", () => {
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
    const result = service.makeVersionFile("template-1", "1.0.0");

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok result");
    expect(result.event.path).toBe("template/template-1/1.0.0.yjs");
    expect(result.event.widgets).toEqual({ w1: { label: "Text" } });
    expect(result.event.sessions).toEqual({ s1: { id: "s1" } });
    expect(fs.existsSync(path.join(draftDir, "1.0.0.yjs"))).toBe(true);
  });
});
