"use client";

import { Button } from "@/components/ui/button";
import { FormBuilder } from "@/features/template";
import { TemplateProvider } from "@/features/template/components/provider/TemplateProvider";
import { useTemplate } from "@/hooks/useTemplates";
import { TemplateMode } from "@/types/template";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
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
    <TemplateProvider template={template} mode={mode as TemplateMode}>
      <div className="flex h-screen flex-col">
        <div className="flex items-center gap-2 border-b px-4 py-2">
          <Link href="/templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1.5 size-4" />
              Templates
            </Button>
          </Link>
          <div className="ml-auto">
            {viewOnly ? (
              <Link href={`/templates/${id}?mode=edit`}>
                <Button size="sm">
                  <Pencil className="mr-1.5 size-4" />
                  Edit
                </Button>
              </Link>
            ) : (
              <Link href={`/templates/${id}?mode=view`}>
                <Button size="sm" variant="outline">
                  Preview
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <FormBuilder />
        </div>
      </div>
    </TemplateProvider>
  );
}
