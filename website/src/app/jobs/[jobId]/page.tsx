"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import JobDetailPage from "@/features/job/components/JobDetailPage";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export default function JobPage({ params }: PageProps) {
  const { jobId } = use(params);
  const searchParams = useSearchParams();
  const boardId = searchParams.get("boardId") ?? "";
  const mode = searchParams.get("mode") === "edit" ? "edit" : "view";

  return <JobDetailPage boardId={boardId} jobId={jobId} mode={mode} />;
}
