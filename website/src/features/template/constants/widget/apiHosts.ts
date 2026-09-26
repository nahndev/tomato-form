export interface ApiCallHost {
  id: string;
  label: string;
  baseUrl: string;
}

/**
 * Stand-in for a real settings/host-management feature, which doesn't exist
 * yet (see `docs/v1.1.0/add-widget-api-call.md`). `HostSelect` reads from
 * this hardcoded list until hosts become a configurable, per-enterprise
 * resource.
 */
export const API_CALL_HOSTS: ApiCallHost[] = [
  { id: "staging", label: "Staging", baseUrl: "https://staging.api.example.com" },
  { id: "production", label: "Production", baseUrl: "https://api.example.com" },
];
