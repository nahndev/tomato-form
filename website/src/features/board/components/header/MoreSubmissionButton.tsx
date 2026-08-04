"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import { Loader2, Plus } from "lucide-react";

const MoreSubmissionButton: React.FC = () => {
  const board = useBoardContext();
  const { mutateAsync: createSubmission, isPending } = useCreateSubmission();

  const [open, setOpen] = useState(false);
  const [pickedTemplateId, setPickedTemplateId] = useState("");

  function openDialog() {
    setPickedTemplateId(board.templates[0]?.id ?? "");
    setOpen(true);
  }

  async function handleCreate() {
    if (!pickedTemplateId) return;
    try {
      await createSubmission({ boardId: board.id, templateId: pickedTemplateId });
      toast.success("Submission created");
      setOpen(false);
    } catch (err) {
      console.error("Failed to create submission:", err);
      toast.error("Failed to create submission");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          onClick={openDialog}
          disabled={board.templates.length === 0}
        >
          <Plus className="mr-1.5 size-4" />
          New Submission
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Submission</DialogTitle>
          <DialogDescription>
            Pick a template to create a submission for this board.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="submission-template">Template</Label>
          <Select
            id="submission-template"
            value={pickedTemplateId}
            onChange={(e) => setPickedTemplateId(e.target.value)}
          >
            {board.templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!pickedTemplateId || isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoreSubmissionButton;
