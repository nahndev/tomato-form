export type DocumentSortOption = "name-asc" | "name-desc" | "newest" | "oldest";

export const DOCUMENT_SORT_OPTIONS: { value: DocumentSortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];
