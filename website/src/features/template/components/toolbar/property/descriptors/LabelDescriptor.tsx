"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";
import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  label: Yup.string().required("Label is required"),
});

/** Field label, shown for every widget type. */
export function LabelDescriptor({ value, onChange }: WidgetPropertyFieldProps) {
  const formik = useFormik({
    initialValues: { label: value.label ?? "" },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => onChange(values.label),
  });

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-label">Label</Label>
      <Input
        id="prop-label"
        value={formik.values.label}
        onChange={formik.handleChange("label")}
        onBlur={(e) => {
          formik.handleBlur("label")(e);
          if (formik.isValid) formik.submitForm();
        }}
        error={formik.touched.label ? formik.errors.label : undefined}
        placeholder="Field label…"
      />
    </div>
  );
}
