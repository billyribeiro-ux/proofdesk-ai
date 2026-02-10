"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useUI } from "@/context/ui-context";
import { useShortcuts } from "@/context/shortcut-context";
import { formatKey } from "@/lib/shortcuts/registry";

export function ShortcutsHelp() {
  const { shortcutsHelpOpen, setShortcutsHelpOpen } = useUI();
  const { getByCategory, search, enabled, setEnabled } = useShortcuts();
  const [query, setQuery] = useState("");

  const categories = query ? { Results: search(query) } : getByCategory();

  return (
    <Modal
      open={shortcutsHelpOpen}
      onClose={() => setShortcutsHelpOpen(false)}
      title="Keyboard Shortcuts"
      description="Navigate and take actions faster with keyboard shortcuts."
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search shortcuts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search keyboard shortcuts"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded border-border"
            />
            Enabled
          </label>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-6">
          {Object.entries(categories).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2 hover:bg-bg-subtle transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-text">
                        {shortcut.label}
                      </p>
                      <p className="text-xs text-text-muted">
                        {shortcut.description}
                      </p>
                    </div>
                    <kbd className="shrink-0 ml-4 rounded-[var(--radius-md)] border border-border bg-bg-subtle px-2 py-1 text-xs font-mono text-text-muted">
                      {formatKey(shortcut.keys)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(categories).length === 0 && (
            <p className="text-center text-sm text-text-muted py-8">
              No shortcuts found
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
