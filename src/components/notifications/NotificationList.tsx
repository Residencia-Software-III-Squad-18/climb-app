import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationItem, type Notification } from "./NotificationItem";

export type { Notification };

interface NotificationListProps {
  notifications: Notification[];
  isLoading?: boolean;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

function SkeletonItem() {
  return (
    <div className="flex gap-3 px-4 py-3.5">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-muted/30" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted/30" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted/20" />
      </div>
    </div>
  );
}

export function NotificationList({ notifications, isLoading, onMarkRead, onMarkAllRead }: NotificationListProps) {
  const unreadCount = notifications.filter((n) => !n.lida).length;

  return (
    <div className="flex w-[320px] flex-col overflow-hidden rounded-xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-[13px] font-semibold text-foreground">Notificações</span>
          {unreadCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && onMarkAllRead && (
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-accent transition-colors hover:text-accent/80"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="max-h-[380px] divide-y divide-border/10 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
        {isLoading ? (
          <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        ) : notifications.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center gap-3 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/20">
              <Bell className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <p className="text-[12px] text-muted-foreground/40">Nenhuma notificação</p>
          </motion.div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
