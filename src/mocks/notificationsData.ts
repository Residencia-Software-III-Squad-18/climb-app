export interface Notification {
  id: string;
  icon: string;
  title: string;
  time: string;
}

export interface NotificationsCardData {
  title: string;
  viewAllLabel: string;
  notifications: Notification[];
}

// Mock data - será substituído pelo React Query + Backend
export const mockNotificationsCardData: NotificationsCardData = {
  title: "Notificações Recentes",
  viewAllLabel: "Ver Todas",
  notifications: [
    {
      id: "1",
      icon: "⚠️",
      title: "Contrato da Tech Solutions",
      time: "há 10 minutos",
    },
    {
      id: "2",
      icon: "📄",
      title: "Contrato Meridian vence em 30 dias",
      time: "há 2 horas",
    },
    {
      id: "3",
      icon: "✓",
      title: "Formulário Solução enviou o Balanço",
      time: "ontem, 15:20",
    },
    {
      id: "4",
      icon: "👥",
      title: "Reunião com Grupo Meridian agendada",
      time: "ontem, 13:20",
    },
  ],
};
