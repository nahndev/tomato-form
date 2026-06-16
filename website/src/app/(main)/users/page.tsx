"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Plus, UserRound, Search, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useUserStore } from "@/store/user.store";
import type { User } from "@/types/user";

const userSchema = Yup.object({
  name: Yup.string().required("Name is required").min(1),
  email: Yup.string().email("Enter a valid email").nullable(),
});

export default function UsersPage() {
  const users = useUserStore((s) => s.users);
  const isLoading = useUserStore((s) => s.isLoading);
  const createUser = useUserStore((s) => s.createUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const deleteUser = useUserStore((s) => s.deleteUser);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

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
        setOpen(false);
        setEditing(null);
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

  const filtered = useMemo(() => {
    if (!nameFilter.trim()) return users;
    const q = nameFilter.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }, [users, nameFilter]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setOpen(true);
  }

  async function handleDelete(uuid: string) {
    setDeletingUuid(uuid);
    try {
      await deleteUser(uuid);
      toast.success("User deleted");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    } finally {
      setDeletingUuid(null);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the people who can be assigned across the application
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              formik.resetForm();
              setEditing(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              New User
            </Button>
          </DialogTrigger>

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
                  onClick={() => setOpen(false)}
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
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name…"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
          <UserRound className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-muted-foreground">
            {users.length === 0 ? "No users yet" : "No users match your search"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {users.length === 0
              ? "Create your first user to get started"
              : "Try a different search term"}
          </p>
          {users.length === 0 && (
            <Button size="sm" className="mt-4" onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              Create User
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <Card key={u.uuid} className="group">
              <CardHeader>
                <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <UserRound className="size-4 text-primary" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{u.name}</CardTitle>
                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(u)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Edit user"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.uuid)}
                      disabled={deletingUuid === u.uuid}
                      className="rounded p-1 text-muted-foreground hover:text-destructive disabled:opacity-50"
                      aria-label="Delete user"
                    >
                      {deletingUuid === u.uuid ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {u.email && (
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
