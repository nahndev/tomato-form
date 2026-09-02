import * as React from "react";

export interface BoardContentProps {
  children: React.ReactNode;
}

export default function BoardContent({ children }: BoardContentProps) {
  return <div className="contents">{children}</div>;
}
