import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger" | "alerta";

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-border/25 bg-card/40 text-muted-foreground",
  info: "border-primary/20 bg-primary/10 text-primary",
  success: "border-accent/20 bg-accent/10 text-accent",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
  alerta: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

interface StatusBadgeProps {
  children: ReactNode;
  className?: string;
  pulse?: boolean;
  tone?: StatusTone;
  icon?: LucideIcon;
}

export function StatusBadge({
  children,
  className,
  pulse = false,
  tone = "neutral",
  icon: Icon,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase",
        toneClasses[tone],
        className,
      )}
    >
      {Icon ? (
        <Icon className="h-3 w-3 opacity-80" />
      ) : (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-current opacity-80",
            pulse && "animate-pulse",
          )}
        />
      )}
      {children}
    </span>
  );
}
