"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Y from "yjs";

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

const TemplateDocContext = createContext<Y.Doc | null>(null);
const TemplateConnectionContext = createContext<boolean>(false);

export interface TemplateDocProviderProps {
  templateId: string;
  children: React.ReactNode;
}

/**
 * The only piece of the template feature coupled to yjs/Hocuspocus - owns the
 * `Y.Doc` + realtime connection lifecycle and hands it down via context so
 * everything else can stay decoupled from yjs.
 */
export const TemplateDocProvider: React.FC<TemplateDocProviderProps> = ({
  templateId,
  children,
}) => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const nextDoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: YJS_SERVER_URL,
      name: `template-${templateId}`,
      document: nextDoc,
    });

    provider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    setDoc(nextDoc);

    return () => {
      provider.destroy();
      nextDoc.destroy();
      setDoc(null);
      setIsConnected(false);
    };
  }, [templateId]);

  return (
    <TemplateDocContext.Provider value={doc}>
      <TemplateConnectionContext.Provider value={isConnected}>
        {children}
      </TemplateConnectionContext.Provider>
    </TemplateDocContext.Provider>
  );
};

/** The doc is naturally `null` until `TemplateDocProvider`'s effect connects it. */
export function useTemplateDoc(): Y.Doc | null {
  return useContext(TemplateDocContext);
}

/**
 * Returns a stable getter for the doc, for action hooks that must mutate it.
 * The doc is created inside an effect (after the first commit), so reading
 * it eagerly at render time would throw on that very first render, before
 * the effect gets a chance to run - components like `SessionCreation` or
 * `WidgetPicker` call action hooks unconditionally on mount. A getter defers
 * the read (and the "not ready" check) to when the action actually fires,
 * by which point the effect has long since populated the doc.
 */
export function useTemplateDocGetter(): () => Y.Doc {
  const doc = useContext(TemplateDocContext);
  const docRef = useRef(doc);
  docRef.current = doc;

  return useCallback(() => {
    if (!docRef.current) {
      throw new Error(
        "This action requires a connected <TemplateDocProvider> ancestor",
      );
    }
    return docRef.current;
  }, []);
}

export function useTemplateConnection(): boolean {
  return useContext(TemplateConnectionContext);
}
