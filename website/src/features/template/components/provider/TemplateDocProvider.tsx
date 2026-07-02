"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { createContext, useContext, useEffect, useState } from "react";
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
 * `Y.Doc` + realtime connection lifecycle and hands it down via context.
 * Renders nothing until the doc exists, so every descendant can assume
 * `useTemplateDoc()` is safe to call unconditionally.
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

  if (!doc) return null;

  return (
    <TemplateDocContext.Provider value={doc}>
      <TemplateConnectionContext.Provider value={isConnected}>
        {children}
      </TemplateConnectionContext.Provider>
    </TemplateDocContext.Provider>
  );
};

/** Safe to call unconditionally - `TemplateDocProvider` never renders children before the doc exists. */
export function useTemplateDoc(): Y.Doc {
  const doc = useContext(TemplateDocContext);
  if (!doc) {
    throw new Error("This hook must be used inside <TemplateDocProvider>");
  }
  return doc;
}

export function useTemplateConnection(): boolean {
  return useContext(TemplateConnectionContext);
}
