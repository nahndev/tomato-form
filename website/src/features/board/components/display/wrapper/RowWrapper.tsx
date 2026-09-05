import { PropsWithClassName } from "@/types/utils";
import clsx from "clsx";

/** Shared column layout used by BoardSettingLabel and BoardSettingColumn to keep rows aligned. */
const RowWrapper: React.FC<PropsWithClassName> = ({ className, children }) => (
  <div role="row" className={clsx("flex flex-col gap-4", className)}>
    {children}
  </div>
);

export { RowWrapper };
