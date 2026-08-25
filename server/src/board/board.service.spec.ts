import { BoardService } from "./board.service";
import { getMockBoard, getMockBoardColumn } from "./testing/board.factory";
import type { PrismaService } from "../database/prisma.service";

function createMockPrisma() {
  return {
    board: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe("BoardService", () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: BoardService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new BoardService(prisma as unknown as PrismaService);
  });

  describe("create", () => {
    it("defaults columns to an empty array when none are provided", async () => {
      const board = getMockBoard();
      prisma.board.create.mockResolvedValue(board);

      await service.create({ name: "Feedback" });

      expect(prisma.board.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ columns: [] }),
        }),
      );
    });

    it("passes the given columns through to Prisma", async () => {
      const board = getMockBoard();
      prisma.board.create.mockResolvedValue(board);
      const column = getMockBoardColumn();

      await service.create({ name: "Feedback", columns: [column as never] });

      expect(prisma.board.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ columns: [column] }),
        }),
      );
    });

    it("includes linked templates and their versions", async () => {
      const board = getMockBoard();
      prisma.board.create.mockResolvedValue(board);

      await service.create({ name: "Feedback" });

      expect(prisma.board.create).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { templates: { include: { templateVersions: true } } },
        }),
      );
    });
  });

  describe("update", () => {
    it("omits columns from the update payload when not provided", async () => {
      const board = getMockBoard();
      prisma.board.update.mockResolvedValue(board);

      await service.update(board.id, { name: "Renamed" });

      const { data } = prisma.board.update.mock.calls[0][0];
      expect(data).not.toHaveProperty("columns");
    });

    it("includes columns in the update payload when provided", async () => {
      const board = getMockBoard();
      prisma.board.update.mockResolvedValue(board);
      const column = getMockBoardColumn();

      await service.update(board.id, { columns: [column as never] });

      expect(prisma.board.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ columns: [column] }),
        }),
      );
    });
  });
});
