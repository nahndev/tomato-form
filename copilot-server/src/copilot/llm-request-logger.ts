import { Logger } from "@nestjs/common";

const logger = new Logger("LlmRequest");

function describeBody(body: RequestInit["body"]): string {
  if (typeof body === "string") return body;
  if (body == null) return "";
  return `<${Object.prototype.toString.call(body)}>`;
}

/**
 * `fetch` wrapper that logs every request sent to the LLM (method, url, body)
 * and the response status / latency. The response body is streamed back
 * untouched, so it is never consumed here.
 */
export const loggingFetch: typeof fetch = async (input, init) => {
  const url = input instanceof Request ? input.url : input.toString();
  const method = init?.method ?? (input instanceof Request ? input.method : "GET");
  const startedAt = Date.now();

  logger.log(`--> ${method} ${url}\n${describeBody(init?.body)}`);

  try {
    const response = await fetch(input, init);
    logger.log(`<-- ${response.status} ${method} ${url} (${Date.now() - startedAt}ms)`);
    return response;
  } catch (error) {
    logger.error(
      `<-- FAILED ${method} ${url} (${Date.now() - startedAt}ms)`,
      error instanceof Error ? error.stack : String(error),
    );
    throw error;
  }
};
