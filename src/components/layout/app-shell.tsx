"use client";

import { useUI } from "@/context/ui-context";
import { cn } from "@/lib/utils/cn";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUI();

  return (
    <div className="min-h-screen bg-bg">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar />
      <div
        className={cn(
          "transition-[margin-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          sidebarOpen
            ? "ml-[var(--sidebar-width)]"
            : "ml-[var(--sidebar-collapsed-width)]"
        )}
      >
        <Header />
        <main id="main-content" className="p-4 sm:p-6 lg:p-8 animate-fade-in" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
