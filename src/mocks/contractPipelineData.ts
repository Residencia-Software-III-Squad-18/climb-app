export interface PipelineStep {
  id: string;
  label: string;
  count: number;
}

export interface Contract {
  id: string;
  company: string;
  service: string;
  analyst: string;
  status: "Ativo" | "Análise" | "Proposta" | "P.Docs";
  date: string;
}

export interface ContractPipelineData {
  title: string;
  subtitle: string;
  steps: PipelineStep[];
  contracts: Contract[];
  filters?: string[];
}

// Mock data - será substituído pelo React Query + Backend
export const mockContractPipelineData: ContractPipelineData = {
  title: "Pipeline dos Contratos",
  subtitle: "Encontrados 24 contratos",
  steps: [
    { id: "proposal", label: "Proposta", count: 8 },
    { id: "docs", label: "Docs", count: 3 },
    { id: "analysis", label: "Análise", count: 11 },
    { id: "active", label: "Ativos", count: 24 },
    { id: "completed", label: "Concluído", count: 34 },
  ],
  contracts: [
    {
      id: "1",
      company: "Gorillaz",
      service: "BPO",
      analyst: "Raul",
      status: "Ativo",
      date: "31.01.",
    },
    {
      id: "2",
      company: "Jotanune",
      service: "M&A",
      analyst: "Raul",
      status: "Análise",
      date: "2019",
    },
    {
      id: "3",
      company: "Bjork",
      service: "Outro",
      analyst: "Raul",
      status: "Proposta",
      date: "31.01.",
    },
    {
      id: "4",
      company: "Smiths",
      service: "BPO",
      analyst: "Raul",
      status: "P.Docs",
      date: "2019",
    },
    {
      id: "5",
      company: "Radioshead",
      service: "M&A",
      analyst: "Raul",
      status: "Ativo",
      date: "30.01.",
    },
  ],
  filters: ["All", "BPO", "M&A"],
};
