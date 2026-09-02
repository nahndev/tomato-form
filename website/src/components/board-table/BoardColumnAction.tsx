export interface BoardColumnActionProps {
  render: () => React.ReactNode;
}

export default function BoardColumnAction({ render }: BoardColumnActionProps) {
  return <div role="columnheader">{render()}</div>;
}
