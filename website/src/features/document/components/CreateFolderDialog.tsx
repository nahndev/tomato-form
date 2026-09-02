import { useFormik } from "formik";
import * as Yup from "yup";
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
import { useCreateFolder } from "@/features/document/hooks/useDocuments";

const folderSchema = Yup.object({
  name: Yup.string().trim().required("Folder name is required").max(255, "Name is too long"),
});

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string | null;
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({ open, onOpenChange, parentId }) => {
  const { mutateAsync: createFolder } = useCreateFolder(parentId);

  const formik = useFormik<{ name: string }>({
    initialValues: { name: "" },
    validationSchema: folderSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await createFolder(values.name.trim());
        toast.success("Folder created");
        resetForm();
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to create folder:", err);
        toast.error("Failed to create folder");
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
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>Create a folder to organize files.</DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="folder-name">Name</Label>
            <Input
              id="folder-name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name ? formik.errors.name : undefined}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              {formik.isSubmitting ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
