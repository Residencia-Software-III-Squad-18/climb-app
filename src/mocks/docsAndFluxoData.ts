export interface DocumentItem {
  id: string;
  name: string;
  status: "Validado" | "Aguardando";
  checked: boolean;
}

export interface DocsCardData {
  title: string;
  subtitle: string;
  documents: DocumentItem[];
  compliancePercentage: number;
  complianceLabel: string;
}

export interface FluxoItem {
  id: string;
  title: string;
  date: string;
}

export interface FluxoAtivoData {
  title: string;
  subtitle: string;
  items: FluxoItem[];
}

// Mock data - será substituído pelo React Query + Backend
export const mockDocsCardData: DocsCardData = {
  title: "Docs",
  subtitle: "Farmácias Saúde+",
  documents: [
    { id: "1", name: "Contrato Social", status: "Validado", checked: true },
    {
      id: "2",
      name: "Balanço da Empresa",
      status: "Validado",
      checked: true,
    },
    {
      id: "3",
      name: "Planilhas Gerenciais",
      status: "Validado",
      checked: true,
    },
    { id: "4", name: "CNPJ", status: "Aguardando", checked: false },
    { id: "5", name: "DRE", status: "Aguardando", checked: false },
  ],
  compliancePercentage: 60,
  complianceLabel: "Conformidade documental",
};

export const mockFluxoAtivoData: FluxoAtivoData = {
  title: "Fluxo Ativo",
  subtitle: "Farmácias Saúde+",
  items: [
    { id: "1", title: "Reunião Contratante", date: "24.11.2020" },
    { id: "2", title: "Proposta Aprovada", date: "25.11.2019" },
    { id: "3", title: "Contrato Criado", date: "28.11.2020" },
    { id: "4", title: "Documentação da Empresa", date: "Pendente" },
    { id: "5", title: "Cadastro no Sistema", date: "Pendente" },
    { id: "6", title: "Análise & Relatório", date: "Pendente" },
  ],
};
