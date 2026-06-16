import { create } from "zustand";
import { getSocket } from "@/lib/socket";
import { userApi } from "@/services/user.api";
import type { CreateUserInput, UpdateUserInput, User } from "@/types/user";

interface UserStore {
  users: User[];
  isLoading: boolean;
  isInitialized: boolean;
  init: () => void;
  createUser: (input: CreateUserInput) => Promise<User>;
  updateUser: (uuid: string, input: UpdateUserInput) => Promise<User>;
  deleteUser: (uuid: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  isInitialized: false,

  init: () => {
    if (get().isInitialized) return;
    set({ isInitialized: true, isLoading: true });

    userApi
      .list()
      .then((users) => set({ users, isLoading: false }))
      .catch(() => set({ isLoading: false }));

    getSocket().on("users:updated", (users: User[]) => set({ users }));
  },

  createUser: (input) => userApi.create(input),
  updateUser: (uuid, input) => userApi.update(uuid, input),
  deleteUser: (uuid) => userApi.remove(uuid),
}));
