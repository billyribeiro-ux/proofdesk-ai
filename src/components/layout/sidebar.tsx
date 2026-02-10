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

const navSections = [
  {
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Clients", href: ROUTES.CLIENTS, icon: Users },
      { label: "Projects", href: ROUTES.PROJECTS, icon: FolderKanban },
      { label: "Timeline", href: ROUTES.TIMELINE, icon: Clock },
      { label: "Evidence", href: ROUTES.EVIDENCE, icon: FileCheck },
    ],
  },
  {
    label: "Governance",
    items: [
      { label: "Risks", href: ROUTES.RISKS, icon: AlertTriangle },
      { label: "Approvals", href: ROUTES.APPROVALS, icon: CheckCircle2 },
      { label: "Audit", href: ROUTES.AUDIT, icon: ScrollText },
      { label: "Billing", href: ROUTES.BILLING, icon: CreditCard },
    ],
  },
  {
    items: [
      { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUI();
  const { isDemo } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/60 bg-bg-elevated transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        sidebarOpen ? "w-[var(--sidebar-width)]" : "w-[var(--sidebar-collapsed-width)]"
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border px-4">
        {sidebarOpen && (
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-[var(--radius-lg)] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-sm)]">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-base font-semibold text-text">ProofDesk</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-[var(--radius-md)] p-1.5 text-text-muted hover:bg-bg-subtle hover:text-text transition-all duration-200 hover:scale-110"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 p-2 overflow-y-auto h-[calc(100vh-var(--header-height))]">
        {navSections.map((section, si) => (
          <div key={si} className={cn(si > 0 && "mt-3 pt-3 border-t border-border/50")}>
            {section.label && sidebarOpen && (
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted/60">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2 text-[13px] font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary shadow-[var(--shadow-sm)]"
                      : "text-text-muted hover:bg-bg-subtle hover:text-text"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} aria-hidden="true" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}

        {isDemo && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <Link
              href={ROUTES.DEMO}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2 text-[13px] font-medium transition-all duration-150 border border-dashed border-secondary/30",
                pathname === ROUTES.DEMO
                  ? "bg-secondary/10 text-secondary shadow-[var(--shadow-sm)]"
                  : "text-secondary/70 hover:bg-secondary/5 hover:text-secondary"
              )}
              aria-current={pathname === ROUTES.DEMO ? "page" : undefined}
            >
              <Play className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              {sidebarOpen && <span>Demo Simulator</span>}
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
