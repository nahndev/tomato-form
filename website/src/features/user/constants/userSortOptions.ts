export type UserSortOption = "name-asc" | "name-desc" | "newest" | "oldest";

export const USER_SORT_OPTIONS: { value: UserSortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];
