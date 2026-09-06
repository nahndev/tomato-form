import * as Y from "yjs";

/** How a document type is loaded from / stored into persistence when hocuspocus opens/flushes it. */
export interface DocumentStrategy {
  load(documentName: string): Promise<Y.Doc>;
  store(documentName: string, document: Y.Doc): Promise<void>;
}
