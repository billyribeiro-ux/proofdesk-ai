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
      className="sticky top-0 z-30 flex h-[var(--header-height)] items-center justify-between border-b border-border bg-bg-elevated/80 backdrop-blur-sm px-4 sm:px-6"
      role="banner"
    >
      <div className="flex items-center gap-3">
        {org && (
          <span className="text-sm font-medium text-text-muted">
            {org.name}
          </span>
        )}
        {isDemo && (
          <span className="inline-flex items-center rounded-[var(--radius-full)] bg-secondary-light border border-secondary/30 px-2 py-0.5 text-xs font-medium text-secondary">
            Demo Mode
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            "hidden sm:flex items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-bg-subtle px-3 py-1.5 text-sm text-text-muted",
            "hover:bg-bg hover:border-border-strong transition-colors"
          )}
          aria-label="Open command palette"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search...</span>
          <kbd className="ml-4 rounded border border-border/50 bg-bg px-1.5 py-0.5 text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setTheme(nextTheme[theme])}
          className="rounded-[var(--radius-md)] p-2 text-text-muted hover:bg-bg-subtle hover:text-text transition-colors"
          aria-label={`Switch to ${nextTheme[theme]} theme`}
        >
          <ThemeIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          onClick={() => setNotificationPanelOpen(true)}
          className="relative rounded-[var(--radius-md)] p-2 text-text-muted hover:bg-bg-subtle hover:text-text transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
        </button>

        {user && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-sm font-medium text-primary">
              {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text leading-tight">
                {user.name ?? "User"}
              </p>
              <p className="text-xs text-text-muted leading-tight">
                {org?.role ?? "Member"}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
