import type { NotificationsCardData } from "@/mocks/notificationsData";

interface NotificationsCardProps {
  data: NotificationsCardData;
  onViewAll?: () => void;
  onNotificationClick?: (notificationId: string) => void;
}

export function NotificationsCard({
  data,
  onViewAll,
  onNotificationClick,
}: NotificationsCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0e1822] dark:text-white">
          {data.title}
        </h3>
        <button
          onClick={onViewAll}
          className="text-cyan-500 text-sm font-medium hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          {data.viewAllLabel}
        </button>
      </div>
      <div className="space-y-3">
        {data.notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onNotificationClick?.(notif.id)}
            className="flex gap-3 p-2 hover:bg-gray-50 dark:hover:bg-[#2a3f4f] rounded cursor-pointer transition-colors"
          >
            <span className="text-lg flex-shrink-0">{notif.icon}</span>
            <div className="text-xs flex-1">
              <p className="text-[#0e1822] dark:text-white font-medium">
                {notif.title}
              </p>
              <p className="text-gray-500 dark:text-gray-400">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
