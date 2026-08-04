import { useCallback, useMemo, useState } from "react";

export function useSelection<T, K extends keyof T>(list: T[], key: K) {
  const [selectedKey, setSelectedKey] = useState<T[K] | null>(null);

  const selected = useMemo(
    () => list.find((item) => item[key] === selectedKey) ?? null,
    [list, key, selectedKey],
  );

  const select = useCallback(
    (item: T | null) => setSelectedKey(item ? item[key] : null),
    [key],
  );

  const toggle = useCallback(
    (item: T | null) => {
      if (item && item[key] === selectedKey) {
        setSelectedKey(null);
        return;
      }
      select(item);
    },
    [selectedKey, key],
  );

  const selectKey = useCallback((k: T[K] | null) => setSelectedKey(k), [key]);

  const isSelected = useCallback(
    (item: T) => selected && selected[key] === item[key],
    [selected, key],
  );

  return { selected, isSelected, select, selectKey, toggle } as const;
}
