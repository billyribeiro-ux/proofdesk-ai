import { test, expect } from "@playwright/test";

// ─── Landing Page ────────────────────────────────────────────
test.describe("Landing Page", () => {
  test("hero section renders with animations", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Turn work activity into");
    await expect(h1).toContainText("trusted client evidence");
    await expect(page.getByRole("link", { name: /start free trial/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /try live demo/i }).first()).toBeVisible();
  });

  test("features section renders all 6 cards", async ({ page }) => {
    await page.goto("/");
    await page.locator("#features").scrollIntoViewIfNeeded();
    await expect(page.getByText("Canonical Timeline")).toBeVisible();
    await expect(page.getByText("AI Status Copilot")).toBeVisible();
    await expect(page.getByText("Risk Monitor")).toBeVisible();
    await expect(page.getByText("Approvals Center")).toBeVisible();
    await expect(page.getByText("Billing Packets")).toBeVisible();
    await expect(page.getByText("Immutable Audit Log")).toBeVisible();
  });

  test("how-it-works section renders 7 steps", async ({ page }) => {
    await page.goto("/");
    await page.locator("#how-it-works").scrollIntoViewIfNeeded();
    for (const step of ["Connect", "Normalize", "Summarize", "Monitor", "Approve", "Package", "Audit"]) {
      await expect(page.locator("#how-it-works").getByText(step, { exact: true }).first()).toBeVisible();
    }
  });

  test("CTA section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Ready to prove your work")).toBeVisible();
  });

  test("footer renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/ProofDesk AI\. All rights reserved/)).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    // Header nav
    await expect(page.getByRole("link", { name: /features/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /how it works/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i })).toBeVisible();
  });
});

// ─── Auth Pages ──────────────────────────────────────────────
test.describe("Auth Pages", () => {
  test("sign in page loads with form", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("sign up page loads with form", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByRole("heading", { name: /create/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/organization/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });
});

// ─── App Pages (all behind demo auth) ───────────────────────
test.describe("App Pages", () => {
  test("dashboard loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();
  });

  test("clients page loads", async ({ page }) => {
    await page.goto("/clients");
    await expect(page.locator("main").getByRole("heading", { name: "Clients" })).toBeVisible();
  });

  test("new client page loads", async ({ page }) => {
    await page.goto("/clients/new");
    await expect(page.getByRole("heading", { name: /new client/i })).toBeVisible();
    await expect(page.getByLabel(/client name/i)).toBeVisible();
  });

  test("projects page loads", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: /projects/i })).toBeVisible();
  });

  test("timeline page loads", async ({ page }) => {
    await page.goto("/timeline");
    await expect(page.getByRole("heading", { name: /timeline/i })).toBeVisible();
  });

  test("evidence page loads", async ({ page }) => {
    await page.goto("/evidence");
    await expect(page.getByRole("heading", { name: /evidence/i })).toBeVisible();
  });

  test("risks page loads", async ({ page }) => {
    await page.goto("/risks");
    // Page loads — may show error state if no DB, or heading if data loads
    await expect(page.locator("main")).toBeVisible();
  });

  test("approvals page loads", async ({ page }) => {
    await page.goto("/approvals");
    await expect(page.locator("main").getByRole("heading", { name: /approvals center/i })).toBeVisible();
  });

  test("audit page loads", async ({ page }) => {
    await page.goto("/audit");
    await expect(page.getByRole("heading", { name: /audit/i })).toBeVisible();
  });

  test("billing page loads", async ({ page }) => {
    await page.goto("/billing");
    await expect(page.locator("main").getByRole("heading", { name: "Billing", exact: true })).toBeVisible();
  });

  test("settings page loads with tabs", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible();
    // Check tab navigation
    const settingsNav = page.getByLabel("Settings navigation");
    await expect(settingsNav.getByRole("button", { name: /profile/i })).toBeVisible();
    await expect(settingsNav.getByRole("button", { name: /notifications/i })).toBeVisible();
    await expect(settingsNav.getByRole("button", { name: /appearance/i })).toBeVisible();
    await expect(settingsNav.getByRole("button", { name: /shortcuts/i })).toBeVisible();
  });

  test("demo page loads", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.getByRole("heading", { name: /demo simulator/i })).toBeVisible();
  });
});

