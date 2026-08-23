import * as fs from "fs";
import * as Y from "yjs";

/**
 * documentName is `{type}/{id}/{version}`, e.g. `template/{templateId}/default`
 * for the live draft, `template/{templateId}/{version}` for a published
 * snapshot, or `submission/{submissionId}/default`.
 */
export function resolveDocumentFile(dataDir: string, documentName: string): string {
  const [type, id, version] = documentName.split("/");
  return `${dataDir}/${type}/${id}/${version ?? "default"}.yjs`;
}

export function readDocFromFile(file: string): Y.Doc {
  const doc = new Y.Doc();
  const data = fs.readFileSync(file);
  Y.applyUpdate(doc, new Uint8Array(data));
  return doc;
}
