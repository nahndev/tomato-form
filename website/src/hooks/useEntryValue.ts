import { useState } from "react";

export function useEntryValue<K, V>() {
  const [key, setKey] = useState<K | null>();
  const [value, setValue] = useState<V | null>();

  const setEntry = (key: K, value: V | null = null) => {
    setKey(key);
    setValue(value);
  };
  return [key, value, setEntry] as const;
}
