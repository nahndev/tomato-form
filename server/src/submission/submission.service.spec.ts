import type { MailService } from "@/mail/mail.service";
import type { SubmissionSearchService } from "@/search/submission-search.service";
import type { UserService } from "@/user/user.service";
import type { PrismaService } from "../database/prisma.service";
import { SubmissionService } from "./submission.service";
import { getMockSubmissionEventRow } from "./testing/submission.factory";

function createMockPrisma() {
  return {
    submission: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
}

function createMockSubmissionSearchService() {
  return { indexSubmission: jest.fn() };
}

describe("SubmissionService", () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let submissionSearchService: ReturnType<typeof createMockSubmissionSearchService>;
  let service: SubmissionService;

  beforeEach(() => {
    prisma = createMockPrisma();
    submissionSearchService = createMockSubmissionSearchService();
    service = new SubmissionService(
      prisma as unknown as PrismaService,
      {} as MailService,
      {} as UserService,
      submissionSearchService as unknown as SubmissionSearchService,
    );
  });

  describe("applyValuesChangedEvent", () => {
    it("applies a value when the key has no prior clock", async () => {
      const row = getMockSubmissionEventRow({ data: {}, dataClocks: {} });
      prisma.submission.findUnique.mockResolvedValue(row);

      await service.applyValuesChangedEvent({
        submissionId: "s1",
        values: { w1: { value: "hello", clock: 1 } },
      });

      expect(prisma.submission.update).toHaveBeenCalledWith({
        where: { id: "s1" },
        data: {
          data: { w1: "hello" },
          dataClocks: { w1: 1 },
        },
      });
    });

    it("drops a stale, out-of-order value whose clock isn't newer", async () => {
      const row = getMockSubmissionEventRow({
        data: { w1: "second" },
        dataClocks: { w1: 5 },
      });
      prisma.submission.findUnique.mockResolvedValue(row);

      await service.applyValuesChangedEvent({
        submissionId: "s1",
        values: { w1: { value: "first", clock: 2 } },
      });

      expect(prisma.submission.update).not.toHaveBeenCalled();
      expect(submissionSearchService.indexSubmission).not.toHaveBeenCalled();
    });

    it("merges only the keys with a newer clock, leaving others untouched", async () => {
      const row = getMockSubmissionEventRow({
        data: { w1: "old", w2: "keep-me" },
        dataClocks: { w1: 1, w2: 9 },
      });
      prisma.submission.findUnique.mockResolvedValue(row);

      await service.applyValuesChangedEvent({
        submissionId: "s1",
        values: {
          w1: { value: "new", clock: 2 },
          w2: { value: "stale", clock: 3 },
        },
      });

      expect(prisma.submission.update).toHaveBeenCalledWith({
        where: { id: "s1" },
        data: {
          data: { w1: "new", w2: "keep-me" },
          dataClocks: { w1: 2, w2: 9 },
        },
      });
    });

    it("does nothing when the submission no longer exists", async () => {
      prisma.submission.findUnique.mockResolvedValue(null);

      await service.applyValuesChangedEvent({
        submissionId: "missing",
        values: { w1: { value: "hello", clock: 1 } },
      });

      expect(prisma.submission.update).not.toHaveBeenCalled();
      expect(submissionSearchService.indexSubmission).not.toHaveBeenCalled();
    });

    it("indexes the merged data using the template version's widgets", async () => {
      const row = getMockSubmissionEventRow({
        data: {},
        dataClocks: {},
        snapshot: { widgets: { w1: { id: "w1", type: "text", label: "Name" } } },
      });
      prisma.submission.findUnique.mockResolvedValue(row);

      await service.applyValuesChangedEvent({
        submissionId: "s1",
        values: { w1: { value: "hello", clock: 1 } },
      });

      expect(submissionSearchService.indexSubmission).toHaveBeenCalledWith(
        "s1",
        { w1: "hello" },
        { w1: { id: "w1", type: "text", label: "Name" } },
      );
    });
  });
});
