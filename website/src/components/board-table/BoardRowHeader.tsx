export interface BoardRowHeaderProps<Row> {
  row: Row;
  render: (row: Row) => React.ReactNode;
}

export default function BoardRowHeader<Row>({
  row,
  render,
}: BoardRowHeaderProps<Row>) {
  return <div role="cell">{render(row)}</div>;
}
