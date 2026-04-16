interface CalendarCardProps {
  title?: string;
  scheduleButtonLabel?: string;
  month: string;
  daysInMonth: number;
  currentDay?: number;
  onSchedule?: () => void;
  onDayClick?: (day: number) => void;
}

export function CalendarCard({
  title = "Calendário",
  scheduleButtonLabel = "Agendar",
  month,
  daysInMonth,
  currentDay = 1,
  onSchedule,
  onDayClick,
}: CalendarCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0e1822] dark:text-white">
          {title}
        </h3>
        <button
          onClick={onSchedule}
          className="text-cyan-500 text-sm font-medium hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          {scheduleButtonLabel}
        </button>
      </div>
      <div className="text-sm">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-[#0e1822] dark:text-white">
            {month}
          </h4>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["seg", "ter", "qua", "qui", "sex", "sab", "dom"].map((day, idx) => (
            <div key={idx} className="p-1 text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => onDayClick?.(idx + 1)}
              className={`p-2 rounded cursor-pointer transition-colors ${
                idx + 1 === currentDay
                  ? "bg-cyan-500 text-white font-bold hover:bg-cyan-600"
                  : "text-[#0e1822] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3f4f]"
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
