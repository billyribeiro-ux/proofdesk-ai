import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_ORG_ID = "demo-org-00000000-0000-0000-0000-000000000000";

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing demo data
  await prisma.organization.deleteMany({ where: { id: DEMO_ORG_ID } });

  // Create demo org
  const org = await prisma.organization.create({
    data: { id: DEMO_ORG_ID, name: "Demo Agency", slug: "demo-agency" },
  });

  // Create demo users
  const passwordHash = await bcrypt.hash("DemoPass123", 12);
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: "demo@proofdesk.ai" }, update: {}, create: { id: "demo-user-001", name: "Demo User", email: "demo@proofdesk.ai", passwordHash } }),
    prisma.user.upsert({ where: { email: "sarah@proofdesk.ai" }, update: {}, create: { name: "Sarah Chen", email: "sarah@proofdesk.ai", passwordHash } }),
    prisma.user.upsert({ where: { email: "mike@proofdesk.ai" }, update: {}, create: { name: "Mike Torres", email: "mike@proofdesk.ai", passwordHash } }),
    prisma.user.upsert({ where: { email: "emily@proofdesk.ai" }, update: {}, create: { name: "Emily Park", email: "emily@proofdesk.ai", passwordHash } }),
  ]);

  // Create memberships
  await Promise.all([
    prisma.membership.create({ data: { userId: users[0].id, organizationId: org.id, role: "OWNER" } }),
    prisma.membership.create({ data: { userId: users[1].id, organizationId: org.id, role: "ADMIN" } }),
    prisma.membership.create({ data: { userId: users[2].id, organizationId: org.id, role: "MANAGER" } }),
    prisma.membership.create({ data: { userId: users[3].id, organizationId: org.id, role: "MANAGER" } }),
  ]);

  // Create subscription
  await prisma.subscription.create({
    data: { organizationId: org.id, plan: "PRO", status: "ACTIVE", currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 86400000) },
  });

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({ data: { organizationId: org.id, name: "Acme Corp", contactName: "Jane Smith", contactEmail: "jane@acme.com", industry: "Technology" } }),
    prisma.client.create({ data: { organizationId: org.id, name: "GlobalTech Inc", contactName: "Bob Johnson", contactEmail: "bob@globaltech.com", industry: "Finance" } }),
    prisma.client.create({ data: { organizationId: org.id, name: "StartupXYZ", contactName: "Alice Williams", contactEmail: "alice@startupxyz.com", industry: "Healthcare" } }),
    prisma.client.create({ data: { organizationId: org.id, name: "MediaFlow", contactName: "Charlie Brown", contactEmail: "charlie@mediaflow.com", industry: "Media" } }),
  ]);

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({ data: { organizationId: org.id, clientId: clients[0].id, name: "Brand Refresh Q4", description: "Complete brand identity refresh", status: "ACTIVE", startDate: new Date("2024-08-01"), dueDate: new Date("2024-12-15"), slaHours: 200, budget: 45000 } }),
    prisma.project.create({ data: { organizationId: org.id, clientId: clients[1].id, name: "Mobile App v2", description: "Second major version of mobile application", status: "ACTIVE", startDate: new Date("2024-07-15"), dueDate: new Date("2024-11-30"), slaHours: 400, budget: 80000 } }),
    prisma.project.create({ data: { organizationId: org.id, clientId: clients[2].id, name: "Website Redesign", description: "Full website redesign with new CMS", status: "ACTIVE", startDate: new Date("2024-09-01"), dueDate: new Date("2025-01-20"), slaHours: 300, budget: 60000 } }),
    prisma.project.create({ data: { organizationId: org.id, clientId: clients[3].id, name: "SEO Campaign", description: "Quarterly SEO optimization campaign", status: "COMPLETED", startDate: new Date("2024-07-01"), dueDate: new Date("2024-09-30"), slaHours: 100, budget: 20000 } }),
  ]);

  // Create work events
  const eventData = [
    { projectId: projects[0].id, source: "figma", eventType: "artifact", title: "Logo concepts v3 uploaded", description: "Three new logo variations", occurredAt: new Date("2024-10-15T14:30:00Z") },
    { projectId: projects[0].id, source: "calendar", eventType: "meeting", title: "Client feedback call completed", description: "45-minute call with stakeholders", occurredAt: new Date("2024-10-15T11:00:00Z") },
    { projectId: projects[1].id, source: "jira", eventType: "milestone", title: "Sprint 4 completed", description: "All sprint 4 stories delivered", occurredAt: new Date("2024-10-14T17:00:00Z") },
    { projectId: projects[1].id, source: "github", eventType: "deployment", title: "API endpoint deployed", description: "Auth API deployed to staging", occurredAt: new Date("2024-10-14T15:30:00Z") },
    { projectId: projects[2].id, source: "email", eventType: "approval", title: "Wireframes approved", description: "Homepage wireframes approved", occurredAt: new Date("2024-10-14T10:00:00Z") },
    { projectId: projects[3].id, source: "manual", eventType: "deliverable", title: "SEO audit report delivered", description: "Comprehensive audit with 47 recommendations", occurredAt: new Date("2024-10-13T16:00:00Z") },
  ];
  await Promise.all(eventData.map((e) => prisma.workEvent.create({ data: { ...e, organizationId: org.id } })));

  // Create evidence artifacts
  await Promise.all([
    prisma.evidenceArtifact.create({ data: { organizationId: org.id, projectId: projects[0].id, type: "design", title: "Logo Concepts v3.fig", uploadedBy: users[1].id } }),
    prisma.evidenceArtifact.create({ data: { organizationId: org.id, projectId: projects[0].id, type: "document", title: "Client Feedback Notes", mimeType: "application/pdf", sizeBytes: 245000, uploadedBy: users[3].id } }),
    prisma.evidenceArtifact.create({ data: { organizationId: org.id, projectId: projects[1].id, type: "report", title: "Sprint 4 Velocity Report", url: "https://jira.example.com/reports/sprint-4", uploadedBy: users[2].id } }),
  ]);

  // Create AI reports
  await prisma.aIReport.create({
    data: { organizationId: org.id, projectId: projects[0].id, variant: "standard", title: "Brand Refresh Q4 — Weekly Summary", summary: "The Brand Refresh Q4 project is progressing well at 65% completion. Key achievements this week include finalization of the color palette and upload of logo concept v3. One medium-severity scope creep risk has been flagged regarding additional collateral requests. Two approval requests are pending client review.", model: "gpt-4", promptVersion: "v1.0" },
  });

  // Create risk flags
  await Promise.all([
    prisma.riskFlag.create({ data: { organizationId: org.id, projectId: projects[0].id, category: "SCOPE_CREEP", severity: "HIGH", title: "Scope creep: additional collateral requested", description: "Client requested 3 additional marketing collateral pieces not in original SOW" } }),
    prisma.riskFlag.create({ data: { organizationId: org.id, projectId: projects[1].id, category: "DEPENDENCY", severity: "CRITICAL", title: "API dependency delayed", description: "Third-party payment API release pushed back 2 weeks" } }),
    prisma.riskFlag.create({ data: { organizationId: org.id, projectId: projects[1].id, category: "BLOCKER", severity: "HIGH", title: "Design review bottleneck", description: "Client stakeholder unavailable for 2 weeks" } }),
    prisma.riskFlag.create({ data: { organizationId: org.id, projectId: projects[2].id, category: "BUDGET_OVERRUN", severity: "MEDIUM", title: "Budget approaching limit", description: "Project at 85% of budget with 35% work remaining" } }),
  ]);

  // Create approval requests
  await Promise.all([
    prisma.approvalRequest.create({ data: { organizationId: org.id, projectId: projects[0].id, title: "Logo concept v3 approval", description: "Review and approve third iteration of logo concepts", requestedBy: users[3].id, dueDate: new Date("2024-10-18") } }),
    prisma.approvalRequest.create({ data: { organizationId: org.id, projectId: projects[0].id, title: "Color palette sign-off", description: "Final approval on color palettes", requestedBy: users[1].id, dueDate: new Date("2024-10-17") } }),
    prisma.approvalRequest.create({ data: { organizationId: org.id, projectId: projects[1].id, title: "Sprint 4 deliverables review", description: "Review all sprint 4 completed stories", requestedBy: users[2].id, dueDate: new Date("2024-10-16") } }),
  ]);

  // Create billing packets
  await prisma.billingPacket.create({
    data: { organizationId: org.id, projectId: projects[0].id, status: "GENERATED", title: "Brand Refresh Q4 — October", periodStart: new Date("2024-10-01"), periodEnd: new Date("2024-10-31"), totalHours: 42.5, totalAmount: 8500, generatedBy: users[0].id, lineItems: [{ description: "Design work", hours: 30, amount: 6000 }, { description: "Strategy", hours: 12.5, amount: 2500 }] },
  });

  // Create demo scenarios
  await Promise.all([
    prisma.demoScenario.create({ data: { name: "Happy Path", type: "HAPPY_PATH", description: "Complete project lifecycle", steps: [{ action: "create_client" }, { action: "create_project" }, { action: "ingest_events" }, { action: "upload_evidence" }, { action: "generate_summary" }, { action: "create_approval" }, { action: "approve" }, { action: "generate_billing" }] } }),
    prisma.demoScenario.create({ data: { name: "Scope Creep", type: "SCOPE_CREEP", description: "Scope creep detection scenario", steps: [{ action: "project_active" }, { action: "client_requests_extra" }, { action: "detect_scope_creep" }, { action: "flag_risk" }, { action: "review_risk" }] } }),
  ]);

  // Create notifications
  await Promise.all([
    prisma.notification.create({ data: { organizationId: org.id, userId: users[0].id, type: "APPROVAL_REQUESTED", title: "New approval request", body: "Logo concept v3 needs your review", href: "/approvals" } }),
    prisma.notification.create({ data: { organizationId: org.id, userId: users[0].id, type: "RISK_FLAGGED", title: "New risk detected", body: "Scope creep flagged on Brand Refresh Q4", href: "/risks" } }),
    prisma.notification.create({ data: { organizationId: org.id, userId: users[0].id, type: "REPORT_GENERATED", title: "AI summary ready", body: "Weekly summary for Brand Refresh Q4 is ready", href: "/projects/p1" } }),
  ]);

  console.log("✅ Seed completed successfully");
  console.log(`   Organization: ${org.name} (${org.id})`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Clients: ${clients.length}`);
  console.log(`   Projects: ${projects.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
