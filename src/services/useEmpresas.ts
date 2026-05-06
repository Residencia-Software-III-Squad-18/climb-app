import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Empresa {
  id: number;
  idEmpresa?: number;
  nome: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  uf?: string;
  cep: string;
  representanteNome?: string;
  representanteCpf?: string;
  representanteContato?: string;
  latitude?: number | null;
  longitude?: number | null;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CreateEmpresaDTO {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  representanteNome?: string;
  representanteCpf?: string;
  representanteContato?: string;
}

interface EmpresaApiResponse {
  id: number;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  representanteNome?: string;
  representanteCpf?: string;
  representanteContato?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

function joinEnderecoParts(empresa: EmpresaApiResponse): string {
  return [empresa.logradouro, empresa.numero, empresa.bairro].filter(Boolean).join(", ");
}

function normalizeEmpresa(empresa: EmpresaApiResponse): Empresa {
  return {
    id: empresa.id,
    nome: empresa.nomeFantasia || empresa.razaoSocial,
    razaoSocial: empresa.razaoSocial,
    nomeFantasia: empresa.nomeFantasia,
    cnpj: empresa.cnpj,
    email: empresa.email ?? "",
    telefone: empresa.telefone ?? "",
    endereco: joinEnderecoParts(empresa),
    logradouro: empresa.logradouro,
    numero: empresa.numero,
    bairro: empresa.bairro,
    cidade: empresa.cidade ?? "",
    estado: empresa.uf ?? "",
    uf: empresa.uf,
    cep: empresa.cep ?? "",
    representanteNome: empresa.representanteNome,
    representanteCpf: empresa.representanteCpf,
    representanteContato: empresa.representanteContato,
    latitude: null,
    longitude: null,
    dataCriacao: empresa.dataCriacao ?? "",
    dataAtualizacao: empresa.dataAtualizacao ?? "",
  };
}

export function useEmpresas() {
  return useQuery<Empresa[]>({
    queryKey: ["empresas"],
    queryFn: async () => {
      const response = await api.get<EmpresaApiResponse[] | { content: EmpresaApiResponse[] }>("/empresas");
      const data = response.data;
      const empresas = Array.isArray(data) ? data : data?.content ?? [];
      return empresas.map(normalizeEmpresa);
    },
  });
}

export function useEmpresaById(id: number) {
  return useQuery<Empresa>({
    queryKey: ["empresas", id],
    queryFn: async () => {
      const response = await api.get<EmpresaApiResponse>(`/empresas/${id}`);
      return normalizeEmpresa(response.data);
    },
    enabled: !!id,
  });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmpresaDTO) => {
      const response = await api.post<EmpresaApiResponse>("/empresas", data);
      return normalizeEmpresa(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateEmpresaDTO> }) => {
      const response = await api.put<EmpresaApiResponse>(`/empresas/${id}`, data);
      return normalizeEmpresa(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}

export function useDeleteEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/empresas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}
