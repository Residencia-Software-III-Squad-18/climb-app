import { useState } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";

import { ContractsTable } from "@/components/ContractsTable";
import { ContractsTabs } from "@/components/ContractsTabs";
import { LayoutContainer } from "@/components/LayoutContainer/LayoutContainer";

export function Contratos() {
  const [activeTab, setActiveTab] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { label: "Todos", value: "todos" },
    { label: "Atrasados", value: "atrasados" },
    { label: "Em análise", value: "em-analise" },
    { label: "Pendentes", value: "pendentes" },
    { label: "Concluído", value: "concluido" },
  ];

  const allContracts = [
    {
      id: "1",
      contractNumber: "CT-2024-089",
      company: "Tech Solutions LTDA",
      analyst: "João Silva",
      value: "R$ 45.000",
      risk: "Baixo" as const,
      status: "Ativo" as const,
      progress: 75,
    },
    {
      id: "2",
      contractNumber: "CT-2024-088",
      company: "Nova Digital S.A.",
      analyst: "Maria Santos",
      value: "R$ 120.000",
      risk: "Médio" as const,
      status: "Em análise" as const,
      progress: 40,
    },
    {
      id: "3",
      contractNumber: "CT-2024-087",
      company: "Ayna Construções",
      analyst: "Pedro Lima",
      value: "R$ 78.500",
      risk: "Alto" as const,
      status: "Pendente" as const,
      progress: 15,
    },
    {
      id: "4",
      contractNumber: "CT-2024-086",
      company: "Beta Serviços ME",
      analyst: "Ana Oliveira",
      value: "R$ 32.000",
      risk: "Baixo" as const,
      status: "Ativo" as const,
      progress: 80,
    },
    {
      id: "5",
      contractNumber: "CT-2024-085",
      company: "Gamma Logística",
      analyst: "Carlos Reis",
      value: "R$ 95.000",
      risk: "Médio" as const,
      status: "Concluído" as const,
      progress: 100,
    },
    {
      id: "6",
      contractNumber: "CT-2024-084",
      company: "Delta Consultoria",
      analyst: "João Silva",
      value: "R$ 55.000",
      risk: "Baixo" as const,
      status: "Ativo" as const,
      progress: 60,
    },
  ];

  // Filtrar por aba
  let filteredContracts = allContracts;

  if (activeTab !== "todos") {
    filteredContracts = allContracts.filter((contract) => {
      switch (activeTab) {
        case "atrasados":
          return contract.status === "Pendente";
        case "em-analise":
          return contract.status === "Em análise";
        case "pendentes":
          return contract.status === "Pendente";
        case "concluido":
          return contract.status === "Concluído";
        default:
          return true;
      }
    });
  }

  // Filtrar por busca
  const displayedContracts = filteredContracts.filter(
    (contract) =>
      contract.contractNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      contract.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.analyst.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LayoutContainer title="Contratos">
      <div className="space-y-6">
        {/* Header com Título e Botão */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0e1822] dark:text-white">
            Contratos
          </h2>
          <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium text-sm">
            + Novo Contrato
          </button>
        </div>

        {/* Barra de Busca e Filtro */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar contratos, proprietários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0e1822] text-[#0e1822] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-[#0e1822] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <span>
              <RxMagnifyingGlass />
            </span>
            <span className="text-sm font-medium">Buscar</span>
          </button>
        </div>

        {/* Abas */}
        <ContractsTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tabela */}
        <ContractsTable contracts={displayedContracts} />
      </div>
    </LayoutContainer>
  );
}
