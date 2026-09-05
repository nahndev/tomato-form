import { PropsWithClassName } from "@/types/utils";
import clsx from "clsx";

export type ZebraCellProps = PropsWithClassName<{ index?: number }>;

/** Row cell shared by BoardSettingLabel and BoardSettingColumn; stripes when `index` is odd. Padding/gap/width are supplied via `className`. */
const ZebraCell: React.FC<ZebraCellProps> = ({
  index = 0,
  className,
  children,
}) => (
  <div
    role="cell"
    className={clsx(
      "h-16 flex items-center transition-colors",
      index % 2 === 1 && "bg-muted/30",
      className,
    )}
  >
    {children}
  </div>
);

export { ZebraCell };
