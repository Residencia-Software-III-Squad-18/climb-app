interface DocumentStatus {
  status: "completo" | "faltante" | "pendente";
  percentage: number;
}

interface Company {
  id: string;
  name: string;
  balanço: DocumentStatus;
  dre: DocumentStatus;
  planOperacional: DocumentStatus;
  cnpj: DocumentStatus;
  contratoSocial: DocumentStatus;
  conformidade: DocumentStatus;
}

interface DocumentsTableProps {
  companies: Company[];
}

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "completo":
      return "text-green-600 dark:text-green-400";
    case "faltante":
      return "text-orange-500 dark:text-orange-400";
    case "pendente":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const DocumentCell = ({
  status,
  isConformidade = false,
}: {
  status: DocumentStatus;
  isConformidade?: boolean;
}) => {
  let displayText = "";

  if (isConformidade) {
    // For conformidade column, show percentage
    displayText =
      status.percentage === 100 ? "+100%" : `+${status.percentage}%`;
  } else {
    // For other columns
    switch (status.status) {
      case "completo":
        displayText = "✓";
        break;
      case "faltante":
        displayText = "*Faltante";
        break;
      case "pendente":
        displayText = "*Pendente";
        break;
    }
  }

  return (
    <td className="px-4 py-3 text-center">
      <span
        className={`text-sm font-medium ${getStatusTextColor(isConformidade ? "faltante" : status.status)}`}
      >
        {displayText}
      </span>
    </td>
  );
};

export function DocumentsTable({ companies }: DocumentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Empresa
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Balanço
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              DRE
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Plan. Operacional
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              CNPJ
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Contrato Social
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Conformidade
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-[#0e1822] dark:text-white">
                  {company.name}
                </span>
              </td>
              <DocumentCell status={company.balanço} />
              <DocumentCell status={company.dre} />
              <DocumentCell status={company.planOperacional} />
              <DocumentCell status={company.cnpj} />
              <DocumentCell status={company.contratoSocial} />
              <DocumentCell
                status={company.conformidade}
                isConformidade={true}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
