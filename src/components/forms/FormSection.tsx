import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormSectionProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: string;
  title: string;
}

export function FormSection({
  children,
  className,
  contentClassName,
  description,
  title,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground/75">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/60">
            {description}
          </p>
        ) : null}
      </div>

      <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
