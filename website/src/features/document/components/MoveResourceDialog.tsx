"use client";

import { useState } from "react";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMoveResource, useResources } from "@/features/document/hooks/useDocuments";
import type { ResourceItem } from "@/types/document";

interface Crumb {
  id: string | null;
  name: string;
}

interface MoveResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: ResourceItem | null;
  currentParentId: string | null;
}

const ROOT_CRUMB: Crumb = { id: null, name: "Root" };

const MoveResourceDialog: React.FC<MoveResourceDialogProps> = ({
  open,
  onOpenChange,
  resource,
  currentParentId,
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([ROOT_CRUMB]);
  const destination = breadcrumbs[breadcrumbs.length - 1];

  const { data: folders = [], isLoading } = useResources(destination.id, "FOLDER");
  const { mutateAsync: moveResource, isPending } = useMoveResource(currentParentId);

  function openFolder(folder: ResourceItem) {
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
  }

  function goToCrumb(index: number) {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }

  function handleClose(v: boolean) {
    onOpenChange(v);
    if (!v) setBreadcrumbs([ROOT_CRUMB]);
  }

  async function handleMoveHere() {
    if (!resource) return;
    try {
      await moveResource({ id: resource.id, destinationId: destination.id });
      toast.success(`Moved "${resource.name}"`);
      handleClose(false);
    } catch (err) {
      console.error("Failed to move resource:", err);
      toast.error("Failed to move resource");
    }
  }

  const noopMove = !resource || destination.id === resource.parentId || destination.id === resource.id;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move {resource?.name}</DialogTitle>
          <DialogDescription>Choose a destination folder.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id ?? "root"} className="flex items-center gap-1">
              {index > 0 && <span>/</span>}
              <button
                type="button"
                className="hover:text-foreground hover:underline disabled:pointer-events-none disabled:text-foreground"
                disabled={index === breadcrumbs.length - 1}
                onClick={() => goToCrumb(index)}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>

        <div className="max-h-64 overflow-y-auto rounded-lg border">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <TomatoIcon icon={TomatoIconKey.Loader} className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : folders.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No subfolders here</p>
          ) : (
            <ul>
              {folders.map((folder) => {
                const disabled = resource?.type === "FOLDER" && folder.id === resource.id;
                return (
                  <li key={folder.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => openFolder(folder)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
                    >
                      <TomatoIcon icon={TomatoIconKey.Folder} className="size-4 text-muted-foreground" />
                      {folder.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={noopMove || isPending} onClick={handleMoveHere}>
            {isPending ? "Moving…" : `Move here`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveResourceDialog;
