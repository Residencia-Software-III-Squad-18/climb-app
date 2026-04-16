export interface FilterHeaderData {
  dateRangeLabel: string;
  newContractLabel: string;
  searchPlaceholder: string;
}

// Mock data - será substituído pelo React Query + Backend
export const mockFilterHeaderData: FilterHeaderData = {
  dateRangeLabel: "11 Nov - 11 Dec, 2026",
  newContractLabel: "Novo Contrato",
  searchPlaceholder: "Buscar...",
};
