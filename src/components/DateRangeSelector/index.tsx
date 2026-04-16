import { useState } from "react";

interface DateRangeSelectorProps {
  onSelectRange: (startDate: string, endDate: string) => void;
  onClose: () => void;
  currentStartDate?: string;
  currentEndDate?: string;
}

export function DateRangeSelector({
  onSelectRange,
  onClose,
  currentStartDate = "2026-11-11",
  currentEndDate = "2026-12-11",
}: DateRangeSelectorProps) {
  const [startDate, setStartDate] = useState(currentStartDate);
  const [endDate, setEndDate] = useState(currentEndDate);

  const handleApply = () => {
    onSelectRange(startDate, endDate);
    onClose();
  };

  const formatDateToLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()].slice(0, 3)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow-lg w-96">
        <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white mb-4">
          Selecione o Intervalo de Datas
        </h3>

        <div className="space-y-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-[#0e1822] dark:text-white mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0e1822] text-[#0e1822] dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-[#0e1822] dark:text-white mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0e1822] text-[#0e1822] dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Preview */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-[#0e1822] rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Intervalo selecionado:
            </p>
            <p className="text-sm font-medium text-[#0e1822] dark:text-white">
              {formatDateToLabel(startDate)} - {formatDateToLabel(endDate)}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a3f4f] transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition-colors font-medium"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
