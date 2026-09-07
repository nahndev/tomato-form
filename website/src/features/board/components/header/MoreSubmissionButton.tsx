"use client";

import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useCreateSubmission } from "@/features/board/hooks/useSubmissions";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

const MoreSubmissionButton: React.FC = () => {
  const board = useBoardContext();
  const { mutateAsync: createSubmission, isPending } = useCreateSubmission();

  const [open, setOpen] = useState(false);
  const [pickedTemplateVersionId, setPickedTemplateVersionId] = useState("");

  const templateVersions = board.templateVersions ?? [];

  function openDialog() {
    setPickedTemplateVersionId(templateVersions[0]?.id ?? "");
    setOpen(true);
  }

  async function handleCreate() {
    if (!pickedTemplateVersionId) return;
    try {
      await createSubmission({
        boardId: board.id,
        templateVersionId: pickedTemplateVersionId,
      });
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
          disabled={templateVersions.length === 0}
        >
          <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
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
            value={pickedTemplateVersionId}
            onValueChange={setPickedTemplateVersionId}
          >
            <SelectTrigger id="submission-template">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateVersions.map((tv) => (
                <SelectItem key={tv.id} value={tv.id}>
                  {tv.template?.name ?? tv.templateId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!pickedTemplateVersionId || isPending}
          >
            {isPending ? (
              <TomatoIcon icon={TomatoIconKey.Loader} className="size-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoreSubmissionButton;
