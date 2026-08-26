import { useCallback, useMemo, useState } from "react";

export function useMultiSelect<T>(items: T[], getId: (item: T) => string) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (item: T) => selectedIds.has(getId(item)),
    [selectedIds, getId],
  );

  const toggle = useCallback(
    (item: T) => {
      const id = getId(item);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [getId],
  );

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allSelected = items.length > 0 && items.every((item) => prev.has(getId(item)));
      return allSelected ? new Set() : new Set(items.map(getId));
    });
  }, [items, getId]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);

  return {
    selectedIds,
    setSelectedIds,
    isSelected,
    toggle,
    toggleAll,
    clear,
    selectedCount,
  } as const;
}
