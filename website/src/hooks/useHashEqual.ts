import { useHash } from "react-use";

export function useHashMatch(hashMatch: string) {
  const [hash, setHash] = useHash();
  const isMatch = hashMatch === hash;

  return [isMatch, () => setHash(isMatch ? "" : hashMatch)] as const;
}
