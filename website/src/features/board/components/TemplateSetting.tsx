"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useTemplates } from "@/hooks/useTemplates";
import { useUpdateBoard } from "@/hooks/useBoards";
import { Loader2 } from "lucide-react";

const TemplateSetting: React.FC = () => {
  const board = useBoardContext();
  const { data: templates = [], isLoading } = useTemplates();
  const { mutateAsync: updateBoard, isPending } = useUpdateBoard(board.id);

  const [draftTemplateIds, setDraftTemplateIds] = useState<string[]>(
    board.templateIds,
  );

  function toggleDraftTemplate(tid: string) {
    setDraftTemplateIds((prev) =>
      prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid],
    );
  }

  async function handleSave() {
    try {
      await updateBoard({ templateIds: draftTemplateIds });
      toast.success("Templates updated");
    } catch (err) {
      console.error("Failed to update templates:", err);
      toast.error("Failed to update templates");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No templates available yet.
      </p>
    );
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Choose which templates this board can create submissions from.
      </p>

      <div className="flex flex-col gap-1 rounded-md border border-input p-2">
        {templates.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-muted"
          >
            <input
              type="checkbox"
              checked={draftTemplateIds.includes(t.id)}
              onChange={() => toggleDraftTemplate(t.id)}
              className="size-4 rounded border-input"
            />
            {t.name}
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default TemplateSetting;
