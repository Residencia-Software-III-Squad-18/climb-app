import { AlertCircle, AlertTriangle, Bell, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type NotificationType = "info" | "sucesso" | "alerta" | "erro";

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  descricao?: string;
  lida: boolean;
  criadoEm: Date;
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; bg: string; text: string }> = {
  info: { icon: Info, bg: "bg-primary/10", text: "text-primary" },
  sucesso: { icon: CheckCircle2, bg: "bg-accent/10", text: "text-accent" },
  alerta: { icon: AlertTriangle, bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  erro: { icon: AlertCircle, bg: "bg-destructive/10", text: "text-destructive" },
};

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há ${mins} min`;
  if (hours < 24) return `há ${hours}h`;
  if (days === 1) return "ontem";
  return `${days} dias atrás`;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const { icon: Icon, bg, text } = typeConfig[notification.tipo];

  return (
    <motion.div
      className={cn(
        "flex cursor-pointer gap-3 px-4 py-3.5 transition-colors hover:bg-muted/10",
        !notification.lida && "bg-accent/[0.03]",
      )}
      onClick={() => onMarkRead?.(notification.id)}
      whileHover={{ x: 1 }}
    >
      <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-4 w-4", text)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-[12px] leading-relaxed", notification.lida ? "text-foreground/70" : "font-medium text-foreground")}>
            {notification.titulo}
          </p>
          {!notification.lida && (
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          )}
        </div>
        {notification.descricao && (
          <p className="mt-0.5 text-[11px] text-muted-foreground/50">{notification.descricao}</p>
        )}
        <p className="mt-1 text-[10px] text-muted-foreground/30">{relativeTime(notification.criadoEm)}</p>
      </div>
    </motion.div>
  );
}
