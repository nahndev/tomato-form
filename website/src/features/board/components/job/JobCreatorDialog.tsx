"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import CronExpressionBuilder from "@/features/board/components/job/CronExpressionBuilder";
import { useBoards } from "@/hooks/useBoards";
import { useCreateJob } from "@/hooks/useJobs";
import { useTemplates } from "@/hooks/useTemplates";
import { isCronExpression } from "@/lib/validators/cron-expression";
import { ACTION_TYPE_SUBMISSION_CREATION } from "@/types/job";

interface ActionFormValues {
  templateId: string;
  boardId: string;
}

const createSchema = Yup.object({
  name: Yup.string().required("Job name is required"),
  expression: Yup.string()
    .required("Schedule is required")
    .test("is-cron-expression", "Invalid cron expression", isCronExpression),
  actions: Yup.array()
    .of(
      Yup.object({
        templateId: Yup.string().required("Template is required"),
        boardId: Yup.string().required("Board is required"),
      }),
    )
    .min(1, "At least one action is required"),
});

export type JobCreatorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const JobCreatorDialog: React.FC<JobCreatorDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const board = useBoardContext();
  const { data: boards = [] } = useBoards();
  const { data: templates = [] } = useTemplates();
  const { mutateAsync: createJob } = useCreateJob();

  const formik = useFormik({
    initialValues: {
      name: "",
      expression: "0 9 * * *",
      actions: [{ templateId: "", boardId: board.id }] as ActionFormValues[],
    },
    validationSchema: createSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await createJob({
          name: values.name,
          expression: values.expression,
          enable: true,
          actions: values.actions.map((action) => ({
            type: ACTION_TYPE_SUBMISSION_CREATION,
            templateId: action.templateId,
            boardId: action.boardId,
          })),
        });
        toast.success("Job created");
        resetForm();
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to create job:", err);
        toast.error("Failed to create job");
      } finally {
        setSubmitting(false);
      }
    },
  });

  function updateAction(index: number, patch: Partial<ActionFormValues>) {
    const next = formik.values.actions.map((action, i) =>
      i === index ? { ...action, ...patch } : action,
    );
    formik.setFieldValue("actions", next);
  }

  function addAction() {
    formik.setFieldValue("actions", [
      ...formik.values.actions,
      { templateId: "", boardId: board.id },
    ]);
  }

  function removeAction(index: number) {
    formik.setFieldValue(
      "actions",
      formik.values.actions.filter((_, i) => i !== index),
    );
  }

  function actionError(index: number, field: keyof ActionFormValues) {
    const errors = formik.errors.actions;
    if (!Array.isArray(errors)) return undefined;
    const entry = errors[index];
    return entry && typeof entry === "object"
      ? (entry as Record<string, string>)[field]
      : undefined;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) formik.resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          New Job
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Job</DialogTitle>
          <DialogDescription>
            Run one or more scheduled actions in the background, like
            creating a submission on a recurring basis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="job-name">Job Name</Label>
            <Input
              id="job-name"
              value={formik.values.name}
              onChange={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
              error={formik.touched.name ? formik.errors.name : undefined}
              placeholder="e.g. Daily feedback submission"
              autoFocus
            />
          </div>

          <CronExpressionBuilder
            value={formik.values.expression}
            onChange={(value) => formik.setFieldValue("expression", value)}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Actions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAction}
              >
                <Plus className="mr-1 size-3.5" />
                Add Action
              </Button>
            </div>

            {formik.values.actions.map((action, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-md border border-border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Action {index + 1}: Create submission
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAction(index)}
                    disabled={formik.values.actions.length === 1}
                    className="rounded p-1 text-muted-foreground hover:text-destructive disabled:opacity-40"
                    aria-label="Remove action"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`job-board-${index}`}>Board</Label>
                  <Select
                    id={`job-board-${index}`}
                    value={action.boardId}
                    onChange={(e) =>
                      updateAction(index, { boardId: e.target.value })
                    }
                    error={actionError(index, "boardId")}
                  >
                    <option value="">Select a board…</option>
                    {boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`job-template-${index}`}>Template</Label>
                  <Select
                    id={`job-template-${index}`}
                    value={action.templateId}
                    onChange={(e) =>
                      updateAction(index, { templateId: e.target.value })
                    }
                    error={actionError(index, "templateId")}
                  >
                    <option value="">Select a template…</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                "Create Job"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobCreatorDialog;
