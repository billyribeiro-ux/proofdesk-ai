"use client";

import { useState } from "react";
import { Play, Pause, SkipForward, RotateCcw, Zap, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { startDemo, nextStep, pause, play, resetDemo, setSpeed } from "@/store/slices/demo-slice";

interface Scenario {
  id: string;
  name: string;
  type: string;
  description: string;
  steps: number;
  icon: typeof Play;
  color: string;
}

const scenarios: Scenario[] = [
  { id: "s1", name: "Happy Path", type: "HAPPY_PATH", description: "Complete project lifecycle from creation to billing packet delivery", steps: 12, icon: CheckCircle2, color: "text-success" },
  { id: "s2", name: "Scope Creep", type: "SCOPE_CREEP", description: "Client requests additional work outside original SOW, triggering risk detection", steps: 8, icon: AlertTriangle, color: "text-warning" },
  { id: "s3", name: "Delayed Dependency", type: "DELAYED_DEPENDENCY", description: "Third-party dependency delay cascades through project timeline", steps: 7, icon: Zap, color: "text-danger" },
  { id: "s4", name: "Rejected Approval", type: "REJECTED_APPROVAL", description: "Client rejects deliverable, triggering revision workflow", steps: 9, icon: XCircle, color: "text-danger" },
  { id: "s5", name: "Full Lifecycle", type: "FULL_LIFECYCLE", description: "End-to-end simulation covering all platform features", steps: 20, icon: Play, color: "text-primary" },
];

const stepDescriptions: Record<string, string[]> = {
  s1: ["Create client 'Acme Corp'", "Create project 'Brand Refresh Q4'", "Ingest work events from Figma", "Upload evidence artifacts", "Generate AI status summary", "Create approval request", "Client approves deliverable", "Generate billing packet", "Send billing packet", "Client acknowledges receipt", "Archive project", "Export audit log"],
  s2: ["Project at 60% completion", "Client requests 3 additional collateral pieces", "System detects scope creep risk", "Risk flagged as HIGH severity", "Manager reviews risk flag", "SOW amendment drafted", "Client approves amendment", "Budget and timeline adjusted"],
  s3: ["Project depends on third-party API", "API vendor announces 2-week delay", "System detects dependency risk", "Risk escalated to CRITICAL", "Project timeline recalculated", "Stakeholders notified", "Mitigation plan created"],
  s4: ["Deliverable submitted for approval", "Client reviews submission", "Client rejects with feedback", "Revision workflow triggered", "Team addresses feedback", "Revised deliverable submitted", "Client reviews revision", "Client approves revision", "Approval logged in audit trail"],
  s5: Array.from({ length: 20 }, (_, i) => `Step ${i + 1}: Full lifecycle event`),
};

export default function DemoPage() {
  const dispatch = useAppDispatch();
  const demo = useAppSelector((state) => state.demo);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const activeScenario = scenarios.find((s) => s.id === demo.scenarioId);
  const steps = demo.scenarioId ? stepDescriptions[demo.scenarioId] ?? [] : [];

  const handleStart = (scenario: Scenario) => {
    dispatch(startDemo({ scenarioId: scenario.id, runId: `run-${Date.now()}`, totalSteps: scenario.steps }));
    setSelectedScenario(scenario.id);
  };

  const handleReset = () => {
    dispatch(resetDemo());
    setSelectedScenario(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Demo Simulator</h1>
          <p className="text-sm text-text-muted mt-1">Interactive scenario playback with seeded data</p>
        </div>
        {demo.isActive && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Reset to Baseline
          </Button>
        )}
      </div>

      {!demo.isActive ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <Card
                  key={scenario.id}
                  padding="md"
                  className={`cursor-pointer transition-all hover:shadow-[var(--shadow-md)] ${selectedScenario === scenario.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-[var(--radius-lg)] bg-bg-subtle flex items-center justify-center ${scenario.color}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text">{scenario.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{scenario.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default">{scenario.steps} steps</Badge>
                        <Badge variant="outline">{scenario.type.replace(/_/g, " ")}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {selectedScenario && (
            <div className="flex justify-center">
              <Button size="lg" onClick={() => handleStart(scenarios.find((s) => s.id === selectedScenario)!)}>
                <Play className="h-5 w-5 mr-2" />
                Start Scenario
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playback Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Playback Controls</CardTitle>
              <CardDescription>{activeScenario?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" size="icon" onClick={() => dispatch(demo.isPlaying ? pause() : play())} aria-label={demo.isPlaying ? "Pause" : "Play"}>
                  {demo.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => dispatch(nextStep())} disabled={demo.currentStep >= demo.totalSteps - 1} aria-label="Next step">
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleReset} aria-label="Reset">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-text-muted">Progress</p>
                  <p className="text-xs font-medium text-text">{demo.currentStep + 1} / {demo.totalSteps}</p>
                </div>
                <div className="h-2 rounded-full bg-bg-subtle overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((demo.currentStep + 1) / demo.totalSteps) * 100}%` }} />
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted mb-2">Speed</p>
                <div className="flex items-center gap-2">
                  {[0.5, 1, 2, 4].map((s) => (
                    <button key={s} onClick={() => dispatch(setSpeed(s))} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${demo.speed === s ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Timeline */}
          <Card padding="none" className="lg:col-span-2">
            <CardHeader className="px-6 pt-6">
              <CardTitle>Scenario Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {steps.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 px-6 py-3 transition-colors ${i === demo.currentStep ? "bg-primary-light" : i < demo.currentStep ? "opacity-60" : ""}`}>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${i < demo.currentStep ? "bg-success text-white" : i === demo.currentStep ? "bg-primary text-white" : "bg-bg-subtle text-text-muted"}`}>
                      {i < demo.currentStep ? "✓" : i + 1}
                    </div>
                    <p className="text-sm text-text">{step}</p>
                    {i === demo.currentStep && <Badge variant="info" className="ml-auto shrink-0">Current</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
