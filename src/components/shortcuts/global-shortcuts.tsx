"use client";

import { useRouter } from "next/navigation";
import { useShortcut } from "@/context/shortcut-context";
import { useUI } from "@/context/ui-context";
import { useTheme } from "@/context/theme-context";
import { ROUTES } from "@/lib/constants/app";

export function GlobalShortcuts() {
  const router = useRouter();
  const { setCommandPaletteOpen, setShortcutsHelpOpen, toggleSidebar, setNotificationPanelOpen } = useUI();
  const { theme, setTheme } = useTheme();

  // ── Global ────────────────────────────────────────────
  useShortcut(
    { id: "cmd-k", keys: "Mod+k", label: "Command Palette", description: "Open command palette", scope: "global", category: "Global" },
    () => setCommandPaletteOpen(true)
  );

  useShortcut(
    { id: "shortcuts-help", keys: "?", label: "Shortcuts Help", description: "Show keyboard shortcuts", scope: "global", category: "Global" },
    () => setShortcutsHelpOpen(true)
  );

  useShortcut(
    { id: "toggle-sidebar", keys: "Mod+b", label: "Toggle Sidebar", description: "Expand or collapse the sidebar", scope: "global", category: "Global" },
    () => toggleSidebar()
  );

  useShortcut(
    { id: "toggle-theme", keys: "Mod+Shift+d", label: "Toggle Theme", description: "Switch between light, dark, and system theme", scope: "global", category: "Global" },
    () => {
      const next: Record<string, "light" | "dark" | "system"> = { light: "dark", dark: "system", system: "light" };
      setTheme(next[theme]);
    }
  );

  useShortcut(
    { id: "open-notifications", keys: "Mod+Shift+n", label: "Notifications", description: "Open notification panel", scope: "global", category: "Global" },
    () => setNotificationPanelOpen(true)
  );

  // ── Navigation (g then X) ────────────────────────────
  useShortcut(
    { id: "nav-dashboard", keys: "g then d", label: "Go to Dashboard", description: "Navigate to dashboard", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.DASHBOARD)
  );

  useShortcut(
    { id: "nav-projects", keys: "g then p", label: "Go to Projects", description: "Navigate to projects", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.PROJECTS)
  );

  useShortcut(
    { id: "nav-clients", keys: "g then c", label: "Go to Clients", description: "Navigate to clients", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.CLIENTS)
  );

  useShortcut(
    { id: "nav-timeline", keys: "g then t", label: "Go to Timeline", description: "Navigate to canonical timeline", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.TIMELINE)
  );

  useShortcut(
    { id: "nav-evidence", keys: "g then e", label: "Go to Evidence", description: "Navigate to evidence vault", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.EVIDENCE)
  );

  useShortcut(
    { id: "nav-risks", keys: "g then r", label: "Go to Risks", description: "Navigate to risk monitor", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.RISKS)
  );

  useShortcut(
    { id: "nav-approvals", keys: "g then a", label: "Go to Approvals", description: "Navigate to approvals", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.APPROVALS)
  );

  useShortcut(
    { id: "nav-audit", keys: "g then l", label: "Go to Audit Log", description: "Navigate to audit log", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.AUDIT)
  );

  useShortcut(
    { id: "nav-billing", keys: "g then b", label: "Go to Billing", description: "Navigate to billing", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.BILLING)
  );

  useShortcut(
    { id: "nav-settings", keys: "g then s", label: "Go to Settings", description: "Navigate to settings", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.SETTINGS)
  );

  // ── Actions ───────────────────────────────────────────
  useShortcut(
    { id: "action-new-client", keys: "Mod+Shift+c", label: "New Client", description: "Create a new client", scope: "global", category: "Actions" },
    () => router.push(ROUTES.CLIENTS_NEW)
  );

  useShortcut(
    { id: "action-home", keys: "Mod+Shift+h", label: "Go Home", description: "Navigate to landing page", scope: "global", category: "Actions" },
    () => router.push("/")
  );

  return null;
}
