import clsx from "clsx";
import { COLUMN_WIDTH, GRID_COLUMNS } from "./constants";

const ContainerGrid: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={clsx("pointer-events-none absolute inset-0 flex", className)}
    >
      {Array.from({ length: GRID_COLUMNS }).map((_, index) => (
        <div
          key={index}
          className="h-full border-r border-dashed last:border-r-0 border-border/50"
          style={{ width: COLUMN_WIDTH }}
        />
      ))}
    </div>
  );
};

export default ContainerGrid;
