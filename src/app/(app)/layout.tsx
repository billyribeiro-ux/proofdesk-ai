import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import { IS_DEMO, DEMO_TENANT_ID } from "@/lib/constants/app";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  // In demo mode, provide synthetic user/org
  const user = IS_DEMO
    ? { id: "demo-user-001", name: "Demo User", email: "demo@proofdesk.ai", image: null }
    : null;

  const org = IS_DEMO
    ? { id: DEMO_TENANT_ID, name: "Demo Agency", slug: "demo-agency", role: "OWNER" as const }
    : null;

  return (
    <Providers user={user} org={org} isDemo={IS_DEMO}>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
