"use client";

import { BoardHeader, BoardProvider, BoardTab, useBoard } from "@/features/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { notFound } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: PageProps) {
  const { id } = use(params);

  const { data: board, isLoading, isError } = useBoard(id);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <TomatoIcon
          icon={TomatoIconKey.Loader}
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (isError || !board) notFound();

  return (
    <BoardProvider board={board}>
      <div className="flex h-screen flex-col overflow-hidden">
        <BoardHeader />
        <main className="flex-1 overflow-hidden">
          <BoardTab />
        </main>
      </div>
    </BoardProvider>
  );
}
