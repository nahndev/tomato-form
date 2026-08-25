"use client";

import { initTemplateDoc } from "@/features/template/hooks/internal/templateDocInit";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { createContext, useContext, useEffect, useState } from "react";
import * as Y from "yjs";

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

const TemplateDocContext = createContext<Y.Doc | null>(null);
const TemplateConnectionContext = createContext<boolean>(false);

export interface TemplateDocProviderProps {
  uuid: string;
  version?: string;
  children: React.ReactNode;
}

/**
 * The only piece of the template feature coupled to yjs/Hocuspocus - owns the
 * `Y.Doc` + realtime connection lifecycle and hands it down via context.
 * Renders a loading spinner instead of `children` until the doc exists *and*
 * has synced, so every descendant can assume `useTemplateDoc()` is safe to
 * call unconditionally and sees a fully-populated doc on first render.
 */
export const TemplateDocProvider: React.FC<TemplateDocProviderProps> = ({
  uuid,
  version,
  children,
}) => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const nextDoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: YJS_SERVER_URL,
      name: `template/${uuid}/${version ?? "default"}`,
      document: nextDoc,
    });

    provider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    provider.on("synced", () => {
      initTemplateDoc(nextDoc);
      setIsSynced(true);
    });

    setDoc(nextDoc);

    return () => {
      provider.destroy();
      nextDoc.destroy();
      setDoc(null);
      setIsConnected(false);
      setIsSynced(false);
    };
  }, [uuid, version]);

  if (!doc || !isSynced) {
    return (
      <div className="flex h-screen items-center justify-center">
        <TomatoIcon
          icon={TomatoIconKey.Loader}
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

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
