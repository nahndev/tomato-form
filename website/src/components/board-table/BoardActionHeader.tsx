import * as React from "react";

export interface BoardActionHeaderProps {
  children: React.ReactNode;
}

export default function BoardActionHeader({ children }: BoardActionHeaderProps) {
  return (
    <div role="columnheader" className="flex items-center">
      {children}
    </div>
  );
}
