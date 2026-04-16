import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";

import type { ContractPipelineData } from "@/mocks/contractPipelineData";

interface ContractPipelineProps {
  data: ContractPipelineData;
  onFilterChange?: (filter: string) => void;
  onRefresh?: () => void;
  activeFilter?: string;
}

export function ContractPipeline({
  data,
  onFilterChange,
  onRefresh,
  activeFilter = "All",
}: ContractPipelineProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    onRefresh?.();
    setTimeout(() => setIsRotating(false), 1000);
  };
  return (
    <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white">
            {data.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {data.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          {data.filters?.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange?.(filter)}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-cyan-200 dark:bg-cyan-600 text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={handleRefresh}
            disabled={isRotating}
            className={`p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all ${
              isRotating ? "animate-spin" : ""
            }`}
            title="Atualizar dados"
          >
            ⟳
          </button>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="flex items-center justify-between mb-6 gap-1">
        {data.steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-xl font-bold text-[#0e1822] dark:text-white">
                {step.count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {step.label}
              </p>
            </div>
            {index < data.steps.length - 1 && (
              <div
                className="text-gray-300 dark:text-gray-600 text-sm"
                title="Próximo passo"
              >
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-5 gap-4 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          Empresa
        </p>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          Serviço
        </p>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          Analista
        </p>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          Status
        </p>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          Vencimento
        </p>
      </div>

      {/* Contracts Table */}
      <div className="space-y-3">
        {data.contracts.map((contract) => (
          <div
            key={contract.id}
            className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <p className="text-sm font-medium text-[#0e1822] dark:text-white">
              {contract.company}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {contract.service}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {contract.analyst}
            </p>
            <StatusBadge status={contract.status} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {contract.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
