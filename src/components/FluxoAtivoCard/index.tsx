import type { FluxoAtivoData } from "@/mocks/docsAndFluxoData";

interface FluxoAtivoCardProps {
  data: FluxoAtivoData;
  onAction?: () => void;
}

export function FluxoAtivoCard({ data, onAction }: FluxoAtivoCardProps) {
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
        {data.items.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <div
              className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                item.date === "Pendente" ? "bg-gray-400" : "bg-cyan-500"
              }`}
            ></div>
            <div className="flex-1">
              <p className="text-[#0e1822] dark:text-white">{item.title}</p>
              <p
                className={`text-xs ${
                  item.date === "Pendente"
                    ? "text-gray-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
