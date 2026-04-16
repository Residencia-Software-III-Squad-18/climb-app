import { useState } from "react";
import { BsSliders2Vertical } from "react-icons/bs";
import { PiCalendarDotsLight } from "react-icons/pi";

import { DateRangeSelector } from "@/components/DateRangeSelector";

interface FilterHeaderProps {
  onNewContract?: () => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  dateRangeLabel?: string;
}

export function FilterHeader({
  onNewContract,
  onDateRangeChange,
  onMenuClick,
  onSearch,
  dateRangeLabel = "11 Nov - 11 Dec, 2026",
}: FilterHeaderProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState(dateRangeLabel);

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    const dateObj1 = new Date(startDate);
    const dateObj2 = new Date(endDate);
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

    const label = `${dateObj1.getDate()} ${months[dateObj1.getMonth()]} - ${dateObj2.getDate()} ${months[dateObj2.getMonth()]}, ${dateObj2.getFullYear()}`;
    setCurrentDateRange(label);
    onDateRangeChange?.(startDate, endDate);
  };
  return (
    <div className="flex items-center justify-between gap-6">
      {/* Left side - Filters */}
      <div className="flex items-center gap-4">
        {/* New Contract Button */}
        <button
          onClick={onNewContract}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a3f4f] transition-colors"
        >
          <span>+</span>
          <span>Novo Contrato</span>
        </button>

        {/* Date Range Selector */}
        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a3f4f] transition-colors"
        >
          <span>
            <PiCalendarDotsLight />
          </span>
          <span>{currentDateRange}</span>
          <span>▼</span>
        </button>
      </div>

      {/* Right side - Menu and Search */}
      <div className="flex items-center gap-3">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a3f4f] transition-colors"
          aria-label="Menu"
        >
          <span className="text-lg">
            <BsSliders2Vertical />
          </span>
        </button>

        {/* Search Button */}
        <button
          onClick={() => onSearch?.("")}
          className="flex items-center justify-center px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a3f4f] transition-colors"
          aria-label="Buscar"
        >
          <span className="text-lg">⌕</span>
        </button>
      </div>

      {/* Date Range Selector Modal */}
      {isDatePickerOpen && (
        <DateRangeSelector
          onSelectRange={handleDateRangeSelect}
          onClose={() => setIsDatePickerOpen(false)}
          currentStartDate="2026-11-11"
          currentEndDate="2026-12-11"
        />
      )}
    </div>
  );
}
