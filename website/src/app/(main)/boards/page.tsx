"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Plus, LayoutGrid, Clock, Search, Trash2, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBoards, useCreateBoard, useDeleteBoard } from "@/hooks/useBoards";
import { useTemplates } from "@/hooks/useTemplates";

const createSchema = Yup.object({
  name: Yup.string().required("Board name is required").min(1),
});

export default function BoardsPage() {
  const { data: boards = [], isLoading, isError } = useBoards();
  const { data: templates = [] } = useTemplates();
  const { mutateAsync: createBoard } = useCreateBoard();
  const { mutateAsync: deleteBoard } = useDeleteBoard();

  const [open, setOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: createSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await createBoard({ name: values.name, templateIds: selectedTemplateIds });
        toast.success("Board created");
        resetForm();
        setSelectedTemplateIds([]);
        setOpen(false);
      } catch (err) {
        console.error("Failed to create board:", err);
        toast.error("Failed to create board");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const filtered = useMemo(() => {
    if (!nameFilter.trim()) return boards;
    const q = nameFilter.toLowerCase();
    return boards.filter((b) => b.name.toLowerCase().includes(q));
  }, [boards, nameFilter]);

  function toggleTemplate(id: string) {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteBoard(id);
      toast.success("Board deleted");
    } catch (err) {
      console.error("Failed to delete board:", err);
      toast.error("Failed to delete board");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Boards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize submissions by board and template
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              formik.resetForm();
              setSelectedTemplateIds([]);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New Board
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Board</DialogTitle>
              <DialogDescription>
                Give your board a name and pick the templates it can create submissions from.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="board-name">Board Name</Label>
                <Input
                  id="board-name"
                  value={formik.values.name}
                  onChange={formik.handleChange("name")}
                  onBlur={formik.handleBlur("name")}
                  error={formik.touched.name ? formik.errors.name : undefined}
                  placeholder="e.g. Customer Feedback"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Templates</Label>
                {templates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No templates available yet.
                  </p>
                ) : (
                  <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-md border border-input p-2">
                    {templates.map((t) => (
                      <label
                        key={t.id}
                        className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTemplateIds.includes(t.id)}
                          onChange={() => toggleTemplate(t.id)}
                          className="size-4 rounded border-input"
                        />
                        {t.name}
                      </label>
                    ))}
                  </div>
                )}
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
                    "Create Board"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name…"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
          <p className="font-semibold text-destructive">Failed to load boards</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
          <LayoutGrid className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-muted-foreground">
            {boards.length === 0 ? "No boards yet" : "No boards match your search"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {boards.length === 0
              ? "Create your first board to get started"
              : "Try a different search term"}
          </p>
          {boards.length === 0 && (
            <Button size="sm" className="mt-4" onClick={() => setOpen(true)}>
              <Plus className="mr-2 size-4" />
              Create Board
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <Link key={b.id} href={`/boards/${b.id}`}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <LayoutGrid className="size-4 text-primary" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{b.name}</CardTitle>
                    <button
                      onClick={(e) => handleDelete(e, b.id)}
                      disabled={deletingId === b.id}
                      className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
                      aria-label="Delete board"
                    >
                      {deletingId === b.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                  <CardDescription>
                    {b.templateIds.length} template
                    {b.templateIds.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {b.createdAt
                      ? new Date(b.createdAt).toLocaleDateString()
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
