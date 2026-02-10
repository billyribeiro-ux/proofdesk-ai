"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Clock,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  ScrollText,
  CreditCard,
  Settings,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUI } from "@/context/ui-context";
import { useAuth } from "@/context/auth-context";
import { ROUTES } from "@/lib/constants/app";

const navItems = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Clients", href: ROUTES.CLIENTS, icon: Users },
  { label: "Projects", href: ROUTES.PROJECTS, icon: FolderKanban },
  { label: "Timeline", href: ROUTES.TIMELINE, icon: Clock },
  { label: "Evidence", href: ROUTES.EVIDENCE, icon: FileCheck },
  { label: "Risks", href: ROUTES.RISKS, icon: AlertTriangle },
  { label: "Approvals", href: ROUTES.APPROVALS, icon: CheckCircle2 },
  { label: "Audit", href: ROUTES.AUDIT, icon: ScrollText },
  { label: "Billing", href: ROUTES.BILLING, icon: CreditCard },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUI();
  const { isDemo } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-bg-elevated transition-[width] duration-200 ease-in-out",
        sidebarOpen ? "w-[var(--sidebar-width)]" : "w-[var(--sidebar-collapsed-width)]"
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border px-4">
        {sidebarOpen && (
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-[var(--radius-lg)] bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-base font-semibold text-text">ProofDesk</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-[var(--radius-md)] p-1.5 text-text-muted hover:bg-bg-subtle hover:text-text transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2 overflow-y-auto h-[calc(100vh-var(--header-height))]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:bg-bg-subtle hover:text-text"
              )}
              aria-current={isActive ? "page" : undefined}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}

        {isDemo && (
          <Link
            href={ROUTES.DEMO}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm font-medium transition-colors mt-2 border border-dashed border-secondary/40",
              pathname === ROUTES.DEMO
                ? "bg-secondary-light text-secondary"
                : "text-secondary hover:bg-secondary-light/50"
            )}
            aria-current={pathname === ROUTES.DEMO ? "page" : undefined}
          >
            <Play className="h-5 w-5 shrink-0" aria-hidden="true" />
            {sidebarOpen && <span>Demo Simulator</span>}
          </Link>
        )}
      </nav>
    </aside>
  );
}
