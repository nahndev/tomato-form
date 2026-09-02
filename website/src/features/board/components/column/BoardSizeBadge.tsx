export interface BoardSizeBadgeProps {
  size: number | null;
}

const BoardSizeBadge: React.FC<BoardSizeBadgeProps> = ({ size }) => {
  if (size === null) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
      {size}px
    </span>
  );
};

export default BoardSizeBadge;
