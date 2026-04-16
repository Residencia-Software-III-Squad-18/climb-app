export interface ContractTableRow {
  id: string;
  contractNumber: string;
  company: string;
  analyst: string;
  value: string;
  risk: "Baixo" | "Médio" | "Alto";
  status: "Ativo" | "Em análise" | "Pendente" | "Concluído";
  progress: number;
}

export interface ContractsPageData {
  searchPlaceholder: string;
  tabs: {
    label: string;
    value: string;
  }[];
  contracts: ContractTableRow[];
}

// Mock data
export const mockContractsData: ContractsPageData = {
  searchPlaceholder: "Buscar contratos, proprietários...",
  tabs: [
    { label: "Todos", value: "todos" },
    { label: "Atrasados", value: "atrasados" },
    { label: "Em análise", value: "em-analise" },
    { label: "Pendentes", value: "pendentes" },
    { label: "Concluído", value: "concluido" },
  ],
  contracts: [
    {
      id: "1",
      contractNumber: "CT-2024-089",
      company: "Tech Solutions LTDA",
      analyst: "João Silva",
      value: "R$ 45.000",
      risk: "Baixo",
      status: "Ativo",
      progress: 75,
    },
    {
      id: "2",
      contractNumber: "CT-2024-088",
      company: "Nova Digital S.A.",
      analyst: "Maria Santos",
      value: "R$ 120.000",
      risk: "Médio",
      status: "Em análise",
      progress: 40,
    },
    {
      id: "3",
      contractNumber: "CT-2024-087",
      company: "Ayna Construções",
      analyst: "Pedro Lima",
      value: "R$ 78.500",
      risk: "Alto",
      status: "Pendente",
      progress: 15,
    },
    {
      id: "4",
      contractNumber: "CT-2024-086",
      company: "Beta Serviços ME",
      analyst: "Ana Oliveira",
      value: "R$ 32.000",
      risk: "Baixo",
      status: "Ativo",
      progress: 80,
    },
    {
      id: "5",
      contractNumber: "CT-2024-085",
      company: "Gamma Logística",
      analyst: "Carlos Reis",
      value: "R$ 95.000",
      risk: "Médio",
      status: "Concluído",
      progress: 100,
    },
    {
      id: "6",
      contractNumber: "CT-2024-084",
      company: "Delta Consultoria",
      analyst: "João Silva",
      value: "R$ 55.000",
      risk: "Baixo",
      status: "Ativo",
      progress: 60,
    },
  ],
};
