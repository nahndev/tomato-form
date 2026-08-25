let counter = 0;

/** Unique id for test fixtures — not a real UUID, just needs to be distinct. */
export function mockId(prefix = "id"): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
