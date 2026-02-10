"use client";

import { useRouter } from "next/navigation";
import { useShortcut } from "@/context/shortcut-context";
import { useUI } from "@/context/ui-context";
import { ROUTES } from "@/lib/constants/app";

export function GlobalShortcuts() {
  const router = useRouter();
  const { setCommandPaletteOpen, setShortcutsHelpOpen } = useUI();

  useShortcut(
    { id: "cmd-k", keys: "Mod+k", label: "Command Palette", description: "Open command palette", scope: "global", category: "Global" },
    () => setCommandPaletteOpen(true)
  );

  useShortcut(
    { id: "shortcuts-help", keys: "?", label: "Shortcuts Help", description: "Show keyboard shortcuts", scope: "global", category: "Global" },
    () => setShortcutsHelpOpen(true)
  );

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
    { id: "nav-risks", keys: "g then r", label: "Go to Risks", description: "Navigate to risk monitor", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.RISKS)
  );

  useShortcut(
    { id: "nav-approvals", keys: "g then a", label: "Go to Approvals", description: "Navigate to approvals", scope: "global", category: "Navigation" },
    () => router.push(ROUTES.APPROVALS)
  );

  return null;
}
