"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Plus, FileText, Clock, Search, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTemplates, useCreateTemplate, useDeleteTemplate } from "@/hooks/useTemplates";
import { WIDGET_LIST } from "@/features/template/components/widget/registry";
import type { WidgetType } from "@/types/template";

const WIDGET_TYPES: { label: string; value: WidgetType }[] = WIDGET_LIST.map((def) => ({
  label: def.label,
  value: def.type,
}));

const createSchema = Yup.object({
  name: Yup.string().required("Template name is required").min(1),
});

export default function TemplatesPage() {
  const { data: templates = [], isLoading, isError } = useTemplates();
  const { mutateAsync: createTemplate } = useCreateTemplate();
  const { mutateAsync: deleteTemplate } = useDeleteTemplate();

  const [open, setOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<WidgetType | "">("");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: createSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await createTemplate({ name: values.name });
        toast.success("Template created");
        resetForm();
        setOpen(false);
      } catch (err) {
        console.error("Failed to create template:", err);
        toast.error("Failed to create template");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const filtered = useMemo(() => {
    let result = [...templates];

    if (nameFilter.trim()) {
      const q = nameFilter.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    if (typeFilter) {
      result = result.filter((t) =>
        Object.values(t.widgets ?? {}).some((w) => w.type === typeFilter),
      );
    }

    result.sort((a, b) => {
      const da = new Date(a.createdAt ?? 0).getTime();
      const db = new Date(b.createdAt ?? 0).getTime();
      return dateSort === "newest" ? db - da : da - db;
    });

    return result;
  }, [templates, nameFilter, typeFilter, dateSort]);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteTemplate(id);
      toast.success("Template deleted");
    } catch (err) {
      console.error("Failed to delete template:", err);
      toast.error("Failed to delete template");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your form templates
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) formik.resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New Template
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Template</DialogTitle>
              <DialogDescription>
                Give your template a name to get started. You can add widgets after creation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={formik.values.name}
                  onChange={formik.handleChange("name")}
                  onBlur={formik.handleBlur("name")}
                  error={formik.touched.name ? formik.errors.name : undefined}
                  placeholder="e.g. Employee Onboarding"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create Template"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name…"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as WidgetType | "")}
          className="w-44"
        >
          <option value="">All types</option>
          {WIDGET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        <Select
          value={dateSort}
          onChange={(e) => setDateSort(e.target.value as "newest" | "oldest")}
          className="w-44"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
          <p className="font-semibold text-destructive">Failed to load templates</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
          <FileText className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-muted-foreground">
            {templates.length === 0 ? "No templates yet" : "No templates match your filters"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {templates.length === 0
              ? "Create your first template to get started"
              : "Try adjusting your search or filters"}
          </p>
          {templates.length === 0 && (
            <Button size="sm" className="mt-4" onClick={() => setOpen(true)}>
              <Plus className="mr-2 size-4" />
              Create Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link key={t.id} href={`/templates/${t.id}`}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-4 text-primary" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <button
                      onClick={(e) => handleDelete(e, t.id)}
                      disabled={deletingId === t.id}
                      className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
                      aria-label="Delete template"
                    >
                      {deletingId === t.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                  <CardDescription>
                    {Object.keys(t.widgets ?? {}).length} widget
                    {Object.keys(t.widgets ?? {}).length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString()
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
