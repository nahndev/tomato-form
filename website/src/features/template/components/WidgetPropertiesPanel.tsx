"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Widget, WidgetProperties } from "@/types/template";

interface WidgetPropertiesPanelProps {
  widget: Widget;
  properties: WidgetProperties;
  onUpdate: (patch: Partial<WidgetProperties>) => void;
}

const schema = Yup.object({
  label: Yup.string().required("Label is required"),
  placeholder: Yup.string(),
  required: Yup.boolean(),
  options: Yup.string(),
});

export function WidgetPropertiesPanel({
  widget,
  properties,
  onUpdate,
}: WidgetPropertiesPanelProps) {
  const formik = useFormik({
    initialValues: {
      label: properties.label ?? "",
      placeholder: properties.placeholder ?? "",
      required: properties.required ?? false,
      options: (properties.options ?? []).join("\n"),
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      onUpdate({
        label: values.label,
        placeholder: values.placeholder || undefined,
        required: values.required || undefined,
        options:
          widget.type === "select"
            ? values.options
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined,
      });
    },
  });

  // Auto-save on blur
  const handleBlurSave = () => {
    if (formik.isValid) formik.submitForm();
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Type: <span className="font-medium text-foreground">{widget.type}</span>
        </p>
      </div>

      <Separator />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="prop-label">Label</Label>
        <Input
          id="prop-label"
          value={formik.values.label}
          onChange={formik.handleChange("label")}
          onBlur={(e) => {
            formik.handleBlur("label")(e);
            handleBlurSave();
          }}
          error={formik.touched.label ? formik.errors.label : undefined}
          placeholder="Field label…"
        />
      </div>

      {widget.type !== "checkbox" && widget.type !== "session" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="prop-placeholder">Placeholder</Label>
          <Input
            id="prop-placeholder"
            value={formik.values.placeholder}
            onChange={formik.handleChange("placeholder")}
            onBlur={(e) => {
              formik.handleBlur("placeholder")(e);
              handleBlurSave();
            }}
            placeholder="Placeholder text…"
          />
        </div>
      )}

      {widget.type !== "session" && (
        <div className="flex items-center gap-2">
          <input
            id="prop-required"
            type="checkbox"
            checked={formik.values.required}
            onChange={(e) => {
              formik.setFieldValue("required", e.target.checked);
              setTimeout(() => formik.submitForm(), 0);
            }}
            className="size-4 rounded border-input accent-primary"
          />
          <Label htmlFor="prop-required">Required</Label>
        </div>
      )}

      {widget.type === "select" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="prop-options">Options (one per line)</Label>
          <textarea
            id="prop-options"
            value={formik.values.options}
            onChange={formik.handleChange("options")}
            onBlur={(e) => {
              formik.handleBlur("options")(e);
              handleBlurSave();
            }}
            rows={4}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder={"Option 1\nOption 2\nOption 3"}
          />
        </div>
      )}

      <Button
        type="submit"
        size="sm"
        disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
      >
        Apply
      </Button>
    </form>
  );
}
