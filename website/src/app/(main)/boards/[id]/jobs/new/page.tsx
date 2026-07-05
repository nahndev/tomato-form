"use client";

import { use } from "react";
import JobCreationPage from "@/features/job/components/JobCreationPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NewJobPage({ params }: PageProps) {
  const { id } = use(params);

  return <JobCreationPage boardId={id} />;
}
