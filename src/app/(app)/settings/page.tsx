"use client";

import { useState } from "react";
import { Settings, User, Bell, Palette, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { useShortcuts } from "@/context/shortcut-context";
import { cn } from "@/lib/utils/cn";

type Tab = "profile" | "notifications" | "appearance" | "shortcuts";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { enabled: shortcutsEnabled, setEnabled: setShortcutsEnabled } = useShortcuts();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <nav className="sm:w-48 shrink-0" aria-label="Settings navigation">
          <div className="flex sm:flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-[var(--radius-lg)] px-3 py-2 text-sm font-medium transition-colors text-left",
                    activeTab === tab.id ? "bg-primary-light text-primary" : "text-text-muted hover:bg-bg-subtle hover:text-text"
                  )}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input label="Name" defaultValue={user?.name ?? ""} />
                <Input label="Email" type="email" defaultValue={user?.email ?? ""} disabled hint="Email cannot be changed" />
                <Input label="Avatar URL" defaultValue={user?.image ?? ""} placeholder="https://..." />
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "emailApprovals", label: "Approval requests", desc: "Get notified when approvals need your attention" },
                  { id: "emailRisks", label: "Risk alerts", desc: "Get notified when new risks are detected" },
                  { id: "emailReports", label: "AI reports", desc: "Get notified when AI summaries are generated" },
                  { id: "emailBilling", label: "Billing packets", desc: "Get notified when billing packets are ready" },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">{pref.label}</p>
                      <p className="text-xs text-text-muted">{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" aria-label={pref.label} />
                      <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-text mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "rounded-[var(--radius-xl)] border-2 p-4 text-center transition-colors",
                          theme === t ? "border-primary bg-primary-light" : "border-border hover:border-border-strong"
                        )}
                      >
                        <div className={cn("mx-auto h-8 w-8 rounded-full mb-2", t === "light" ? "bg-white border border-border" : t === "dark" ? "bg-gray-900" : "bg-gradient-to-r from-white to-gray-900")} />
                        <p className="text-sm font-medium text-text capitalize">{t}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "shortcuts" && (
            <Card>
              <CardHeader><CardTitle>Keyboard Shortcuts</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text">Enable keyboard shortcuts</p>
                    <p className="text-xs text-text-muted">Use keyboard shortcuts to navigate and take actions faster</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={shortcutsEnabled} onChange={(e) => setShortcutsEnabled(e.target.checked)} className="sr-only peer" aria-label="Enable keyboard shortcuts" />
                    <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
                  </label>
                </div>
                <p className="text-sm text-text-muted">
                  Press <kbd className="rounded border border-border bg-bg-subtle px-1.5 py-0.5 text-xs font-mono">?</kbd> anywhere to view all available shortcuts.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
