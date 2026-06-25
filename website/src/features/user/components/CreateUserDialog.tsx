import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { useUserStore } from "@/store/user.store";
import type { User } from "@/types/user";

const userSchema = Yup.object({
  name: Yup.string().required("Name is required").min(1),
  email: Yup.string().email("Enter a valid email").nullable(),
});

interface CreateUserDialogProps {
  open: boolean;
  editing: User | null;
  onOpenChange: (open: boolean) => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  editing,
  onOpenChange,
}) => {
  const createUser = useUserStore((s) => s.createUser);
  const updateUser = useUserStore((s) => s.updateUser);

  const formik = useFormik({
    initialValues: { name: "", email: "" },
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const email = values.email.trim() || null;
      try {
        if (editing) {
          await updateUser(editing.uuid, { name: values.name, email });
          toast.success("User updated");
        } else {
          await createUser({ name: values.name, email });
          toast.success("User created");
        }
        resetForm();
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to save user:", err);
        toast.error(editing ? "Failed to update user" : "Failed to create user");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    formik.setValues({ name: editing?.name ?? "", email: editing?.email ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

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
          <DialogTitle>{editing ? "Edit User" : "New User"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this user's name."
              : "Add a new user so they can be referenced across the application."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              value={formik.values.name}
              onChange={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
              error={formik.touched.name ? formik.errors.name : undefined}
              placeholder="e.g. Jane Doe"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-email">Email (optional)</Label>
            <Input
              id="user-email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email ? formik.errors.email : undefined}
              placeholder="e.g. jane@example.com"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : editing ? (
                "Save Changes"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
