"use client";

import { useSearchParams } from "next/navigation";
import JobCreationPage from "@/features/job/components/JobCreationPage";

export default function NewJobPage() {
  const searchParams = useSearchParams();
  const boardId = searchParams.get("boardId") ?? "";

  return <JobCreationPage boardId={boardId} />;
}
