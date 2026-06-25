"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
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
});

export function WidgetPropertiesPanel({
  widget,
  properties,
  onUpdate,
}: WidgetPropertiesPanelProps) {
  const def = WIDGET_REGISTRY[widget.type];
  const showPlaceholder = def.showPlaceholder ?? true;
  const showRequired = def.showRequired ?? true;

  const formik = useFormik({
    initialValues: {
      label: properties.label ?? "",
      placeholder: properties.placeholder ?? "",
      required: properties.required ?? false,
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      onUpdate({
        label: values.label,
        placeholder: values.placeholder || undefined,
        required: values.required || undefined,
      });
    },
  });

  // Auto-save on blur
  const handleBlurSave = () => {
    if (formik.isValid) formik.submitForm();
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Type: <span className="font-medium text-foreground">{widget.type}</span>
        </p>
      </div>

      <Separator />

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
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

        {showPlaceholder && (
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

        {showRequired && (
          <div className="flex items-center gap-2">
            <input
              id="prop-required"
              type="checkbox"
              checked={formik.values.required}
              onChange={(e) => {
                formik.setFieldValue("required", e.target.checked);
                // setFieldValue updates formik state asynchronously, so
                // submitForm must wait a tick to see the new "required" value.
                setTimeout(() => formik.submitForm(), 0);
              }}
              className="size-4 rounded border-input accent-primary"
            />
            <Label htmlFor="prop-required">Required</Label>
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

      {def.SettingsFields && (
        <>
          <Separator />
          <def.SettingsFields key={widget.id} value={properties} onChange={onUpdate} />
        </>
      )}
    </div>
  );
}
