interface BoardIdLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function BoardIdLayout({ children, modal }: BoardIdLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
