"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBoard, useUpdateBoard } from "@/hooks/useBoards";
import { useTemplates } from "@/hooks/useTemplates";
import {
  useCreateSubmission,
  useDeleteSubmission,
  useSubmissions,
} from "@/hooks/useSubmissions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: PageProps) {
  const { id } = use(params);

  const { data: board, isLoading, isError } = useBoard(id);
  const { data: templates = [] } = useTemplates();
  const { mutateAsync: updateBoard, isPending: isSavingTemplates } =
    useUpdateBoard(id);
  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useSubmissions(id);
  const { mutateAsync: createSubmission, isPending: isCreatingSubmission } =
    useCreateSubmission();
  const { mutateAsync: deleteSubmission } = useDeleteSubmission(id);

  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [draftTemplateIds, setDraftTemplateIds] = useState<string[]>([]);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [pickedTemplateId, setPickedTemplateId] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const templateById = useMemo(
    () => new Map(templates.map((t) => [t.id, t])),
    [templates],
  );

  const boardTemplates = useMemo(
    () => (board?.templateIds ?? []).map((tid) => templateById.get(tid)),
    [board, templateById],
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !board) notFound();

  function openTemplatesDialog() {
    setDraftTemplateIds(board.templateIds);
    setTemplatesOpen(true);
  }

  function toggleDraftTemplate(tid: string) {
    setDraftTemplateIds((prev) =>
      prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid],
    );
  }

  async function saveTemplates() {
    try {
      await updateBoard({ templateIds: draftTemplateIds });
      toast.success("Templates updated");
      setTemplatesOpen(false);
    } catch (err) {
      console.error("Failed to update templates:", err);
      toast.error("Failed to update templates");
    }
  }

  function openSubmissionDialog() {
    setPickedTemplateId(board.templateIds[0] ?? "");
    setSubmissionOpen(true);
  }

  async function handleCreateSubmission() {
    if (!pickedTemplateId) return;
    try {
      await createSubmission({ boardId: id, templateId: pickedTemplateId });
      toast.success("Submission created");
      setSubmissionOpen(false);
    } catch (err) {
      console.error("Failed to create submission:", err);
      toast.error("Failed to create submission");
    }
  }

  async function handleDeleteSubmission(submissionId: string) {
    setDeletingId(submissionId);
    try {
      await deleteSubmission(submissionId);
      toast.success("Submission deleted");
    } catch (err) {
      console.error("Failed to delete submission:", err);
      toast.error("Failed to delete submission");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/boards"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Boards
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {board.templateIds.length} template
            {board.templateIds.length !== 1 ? "s" : ""} linked
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={openTemplatesDialog}>
                <Settings className="mr-2 size-4" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Board Templates</DialogTitle>
                <DialogDescription>
                  Choose which templates this board can create submissions from.
                </DialogDescription>
              </DialogHeader>

              {templates.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No templates available yet.
                </p>
              ) : (
                <div className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border border-input p-2">
                  {templates.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={draftTemplateIds.includes(t.id)}
                        onChange={() => toggleDraftTemplate(t.id)}
                        className="size-4 rounded border-input"
                      />
                      {t.name}
                    </label>
                  ))}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTemplatesOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveTemplates} disabled={isSavingTemplates}>
                  {isSavingTemplates ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={submissionOpen} onOpenChange={setSubmissionOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openSubmissionDialog}
                disabled={board.templateIds.length === 0}
              >
                <Plus className="mr-2 size-4" />
                New Submission
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Submission</DialogTitle>
                <DialogDescription>
                  Pick a template to create a submission for this board.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="submission-template">Template</Label>
                <Select
                  id="submission-template"
                  value={pickedTemplateId}
                  onChange={(e) => setPickedTemplateId(e.target.value)}
                >
                  {board.templateIds.map((tid) => (
                    <option key={tid} value={tid}>
                      {templateById.get(tid)?.name ?? tid}
                    </option>
                  ))}
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSubmissionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSubmission}
                  disabled={!pickedTemplateId || isCreatingSubmission}
                >
                  {isCreatingSubmission ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {boardTemplates.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {boardTemplates.map(
            (t) =>
              t && (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1 text-xs text-muted-foreground"
                >
                  <FileText className="size-3" />
                  {t.name}
                </span>
              ),
          )}
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Submissions</h2>

      {isLoadingSubmissions ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
          <FileText className="mb-4 size-10 text-muted-foreground/40" />
          <h3 className="font-semibold text-muted-foreground">
            No submissions yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Create a submission from one of this board&apos;s templates
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {submissions.map((s) => (
            <Link key={s.id} href={`/boards/${id}/submissions/${s.id}`}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {templateById.get(s.templateId)?.name ?? "Unknown template"}
                    </CardTitle>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteSubmission(s.id);
                      }}
                      disabled={deletingId === s.id}
                      className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
                      aria-label="Delete submission"
                    >
                      {deletingId === s.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                  <CardDescription>
                    {s.createdAt
                      ? new Date(s.createdAt).toLocaleString()
                      : "—"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {Object.keys(s.data ?? {}).length} field
                    {Object.keys(s.data ?? {}).length !== 1 ? "s" : ""} filled
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
