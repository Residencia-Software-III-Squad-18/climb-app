import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Event {
  id: number;
  title: string;
  time: string;
  color: string;
  day: number;
}

export default function AgendaResponsive() {
  const { theme } = useTheme();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Mock events data
  const events: Event[] = [
    { id: 1, title: 'Kickoff', time: '09:00', color: 'teal', day: 2 },
    { id: 2, title: 'Vencimento', time: '', color: 'orange', day: 6 },
    { id: 3, title: 'Apresentação', time: '14:00', color: 'teal', day: 9 },
    { id: 4, title: 'Revisão', time: '10:30', color: 'blue', day: 10 },
    { id: 5, title: 'Kickoff', time: '09:00', color: 'teal', day: 12 },
    { id: 6, title: 'Vencimento', time: '', color: 'red', day: 15 },
    { id: 7, title: 'Alinhamento', time: '15:00', color: 'blue', day: 17 },
    { id: 8, title: 'Relatório', time: '11:00', color: 'green', day: 20 },
    { id: 9, title: 'Revisão', time: '14:00', color: 'purple', day: 25 },
  ];

  const getEventsForDay = (day: number) => {
    return events.filter((e) => e.day === day);
  };

  const colorMap: Record<string, { bg: string; text: string }> = {
    teal: { bg: 'rgba(10,191,163,0.09)', text: '#0abfa3' },
    orange: { bg: 'rgba(245,158,11,0.09)', text: '#f59e0b' },
    blue: { bg: 'rgba(59,130,246,0.09)', text: '#3b82f6' },
    green: { bg: 'rgba(16,185,129,0.09)', text: '#10b981' },
    purple: { bg: 'rgba(139,92,246,0.09)', text: '#8b5cf6' },
    red: { bg: 'rgba(239,68,68,0.09)', text: '#ef4444' },
  };

  const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const miniDaysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getFirstDayOfMonth(currentMonth, currentYear);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const selectedDaysInMonth = getDaysInMonth(currentMonth, currentYear);

  useEffect(() => {
    if (selectedDay && selectedDay > selectedDaysInMonth) {
      setSelectedDay(selectedDaysInMonth);
    }
  }, [currentMonth, currentYear, selectedDaysInMonth, selectedDay]);

  const renderCalendarCells = () => {
    const cells = [];
    const prevMonthDays = getDaysInMonth(currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear);

    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        const dayNum = week * 7 + day + 1 - startDay;

        if (dayNum < 1) {
          // Previous month days (faded)
          const prevDay = prevMonthDays + dayNum;
          cells.push(
            <div
              key={`${week}-${day}`}
              className={`border-r border-b p-2 ${
                theme === 'dark' ? 'border-[#3d3e3c]' : 'border-[#f0f2f4]'
              }`}
              style={{ minHeight: '88px' }}
            >
              <p className={`font-['Plus_Jakarta_Sans'] font-bold text-[12px] opacity-38 ${
                theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
              }`}>
                {prevDay}
              </p>
            </div>
          );
        } else if (dayNum <= daysInMonth) {
          // Current month days
          const dayEvents = getEventsForDay(dayNum);
          const isToday = dayNum === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const isSelected = selectedDay === dayNum;

          cells.push(
            <div
              key={`${week}-${day}`}
              onClick={() => setSelectedDay(dayNum)}
              className={`border-r border-b p-2 cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'border-[#3d3e3c]'
                  : 'border-[#f0f2f4]'
              } ${
                isSelected
                  ? 'bg-[rgba(68,192,184,0.15)]'
                  : isToday
                  ? theme === 'dark'
                    ? 'bg-[rgba(10,191,163,0.08)]'
                    : 'bg-[#e6f9f6]'
                  : theme === 'dark'
                  ? 'hover:bg-[#2d2e2c]'
                  : 'hover:bg-[#f9fafb]'
              }`}
              style={{ minHeight: '88px' }}
            >
              <div className="relative">
                {isToday ? (
                  <div className="bg-[#0abfa3] rounded-full w-[22px] h-[22px] flex items-center justify-center mb-2">
                    <p className="font-['Plus_Jakarta_Sans'] font-bold text-white text-[12px]">
                      {dayNum}
                    </p>
                  </div>
                ) : (
                  <p
                    className={`font-['Plus_Jakarta_Sans'] font-bold text-[12px] mb-2 ${
                      theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
                    }`}
                  >
                    {dayNum}
                  </p>
                )}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-[4px] px-1.5 py-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[9.5px]"
                      style={{
                        backgroundColor: colorMap[event.color].bg,
                        color: colorMap[event.color].text,
                      }}
                    >
                      <p className="font-['Plus_Jakarta_Sans'] font-semibold">
                        {event.time && `${event.time} `}
                        {event.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        } else {
          // Next month days (faded)
          const nextDay = dayNum - daysInMonth;
          cells.push(
            <div
              key={`${week}-${day}`}
              className={`border-r border-b p-2 ${
                theme === 'dark' ? 'border-[#3d3e3c]' : 'border-[#f0f2f4]'
              }`}
              style={{ minHeight: '88px' }}
            >
              <p className={`font-['Plus_Jakarta_Sans'] font-bold text-[12px] opacity-38 ${
                theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
              }`}>
                {nextDay}
              </p>
            </div>
          );
        }
      }
    }
    return cells;
  };

  const renderMiniCalendar = () => {
    const miniCells = [];
    const daysWithEvents = [2, 6, 9, 10, 12, 15, 17, 20, 25];
    const prevMonthDays = getDaysInMonth(currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear);

    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const dayNum = week * 7 + day + 1 - startDay;

        if (dayNum < 1) {
          // Previous month days
          const prevDay = prevMonthDays + dayNum;
          miniCells.push(
            <div
              key={`mini-${week}-${day}`}
              className="flex items-center justify-center rounded-[5px] w-[31px] h-[31px] opacity-45"
            >
              <p className="font-['Plus_Jakarta_Sans'] font-medium text-[#9ea5b0] text-[10.5px]">
                {prevDay}
              </p>
            </div>
          );
        } else if (dayNum <= daysInMonth) {
          // Current month days
          const hasEvent = daysWithEvents.includes(dayNum);
          const isToday = dayNum === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const isSelected = selectedDay === dayNum;

          miniCells.push(
            <div
              key={`mini-${week}-${day}`}
              onClick={() => setSelectedDay(dayNum)}
              className={`flex flex-col items-center justify-center rounded-[5px] w-[31px] h-[31px] cursor-pointer relative ${
                isSelected
                  ? 'bg-[rgba(68,192,184,0.3)]'
                  : isToday
                  ? 'bg-[#0abfa3]'
                  : ''
              }`}
            >
              <p
                className={`font-['Plus_Jakarta_Sans'] text-[10.5px] ${
                  isToday
                    ? 'text-white font-bold'
                    : theme === 'dark'
                    ? 'text-[#9ea5b0] font-medium'
                    : 'text-[#5c6370] font-medium'
                }`}
              >
                {dayNum}
              </p>
              {hasEvent && !isToday && (
                <div className="absolute bottom-1 w-[3px] h-[3px] bg-[#f59e0b] rounded-full" />
              )}
            </div>
          );
        } else {
          // Next month days
          const nextDay = dayNum - daysInMonth;
          if (nextDay <= 10) {
            miniCells.push(
              <div
                key={`mini-${week}-${day}`}
                className="flex items-center justify-center rounded-[5px] w-[31px] h-[31px] opacity-45"
              >
                <p className="font-['Plus_Jakarta_Sans'] font-medium text-[#9ea5b0] text-[10.5px]">
                  {nextDay}
                </p>
              </div>
            );
          } else {
            miniCells.push(<div key={`mini-${week}-${day}`} className="w-[31px] h-[31px]" />);
          }
        }
      }
    }
    return miniCells;
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div
      className={`w-full min-h-screen pt-4 p-6 md:px-6 pb-6 overflow-x-hidden ${
        theme === 'dark' ? 'bg-[#0f1419]' : 'bg-[#f4f6f8]'
      }`}
    >
      {/* Title Section */}
      <div className="mb-6">
        <h1 className={`font-['DM_Sans'] font-bold text-[24px] mb-1 ${
          theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
        }`} style={{ letterSpacing: '-0.5px' }}>
          Agenda de Eventos
        </h1>
        <p className={`font-['DM_Sans'] text-[13px] ${
          theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#6b7a8d]'
        }`}>
          Visualize os próximos eventos de forma interativa com a agenda
        </p>
      </div>

      {/* Main Content - Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Main Calendar - Left Side */}
        <div
          className={`flex-1 w-full lg:w-auto rounded-[10px] border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_1px_3px_0px_rgba(0,0,0,0.06)] overflow-hidden ${
            theme === 'dark'
              ? 'bg-[#1e1f1d] border-[#2d2e2c]'
                : 'bg-white border-[#e8eaed]'
          }`}
        >
          {/* Calendar Header with Navigation */}
          <div
            className={`border-b px-4 flex items-center justify-between ${
              theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
            }`}
            style={{ height: '44px' }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className={`w-[22px] h-[22px] rounded-[4px] border flex items-center justify-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#9ea5b0] hover:bg-[#3d3e3c]'
                    : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
                }`}
              >
                <span className="font-['Inter'] text-[11px]">‹</span>
              </button>
              <p
                className={`font-['Plus_Jakarta_Sans'] font-bold text-[14px] ${
                  theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                }`}
              >
                {monthNames[currentMonth]} {currentYear}
              </p>
              <button
                onClick={handleNextMonth}
                className={`w-[22px] h-[22px] rounded-[4px] border flex items-center justify-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#9ea5b0] hover:bg-[#3d3e3c]'
                    : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
                }`}
              >
                <span className="font-['Inter'] text-[11px]">›</span>
              </button>
            </div>
            <button
              onClick={handleToday}
              className={`h-[23px] px-3 rounded-[6px] border transition-colors font-['Plus_Jakarta_Sans'] font-semibold text-[11px] ${
                theme === 'dark'
                  ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#9ea5b0] hover:bg-[#3d3e3c]'
                  : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
              }`}
            >
              Hoje
            </button>
          </div>

          {/* Day Headers */}
          <div
            className={`grid grid-cols-7 border-b ${
              theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
            }`}
            style={{ height: '27px' }}
          >
            {daysOfWeek.map((day, idx) => (
              <div
                key={idx}
                className={`border-r text-center flex items-center justify-center ${
                  idx === 6 ? 'border-r-0' : ''
                } ${theme === 'dark' ? 'border-[#3d3e3c]' : 'border-[#f0f2f4]'}`}
              >
                <p
                  className={`font-['Plus_Jakarta_Sans'] font-bold text-[10px] uppercase ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#9ea5b0]'
                  }`}
                  style={{ letterSpacing: '0.5px' }}
                >
                  {day}
                </p>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">{renderCalendarCells()}</div>
        </div>

        {/* Right Sidebar - Stacked Components */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4 min-w-0">
          {/* Mini Calendar */}
          <div
            className={`rounded-[10px] border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_1px_3px_0px_rgba(0,0,0,0.06)] ${
              theme === 'dark'
                ? 'bg-[#1e1f1d] border-[#2d2e2c]'
                : 'bg-white border-[#e8eaed]'
            }`}
          >
            <div
              className={`border-b px-4 flex items-center justify-center ${
                theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
              }`}
              style={{ height: '39px' }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className={`w-[22px] h-[22px] rounded-[4px] border flex items-center justify-center transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#9ea5b0] hover:bg-[#3d3e3c]'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
                  }`}
                >
                  <span className="font-['Inter'] text-[11px]">‹</span>
                </button>
                <p
                  className={`font-['Plus_Jakarta_Sans'] font-bold text-[12px] ${
                    theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                  }`}
                >
                  {monthNames[currentMonth]} {currentYear}
                </p>
                <button
                  onClick={handleNextMonth}
                  className={`w-[22px] h-[22px] rounded-[4px] border flex items-center justify-center transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#9ea5b0] hover:bg-[#3d3e3c]'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
                  }`}
                >
                  <span className="font-['Inter'] text-[11px]">›</span>
                </button>
              </div>
            </div>
            <div className="px-3 py-3">
              <div className="grid grid-cols-7 gap-0.5 mb-2">
                {miniDaysOfWeek.map((day, idx) => (
                  <div key={idx} className="text-center" style={{ height: '18px' }}>
                    <p
                      className={`font-['Plus_Jakarta_Sans'] font-bold text-[9px] uppercase ${
                        theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#9ea5b0]'
                      }`}
                      style={{ letterSpacing: '0.5px' }}
                    >
                      {day}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">{renderMiniCalendar()}</div>
            </div>
          </div>

          {/* Eventos do dia */}
          <div
            className={`rounded-[10px] border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_1px_3px_0px_rgba(0,0,0,0.06)] ${
              theme === 'dark'
                ? 'bg-[#1e1f1d] border-[#2d2e2c]'
                : 'bg-white border-[#e8eaed]'
            }`}
          >
            <div
              className={`border-b px-4 flex items-center ${
                theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
              }`}
              style={{ height: '32px' }}
            >
              <p
                className={`font-['Plus_Jakarta_Sans'] font-bold text-[12px] ${
                  theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                }`}
              >
                Eventos do dia
              </p>
            </div>
            <div className="px-4 py-3 flex items-center justify-center" style={{ minHeight: '53px' }}>
              {selectedDay && selectedDayEvents.length > 0 ? (
                <div className="w-full space-y-2">
                  {selectedDayEvents.map((event) => (
                    <div key={event.id} className="space-y-0.5">
                      <p
                        className={`font-['Plus_Jakarta_Sans'] font-semibold text-[11px] ${
                          theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                        }`}
                      >
                        {event.title}
                      </p>
                      {event.time && (
                        <p
                          className={`font-['Plus_Jakarta_Sans'] text-[10px] ${
                            theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
                          }`}
                        >
                          {event.time}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`font-['Plus_Jakarta_Sans'] text-[12px] text-center ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#9ea5b0]'
                  }`}
                >
                  Clique em um dia
                </p>
              )}
            </div>
          </div>

          {/* Agendar Reunião */}
          <div
            className={`rounded-[10px] border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_1px_3px_0px_rgba(0,0,0,0.06)] min-w-0 ${
              theme === 'dark'
                ? 'bg-[#1e1f1d] border-[#2d2e2c]'
                : 'bg-white border-[#e8eaed]'
            }`}
          >
            <div
              className={`border-b px-4 flex items-center ${
                theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
              }`}
              style={{ height: '32px' }}
            >
              <p
                className={`font-['Plus_Jakarta_Sans'] font-bold text-[12px] ${
                  theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                }`}
              >
                Agendar Reunião
              </p>
            </div>
            <div className="px-4 py-3 space-y-3">
              {/* Pauta */}
              <div>
                <label
                  className={`font-['Plus_Jakarta_Sans'] font-semibold text-[11px] mb-1 block ${
                    theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
                  }`}
                >
                  Pauta *
                </label>
                <input
                  type="text"
                  placeholder="Pauta da reunião..."
                  className={`w-full min-w-0 border rounded-[6px] px-2 py-1.5 font-['Plus_Jakarta_Sans'] text-[12px] transition-all focus:outline-none focus:ring-1 focus:ring-[#0abfa3] ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#757575]'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23] placeholder:text-[#757575]'
                  }`}
                  style={{ height: '29px' }}
                />
              </div>

              {/* Empresa */}
              <div>
                <label
                  className={`font-['Plus_Jakarta_Sans'] font-semibold text-[11px] mb-1 block ${
                    theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
                  }`}
                >
                  Empresa
                </label>
                <select
                  className={`w-full min-w-0 border rounded-[6px] px-2 py-1.5 font-['Plus_Jakarta_Sans'] text-[12px] transition-all focus:outline-none focus:ring-1 focus:ring-[#0abfa3] ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
                  }`}
                  style={{ height: '29px' }}
                >
                  <option>Value</option>
                </select>
              </div>

              {/* Data */}
              <div>
                <label
                  className={`font-['Plus_Jakarta_Sans'] font-semibold text-[11px] mb-1 block ${
                    theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
                  }`}
                >
                  Data
                </label>
                {/* DD + MM row — minmax(0,1fr) prevents overflow */}
                <div className="mb-1.5" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="DD"
                    className={`min-w-0 border rounded-[6px] px-2 py-1.5 font-['Plus_Jakarta_Sans'] text-[12px] text-center transition-all focus:outline-none focus:ring-1 focus:ring-[#0abfa3] ${
                      theme === 'dark'
                        ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#757575]'
                        : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23] placeholder:text-[#757575]'
                    }`}
                    style={{ height: '29px' }}
                  />
                  <input
                    type="text"
                    placeholder="MM"
                    className={`min-w-0 border rounded-[6px] px-2 py-1.5 font-['Plus_Jakarta_Sans'] text-[12px] text-center transition-all focus:outline-none focus:ring-1 focus:ring-[#0abfa3] ${
                      theme === 'dark'
                        ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#757575]'
                        : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23] placeholder:text-[#757575]'
                    }`}
                    style={{ height: '29px' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="YYYY"
                  className={`w-full min-w-0 border rounded-[6px] px-2 py-1.5 font-['Plus_Jakarta_Sans'] text-[12px] text-center transition-all focus:outline-none focus:ring-1 focus:ring-[#0abfa3] ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#757575]'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23] placeholder:text-[#757575]'
                  }`}
                  style={{ height: '29px' }}
                />
              </div>

              {/* Hora */}
              <div>
                <label
                  className={`font-['Plus_Jakarta_Sans'] font-semibold text-[11px] mb-1 block ${
                    theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
                  }`}
                >
                  Hora
                </label>
                {/* H + M row — minmax(0,1fr) prevents overflow */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="H"
                    className={`min-w-0 border rounded-[6px] px-2 py-1.5 font-['Plus_Jakarta_Sans'] text-[12px] text-center transition-all focus:outline-none focus:ring-1 focus:ring-[#0abfa3] ${
                      theme === 'dark'
                        ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#757575]'
                        : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23] placeholder:text-[#757575]'
                    }`}
                    style={{ height: '29px' }}
                  />
                  <input
                    type="text"
                    placeholder="M"
                    className={`min-w-0 border rounded-[6px] px-2 py-1.5 font-['Plus_Jakarta_Sans'] text-[12px] text-center transition-all focus:outline-none focus:ring-1 focus:ring-[#0abfa3] ${
                      theme === 'dark'
                        ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#757575]'
                        : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23] placeholder:text-[#757575]'
                    }`}
                    style={{ height: '29px' }}
                  />
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="presencial"
                  className="w-[13px] h-[13px] rounded-[2px] border border-black cursor-pointer"
                />
                <label
                  htmlFor="presencial"
                  className={`font-['Plus_Jakarta_Sans'] text-[11.5px] cursor-pointer ${
                    theme === 'dark' ? 'text-[#9ea5b0]' : 'text-[#5c6370]'
                  }`}
                >
                  Reunião presencial
                </label>
              </div>

              {/* Button */}
              <button className="w-full bg-[#0abfa3] text-white rounded-[6px] font-['Plus_Jakarta_Sans'] font-semibold text-[11.5px] hover:bg-[#099989] transition-colors" style={{ height: '25px' }}>
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}