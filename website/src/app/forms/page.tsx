import Link from "next/link";
import { Plus, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Template } from "@/types/template";

async function getTemplates(): Promise<Template[]> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3022/api";
  try {
    const res = await fetch(`${base}/templates`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function FormsPage() {
  const templates = await getTemplates();

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your form templates
          </p>
        </div>
        <Link href="/forms/new">
          <Button>
            <Plus className="mr-2 size-4" />
            New Form
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
          <FileText className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-muted-foreground">No forms yet</h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Create your first form to get started
          </p>
          <Link href="/forms/new" className="mt-4">
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Create Form
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link key={t.id} href={`/forms/${t.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription>
                    {Object.keys(t.widgets ?? {}).length} widget
                    {Object.keys(t.widgets ?? {}).length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {t.updatedAt
                      ? new Date(t.updatedAt).toLocaleDateString()
                      : "—"}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
