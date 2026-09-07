"use client";

import { createSyncDoc } from "@/features/template/sync";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { SyncDoc, SyncDocProvider, useSyncDoc } from "@tomato/sync";
import { createContext, useContext, useEffect, useState } from "react";
import type * as Y from "yjs";

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

const TemplateConnectionContext = createContext<boolean>(false);

export interface TemplateDocProviderProps {
  uuid: string;
  children: React.ReactNode;
}

/**
 * The only piece of the template feature coupled to yjs/Hocuspocus - owns the
 * `SyncDoc` + realtime connection lifecycle, registers the feature's Handlers
 * (`WidgetHandler`, `SessionHandler`, ...), and hands the doc down via
 * `@tomato/sync`'s context. Renders a loading spinner instead of `children`
 * until the doc exists *and* has synced, so every descendant can assume
 * `useTemplateDoc()`/`useHandler()` are safe to call unconditionally and see
 * a fully-populated doc on first render.
 */
export const TemplateDocProvider: React.FC<TemplateDocProviderProps> = ({
  uuid,
  children,
}) => {
  const [syncDoc, setSyncDoc] = useState<SyncDoc | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const nextSyncDoc = createSyncDoc();

    const provider = new HocuspocusProvider({
      url: YJS_SERVER_URL,
      name: `template/${uuid}/default`,
      document: nextSyncDoc.doc,
    });

    provider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    provider.on("synced", () => {
      nextSyncDoc.synced();
      setIsSynced(true);
    });

    setSyncDoc(nextSyncDoc);

    return () => {
      provider.destroy();
      nextSyncDoc.destroy();
      setSyncDoc(null);
      setIsConnected(false);
      setIsSynced(false);
    };
  }, [uuid]);

  if (!syncDoc || !isSynced) {
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
    <SyncDocProvider value={syncDoc}>
      <TemplateConnectionContext.Provider value={isConnected}>
        {children}
      </TemplateConnectionContext.Provider>
    </SyncDocProvider>
  );
};

/** Safe to call unconditionally - `TemplateDocProvider` never renders children before the doc exists. */
export function useTemplateDoc(): Y.Doc {
  return useSyncDoc().doc;
}

export function useTemplateConnection(): boolean {
  return useContext(TemplateConnectionContext);
}
