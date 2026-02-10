"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUI } from "@/context/ui-context";
import { useShortcuts } from "@/context/shortcut-context";
import { ROUTES } from "@/lib/constants/app";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  category: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, setShortcutsHelpOpen } = useUI();
  const { pushScope, popScope } = useShortcuts();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    { id: "nav-dashboard", label: "Go to Dashboard", category: "Navigation", action: () => router.push(ROUTES.DASHBOARD) },
    { id: "nav-projects", label: "Go to Projects", shortcut: "G then P", category: "Navigation", action: () => router.push(ROUTES.PROJECTS) },
    { id: "nav-clients", label: "Go to Clients", shortcut: "G then C", category: "Navigation", action: () => router.push(ROUTES.CLIENTS) },
    { id: "nav-timeline", label: "Go to Timeline", category: "Navigation", action: () => router.push(ROUTES.TIMELINE) },
    { id: "nav-evidence", label: "Go to Evidence", category: "Navigation", action: () => router.push(ROUTES.EVIDENCE) },
    { id: "nav-risks", label: "Go to Risks", shortcut: "G then R", category: "Navigation", action: () => router.push(ROUTES.RISKS) },
    { id: "nav-approvals", label: "Go to Approvals", shortcut: "G then A", category: "Navigation", action: () => router.push(ROUTES.APPROVALS) },
    { id: "nav-audit", label: "Go to Audit Log", category: "Navigation", action: () => router.push(ROUTES.AUDIT) },
    { id: "nav-billing", label: "Go to Billing", category: "Navigation", action: () => router.push(ROUTES.BILLING) },
    { id: "nav-settings", label: "Go to Settings", category: "Navigation", action: () => router.push(ROUTES.SETTINGS) },
    { id: "action-new-client", label: "New Client", category: "Actions", action: () => router.push(ROUTES.CLIENTS_NEW) },
    { id: "action-shortcuts", label: "View Keyboard Shortcuts", shortcut: "?", category: "Actions", action: () => { setCommandPaletteOpen(false); setShortcutsHelpOpen(true); } },
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    if (commandPaletteOpen) {
      pushScope("modal");
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      popScope("modal");
    }
  }, [commandPaletteOpen, pushScope, popScope]);

  const close = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen]);

  const execute = useCallback(
    (item: CommandItem) => {
      close();
      item.action();
    },
    [close]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatFiltered[selectedIndex]) {
        e.preventDefault();
        execute(flatFiltered[selectedIndex]);
      }
    },
    [close, execute, flatFiltered, selectedIndex]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-[var(--bg-overlay)]" onClick={close} aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-[var(--radius-xl)] border border-border bg-bg-elevated shadow-[var(--shadow-xl)] overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 text-text-muted shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 h-12 bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
            aria-label="Search commands"
            aria-activedescendant={flatFiltered[selectedIndex]?.id}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
          />
          <button onClick={close} className="p-1 text-text-muted hover:text-text" aria-label="Close command palette">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={listRef} id="command-list" role="listbox" className="max-h-[300px] overflow-y-auto p-2">
          {flatFiltered.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">No results found</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="px-2 py-1.5 text-xs font-medium text-text-muted uppercase tracking-wider">{category}</p>
                {items.map((item) => {
                  const globalIdx = flatFiltered.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      id={item.id}
                      role="option"
                      aria-selected={globalIdx === selectedIndex}
                      className={cn(
                        "flex w-full items-center justify-between rounded-[var(--radius-lg)] px-3 py-2.5 text-sm text-left transition-colors",
                        globalIdx === selectedIndex
                          ? "bg-primary-light text-primary"
                          : "text-text hover:bg-bg-subtle"
                      )}
                      onClick={() => execute(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <kbd className="text-[10px] font-mono text-text-muted bg-bg-subtle border border-border/50 rounded px-1.5 py-0.5">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-text-muted">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
