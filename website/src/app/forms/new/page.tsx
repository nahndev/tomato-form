"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateTemplate } from "@/hooks/useTemplates";

const schema = Yup.object({
  name: Yup.string().required("Form name is required").min(1),
});

export default function NewFormPage() {
  const router = useRouter();
  const { mutateAsync: createTemplate } = useCreateTemplate();

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const template = await createTemplate({ name: values.name });
        toast.success("Form created");
        router.push(`/forms/${template.id}`);
      } catch (err) {
        console.error("Failed to create form:", err);
        toast.error("Failed to create form");
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto max-w-lg px-6 py-10">
      <Link
        href="/forms"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to forms
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Form</CardTitle>
          <CardDescription>
            Give your form a name to get started. You can add widgets after
            creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Form Name</Label>
              <Input
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                error={formik.touched.name ? formik.errors.name : undefined}
                placeholder="e.g. Employee Onboarding"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Link href="/forms">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {formik.isSubmitting ? "Creating…" : "Create Form"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
