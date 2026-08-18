import type { Principal } from "@/types/principal";

export function getMockPrincipal(overrides?: Partial<Principal>): Principal {
  return {
    sub: "user-1",
    email: "jane.doe@example.com",
    tenantId: "tenant-1",
    name: "Jane Doe",
    roles: ["member"],
    ...overrides,
  };
}
