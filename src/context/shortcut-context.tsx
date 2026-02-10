"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  shortcutRegistry,
  type ShortcutDefinition,
  type ShortcutScope,
} from "@/lib/shortcuts/registry";

interface ShortcutContextValue {
  register: (shortcut: ShortcutDefinition) => () => void;
  pushScope: (scope: ShortcutScope) => void;
  popScope: (scope: ShortcutScope) => void;
  currentScope: ShortcutScope;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  getAll: () => ShortcutDefinition[];
  getByCategory: () => Record<string, ShortcutDefinition[]>;
  search: (query: string) => ShortcutDefinition[];
}

const ShortcutContext = createContext<ShortcutContextValue | undefined>(
  undefined
);

export function ShortcutProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("proofdesk-shortcuts-enabled");
    if (stored === "false") {
      setEnabledState(false);
      shortcutRegistry.setEnabled(false);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => shortcutRegistry.handleKeyDown(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const register = useCallback((shortcut: ShortcutDefinition) => {
    return shortcutRegistry.register(shortcut);
  }, []);

  const pushScope = useCallback((scope: ShortcutScope) => {
    shortcutRegistry.pushScope(scope);
  }, []);

  const popScope = useCallback((scope: ShortcutScope) => {
    shortcutRegistry.popScope(scope);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    shortcutRegistry.setEnabled(value);
    localStorage.setItem("proofdesk-shortcuts-enabled", String(value));
  }, []);

  const getAll = useCallback(() => shortcutRegistry.getAll(), []);
  const getByCategory = useCallback(
    () => shortcutRegistry.getByCategory(),
    []
  );
  const search = useCallback(
    (query: string) => shortcutRegistry.search(query),
    []
  );

  return (
    <ShortcutContext.Provider
      value={{
        register,
        pushScope,
        popScope,
        currentScope: shortcutRegistry.currentScope,
        enabled,
        setEnabled,
        getAll,
        getByCategory,
        search,
      }}
    >
      {children}
    </ShortcutContext.Provider>
  );
}

export function useShortcuts() {
  const ctx = useContext(ShortcutContext);
  if (!ctx)
    throw new Error("useShortcuts must be used within ShortcutProvider");
  return ctx;
}

export function useShortcut(shortcut: Omit<ShortcutDefinition, "handler">, handler: () => void) {
  const { register } = useShortcuts();
  useEffect(() => {
    return register({ ...shortcut, handler });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, shortcut.id, shortcut.keys, shortcut.enabled]);
}
