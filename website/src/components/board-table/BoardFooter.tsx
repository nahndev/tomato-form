export interface BoardFooterProps {
  render: () => React.ReactNode;
}

export default function BoardFooter({ render }: BoardFooterProps) {
  return (
    <div role="row" className="contents">
      <div role="cell">{render()}</div>
    </div>
  );
}
