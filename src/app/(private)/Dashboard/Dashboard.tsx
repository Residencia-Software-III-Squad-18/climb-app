import { useState } from "react";

import { CalendarCard } from "@/components/CalendarCard";
import { ContractPipeline } from "@/components/ContractPipeline";
import { DocsCard } from "@/components/DocsCard";
import { FilterHeader } from "@/components/FilterHeader";
import { FluxoAtivoCard } from "@/components/FluxoAtivoCard";
import { LayoutContainer } from "@/components/LayoutContainer/LayoutContainer";
import { NotificationsCard } from "@/components/NotificationsCard";
import { StatsGrid } from "@/components/StatsGrid";

import {
  useContratos,
  useNotificacoes,
  useDocumentos,
} from "@/hooks/dashboard";
import { mockCalendarData } from "@/mocks/calendarData";
import { mockFluxoAtivoData } from "@/mocks/docsAndFluxoData";

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: contratos = [], refetch: refetchContratos } = useContratos();
  const { data: notificacoes = [] } = useNotificacoes();
  const { data: documentos = [] } = useDocumentos();

  // === STATS GRID ===
  const statsData = [
    {
      id: "active-contracts",
      title: "Contratos Ativos",
      value: contratos.filter((c) => c.status === "ATIVO").length,
      description: "Contratos em vigor",
    },
    {
      id: "proposal-contracts",
      title: "Propostas Pendentes",
      value: contratos.filter((c) => c.status === "EM_ANALISE").length,
      description: "Aguardando aprovação",
    },
    {
      id: "pending-docs",
      title: "Documentos Pendentes",
      value: documentos.length,
      description: "Documentos cadastrados",
    },
    {
      id: "notifications",
      title: "Notificações",
      value: notificacoes.filter((n) => !n.lida).length,
      description: "Não lidas",
    },
  ];

  // === CONTRACT PIPELINE ===
  // Agrupar contratos por status
  const contratosPorStatus = {
    ATIVO: contratos.filter((c) => c.status === "ATIVO"),
    EM_ANALISE: contratos.filter((c) => c.status === "EM_ANALISE"),
    CANCELADO: contratos.filter((c) => c.status === "CANCELADO"),
  };

  // Filtrar contratos baseado no filtro ativo
  const filteredContracts = {
    All: contratos,
    Ativo: contratosPorStatus.ATIVO,
    Análise: contratosPorStatus.EM_ANALISE,
    "P.Docs": contratosPorStatus.CANCELADO,
  };

  const contractPipelineData = {
    title: "Pipeline dos Contratos",
    subtitle: `Encontrados ${contratos.length} contratos`,
    steps: [
      {
        id: "proposal",
        label: "Proposta",
        count: contratosPorStatus.EM_ANALISE.length,
      },
      {
        id: "analysis",
        label: "Análise",
        count: contratosPorStatus.EM_ANALISE.length,
      },
      { id: "active", label: "Ativos", count: contratosPorStatus.ATIVO.length },
      {
        id: "completed",
        label: "Concluído",
        count: contratosPorStatus.CANCELADO.length,
      },
    ],
    contracts: (
      filteredContracts[activeFilter as keyof typeof filteredContracts] ||
      contratos
    ).map((c) => ({
      id: String(c.id),
      company: c.nomeEmpresa,
      service: "Serviço",
      analyst: "Admin",
      status: (c.status === "ATIVO"
        ? "Ativo"
        : c.status === "EM_ANALISE"
          ? "Análise"
          : "P.Docs") as "Ativo" | "Análise" | "Proposta" | "P.Docs",
      date: new Date(c.dataInicio).toLocaleDateString("pt-BR", {
        month: "2-digit",
        day: "2-digit",
      }),
    })),
    filters: ["All", "Ativo", "Análise", "P.Docs"],
  };

  // === DOCS CARD ===
  const docsCardData = {
    title: "Docs",
    subtitle: "Documentação Corporativa",
    documents: documentos.slice(0, 5).map((doc, index) => ({
      id: String(doc.id),
      name: doc.nome,
      status: index < 3 ? ("Validado" as const) : ("Aguardando" as const),
      checked: index < 3,
    })),
    compliancePercentage:
      documentos.length > 0
        ? Math.round((Math.min(3, documentos.length) / documentos.length) * 100)
        : 0,
    complianceLabel: "Conformidade",
  };

  // === NOTIFICATIONS CARD ===
  const notificationsCardData = {
    title: "Notificações Recentes",
    viewAllLabel: "Ver Todas",
    notifications: notificacoes.slice(0, 4).map((notif) => ({
      id: String(notif.id),
      icon: notif.lida ? "✓" : "⚠️",
      title: notif.titulo,
      time: new Date(notif.dataCriacao).toLocaleString("pt-BR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })),
  };

  const handleNewContract = () => {
    console.log("Novo contrato clicado");
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    console.log("Data selecionada:", startDate, "até", endDate);
  };

  const handleMenuClick = () => {
    console.log("Menu clicado");
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
  };

  const handleRefreshPipeline = () => {
    refetchContratos();
  };

  return (
    <LayoutContainer title="Dashboard">
      <div className="space-y-6">
        {/* Filter Header */}
        <FilterHeader
          onNewContract={handleNewContract}
          onDateRangeChange={handleDateRangeChange}
          onMenuClick={handleMenuClick}
          onSearch={handleSearch}
        />

        <StatsGrid stats={statsData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ContractPipeline
              data={contractPipelineData}
              onRefresh={handleRefreshPipeline}
              onFilterChange={handleFilterChange}
              activeFilter={activeFilter}
            />

            {/* Docs and Fluxo Ativo */}
            <div className="grid grid-cols-2 gap-4">
              <DocsCard data={docsCardData} />
              <FluxoAtivoCard data={mockFluxoAtivoData} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications */}
            <NotificationsCard data={notificationsCardData} />

            {/* Calendar */}
            <CalendarCard
              title={mockCalendarData.title}
              scheduleButtonLabel={mockCalendarData.scheduleButtonLabel}
              month={mockCalendarData.month}
              daysInMonth={mockCalendarData.daysInMonth}
              currentDay={mockCalendarData.currentDay}
            />
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
}
