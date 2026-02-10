import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeStyles = {
  sm: "h-4 w-4 border",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-2",
};

export function LoadingSpinner({ size = "md", className, label = "Loading" }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} role="status" aria-label={label}>
      <div
        className={cn(
          "animate-spin rounded-full border-border border-t-primary",
          sizeStyles[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader({ label = "Loading page..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" label={label} />
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}
