"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
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
import { useCreateTemplate } from "@/features/template";

const createSchema = Yup.object({
  name: Yup.string().required("Template name is required").min(1),
});

interface DashboardCreatorProps {
  children: React.ReactNode;
}

const DashboardCreator: React.FC<DashboardCreatorProps> = ({ children }) => {
  const { mutateAsync: createTemplate } = useCreateTemplate();
  const [open, setOpen] = useState(false);

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

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) formik.resetForm();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              {formik.isSubmitting ? (
                <>
                  <TomatoIcon icon={TomatoIconKey.Loader} className="mr-2 size-4 animate-spin" />
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
  );
};

export default DashboardCreator;
