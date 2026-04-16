export interface StatData {
  id: string;
  title: string;
  value: string | number;
  description: string;
}

// Mock data - será substituído pelo React Query + Backend
export const mockStatsData: StatData[] = [
  {
    id: "active-contracts",
    title: "Contratos Ativos",
    value: 24,
    description: "1 mais que mês passado",
  },
  {
    id: "pending-proposals",
    title: "Propostos Pendentes",
    value: 7,
    description: "Aguardando aprovação",
  },
  {
    id: "pending-docs",
    title: "Documentos Pendentes",
    value: 11,
    description: "Análise pendentes",
  },
  {
    id: "weekly-meetings",
    title: "Reuniões esta semana",
    value: 7,
    description: "3 dias mais seja semana",
  },
];
