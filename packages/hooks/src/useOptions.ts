import { useCallback, useState } from "react";

export interface UseOptionsResult<T> {
  list: T[];
  selected: T | null;
  toggle: (value: T) => void;
}

export function useOptions<T>(list: T[], initial: T | null = null): UseOptionsResult<T> {
  const [selected, setSelected] = useState<T | null>(initial);

  const toggle = useCallback((value: T) => {
    setSelected((prev) => (prev === value ? null : value));
  }, []);

  return { list, selected, toggle };
}
