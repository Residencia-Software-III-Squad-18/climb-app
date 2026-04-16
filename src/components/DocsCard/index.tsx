import type { DocsCardData } from "@/mocks/docsAndFluxoData";

interface DocsCardProps {
  data: DocsCardData;
  onAction?: () => void;
}

export function DocsCard({ data, onAction }: DocsCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#0e1822] dark:text-white text-sm">
            {data.title}
          </h3>
          <p className="text-xs text-cyan-500">{data.subtitle}</p>
        </div>
        <button
          onClick={onAction}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          title="Abrir"
        >
          ↗
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {data.documents.map((doc) => (
          <div key={doc.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={doc.checked}
              readOnly
              className="w-4 h-4 text-cyan-500"
            />
            <span className="text-[#0e1822] dark:text-white flex-1">
              {doc.name}
            </span>
            <span
              className={`text-xs ml-auto ${
                doc.status === "Validado" ? "text-gray-400" : "text-orange-500"
              }`}
            >
              {doc.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {data.complianceLabel}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-orange-400 h-2 rounded-full"
            style={{ width: `${data.compliancePercentage}%` }}
          ></div>
        </div>
        <p className="text-xs font-semibold text-[#0e1822] dark:text-white mt-2">
          {data.compliancePercentage}%
        </p>
      </div>
    </div>
  );
}
