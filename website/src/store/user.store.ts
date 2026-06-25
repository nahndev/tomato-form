import { create } from "zustand";
import { getSocket } from "@/lib/socket";
import { userApi } from "@/services/user.api";
import type { CreateUserInput, UpdateUserInput, User } from "@/types/user";

interface UserStore {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  isInitialized: boolean;
  init: () => void;
  refetch: () => void;
  createUser: (input: CreateUserInput) => Promise<User>;
  updateUser: (uuid: string, input: UpdateUserInput) => Promise<User>;
  deleteUser: (uuid: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  isError: false,
  isInitialized: false,

  init: () => {
    if (get().isInitialized) return;
    set({ isInitialized: true });
    get().refetch();

    getSocket().on("users:updated", (users: User[]) => set({ users, isError: false }));
  },

  refetch: () => {
    set({ isLoading: true, isError: false });
    userApi
      .list()
      .then((users) => set({ users, isLoading: false }))
      .catch((err) => {
        console.error("Failed to load users:", err);
        set({ isLoading: false, isError: true });
      });
  },

  createUser: (input) => userApi.create(input),
  updateUser: (uuid, input) => userApi.update(uuid, input),
  deleteUser: (uuid) => userApi.remove(uuid),
}));
