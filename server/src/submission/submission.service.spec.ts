import { ConflictException } from "@nestjs/common";
import type { SubmissionDisplayService } from "@/display/submission-display.service";
import type { MailService } from "@/mail/mail.service";
import type { SubmissionSearchService } from "@/search/submission-search.service";
import type { UserService } from "@/user/user.service";
import type { PrismaService } from "../database/prisma.service";
import { SubmissionService } from "./submission.service";
import { getMockSubmissionEventRow } from "./testing/submission.factory";

function createMockPrisma() {
  return {
    submission: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    template: {
      findUnique: jest.fn(),
    },
  };
}

function createMockSubmissionSearchService() {
  return { indexSubmission: jest.fn() };
}

function createMockSubmissionDisplayService() {
  return { buildDisplayDoc: jest.fn().mockReturnValue({}) };
}

describe("SubmissionService", () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let submissionSearchService: ReturnType<typeof createMockSubmissionSearchService>;
  let submissionDisplayService: ReturnType<typeof createMockSubmissionDisplayService>;
  let service: SubmissionService;

  beforeEach(() => {
    prisma = createMockPrisma();
    submissionSearchService = createMockSubmissionSearchService();
    submissionDisplayService = createMockSubmissionDisplayService();
    service = new SubmissionService(
      prisma as unknown as PrismaService,
      {} as MailService,
      {} as UserService,
      submissionSearchService as unknown as SubmissionSearchService,
      submissionDisplayService as unknown as SubmissionDisplayService,
    );
  });

  describe("create", () => {
    it("computes dataDisplays from the initial data and the template's widgets", async () => {
      const widgets = { w1: { id: "w1", type: "text", label: "Name" } };
      prisma.template.findUnique.mockResolvedValue({ snapshot: { widgets } });
      submissionDisplayService.buildDisplayDoc.mockReturnValue({ w1: { text: "hello" } });
      prisma.submission.create.mockResolvedValue(getMockSubmissionEventRow());

      await service.create({
        boardId: "b1",
        templateId: "t1",
        data: { w1: "hello" },
      });

      expect(submissionDisplayService.buildDisplayDoc).toHaveBeenCalledWith(
        { data: { w1: "hello" } },
        { widgets },
      );
      expect(prisma.submission.create).toHaveBeenCalledWith({
        data: {
          boardId: "b1",
          templateId: "t1",
          data: { w1: "hello" },
          dataDisplays: { w1: { text: "hello" } },
        },
      });
    });

    it("throws when the template doesn't exist, without creating the submission", async () => {
      prisma.template.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ boardId: "b1", templateId: "missing" }),
      ).rejects.toThrow(ConflictException);

      expect(prisma.submission.create).not.toHaveBeenCalled();
      expect(submissionDisplayService.buildDisplayDoc).not.toHaveBeenCalled();
    });
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
          dataDisplays: {},
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
      expect(submissionDisplayService.buildDisplayDoc).not.toHaveBeenCalled();
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
          dataDisplays: {},
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

    it("indexes the merged data using the template's widgets", async () => {
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

    it("computes dataDisplays from the merged data and the template's widgets", async () => {
      const widgets = { w1: { id: "w1", type: "text", label: "Name" } };
      const row = getMockSubmissionEventRow({ data: {}, dataClocks: {}, snapshot: { widgets } });
      prisma.submission.findUnique.mockResolvedValue(row);
      submissionDisplayService.buildDisplayDoc.mockReturnValue({ w1: { text: "hello" } });

      await service.applyValuesChangedEvent({
        submissionId: "s1",
        values: { w1: { value: "hello", clock: 1 } },
      });

      expect(submissionDisplayService.buildDisplayDoc).toHaveBeenCalledWith(
        { data: { w1: "hello" } },
        { widgets },
      );
      expect(prisma.submission.update).toHaveBeenCalledWith({
        where: { id: "s1" },
        data: {
          data: { w1: "hello" },
          dataClocks: { w1: 1 },
          dataDisplays: { w1: { text: "hello" } },
        },
      });
    });
  });
});
