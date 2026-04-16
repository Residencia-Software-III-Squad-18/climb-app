interface Tab {
  label: string;
  value: string;
}

interface ContractsTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function ContractsTabs({
  tabs,
  activeTab,
  onTabChange,
}: ContractsTabsProps) {
  return (
    <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === tab.value
              ? "text-[#0e1822] dark:text-white border-cyan-500"
              : "text-gray-600 dark:text-gray-400 border-transparent hover:text-[#0e1822] dark:hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
