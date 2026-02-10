import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────────

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Organization ────────────────────────────────────────────

export const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "CLIENT_VIEWER"]),
});

// ─── Client ──────────────────────────────────────────────────

export const createClientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(200),
  contactName: z.string().max(200).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  industry: z.string().max(100).optional(),
  notes: z.string().max(5000).optional(),
});

export const updateClientSchema = createClientSchema.partial();

// ─── Project ─────────────────────────────────────────────────

export const createProjectSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  name: z.string().min(1, "Project name is required").max(200),
  description: z.string().max(5000).optional(),
  status: z
    .enum(["DRAFT", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"])
    .default("DRAFT"),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  slaHours: z.number().int().positive().optional(),
  budget: z.number().positive().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ─── Work Event ──────────────────────────────────────────────

export const createWorkEventSchema = z.object({
  projectId: z.string().min(1),
  source: z.string().min(1).max(50),
  sourceId: z.string().optional(),
  eventType: z.string().min(1).max(50),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  occurredAt: z.string().datetime(),
});

// ─── Evidence Artifact ───────────────────────────────────────

export const createEvidenceSchema = z.object({
  projectId: z.string().min(1),
  type: z.string().min(1).max(50),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  url: z.string().url().optional(),
  fileKey: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().positive().optional(),
  hash: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ─── AI Report ───────────────────────────────────────────────

export const generateReportSchema = z.object({
  projectId: z.string().min(1),
  variant: z.enum(["standard", "strict", "executive"]).default("standard"),
});

// ─── Risk Flag ───────────────────────────────────────────────

export const createRiskSchema = z.object({
  projectId: z.string().min(1),
  category: z.enum([
    "SCOPE_CREEP",
    "DELIVERY_DELAY",
    "BLOCKER",
    "BUDGET_OVERRUN",
    "QUALITY",
    "DEPENDENCY",
  ]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const resolveRiskSchema = z.object({
  resolvedBy: z.string().min(1),
});

// ─── Approval ────────────────────────────────────────────────

export const createApprovalSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const approvalDecisionSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
  comment: z.string().max(5000).optional(),
});

// ─── Billing Packet ──────────────────────────────────────────

export const createBillingPacketSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1).max(500),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  totalHours: z.number().positive().optional(),
  totalAmount: z.number().positive().optional(),
  lineItems: z
    .array(
      z.object({
        description: z.string(),
        hours: z.number().optional(),
        amount: z.number(),
      })
    )
    .optional(),
  evidenceIds: z.array(z.string()).optional(),
});

// ─── Notification Preferences ────────────────────────────────

export const notificationPrefsSchema = z.object({
  emailApprovals: z.boolean(),
  emailRisks: z.boolean(),
  emailReports: z.boolean(),
  emailBilling: z.boolean(),
  inAppAll: z.boolean(),
});

// ─── Settings ────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  image: z.string().url().optional().or(z.literal("")),
});

export const updateThemeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

// ─── Type exports ────────────────────────────────────────────

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateWorkEventInput = z.infer<typeof createWorkEventSchema>;
export type CreateEvidenceInput = z.infer<typeof createEvidenceSchema>;
export type GenerateReportInput = z.infer<typeof generateReportSchema>;
export type CreateRiskInput = z.infer<typeof createRiskSchema>;
export type ResolveRiskInput = z.infer<typeof resolveRiskSchema>;
export type CreateApprovalInput = z.infer<typeof createApprovalSchema>;
export type ApprovalDecisionInput = z.infer<typeof approvalDecisionSchema>;
export type CreateBillingPacketInput = z.infer<
  typeof createBillingPacketSchema
>;
export type NotificationPrefsInput = z.infer<typeof notificationPrefsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
