import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 gap-4 text-center", className)}>
      {icon && (
        <div className="h-14 w-14 rounded-full bg-bg-subtle flex items-center justify-center text-text-muted">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text">{title}</h3>
        {description && <p className="text-sm text-text-muted max-w-md">{description}</p>}
      </div>
      {action}
    </div>
  );
}
