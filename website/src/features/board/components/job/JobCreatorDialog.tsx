"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { getIn, useFormik } from "formik";
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
import ActionCard, {
  ActionCardErrors,
  JobActionPatch,
} from "@/features/board/components/job/actions/ActionCard";
import {
  ACTION_TYPE_OPTIONS,
  createDefaultAction,
} from "@/features/board/components/job/actions/create-default-action";
import { useCreateJob } from "@/hooks/useJobs";
import { isCronExpression } from "@/lib/validators/cron-expression";
import {
  ACTION_TYPE_SEND_MAIL,
  ACTION_TYPE_SUBMISSION_CREATION,
  JobAction,
  RecipientType,
} from "@/types/job";

const submissionCreationActionSchema = Yup.object({
  type: Yup.string().required(),
  templateId: Yup.string().required("Template is required"),
  boardId: Yup.string().required("Board is required"),
});

const sendMailActionSchema = Yup.object({
  type: Yup.string().required(),
  recipients: Yup.array()
    .of(
      Yup.object({
        type: Yup.string()
          .oneOf([RecipientType.MAIL, RecipientType.USER])
          .required(),
        value: Yup.string().required("Value is required"),
      }),
    )
    .min(1, "At least one recipient is required"),
  content: Yup.object({
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().required("Body is required"),
  }),
});

const actionSchema = Yup.lazy((value: { type?: string } | undefined) =>
  value?.type === ACTION_TYPE_SEND_MAIL
    ? sendMailActionSchema
    : submissionCreationActionSchema,
);

const createSchema = Yup.object({
  name: Yup.string().required("Job name is required"),
  expression: Yup.string()
    .required("Schedule is required")
    .test("is-cron-expression", "Invalid cron expression", isCronExpression),
  actions: Yup.array()
    .of(actionSchema)
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
  const { mutateAsync: createJob } = useCreateJob();

  const formik = useFormik({
    initialValues: {
      name: "",
      expression: "0 9 * * *",
      actions: [
        createDefaultAction(ACTION_TYPE_SUBMISSION_CREATION, board.id),
      ] as JobAction[],
    },
    validationSchema: createSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await createJob({
          name: values.name,
          expression: values.expression,
          enable: true,
          actions: values.actions,
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

  function updateAction(index: number, patch: JobActionPatch) {
    const next = formik.values.actions.map((action, i) =>
      i === index ? ({ ...action, ...patch } as JobAction) : action,
    );
    formik.setFieldValue("actions", next);
  }

  function changeActionType(index: number, type: JobAction["type"]) {
    const next = formik.values.actions.map((action, i) =>
      i === index ? createDefaultAction(type, board.id) : action,
    );
    formik.setFieldValue("actions", next);
  }

  function addAction() {
    formik.setFieldValue("actions", [
      ...formik.values.actions,
      createDefaultAction(ACTION_TYPE_SUBMISSION_CREATION, board.id),
    ]);
  }

  function removeAction(index: number) {
    formik.setFieldValue(
      "actions",
      formik.values.actions.filter((_, i) => i !== index),
    );
  }

  function actionErrors(index: number): ActionCardErrors | undefined {
    return getIn(formik.errors, `actions[${index}]`) as
      | ActionCardErrors
      | undefined;
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
            creating a submission or sending an email on a recurring basis.
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
                    Action {index + 1}
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
                  <Label htmlFor={`job-action-type-${index}`}>
                    Action Type
                  </Label>
                  <Select
                    id={`job-action-type-${index}`}
                    value={action.type}
                    onChange={(e) =>
                      changeActionType(
                        index,
                        e.target.value as JobAction["type"],
                      )
                    }
                  >
                    {ACTION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <ActionCard
                  idPrefix={`job-action-${index}`}
                  value={action}
                  onChange={(patch) => updateAction(index, patch)}
                  errors={actionErrors(index)}
                />
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
