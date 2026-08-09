import { useCallback } from "react";

export function useToggleProperty<T>(
  state: T | undefined,
  callback: (value: T) => void,
  trueValue: T,
  falseValue: T,
) {
  const on = state === trueValue;

  const toggle = useCallback(() => {
    callback(on ? falseValue : trueValue);
  }, [callback, on, trueValue, falseValue]);

  return [on, toggle] as const;
}
