"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { getIn, useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import CronExpressionBuilder from "@/features/job/components/CronExpressionBuilder";
import ActionCard, {
  ActionCardErrors,
  JobActionPatch,
} from "@/features/job/components/actions/ActionCard";
import {
  ACTION_TYPE_OPTIONS,
  createDefaultAction,
} from "@/features/job/components/actions/create-default-action";
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

const jobFormSchema = Yup.object({
  name: Yup.string().required("Job name is required"),
  expression: Yup.string()
    .required("Schedule is required")
    .test("is-cron-expression", "Invalid cron expression", isCronExpression),
  actions: Yup.array()
    .of(actionSchema)
    .min(1, "At least one step is required"),
});

function actionLabel(type: JobAction["type"]) {
  return ACTION_TYPE_OPTIONS.find((option) => option.value === type)?.label;
}

export interface JobFormValues {
  name: string;
  expression: string;
  actions: JobAction[];
}

export type JobFormProps = {
  boardId: string;
  initialValues: JobFormValues;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (values: JobFormValues) => Promise<void>;
  onCancel: () => void;
};

const JobForm: React.FC<JobFormProps> = ({
  boardId,
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const formik = useFormik({
    initialValues,
    validationSchema: jobFormSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values);
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
      i === index ? createDefaultAction(type, boardId) : action,
    );
    formik.setFieldValue("actions", next);
  }

  function addStep() {
    const next = [
      ...formik.values.actions,
      createDefaultAction(ACTION_TYPE_SUBMISSION_CREATION, boardId),
    ];
    formik.setFieldValue("actions", next);
    setSelectedStep(next.length - 1);
  }

  function removeStep(index: number) {
    const next = formik.values.actions.filter((_, i) => i !== index);
    formik.setFieldValue("actions", next);
    setSelectedStep((prev) => Math.min(prev, next.length - 1));
  }

  function actionErrors(index: number): ActionCardErrors | undefined {
    return getIn(formik.errors, `actions[${index}]`) as
      | ActionCardErrors
      | undefined;
  }

  const targetAction = formik.values.actions[selectedStep] as
    | JobAction
    | undefined;

  return (
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
          <Label>Steps</Label>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="mr-1 size-3.5" />
            Add Step
          </Button>
        </div>

        <div className="flex flex-col gap-1 rounded-md border border-border p-1.5">
          {formik.values.actions.map((action, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedStep(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedStep(index);
                }
              }}
              className={cn(
                "flex items-center gap-2 rounded p-2 text-left text-sm transition-colors",
                index === selectedStep
                  ? "bg-accent"
                  : "hover:bg-accent/50 text-muted-foreground",
              )}
            >
              <span className="font-medium">Step {index + 1}</span>
              <Badge variant="secondary">{actionLabel(action.type)}</Badge>
              <div className="flex-1" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeStep(index);
                }}
                disabled={formik.values.actions.length === 1}
                aria-label="Remove step"
                className="rounded p-1 hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {targetAction && (
          <div className="flex flex-col gap-2 rounded-md border border-border p-3">
            <span className="text-xs font-medium text-muted-foreground">
              Editing step {selectedStep + 1}
            </span>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`job-action-type-${selectedStep}`}>
                Action Type
              </Label>
              <Select
                id={`job-action-type-${selectedStep}`}
                value={targetAction.type}
                onChange={(e) =>
                  changeActionType(
                    selectedStep,
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
              idPrefix={`job-action-${selectedStep}`}
              value={targetAction}
              onChange={(patch) => updateAction(selectedStep, patch)}
              errors={actionErrors(selectedStep)}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
          {formik.isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {submittingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
