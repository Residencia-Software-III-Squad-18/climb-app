import { useState } from "react";

import { LayoutContainer } from "@/components/LayoutContainer/LayoutContainer";

interface Event {
  id: string;
  date: number;
  time: string;
  title: string;
  type: "reuniao" | "aberta" | "vencimento" | "documento";
}

const eventsMock: Event[] = [
  { id: "1", date: 5, time: "09:00", title: "REALUP", type: "aberta" },
  { id: "2", date: 9, time: "14:00", title: "Apresentação", type: "reuniao" },
  { id: "3", date: 10, time: "10:30", title: "Reunião", type: "documento" },
  { id: "4", date: 15, time: "", title: "Vencimento", type: "vencimento" },
  { id: "5", date: 17, time: "03:00", title: "Manutenção", type: "reuniao" },
  { id: "6", date: 20, time: "11:00", title: "Reunião", type: "reuniao" },
  { id: "7", date: 25, time: "14:00", title: "Reunião", type: "reuniao" },
  { id: "8", date: 12, time: "09:00", title: "REALUP", type: "aberta" },
  { id: "9", date: 6, time: "", title: "Vencimento", type: "vencimento" },
];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "reuniao":
      return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300";
    case "aberta":
      return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300";
    case "vencimento":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
    case "documento":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  }
};

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

const getDayEvents = (day: number) => {
  return eventsMock.filter((e) => e.date === day);
};

