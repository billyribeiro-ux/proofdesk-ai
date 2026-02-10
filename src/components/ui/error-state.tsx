import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 gap-4 text-center",
        className
      )}
      role="alert"
    >
      <div className="h-14 w-14 rounded-full bg-danger-light flex items-center justify-center">
        <AlertTriangle className="h-7 w-7 text-danger" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text">{title}</h3>
        <p className="text-sm text-text-muted max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
