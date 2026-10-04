import { Button } from "@/components/ui/button";
import { ButtonIcon } from "@/components/ui/button-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTemplateMode } from "@/features/template/components/provider/TemplateBuilderProvider";
import {
  TOOLBAR_REGISTRY,
  ToolbarDefinition,
  ToolbarType,
} from "@/features/template/constants/toolbar/registry";
import { ToolbarMode, useToolbarModeStore } from "@/store/toolbar-mode.store";
import { TemplateMode } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";
import React, { useState } from "react";

export type ToolbarPanelProps = {};

const ToolbarPanel: React.FC<ToolbarPanelProps> = () => {
  const [type, setType] = useState<ToolbarType>(ToolbarType.Widget);
  const [popupOpen, setPopupOpen] = useState(false);
  const mode = useToolbarModeStore((state) => state.mode);
  const setMode = useToolbarModeStore((state) => state.setMode);
  const templateMode = useTemplateMode();
  const definitions = Object.values(TOOLBAR_REGISTRY).filter(
    (definition) => !definition.editOnly || templateMode === TemplateMode.EDIT,
  );
  const isPopup = mode === ToolbarMode.Popup;

  const toggleMode = () => {
    if (isPopup) {
      setMode(ToolbarMode.Docked);
      setPopupOpen(false);
      return;
    }
    setMode(ToolbarMode.Popup);
    setPopupOpen(true);
  };

  const selectType = (next: ToolbarType) => {
    setType(next);
    if (isPopup) setPopupOpen(true);
  };

  const def = TOOLBAR_REGISTRY[type];

  return (
    <div className={clsx("flex flex-row h-full", !isPopup && "w-[25em]")}>
      <ToolbarPanelWrapper
        label={def.label}
        mode={mode}
        onToggleMode={toggleMode}
        open={popupOpen}
        onOpenChange={setPopupOpen}
      >
        <def.Component />
      </ToolbarPanelWrapper>

      <ToolbarMenuList
        definitions={definitions}
        type={type}
        setType={selectType}
      />
    </div>
  );
};

interface ToolbarPanelWrapperProps {
  label: string;
  mode: ToolbarMode;
  onToggleMode: () => void;
  /** Popup mode only: whether the dialog is open. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
/** Wraps a toolbar menu body with its header: a `Dialog` in popup mode, a docked `div` otherwise. */
const ToolbarPanelWrapper: React.FC<ToolbarPanelWrapperProps> = ({
  label,
  mode,
  onToggleMode,
  open,
  onOpenChange,
  children,
}) => {
  if (mode !== ToolbarMode.Popup) {
    return (
      <div className="grid flex-1 grid-rows-[auto_1fr]">
        <ToolbarHeader label={label} mode={mode} onToggleMode={onToggleMode} />
        {children}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-md flex-col gap-0 overflow-hidden p-0">
        <ToolbarHeader
          label={label}
          mode={mode}
          onToggleMode={onToggleMode}
          className="pr-10"
          asDialogTitle
        />
        <DialogDescription className="sr-only">
          {label} menu in popup mode
        </DialogDescription>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

interface ToolbarHeaderProps {
  label: string;
  mode: ToolbarMode;
  onToggleMode: () => void;
  className?: string;
  asDialogTitle?: boolean;
}
const ToolbarHeader: React.FC<ToolbarHeaderProps> = ({
  label,
  mode,
  onToggleMode,
  className,
  asDialogTitle,
}) => {
  const isPopup = mode === ToolbarMode.Popup;
  const modeLabel = isPopup ? "Dock to sidebar" : "Open in popup";
  const titleClassName =
    "text-xs font-semibold uppercase tracking-wider leading-normal text-muted-foreground";

  return (
    <div
      className={clsx(
        "flex items-center justify-between bg-slate-100 p-2",
        className,
      )}
    >
      {asDialogTitle ? (
        <DialogTitle className={titleClassName}>{label}</DialogTitle>
      ) : (
        <h6 className={titleClassName}>{label}</h6>
      )}
      <ButtonIcon
        icon={isPopup ? TomatoIconKey.PanelRight : TomatoIconKey.AppWindow}
        iconClassName="size-3.5"
        className="size-6"
        title={modeLabel}
        aria-label={modeLabel}
        onClick={onToggleMode}
      />
    </div>
  );
};

interface ToolbarMenuListProps {
  definitions: ToolbarDefinition[];
  type: ToolbarType;
  setType: (active: ToolbarType) => void;
}
const ToolbarMenuList: React.FC<ToolbarMenuListProps> = ({
  definitions,
  type,
  setType,
}) => {
  return (
    <div className="p-2 bg-slate-100 h-full">
      <div className="flex flex-col gap-2">
        {definitions.map((def) => (
          <Button
            key={def.type}
            variant="ghost"
            className={clsx(
              "size-10",
              type === def.type &&
                "bg-slate-500 text-gray-200 hover:bg-slate-700 hover:text-gray-50",
            )}
            onClick={() => setType(def.type)}
          >
            <TomatoIcon icon={def.icon} />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ToolbarPanel;
