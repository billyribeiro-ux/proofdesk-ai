"use client";

import { Bell, Search, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useUI } from "@/context/ui-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { setCommandPaletteOpen, setNotificationPanelOpen } = useUI();
  const { user, org, isDemo } = useAuth();

  const themeIcons = { light: Sun, dark: Moon, system: Monitor };
  const nextTheme: Record<string, "light" | "dark" | "system"> = {
    light: "dark",
    dark: "system",
    system: "light",
  };
  const ThemeIcon = themeIcons[theme];

  return (
    <header
      className="sticky top-0 z-30 flex h-[var(--header-height)] items-center justify-between border-b border-border/60 px-4 sm:px-6 glass"
      role="banner"
    >
      <div className="flex items-center gap-3">
        {org && (
          <span className="text-sm font-medium text-text">
            {org.name}
          </span>
        )}
        {isDemo && (
          <span className="inline-flex items-center rounded-full bg-secondary/10 border border-secondary/20 px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
            Demo
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            "hidden sm:flex items-center gap-2 rounded-[var(--radius-lg)] border border-border/60 bg-bg-subtle/50 px-3 py-1.5 text-sm text-text-muted",
            "hover:bg-bg-subtle hover:border-border transition-all duration-150"
          )}
          aria-label="Open command palette"
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-[13px]">Search...</span>
          <kbd className="ml-6 rounded-[var(--radius-sm)] border border-border/50 bg-bg px-1.5 py-0.5 text-[10px] font-mono text-text-muted/70">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setTheme(nextTheme[theme])}
          className="rounded-[var(--radius-lg)] p-2 text-text-muted hover:bg-bg-subtle hover:text-text transition-all duration-150"
          aria-label={`Switch to ${nextTheme[theme]} theme`}
        >
          <ThemeIcon className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          onClick={() => setNotificationPanelOpen(true)}
          className="relative rounded-[var(--radius-lg)] p-2 text-text-muted hover:bg-bg-subtle hover:text-text transition-all duration-150"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-bg-elevated" aria-hidden="true" />
        </button>

        <div className="mx-1 h-5 w-px bg-border/50" />

        {user && (
          <button className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2 py-1.5 transition-all duration-150 hover:bg-bg-subtle">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-semibold text-white shadow-[var(--shadow-sm)]">
              {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-medium text-text leading-tight">
                {user.name ?? "User"}
              </p>
              <p className="text-[11px] text-text-muted leading-tight">
                {org?.role ?? "Member"}
              </p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