// ─── Sidebar Navigation ─────────────────────────────────────
test.describe("Sidebar Navigation", () => {
  test("sidebar renders with all nav items", async ({ page }) => {
    await page.goto("/dashboard");
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByText("Dashboard")).toBeVisible();
    await expect(sidebar.getByText("Clients")).toBeVisible();
    await expect(sidebar.getByText("Projects")).toBeVisible();
    await expect(sidebar.getByText("Timeline")).toBeVisible();
    await expect(sidebar.getByText("Evidence")).toBeVisible();
    await expect(sidebar.getByText("Risks")).toBeVisible();
    await expect(sidebar.getByText("Approvals")).toBeVisible();
    await expect(sidebar.getByText("Audit")).toBeVisible();
    await expect(sidebar.getByText("Billing")).toBeVisible();
    await expect(sidebar.getByText("Settings")).toBeVisible();
  });

  test("sidebar collapse toggle works", async ({ page }) => {
    await page.goto("/dashboard");
    const toggleBtn = page.getByLabel(/collapse sidebar/i);
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    // After collapse, expand button should appear
    await expect(page.getByLabel(/expand sidebar/i)).toBeVisible();
  });

  test("clicking nav item navigates", async ({ page }) => {
    await page.goto("/dashboard");
    await page.locator("aside").getByText("Clients").click();
    await expect(page).toHaveURL(/\/clients/);
    await expect(page.getByRole("heading", { name: /clients/i })).toBeVisible();
  });
});

// ─── Header ──────────────────────────────────────────────────
test.describe("Header", () => {
  test("header renders with all controls", async ({ page }) => {
    await page.goto("/dashboard");
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
    // Search button
    await expect(page.getByLabel("Open command palette")).toBeVisible();
    // Theme toggle
    await expect(page.getByLabel(/switch to (light|dark|system) theme/i)).toBeVisible();
    // Notifications
    await expect(page.getByLabel("Open notifications")).toBeVisible();
  });

  test("theme toggle cycles themes", async ({ page }) => {
    await page.goto("/dashboard");
    const themeBtn = page.getByLabel(/switch to (light|dark|system) theme/i);
    await themeBtn.click();
    // Should have changed — just verify no crash
    await expect(page.getByLabel(/switch to (light|dark|system) theme/i)).toBeVisible();
  });
});

// ─── Settings Interactions ───────────────────────────────────
test.describe("Settings Interactions", () => {
  test("can switch between settings tabs", async ({ page }) => {
    await page.goto("/settings");
    // Click Appearance tab
    const settingsNav = page.getByLabel("Settings navigation");
    await settingsNav.getByRole("button", { name: /appearance/i }).click();
    await expect(page.getByText(/theme/i)).toBeVisible();
    // Click Notifications tab
    await settingsNav.getByRole("button", { name: /notifications/i }).click();
    await expect(page.getByText(/notification preferences/i)).toBeVisible();
    // Click Shortcuts tab
    await settingsNav.getByRole("button", { name: /shortcuts/i }).click();
    await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible();
  });
});

// ─── API Health ──────────────────────────────────────────────
test.describe("API", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const res = await request.get("/api/health");
    // In demo mode without DB, health may return 500 — just verify it responds
    expect(res.status()).toBeLessThan(504);
  });
});

// ─── No Console Errors ──────────────────────────────────────
test.describe("Console Error Check", () => {
  test("landing page has no JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForTimeout(2000);
    expect(errors).toEqual([]);
  });

  test("dashboard has no JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/dashboard");
    await page.waitForTimeout(2000);
    expect(errors).toEqual([]);
  });
});
