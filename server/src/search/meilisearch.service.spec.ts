import type { EnvironmentVariables } from "@/config/env.schema";
import type { ConfigService } from "@nestjs/config";
import { MeilisearchService } from "./meilisearch.service";

function getService(): MeilisearchService {
  const configService = {
    get: (key: string) =>
      key === "MEILISEARCH_URL" ? "http://localhost:7700" : "test-key",
  } as unknown as ConfigService<EnvironmentVariables, true>;
  return new MeilisearchService(configService);
}

describe("MeilisearchService", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("posts the document to the submissions index with the api key", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;
    const service = getService();

    await service.indexSubmission({ id: "s1", tags: ["w1:a"], date: [], text: [] });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:7700/indexes/submissions/documents",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
        body: JSON.stringify([{ id: "s1", tags: ["w1:a"], date: [], text: [] }]),
      }),
    );
  });

  it("logs without throwing when the request fails", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("server error"),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const service = getService();

    await expect(
      service.indexSubmission({ id: "s1", tags: [], date: [], text: [] }),
    ).resolves.toBeUndefined();
  });
});
