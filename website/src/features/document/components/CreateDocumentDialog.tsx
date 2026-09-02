import { useFormik } from "formik";
import * as Yup from "yup";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadDocument } from "@/features/document/hooks/useDocuments";
import { formatBytes } from "@/lib/format";

// Mirrors MAX_UPLOAD_SIZE_BYTES in storage/src/file/file.constants.ts
const MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024;

const uploadSchema = Yup.object({
  file: Yup.mixed<File>()
    .required("Select a file to upload")
    .test(
      "max-size",
      `File must be smaller than ${formatBytes(MAX_UPLOAD_SIZE_BYTES)}`,
      (file) => !file || file.size <= MAX_UPLOAD_SIZE_BYTES,
    ),
});

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string | null;
}

const CreateDocumentDialog: React.FC<CreateDocumentDialogProps> = ({ open, onOpenChange, parentId }) => {
  const { mutateAsync: uploadDocument } = useUploadDocument(parentId);

  const formik = useFormik<{ file: File | null }>({
    initialValues: { file: null },
    validationSchema: uploadSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!values.file) return;
      try {
        await uploadDocument(values.file);
        toast.success("File uploaded");
        resetForm();
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to upload file:", err);
        toast.error("Failed to upload file");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) formik.resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Add a new file to storage.</DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="document-file">File</Label>
            <Input
              id="document-file"
              type="file"
              onChange={(e) => formik.setFieldValue("file", e.target.files?.[0] ?? null)}
              onBlur={() => formik.setFieldTouched("file", true)}
              error={formik.touched.file ? formik.errors.file : undefined}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              {formik.isSubmitting ? (
                <>
                  <TomatoIcon icon={TomatoIconKey.Loader} className="animate-spin" />
                  Uploading…
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocumentDialog;
