export interface BoardRowActionProps<Row, Column> {
  row: Row;
  column: Column;
  render: (row: Row, column: Column) => React.ReactNode;
}

export default function BoardRowAction<Row, Column>({
  row,
  column,
  render,
}: BoardRowActionProps<Row, Column>) {
  return <>{render(row, column)}</>;
}
