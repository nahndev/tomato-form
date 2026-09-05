import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/types/utils";

const SessionWrapper: React.FC<PropsWithClassName> = ({ children }) => (
  <div className={cn("flex flex-col")}>
    <div className="h-10"></div>
    {children}
  </div>
);

export { SessionWrapper };
