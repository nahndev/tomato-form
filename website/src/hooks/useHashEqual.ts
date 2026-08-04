import { useCallback, useEffect, useState } from "react";

export function useHashMatch(hashMatch: string) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isMatch = hashMatch === hash;
  const toggle = useCallback(() => {
    window.location.hash = isMatch ? "" : hashMatch;
  }, [isMatch, hashMatch]);

  return [isMatch, toggle] as const;
}
