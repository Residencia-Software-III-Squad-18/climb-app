import { DocumentsTable } from "@/components/DocumentsTable";
import { LayoutContainer } from "@/components/LayoutContainer/LayoutContainer";

export function Documentos() {
  const companies = [
    {
      id: "1",
      name: "Construtora Nova Era",
      balanço: { status: "completo" as const, percentage: 100 },
      dre: { status: "completo" as const, percentage: 100 },
      planOperacional: { status: "completo" as const, percentage: 100 },
      cnpj: { status: "completo" as const, percentage: 100 },
      contratoSocial: { status: "completo" as const, percentage: 100 },
      conformidade: { status: "completo" as const, percentage: 100 },
    },
    {
      id: "2",
      name: "Farmácia Saúde+",
      balanço: { status: "completo" as const, percentage: 100 },
      dre: { status: "faltante" as const, percentage: 0 },
      planOperacional: { status: "completo" as const, percentage: 100 },
      cnpj: { status: "faltante" as const, percentage: 0 },
      contratoSocial: { status: "completo" as const, percentage: 100 },
      conformidade: { status: "faltante" as const, percentage: 80 },
    },
    {
      id: "3",
      name: "Distribuidora Armazém",
      balanço: { status: "completo" as const, percentage: 100 },
      dre: { status: "completo" as const, percentage: 100 },
      planOperacional: { status: "faltante" as const, percentage: 0 },
      cnpj: { status: "completo" as const, percentage: 100 },
      contratoSocial: { status: "completo" as const, percentage: 100 },
      conformidade: { status: "completo" as const, percentage: 80 },
    },
  ];

  return (
    <LayoutContainer title="Documentos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0e1822] dark:text-white">
              Gestão Documental
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm">
              Drive
            </button>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium text-sm">
              + Solicitar
            </button>
          </div>
        </div>

        {/* Seção de Documentação */}
        <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white mb-6">
            Documentação por Empresa
          </h3>

          <DocumentsTable companies={companies} />
        </div>
      </div>
    </LayoutContainer>
  );
}
