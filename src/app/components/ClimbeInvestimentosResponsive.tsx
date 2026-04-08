import { useState } from 'react';
import svgPaths from '../../imports/svg-l5b9mhbrnh';
import { useTheme } from '../context/ThemeContext';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  company: string;
  color: string;
}

const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const monthsOfYear = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ClimbeInvestimentosResponsive() {
  const { theme } = useTheme();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isInPerson, setIsInPerson] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const mockEvents: Event[] = [
    { id: '1', title: 'Reunião de Investimentos', date: '2026-03-04', time: '10:00', company: 'Climbe Capital', color: '#0abfa3' },
    { id: '2', title: 'Análise de Portfólio', date: '2026-03-04', time: '14:00', company: 'Valor Investimentos', color: '#3b82f6' },
    { id: '3', title: 'Due Diligence', date: '2026-03-15', time: '09:00', company: 'Tech Ventures', color: '#f59e0b' },
    { id: '4', title: 'Revisão Estratégica', date: '2026-03-02', time: '11:00', company: 'Alpha Partners', color: '#f59e0b' },
    { id: '5', title: 'Comitê de Investimentos', date: '2026-03-06', time: '15:00', company: 'Beta Capital', color: '#f59e0b' },
    { id: '6', title: 'Análise Trimestral', date: '2026-03-10', time: '13:00', company: 'Gamma Ventures', color: '#f59e0b' },
    { id: '7', title: 'Apresentação Portfolio', date: '2026-03-12', time: '16:00', company: 'Delta Investimentos', color: '#f59e0b' },
    { id: '8', title: 'Due Diligence Follow-up', date: '2026-03-17', time: '10:30', company: 'Epsilon Capital', color: '#f59e0b' },
    { id: '9', title: 'Reunião com Stakeholders', date: '2026-03-20', time: '14:30', company: 'Zeta Partners', color: '#f59e0b' },
    { id: '10', title: 'Planejamento Q2', date: '2026-03-25', time: '09:30', company: 'Omega Ventures', color: '#f59e0b' },
  ];

  const eventsForSelectedDay = mockEvents.filter(
    (event) => selectedDay && event.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
  );

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
    setSelectedDay(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    setSelectedDay(today.getDate());
  };

  const renderMiniCalendar = () => {
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvent = mockEvents.some(
        (e) => e.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      );

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`relative aspect-square flex flex-col items-center justify-center rounded-[5px] transition-all ${
            isSelected
              ? 'bg-[#0abfa3] text-white'
              : theme === 'dark'
              ? 'hover:bg-[#2d2e2c]'
              : 'hover:bg-[#f4f6f8]'
          }`}
        >
          <span
            className={`text-[10.5px] font-['Plus_Jakarta_Sans:Medium',sans-serif] ${
              isSelected
                ? 'text-white font-bold'
                : theme === 'dark'
                ? 'text-[#b8bcc4]'
                : 'text-[#5c6370]'
            }`}
          >
            {day}
          </span>
          {hasEvent && !isSelected && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-[#f59e0b] rounded-full" />
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`w-full h-full overflow-x-hidden pt-4 p-4 md:px-7 pb-4 md:pb-7 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-[#f4f6f8]'}`}>
      {/* Header */}
      <div className={`rounded-[10px] shadow-sm border p-4 mb-4 ${
        theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e2e7ed]'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="w-full lg:w-[360px]">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
                  <path d={svgPaths.p8cdb700} stroke="#6B7A8D" strokeWidth="1.16667" />
                  <path d="M12.25 12.25L9.7125 9.7125" stroke="#6B7A8D" strokeWidth="1.16667" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar evento"
                className={`w-full border rounded-[8px] pl-10 pr-4 py-2 font-['DM_Sans:Regular',sans-serif] text-[13px] placeholder:text-[#6b7a8d] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                    : 'bg-[#f4f6f8] border-[#e2e7ed] text-[#1a2332]'
                }`}
              />
            </div>
          </div>

          {/* View Mode Tabs and Schedule Button */}
          <div className="flex gap-3 w-full lg:w-auto">
            <div className={`rounded-[6px] p-0.5 flex gap-1 ${
              theme === 'dark' ? 'bg-[#2d2e2c]' : 'bg-[#f4f6f8]'
            }`}>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-1 rounded-[5px] text-[11.5px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] transition-all ${
                  viewMode === 'month'
                    ? theme === 'dark'
                      ? 'bg-[#0abfa3] text-white shadow-sm'
                      : 'bg-white text-[#1a1d23] shadow-sm'
                    : theme === 'dark'
                    ? 'text-[#b8bcc4]'
                    : 'text-[#5c6370]'
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-1 rounded-[5px] text-[11.5px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] transition-all ${
                  viewMode === 'week'
                    ? theme === 'dark'
                      ? 'bg-[#0abfa3] text-white shadow-sm'
                      : 'bg-white text-[#1a1d23] shadow-sm'
                    : theme === 'dark'
                    ? 'text-[#b8bcc4]'
                    : 'text-[#5c6370]'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-1 rounded-[5px] text-[11.5px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] transition-all ${
                  viewMode === 'list'
                    ? theme === 'dark'
                      ? 'bg-[#0abfa3] text-white shadow-sm'
                      : 'bg-white text-[#1a1d23] shadow-sm'
                    : theme === 'dark'
                    ? 'text-[#b8bcc4]'
                    : 'text-[#5c6370]'
                }`}
              >
                Lista
              </button>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-[#0abfa3] text-white px-4 py-1.5 rounded-[6px] text-[11px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] hover:bg-[#099d88] transition-colors whitespace-nowrap"
            >
              ＋ Agendar
            </button>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-6">
        <h1 className={`font-['DM_Sans:Bold',sans-serif] font-bold text-[20px] md:text-[24px] tracking-[-0.5px] mb-1 ${
          theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
        }`}>
          Agenda de Eventos
        </h1>
        <p className={`font-['DM_Sans:Regular',sans-serif] text-[13px] ${
          theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
        }`}>
          Visualize os próximos eventos de forma interativa com a agenda
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Main Calendar - Left Side */}
        <div className="flex-1 w-full lg:w-auto">
          <div className={`rounded-[10px] shadow-sm border relative h-[696px] ${
            theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e8eaed]'
          }`}>
            {/* Calendar Header */}
            <div className="absolute border-[#f0f2f4] border-b border-solid h-[44px] left-0 right-0 top-0">
              <div className="absolute h-[22px] left-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <button
                  onClick={() => changeMonth(-1)}
                  className={`border rounded-[4px] px-2 py-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#b8bcc4] hover:bg-[#3d3e3c]'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
                  }`}
                >
                  <span className="font-['Inter:Regular',sans-serif] text-[11px]">‹</span>
                </button>
                <h3 className={`font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] ${
                  theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                }`}>
                  {monthsOfYear[month]} {year}
                </h3>
                <button
                  onClick={() => changeMonth(1)}
                  className={`border rounded-[4px] px-2 py-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#b8bcc4] hover:bg-[#3d3e3c]'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
                  }`}
                >
                  <span className="font-['Inter:Regular',sans-serif] text-[11px]">›</span>
                </button>
              </div>
              <button
                onClick={handleToday}
                className={`absolute right-4 top-1/2 -translate-y-1/2 border rounded-[6px] px-3 py-1 text-[11px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#b8bcc4] hover:bg-[#3d3e3c]'
                    : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
                }`}
              >
                Hoje
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="absolute h-[27px] left-0 right-0 top-[44px] grid grid-cols-7">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, idx) => (
                <div key={idx} className="border-[#f0f2f4] border-b border-solid flex items-center justify-center">
                  <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[10px] text-[#9ea5b0] tracking-[0.5px] uppercase">
                    {day}
                  </p>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="absolute left-0 right-0 top-[71px] bottom-0 grid grid-cols-7 grid-rows-5">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="border-[#f0f2f4] border-b border-r border-solid" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = day === selectedDay;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const dayEvents = mockEvents.filter(
                  (e) => e.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                );

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`relative border-[#f0f2f4] border-b border-r border-solid p-2 text-left transition-colors ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-[#0d3d35]'
                          : 'bg-[#e6f9f6]'
                        : theme === 'dark'
                        ? 'hover:bg-[#2d2e2c]'
                        : 'hover:bg-[#f4f6f8]'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] ${
                        isSelected
                          ? 'bg-[#0abfa3] text-white rounded-full w-[22px] h-[22px]'
                          : theme === 'dark'
                          ? 'text-[#b8bcc4]'
                          : 'text-[#5c6370]'
                      }`}
                    >
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-[9.5px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] px-1 py-0.5 rounded-[4px] truncate"
                          style={{
                            backgroundColor: `${event.color}17`,
                            color: event.color,
                          }}
                        >
                          {event.time.slice(0, 5)} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-[#9ea5b0] px-1">
                          +{dayEvents.length - 2} mais
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Stacked Components */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
        {/* Mini Calendar */}
        <div className={`rounded-[10px] shadow-sm border p-4 ${
          theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e8eaed]'
        }`}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0f2f4]">
            <button
              onClick={() => changeMonth(-1)}
              className={`border rounded-[4px] px-2 py-1 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#b8bcc4] hover:bg-[#3d3e3c]'
                  : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
              }`}
            >
              <span className="font-['Inter:Regular',sans-serif] text-[11px]">‹</span>
            </button>
            <h3 className={`font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] ${
              theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
            }`}>
              {monthsOfYear[month]} {year}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className={`border rounded-[4px] px-2 py-1 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#2d2e2c] border-[#3d3e3c] text-[#b8bcc4] hover:bg-[#3d3e3c]'
                  : 'bg-[#f4f6f8] border-[#e8eaed] text-[#5c6370] hover:bg-[#e8eaed]'
              }`}
            >
              <span className="font-['Inter:Regular',sans-serif] text-[11px]">›</span>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="text-center">
                <span className="text-[9px] font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[#9ea5b0] uppercase">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderMiniCalendar()}
          </div>
        </div>

        {/* Events of the Day */}
        <div className={`rounded-[10px] shadow-sm border p-4 ${
          theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e8eaed]'
        }`}>
          <div className="border-b border-[#f0f2f4] pb-3 mb-4">
            <h3 className={`font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] ${
              theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
            }`}>
              Eventos do dia
            </h3>
          </div>

          {eventsForSelectedDay.length > 0 ? (
            <div className="space-y-3">
              {eventsForSelectedDay.map((event) => (
                <div key={event.id} className="border-l-4 pl-3 py-2" style={{ borderColor: event.color }}>
                  <p className={`font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[12px] mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                  }`}>
                    {event.title}
                  </p>
                  <p className={`font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[11px] ${
                    theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
                  }`}>
                    {event.time}
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[10px] text-[#9ea5b0] mt-1">
                    {event.company}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[12px] text-[#9ea5b0] py-8">
              Clique em um dia
            </p>
          )}
        </div>

        {/* Schedule Form */}
        <div className={`rounded-[10px] shadow-sm border p-4 ${
          theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e8eaed]'
        }`}>
          <div className="border-b border-[#f0f2f4] pb-3 mb-4">
            <h3 className={`font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] ${
              theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
            }`}>
              Agendar Reunião
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] text-[11px] text-[#5c6370] block mb-2">
                Pauta *
              </label>
              <input
                type="text"
                placeholder="Pauta da reunião..."
                className={`w-full border rounded-[6px] px-3 py-2 text-[12px] font-['Plus_Jakarta_Sans:Regular',sans-serif] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                    : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
                }`}
              />
            </div>

            <div>
              <label className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] text-[11px] text-[#5c6370] block mb-2">
                Empresa
              </label>
              <select className={`w-full border rounded-[6px] px-3 py-2 text-[12px] font-['Plus_Jakarta_Sans:Regular',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                theme === 'dark'
                  ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                  : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
              }`}>
                <option>Value</option>
                <option>Climbe Capital</option>
                <option>Valor Investimentos</option>
              </select>
            </div>

            <div>
              <label className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] text-[11px] text-[#5c6370] block mb-2">
                Data
              </label>
              <div className="mb-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="DD"
                  maxLength={2}
                  className={`min-w-0 border rounded-[6px] px-3 py-2 text-[12px] font-['Plus_Jakarta_Sans:Regular',sans-serif] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
                  }`}
                />
                <input
                  type="text"
                  placeholder="MM"
                  maxLength={2}
                  className={`min-w-0 border rounded-[6px] px-3 py-2 text-[12px] font-['Plus_Jakarta_Sans:Regular',sans-serif] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="YYYY"
                maxLength={4}
                className={`w-full border rounded-[6px] px-3 py-2 text-[12px] font-['Plus_Jakarta_Sans:Regular',sans-serif] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                    : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
                }`}
              />
            </div>

            <div>
              <label className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] text-[11px] text-[#5c6370] block mb-2">
                Hora
              </label>
              <div className="mb-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="H"
                  maxLength={2}
                  className={`min-w-0 border rounded-[6px] px-3 py-2 text-[12px] font-['Plus_Jakarta_Sans:Regular',sans-serif] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
                  }`}
                />
                <input
                  type="text"
                  placeholder="M"
                  maxLength={2}
                  className={`min-w-0 border rounded-[6px] px-3 py-2 text-[12px] font-['Plus_Jakarta_Sans:Regular',sans-serif] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                    theme === 'dark'
                      ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white'
                      : 'bg-[#f4f6f8] border-[#e8eaed] text-[#1a1d23]'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="in-person"
                checked={isInPerson}
                onChange={(e) => setIsInPerson(e.target.checked)}
                className="border border-black rounded-[2px] size-[13px] cursor-pointer"
              />
              <label
                htmlFor="in-person"
                className={`font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[11.5px] cursor-pointer ${
                  theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#5c6370]'
                }`}
              >
                Reunião presencial
              </label>
            </div>

            <button className="w-full bg-[#0abfa3] text-white px-4 py-2 rounded-[6px] text-[11.5px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] hover:bg-[#099d88] transition-colors">
              Confirmar Agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
