import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

type FeedbackTone = "error" | "info" | "success";

const toneMap: Record<
  FeedbackTone,
  {
    icon: typeof AlertCircle;
    wrapper: string;
    title: string;
  }
> = {
  error: {
    icon: AlertCircle,
    wrapper: "border-destructive/30 bg-destructive/10 text-destructive",
    title: "text-destructive",
  },
  info: {
    icon: Info,
    wrapper: "border-primary/20 bg-primary/10 text-primary",
    title: "text-primary",
  },
  success: {
    icon: CheckCircle2,
    wrapper: "border-accent/20 bg-accent/10 text-accent",
    title: "text-accent",
  },
};

interface InlineFeedbackProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
  tone?: FeedbackTone;
}

export function InlineFeedback({
  message,
  onDismiss,
  title,
  tone = "info",
}: InlineFeedbackProps) {
  const config = toneMap[tone];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-xl border px-4 py-3", config.wrapper)}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1">
          {title ? (
            <p className={cn("text-[12px] font-semibold", config.title)}>{title}</p>
          ) : null}
          <p className="text-[12px] leading-relaxed text-foreground/80">{message}</p>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-background/40 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
