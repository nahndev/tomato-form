"use client";

import { useMemo } from "react";
import DashboardContent from "@/features/template/components/dashboard/DashboardContent";
import DashboardHeader from "@/features/template/components/dashboard/DashboardHeader";
import { useTemplates } from "@/features/template";

export default function TemplatesPage() {
  const { data: templates = [], isLoading, isError, refetch } = useTemplates();

  const sorted = useMemo(
    () =>
      [...templates].sort((a, b) => {
        const da = new Date(a.createdAt ?? 0).getTime();
        const db = new Date(b.createdAt ?? 0).getTime();
        return db - da;
      }),
    [templates],
  );

  const publishedCount = useMemo(
    () => sorted.filter((t) => Boolean(t.version)).length,
    [sorted],
  );

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <DashboardHeader
        total={sorted.length}
        publishedCount={publishedCount}
        draftCount={sorted.length - publishedCount}
      />

      <div className="mt-6">
        <DashboardContent
          templates={sorted}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </div>
    </div>
  );
}
