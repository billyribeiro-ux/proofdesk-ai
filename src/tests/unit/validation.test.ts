import { describe, it, expect } from "vitest";
import {
  signUpSchema,
  signInSchema,
  createClientSchema,
  createProjectSchema,
  createRiskSchema,
  approvalDecisionSchema,
  createBillingPacketSchema,
} from "@/lib/validation/schemas";

describe("signUpSchema", () => {
  it("validates a correct signup payload", () => {
    const result = signUpSchema.safeParse({
      name: "Jane Smith",
      email: "jane@acme.com",
      password: "SecurePass1",
      orgName: "Acme Agency",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short password", () => {
    const result = signUpSchema.safeParse({
      name: "Jane",
      email: "jane@acme.com",
      password: "short",
      orgName: "Acme",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = signUpSchema.safeParse({
      name: "Jane",
      email: "jane@acme.com",
      password: "alllowercase1",
      orgName: "Acme",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      password: "SecurePass1",
      orgName: "Acme",
    });
    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("validates correct signin", () => {
    const result = signInSchema.safeParse({
      email: "jane@acme.com",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({
      email: "jane@acme.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("createClientSchema", () => {
  it("validates minimal client", () => {
    const result = createClientSchema.safeParse({ name: "Acme Corp" });
    expect(result.success).toBe(true);
  });

  it("validates full client", () => {
    const result = createClientSchema.safeParse({
      name: "Acme Corp",
      contactName: "Jane",
      contactEmail: "jane@acme.com",
      industry: "Tech",
      notes: "Important client",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createClientSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});

describe("createProjectSchema", () => {
  it("validates minimal project", () => {
    const result = createProjectSchema.safeParse({
      clientId: "c1",
      name: "Brand Refresh",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing clientId", () => {
    const result = createProjectSchema.safeParse({ name: "Brand Refresh" });
    expect(result.success).toBe(false);
  });
});

describe("createRiskSchema", () => {
  it("validates a risk flag", () => {
    const result = createRiskSchema.safeParse({
      projectId: "p1",
      category: "SCOPE_CREEP",
      severity: "HIGH",
      title: "Scope creep detected",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category", () => {
    const result = createRiskSchema.safeParse({
      projectId: "p1",
      category: "INVALID",
      severity: "HIGH",
      title: "Test",
    });
    expect(result.success).toBe(false);
  });
});

describe("approvalDecisionSchema", () => {
  it("validates approval", () => {
    const result = approvalDecisionSchema.safeParse({
      decision: "APPROVED",
      comment: "Looks good",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid decision", () => {
    const result = approvalDecisionSchema.safeParse({
      decision: "MAYBE",
    });
    expect(result.success).toBe(false);
  });
});

describe("createBillingPacketSchema", () => {
  it("validates billing packet", () => {
    const result = createBillingPacketSchema.safeParse({
      projectId: "p1",
      title: "October Billing",
      periodStart: "2024-10-01T00:00:00Z",
      periodEnd: "2024-10-31T23:59:59Z",
      totalHours: 42.5,
      totalAmount: 8500,
    });
    expect(result.success).toBe(true);
  });
});
