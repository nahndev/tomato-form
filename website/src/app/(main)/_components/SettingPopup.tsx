"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SETTING_HASH, SettingContent } from "@/features/setting";
import { useHashMatch } from "@/hooks/useHashEqual";
import clsx from "clsx";
import { Settings2Icon } from "lucide-react";

export function SettingPopup() {
  const [isMatch, toggle] = useHashMatch(SETTING_HASH);
  return (
    <>
      <div
        className={clsx(
          "cursor-pointer",
          "flex flex-row gap-2 items-center p-2",
          "hover:bg-accent",
        )}
        onClick={toggle}
      >
        <Settings2Icon className="size-4" />
        Setting
      </div>
      <Dialog open={isMatch} onOpenChange={toggle}>
        <DialogContent className="min-w-min">
          <SettingContent />
        </DialogContent>
      </Dialog>
    </>
  );
}
