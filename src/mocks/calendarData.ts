export interface CalendarData {
  title: string;
  scheduleButtonLabel: string;
  month: string;
  daysInMonth: number;
  currentDay: number;
}

// Mock data - será substituído pelo React Query + Backend
export const mockCalendarData: CalendarData = {
  title: "Calendário",
  scheduleButtonLabel: "Agendar",
  month: "Março",
  daysInMonth: 31,
  currentDay: 1,
};
