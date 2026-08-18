import { create } from "zustand";
import { getMockPrincipal } from "@/mocks/principal.mock";
import type { Principal } from "@/types/principal";

interface PrincipalStore {
  principal: Principal | null;
  isInitialized: boolean;
  init: () => void;
}

/**
 * No auth backend exists yet - `init` seeds the store with a mock principal
 * so the rest of the app can already depend on "who's connected" (e.g. yjs
 * awareness). Swap `getMockPrincipal()` for a real session fetch once auth lands.
 */
export const usePrincipalStore = create<PrincipalStore>((set, get) => ({
  principal: null,
  isInitialized: false,

  init: () => {
    if (get().isInitialized) return;
    set({ isInitialized: true, principal: getMockPrincipal() });
  },
}));
