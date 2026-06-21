"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/hooks/useTemplates";
import { useSubmission, useUpdateSubmission } from "@/hooks/useSubmissions";

interface PageProps {
  params: Promise<{ id: string; submissionId: string }>;
}

export default function SubmissionPage({ params }: PageProps) {
  const { id: boardId, submissionId } = use(params);

  const { data: submission, isLoading, isError } = useSubmission(submissionId);
  const { data: template, isLoading: isLoadingTemplate } = useTemplate(
    submission?.templateId ?? "",
  );
  const { mutateAsync: updateSubmission, isPending: isSaving } =
    useUpdateSubmission(submissionId);

  const [values, setValues] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setValues(submission?.data ?? {});
  }, [submission]);

  const orderedWidgetIds = useMemo(() => {
    if (!template) return [];
    const idxByWidgetId = new Map<string, string>();
    for (const [widgetId, layout] of Object.entries(template.layouts)) {
      idxByWidgetId.set(widgetId, layout.idx);
    }
    return Object.keys(template.widgets).sort((a, b) => {
      const idxA = idxByWidgetId.get(a) ?? "";
      const idxB = idxByWidgetId.get(b) ?? "";
      return idxA.localeCompare(idxB);
    });
  }, [template]);

  if (isLoading || isLoadingTemplate) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !submission) notFound();

  function setValue(widgetId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [widgetId]: value }));
  }

  async function handleSave() {
    try {
      await updateSubmission({ data: values });
      toast.success("Submission saved");
    } catch (err) {
      console.error("Failed to save submission:", err);
      toast.error("Failed to save submission");
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-10">
      <Link
        href={`/boards/${boardId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Board
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {template?.name ?? "Submission"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {submission.createdAt
            ? `Submitted ${new Date(submission.createdAt).toLocaleString()}`
            : "Submission details"}
        </p>
      </div>

      {!template ? (
        <p className="text-sm text-muted-foreground">
          The template used for this submission is no longer available.
        </p>
      ) : orderedWidgetIds.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          This template has no fields yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orderedWidgetIds.map((widgetId) => {
            const widget = template.widgets[widgetId];
            const props = template.properties[widgetId];
            const value = values[widgetId];

            return (
              <div key={widgetId} className="flex flex-col gap-1.5">
                <Label htmlFor={widgetId}>
                  {props?.label ?? widgetId}
                  {props?.required ? " *" : ""}
                </Label>

                {widget.type === "textarea" ? (
                  <Textarea
                    id={widgetId}
                    value={(value as string) ?? ""}
                    placeholder={props?.placeholder}
                    onChange={(e) => setValue(widgetId, e.target.value)}
                  />
                ) : widget.type === "select" ? (
                  <Select
                    id={widgetId}
                    value={(value as string) ?? ""}
                    onChange={(e) => setValue(widgetId, e.target.value)}
                  >
                    <option value="">Select…</option>
                    {(props?.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Select>
                ) : widget.type === "checkbox" ? (
                  <input
                    id={widgetId}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => setValue(widgetId, e.target.checked)}
                    className="size-4 rounded border-input"
                  />
                ) : (
                  <Input
                    id={widgetId}
                    type={widget.type === "number" ? "number" : widget.type === "date" ? "date" : "text"}
                    value={(value as string | number) ?? ""}
                    placeholder={props?.placeholder}
                    onChange={(e) =>
                      setValue(
                        widgetId,
                        widget.type === "number"
                          ? e.target.valueAsNumber
                          : e.target.value,
                      )
                    }
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Save Submission"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
