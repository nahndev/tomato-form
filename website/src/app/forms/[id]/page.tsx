import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormBuilder } from "@/features/form-builder";
import type { Template } from "@/types/template";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

async function getTemplate(id: string): Promise<Template | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3022/api";
  try {
    const res = await fetch(`${base}/templates/${id}`, {
      next: { revalidate: 0 },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch template");
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function FormPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { mode } = await searchParams;
  const viewOnly = mode !== "edit";

  const template = await getTemplate(id);
  if (!template) notFound();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Link href="/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1.5 size-4" />
            Forms
          </Button>
        </Link>
        <div className="ml-auto">
          {viewOnly ? (
            <Link href={`/forms/${id}?mode=edit`}>
              <Button size="sm">
                <Pencil className="mr-1.5 size-4" />
                Edit
              </Button>
            </Link>
          ) : (
            <Link href={`/forms/${id}`}>
              <Button size="sm" variant="outline">
                Preview
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <FormBuilder template={template} viewOnly={viewOnly} />
      </div>
    </div>
  );
}
