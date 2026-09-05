import { FlexRow } from "@/components/ui/flex-row";
import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget";
import { DisplayType } from "@/types/display-type";
import { ComponentProps } from "@/types/utils";
import clsx from "clsx";

export type BoardColumnBoxProps = ComponentProps<{
  type: DisplayType;
}>;

const BoardColumnBox: React.FC<BoardColumnBoxProps> = ({ type, children }) => {
  const { label, icon, color } = DISPLAY_TYPE_REGISTRY[type];

  return (
    <div className={clsx("relative size-full")}>
      <FlexRow>{children}</FlexRow>
      <div className="absolute top-0 -z-10 w-full h-screen bg-slate-200 opacity-20" />
    </div>
  );
};

export default BoardColumnBox;
