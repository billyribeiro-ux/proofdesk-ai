"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/theme-context";
import { UIProvider } from "@/context/ui-context";
import { ShortcutProvider } from "@/context/shortcut-context";
import { StoreProvider } from "@/store/provider";
import { AuthProvider, type AuthUser, type AuthOrg } from "@/context/auth-context";
import { CommandPalette } from "@/components/shortcuts/command-palette";
import { ShortcutsHelp } from "@/components/shortcuts/shortcuts-help";
import { GlobalShortcuts } from "@/components/shortcuts/global-shortcuts";

interface ProvidersProps {
  children: ReactNode;
  user?: AuthUser | null;
  org?: AuthOrg | null;
  isDemo?: boolean;
}

export function Providers({
  children,
  user = null,
  org = null,
  isDemo = false,
}: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider>
          <AuthProvider user={user} org={org} isDemo={isDemo}>
            <UIProvider>
              <ShortcutProvider>
                {children}
                <CommandPalette />
                <ShortcutsHelp />
                <GlobalShortcuts />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    className:
                      "bg-bg-elevated border-border text-text shadow-[var(--shadow-lg)]",
                  }}
                />
              </ShortcutProvider>
            </UIProvider>
          </AuthProvider>
        </ThemeProvider>
      </StoreProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
