export interface BoardRowContentProps<Row, Column> {
  row: Row;
  column: Column;
  render: (row: Row, column: Column) => React.ReactNode;
}

export default function BoardRowContent<Row, Column>({
  row,
  column,
  render,
}: BoardRowContentProps<Row, Column>) {
  return <>{render(row, column)}</>;
}
