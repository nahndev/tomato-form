export interface BoardColumnHeaderProps<Column> {
  column: Column;
  render: (column: Column) => React.ReactNode;
}

export default function BoardColumnHeader<Column>({
  column,
  render,
}: BoardColumnHeaderProps<Column>) {
  return <div role="columnheader">{render(column)}</div>;
}
