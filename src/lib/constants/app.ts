export const APP_NAME = "ProofDesk AI";
export const APP_DESCRIPTION =
  "AI Governance & Client Proof-of-Work platform for agencies and consultancies.";

export const APP_MODE = (process.env.NEXT_PUBLIC_APP_MODE ??
  process.env.APP_MODE ??
  "production") as "production" | "demo";

export const IS_DEMO = APP_MODE === "demo";
export const IS_PRODUCTION = APP_MODE === "production";

export const DEMO_TENANT_ID =
  process.env.DEMO_TENANT_ID ??
  "demo-org-00000000-0000-0000-0000-000000000000";

export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CLIENT_VIEWER: "CLIENT_VIEWER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 100,
  ADMIN: 80,
  MANAGER: 60,
  CLIENT_VIEWER: 20,
};

export const PLAN_LIMITS = {
  FREE: { projects: 3, members: 2, clients: 3, storage: 100_000_000 },
  STARTER: { projects: 15, members: 10, clients: 15, storage: 1_000_000_000 },
  PRO: { projects: 100, members: 50, clients: 100, storage: 10_000_000_000 },
  ENTERPRISE: {
    projects: Infinity,
    members: Infinity,
    clients: Infinity,
    storage: Infinity,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth/signin",
  SIGN_UP: "/auth/signup",
  DASHBOARD: "/dashboard",
  CLIENTS: "/clients",
  CLIENTS_NEW: "/clients/new",
  PROJECTS: "/projects",
  TIMELINE: "/timeline",
  EVIDENCE: "/evidence",
  RISKS: "/risks",
  APPROVALS: "/approvals",
  AUDIT: "/audit",
  BILLING: "/billing",
  SETTINGS: "/settings",
  DEMO: "/demo",
  MOTION_SHOWCASE: "/motion-showcase",
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, shortcut: "G then D" },
  { label: "Projects", href: ROUTES.PROJECTS, shortcut: "G then P" },
  { label: "Clients", href: ROUTES.CLIENTS, shortcut: "G then C" },
  { label: "Timeline", href: ROUTES.TIMELINE, shortcut: "" },
  { label: "Evidence", href: ROUTES.EVIDENCE, shortcut: "" },
  { label: "Risks", href: ROUTES.RISKS, shortcut: "G then R" },
  { label: "Approvals", href: ROUTES.APPROVALS, shortcut: "G then A" },
  { label: "Audit", href: ROUTES.AUDIT, shortcut: "" },
  { label: "Billing", href: ROUTES.BILLING, shortcut: "" },
  { label: "Settings", href: ROUTES.SETTINGS, shortcut: "" },
] as const;
