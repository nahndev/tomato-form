import { Typography } from "@/components/ui/typography";
import { PropsWithClassName } from "@/types/utils";
import clsx from "clsx";

export type SessionCardProps = PropsWithClassName<{ title: string }>;

const SessionCard: React.FC<SessionCardProps> = ({ title, children }) => {
  return (
    <div
      className={clsx(
        "flex flex-col",
        "border-2 -m-0.5 border-slate-100 rounded-lg overflow-hidden",
      )}
    >
      <div
        className={clsx(
          "bg-slate-50",
          "h-10 p-2 flex items-center",
          "border-b-2 border-slate-100",
        )}
      >
        <Typography className="uppercase font-semibold text-xs">
          {title}
        </Typography>
      </div>
      {children}
    </div>
  );
};

export default SessionCard;
