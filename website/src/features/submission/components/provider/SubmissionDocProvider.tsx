"use client";

import { usePrincipalStore } from "@/store/principal.store";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { createContext, useContext, useEffect, useState } from "react";
import * as Y from "yjs";

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

const SubmissionDocContext = createContext<Y.Doc | null>(null);
const SubmissionConnectionContext = createContext<boolean>(false);

export interface SubmissionDocProviderProps {
  uuid: string;
  children: React.ReactNode;
}

/**
 * Owns the submission's `Y.Doc` + realtime connection, separate from the
 * template's structural doc - mirrors `TemplateDocProvider`. Uses a
 * `submission/{uuid}/default` document name so every submission lands under
 * its own file on the (shared, unmodified) yjs-server, never colliding with
 * a template id.
 */
export const SubmissionDocProvider: React.FC<SubmissionDocProviderProps> = ({
  uuid,
  children,
}) => {
  const principal = usePrincipalStore((s) => s.principal);
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const nextDoc = new Y.Doc();
    const nextProvider = new HocuspocusProvider({
      url: YJS_SERVER_URL,
      name: `submission/${uuid}/default`,
      document: nextDoc,
    });

    nextProvider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    setDoc(nextDoc);
    setProvider(nextProvider);

    return () => {
      nextProvider.destroy();
      nextDoc.destroy();
      setDoc(null);
      setProvider(null);
      setIsConnected(false);
    };
  }, [uuid]);

  useEffect(() => {
    if (!provider || !principal) return;
    provider.setAwarenessField("user", {
      name: principal.name,
      email: principal.email,
    });
  }, [provider, principal]);

  if (!doc) return null;

  return (
    <SubmissionDocContext.Provider value={doc}>
      <SubmissionConnectionContext.Provider value={isConnected}>
        {children}
      </SubmissionConnectionContext.Provider>
    </SubmissionDocContext.Provider>
  );
};

/** Safe to call unconditionally - `SubmissionDocProvider` never renders children before the doc exists. */
export function useSubmissionDoc(): Y.Doc {
  const doc = useContext(SubmissionDocContext);
  if (!doc) {
    throw new Error("This hook must be used inside <SubmissionDocProvider>");
  }
  return doc;
}

export function useSubmissionConnection(): boolean {
  return useContext(SubmissionConnectionContext);
}
