"use client";

export type ShortcutScope = "global" | "page" | "modal" | "editor";

export interface ShortcutDefinition {
  id: string;
  keys: string;
  label: string;
  description: string;
  scope: ShortcutScope;
  category: string;
  handler: () => void;
  enabled?: boolean;
}

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export function formatKey(key: string): string {
  if (isMac) {
    return key
      .replace(/Mod/g, "⌘")
      .replace(/Alt/g, "⌥")
      .replace(/Shift/g, "⇧")
      .replace(/Ctrl/g, "⌃");
  }
  return key.replace(/Mod/g, "Ctrl");
}

export function parseKeys(keys: string): {
  mod: boolean;
  shift: boolean;
  alt: boolean;
  ctrl: boolean;
  key: string;
  sequence?: string[];
} {
  const parts = keys.split("+").map((p) => p.trim().toLowerCase());
  const mod = parts.includes("mod");
  const shift = parts.includes("shift");
  const alt = parts.includes("alt");
  const ctrl = parts.includes("ctrl");
  const key = parts.filter(
    (p) => !["mod", "shift", "alt", "ctrl"].includes(p)
  )[0];

  if (keys.includes(" then ")) {
    const sequence = keys.split(" then ").map((s) => s.trim().toLowerCase());
    return { mod, shift, alt, ctrl, key, sequence };
  }

  return { mod, shift, alt, ctrl, key };
}

export function matchesEvent(
  e: KeyboardEvent,
  parsed: ReturnType<typeof parseKeys>
): boolean {
  const modKey = isMac ? e.metaKey : e.ctrlKey;
  if (parsed.mod && !modKey) return false;
  if (parsed.shift && !e.shiftKey) return false;
  if (parsed.alt && !e.altKey) return false;
  if (parsed.ctrl && !e.ctrlKey) return false;
  return e.key.toLowerCase() === parsed.key;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable || target.getAttribute("contenteditable") === "true") return true;
  return false;
}

class ShortcutRegistry {
  private shortcuts = new Map<string, ShortcutDefinition>();
  private scopeStack: ShortcutScope[] = ["global"];
  private sequenceBuffer: string[] = [];
  private sequenceTimeout: ReturnType<typeof setTimeout> | null = null;
  private enabled = true;

  register(shortcut: ShortcutDefinition) {
    this.shortcuts.set(shortcut.id, shortcut);
    return () => this.unregister(shortcut.id);
  }

  unregister(id: string) {
    this.shortcuts.delete(id);
  }

  pushScope(scope: ShortcutScope) {
    this.scopeStack.push(scope);
  }

  popScope(scope: ShortcutScope) {
    const idx = this.scopeStack.lastIndexOf(scope);
    if (idx !== -1) this.scopeStack.splice(idx, 1);
  }

  get currentScope(): ShortcutScope {
    return this.scopeStack[this.scopeStack.length - 1] ?? "global";
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  handleKeyDown(e: KeyboardEvent) {
    if (!this.enabled) return;
    if (isTypingTarget(e.target)) return;

    const currentScope = this.currentScope;
    const key = e.key.toLowerCase();

    // Handle sequence shortcuts (e.g., "g then d")
    if (this.sequenceBuffer.length > 0) {
      this.sequenceBuffer.push(key);
      if (this.sequenceTimeout) clearTimeout(this.sequenceTimeout);

      for (const shortcut of this.shortcuts.values()) {
        if (shortcut.enabled === false) continue;
        const parsed = parseKeys(shortcut.keys);
        if (!parsed.sequence) continue;
        if (
          parsed.sequence.length === this.sequenceBuffer.length &&
          parsed.sequence.every((s, i) => s === this.sequenceBuffer[i])
        ) {
          if (this.canExecuteInScope(shortcut.scope, currentScope)) {
            e.preventDefault();
            shortcut.handler();
            this.sequenceBuffer = [];
            return;
          }
        }
      }

      if (this.sequenceBuffer.length >= 3) {
        this.sequenceBuffer = [];
      } else {
        this.sequenceTimeout = setTimeout(() => {
          this.sequenceBuffer = [];
        }, 1000);
      }
      return;
    }

    // Check if this key starts a sequence
    for (const shortcut of this.shortcuts.values()) {
      const parsed = parseKeys(shortcut.keys);
      if (parsed.sequence && parsed.sequence[0] === key) {
        this.sequenceBuffer = [key];
        this.sequenceTimeout = setTimeout(() => {
          this.sequenceBuffer = [];
        }, 1000);
        return;
      }
    }

    // Handle single-key and combo shortcuts
    for (const shortcut of this.shortcuts.values()) {
      if (shortcut.enabled === false) continue;
      const parsed = parseKeys(shortcut.keys);
      if (parsed.sequence) continue;
      if (!matchesEvent(e, parsed)) continue;
      if (!this.canExecuteInScope(shortcut.scope, currentScope)) continue;

      e.preventDefault();
      shortcut.handler();
      return;
    }
  }

  private canExecuteInScope(
    shortcutScope: ShortcutScope,
    currentScope: ShortcutScope
  ): boolean {
    const scopePriority: Record<ShortcutScope, number> = {
      global: 0,
      page: 1,
      modal: 2,
      editor: 3,
    };
    if (shortcutScope === "global") return true;
    return scopePriority[shortcutScope] >= scopePriority[currentScope];
  }

  getAll(): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values());
  }

  getByCategory(): Record<string, ShortcutDefinition[]> {
    const result: Record<string, ShortcutDefinition[]> = {};
    for (const shortcut of this.shortcuts.values()) {
      if (!result[shortcut.category]) result[shortcut.category] = [];
      result[shortcut.category].push(shortcut);
    }
    return result;
  }

  search(query: string): ShortcutDefinition[] {
    const lower = query.toLowerCase();
    return this.getAll().filter(
      (s) =>
        s.label.toLowerCase().includes(lower) ||
        s.description.toLowerCase().includes(lower) ||
        s.keys.toLowerCase().includes(lower)
    );
  }
}

export const shortcutRegistry = new ShortcutRegistry();
