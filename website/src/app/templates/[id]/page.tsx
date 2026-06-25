"use client";

import { TemplateProvider } from "@/features/template/components/provider/TemplateProvider";
import { TemplateBuilder } from "@/features/template/components/template/TemplateBuilder";
import TemplateHeader from "@/features/template/components/template/TemplateHeader";
import { useTemplate } from "@/hooks/useTemplates";
import { TemplateMode } from "@/types/template";
import { DragDropProvider } from "@dnd-kit/react";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default function TemplatePage({ params, searchParams }: PageProps) {
  const { id } = use(params);
  const { mode = TemplateMode.EDIT } = use(searchParams);
  const viewOnly = mode !== TemplateMode.EDIT;

  const { data: template, isLoading, isError } = useTemplate(id);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !template) notFound();

  return (
    <DragDropProvider>
      <TemplateProvider template={template} mode={mode as TemplateMode}>
        <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
          <TemplateHeader />
          <TemplateBuilder />
        </div>
      </TemplateProvider>
    </DragDropProvider>
  );
}