export function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2));
  const [viewMode, setViewMode] = useState<"mes" | "semana" | "lista">("mes");
  const [selectedDay, setSelectedDay] = useState<number | null>(8);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [formData, setFormData] = useState({
    pauta: "",
    empresa: "",
    dia: "",
    mes: "",
    ano: "",
    hora: "",
    minuto: "",
    incluirApresentacao: false,
  });

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  const monthName = currentDate.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const dayLabels = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirm = () => {
    console.log("Agendamento confirmado:", formData);
    setShowNewEvent(false);
    setFormData({
      pauta: "",
      empresa: "",
      dia: "",
      mes: "",
      ano: "",
      hora: "",
      minuto: "",
      incluirApresentacao: false,
    });
  };

  // Get events for selected day
  const selectedDayEvents = selectedDay ? getDayEvents(selectedDay) : [];

  // Get current week (for semana view)
  const getWeekDays = () => {
    const today = new Date(year, month, selectedDay || 1);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date.getDate());
    }
    return weekDays;
  };

  const weekDays = viewMode === "semana" ? getWeekDays() : [];

  return (
    <LayoutContainer title="Agenda">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0e1822] dark:text-white">
              Agenda de Eventos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visualize os próximos eventos de forma interativa com a agenda
            </p>
          </div>
          <button
            onClick={() => setShowNewEvent(!showNewEvent)}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium text-sm"
          >
            + Agendar
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2">
          {["mes", "semana", "lista"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as "mes" | "semana" | "lista")}
              className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                viewMode === mode
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {mode === "mes" ? "Mês" : mode === "semana" ? "Semana" : "Lista"}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar/Week/List View */}
          <div className="lg:col-span-2">
            {viewMode === "mes" && (
              <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    ‹
                  </button>
                  <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white capitalize">
                    {monthName}
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    ›
                  </button>
                </div>

                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayLabels.map((day) => (
                    <div
                      key={day}
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center py-2 uppercase"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayEvents = day ? getDayEvents(day) : [];
                    const isSelected = day === selectedDay;

                    return (
                      <div
                        key={index}
                        onClick={() => day && setSelectedDay(day)}
                        className={`min-h-28 p-2 border rounded cursor-pointer transition-colors ${
                          day
                            ? isSelected
                              ? "bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400 dark:border-cyan-600"
                              : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            : "bg-white dark:bg-[#1a2532] border-white dark:border-[#1a2532]"
                        }`}
                      >
                        {day && (
                          <>
                            <div
                              className={`text-sm font-semibold mb-1 ${
                                isSelected
                                  ? "text-cyan-700 dark:text-cyan-300"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded truncate font-medium ${getEventTypeColor(
                                    event.type
                                  )}`}
                                  title={`${event.time} ${event.title}`}
                                >
                                  {event.time
                                    ? `${event.time} ${event.title}`
                                    : event.title}
                                </div>
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                                  +{dayEvents.length - 3} mais
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "semana" && (
              <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    ‹
                  </button>
                  <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white capitalize">
                    Semana
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    ›
                  </button>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const dayEvents = getDayEvents(day);
                    const isSelected = day === selectedDay;

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDay(day)}
                        className={`min-h-40 p-2 rounded border cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400 dark:border-cyan-600"
                            : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            isSelected
                              ? "text-cyan-700 dark:text-cyan-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {dayLabels[index]}
                        </div>
                        <div className="text-lg font-bold text-[#0e1822] dark:text-white mb-2">
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate font-medium ${getEventTypeColor(
                                event.type
                              )}`}
                              title={`${event.time} ${event.title}`}
                            >
                              {event.time
                                ? `${event.time} ${event.title}`
                                : event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "lista" && (
              <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white mb-6">
                  Próximos Eventos
                </h3>
                <div className="space-y-3">
                  {eventsMock.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded border-l-4 ${getEventTypeColor(
                        event.type
                      )} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => setSelectedDay(event.date)}
                    >
                      <div className="flex items-between justify-between">
                        <div>
                          <div className="font-semibold text-[#0e1822] dark:text-white">
                            {event.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Dia {event.date} de março •{" "}
                            {event.time || "Sem hora"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Mini Calendar */}
            <div className="bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow">
              <div className="grid grid-cols-7 gap-1 mb-3">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((day) => (
                  <div
                    key={day}
                    className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-xs">
                {[
                  30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                ].map((day, index) => (
                  <div
                    key={index}
                    className={`p-1 text-center rounded cursor-pointer ${
                      day === selectedDay
                        ? "bg-cyan-500 text-white font-bold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => day <= 31 && setSelectedDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Eventos do dia */}
            <div className="bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow">
              <h4 className="font-semibold text-[#0e1822] dark:text-white mb-4">
                Eventos do dia
              </h4>
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 rounded text-xs ${getEventTypeColor(
                        event.type
                      )}`}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.time && (
                        <div className="text-xs opacity-75">{event.time}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum evento neste dia
                </div>
              )}
            </div>

            {/* Agendar Reunião */}
            {showNewEvent && (
              <div className="bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow space-y-4">
                <h4 className="font-semibold text-[#0e1822] dark:text-white">
                  Agendar Reunião
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Pauta *
                  </label>
                  <input
                    type="text"
                    placeholder="Pauta da reunião..."
                    value={formData.pauta}
                    onChange={(e) => handleFormChange("pauta", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.empresa}
                    onChange={(e) =>
                      handleFormChange("empresa", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Data
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="DD"
                      maxLength={2}
                      value={formData.dia}
                      onChange={(e) => handleFormChange("dia", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="MM"
                      maxLength={2}
                      value={formData.mes}
                      onChange={(e) => handleFormChange("mes", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Ano
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY"
                    maxLength={4}
                    value={formData.ano}
                    onChange={(e) => handleFormChange("ano", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Hora
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="H"
                      maxLength={2}
                      value={formData.hora}
                      onChange={(e) => handleFormChange("hora", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="M"
                      maxLength={2}
                      value={formData.minuto}
                      onChange={(e) =>
                        handleFormChange("minuto", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="apresentacao"
                    checked={formData.incluirApresentacao}
                    onChange={(e) =>
                      handleFormChange("incluirApresentacao", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="apresentacao"
                    className="text-xs text-gray-700 dark:text-gray-300"
                  >
                    Incluir apresentação
                  </label>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium text-sm"
                >
                  Confirmar Agendamento
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
}
