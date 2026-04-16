type StatusType = "Ativo" | "Análise" | "Proposta" | "P.Docs";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusColorMap: Record<StatusType, string> = {
    Ativo: "bg-cyan-200 dark:bg-cyan-600 text-gray-900 dark:text-white",
    Análise: "bg-blue-200 dark:bg-blue-600 text-gray-900 dark:text-white",
    Proposta: "bg-cyan-200 dark:bg-cyan-600 text-gray-900 dark:text-white",
    "P.Docs": "bg-orange-200 dark:bg-orange-600 text-gray-900 dark:text-white",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${statusColorMap[status]}`}
    >
      {status}
    </span>
  );
}
