import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardApi } from "@/services/board.api";
import type { CreateBoardInput, UpdateBoardInput } from "@/types/board";

const BOARDS_KEY = ["boards"] as const;
const boardKey = (id: string) => ["boards", id] as const;

export function useBoards() {
  return useQuery({
    queryKey: BOARDS_KEY,
    queryFn: boardApi.list,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: boardKey(id),
    queryFn: () => boardApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBoardInput) => boardApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useUpdateBoard(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBoardInput) => boardApi.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(boardKey(id), updated);
      qc.invalidateQueries({ queryKey: BOARDS_KEY });
    },
  });
}

export function useDeleteBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => boardApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}
