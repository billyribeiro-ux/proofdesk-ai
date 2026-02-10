export const queryKeys = {
  auth: {
    session: () => ["auth", "session"] as const,
  },
  org: {
    current: () => ["org", "current"] as const,
    members: () => ["org", "members"] as const,
    invitations: () => ["org", "invitations"] as const,
  },
  clients: {
    all: ["clients"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["clients", "list", filters] as const,
    detail: (id: string) => ["clients", "detail", id] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["projects", "list", filters] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
  },
  timeline: {
    all: ["timeline"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["timeline", "list", filters] as const,
  },
  evidence: {
    all: ["evidence"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["evidence", "list", filters] as const,
  },
  reports: {
    all: ["reports"] as const,
    list: (projectId?: string) =>
      ["reports", "list", projectId] as const,
  },
  risks: {
    all: ["risks"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["risks", "list", filters] as const,
  },
  approvals: {
    all: ["approvals"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["approvals", "list", filters] as const,
    detail: (id: string) => ["approvals", "detail", id] as const,
  },
  billing: {
    all: ["billing"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["billing", "list", filters] as const,
    subscription: () => ["billing", "subscription"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: () => ["notifications", "list"] as const,
    unread: () => ["notifications", "unread"] as const,
  },
  audit: {
    all: ["audit"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["audit", "list", filters] as const,
  },
  demo: {
    scenarios: () => ["demo", "scenarios"] as const,
    runs: () => ["demo", "runs"] as const,
    currentRun: (runId: string) => ["demo", "run", runId] as const,
  },
} as const;
