interface Contract {
  id: string;
  contractNumber: string;
  company: string;
  analyst: string;
  value: string;
  risk: "Baixo" | "Médio" | "Alto";
  status: "Ativo" | "Em análise" | "Pendente" | "Concluído";
  progress: number;
}

interface ContractsTableProps {
  contracts: Contract[];
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Baixo":
      return "text-green-600";
    case "Médio":
      return "text-orange-600";
    case "Alto":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ativo":
      return "text-green-600";
    case "Em análise":
      return "text-orange-600";
    case "Pendente":
      return "text-blue-600";
    case "Concluído":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

export function ContractsTable({ contracts }: ContractsTableProps) {
  return (
    <div className="bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Contrato
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Empresa
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Analista
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Valor
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Risco
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Progresso
            </th>
          </tr>
        </thead>
        <tbody>
          {contracts.length > 0 ? (
            contracts.map((contract) => (
              <tr
                key={contract.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                    {contract.contractNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[#0e1822] dark:text-white">
                    {contract.company}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {contract.analyst}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-[#0e1822] dark:text-white">
                    {contract.value}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-medium ${getRiskColor(contract.risk)}`}
                  >
                    {contract.risk}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-medium ${getStatusColor(contract.status)}`}
                  >
                    {contract.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${contract.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {contract.progress}%
                    </span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhum contrato encontrado
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
