import { useState } from 'react';
import svgPaths from '../../imports/svg-on1v92fybh';
import svgPathsDoc from '../../imports/svg-b3epu4th1g';
import { useTheme } from '../context/ThemeContext';

interface Contract {
  id: string;
  code: string;
  type: string;
  company: string;
  analyst: string;
  value: string;
  risk: 'Baixo' | 'Médio' | 'Alto';
  status: 'Ativo' | 'Pendente' | 'Em análise' | 'Concluído';
  progress: number;
  documents: {
    name: string;
    status: 'Validado' | 'Aguardando';
  }[];
  conformidade: number;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    code: 'CT-2024-089',
    type: 'CDB',
    company: 'Tech Solutions LTDA',
    analyst: 'João Silva',
    value: 'R$ 45.000',
    risk: 'Baixo',
    status: 'Ativo',
    progress: 75,
    documents: [
      { name: 'Contrato Social', status: 'Validado' },
      { name: 'Balanço da Empresa', status: 'Validado' },
      { name: 'Planilhas Gerenciais', status: 'Validado' },
      { name: 'CNPJ', status: 'Aguardando' },
      { name: 'DRE', status: 'Aguardando' },
    ],
    conformidade: 75,
  },
  {
    id: '2',
    code: 'CT-2024-088',
    type: 'LCI',
    company: 'Nova Digital S.A.',
    analyst: 'Maria Santos',
    value: 'R$ 120.000',
    risk: 'Médio',
    status: 'Em análise',
    progress: 40,
    documents: [
      { name: 'Contrato Social', status: 'Validado' },
      { name: 'Balanço da Empresa', status: 'Aguardando' },
      { name: 'Planilhas Gerenciais', status: 'Aguardando' },
      { name: 'CNPJ', status: 'Validado' },
      { name: 'DRE', status: 'Aguardando' },
    ],
    conformidade: 40,
  },
  {
    id: '3',
    code: 'CT-2024-087',
    type: 'CRI',
    company: 'Alpha Construções',
    analyst: 'Pedro Lima',
    value: 'R$ 78.500',
    risk: 'Alto',
    status: 'Pendente',
    progress: 15,
    documents: [
      { name: 'Contrato Social', status: 'Aguardando' },
      { name: 'Balanço da Empresa', status: 'Aguardando' },
      { name: 'Planilhas Gerenciais', status: 'Aguardando' },
      { name: 'CNPJ', status: 'Aguardando' },
      { name: 'DRE', status: 'Validado' },
    ],
    conformidade: 15,
  },
  {
    id: '4',
    code: 'CT-2024-086',
    type: 'LCA',
    company: 'Beta Serviços ME',
    analyst: 'Ana Oliveira',
    value: 'R$ 32.000',
    risk: 'Baixo',
    status: 'Ativo',
    progress: 90,
    documents: [
      { name: 'Contrato Social', status: 'Validado' },
      { name: 'Balanço da Empresa', status: 'Validado' },
      { name: 'Planilhas Gerenciais', status: 'Validado' },
      { name: 'CNPJ', status: 'Validado' },
      { name: 'DRE', status: 'Aguardando' },
    ],
    conformidade: 90,
  },
  {
    id: '5',
    code: 'CT-2024-085',
    type: 'CDB',
    company: 'Gamma Logística',
    analyst: 'Carlos Reis',
    value: 'R$ 95.000',
    risk: 'Médio',
    status: 'Concluído',
    progress: 100,
    documents: [
      { name: 'Contrato Social', status: 'Validado' },
      { name: 'Balanço da Empresa', status: 'Validado' },
      { name: 'Planilhas Gerenciais', status: 'Validado' },
      { name: 'CNPJ', status: 'Validado' },
      { name: 'DRE', status: 'Validado' },
    ],
    conformidade: 100,
  },
  {
    id: '6',
    code: 'CT-2024-084',
    type: 'LCI',
    company: 'Delta Consultoria',
    analyst: 'João Silva',
    value: 'R$ 65.000',
    risk: 'Baixo',
    status: 'Ativo',
    progress: 60,
    documents: [
      { name: 'Contrato Social', status: 'Validado' },
      { name: 'Balanço da Empresa', status: 'Validado' },
      { name: 'Planilhas Gerenciais', status: 'Aguardando' },
      { name: 'CNPJ', status: 'Validado' },
      { name: 'DRE', status: 'Aguardando' },
    ],
    conformidade: 60,
  },
];

export default function ContratosResponsive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const { theme } = useTheme();

  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch =
      contract.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'Todos' || contract.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getRiskColor = (risk: Contract['risk']) => {
    switch (risk) {
      case 'Baixo':
        return 'text-[#16a34a]';
      case 'Médio':
        return 'text-[#d97706]';
      case 'Alto':
        return 'text-[#dc2626]';
      default:
        return 'text-[#6b7a8d]';
    }
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'Ativo':
        return 'bg-[#dcfce7] text-[#16a34a]';
      case 'Pendente':
        return 'bg-[#fef3c7] text-[#d97706]';
      case 'Em análise':
        return 'bg-[#fef9c3] text-[#ca8a04]';
      case 'Concluído':
        return 'bg-[#e0e7ff] text-[#4f46e5]';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className={`w-full h-full overflow-auto pt-4 p-4 md:px-7 pb-4 md:pb-7 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-[#f4f6f8]'}`}>
      {/* Header with Search and User */}
      <div className={`rounded-[10px] shadow-sm border p-4 mb-4 ${
        theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e2e7ed]'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="w-full md:w-[360px]">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
                  <path d={svgPaths.p8cdb700} stroke={theme === 'dark' ? '#9ea5b0' : '#6B7A8D'} strokeWidth="1.16667" />
                  <path d="M12.25 12.25L9.7125 9.7125" stroke={theme === 'dark' ? '#9ea5b0' : '#6B7A8D'} strokeWidth="1.16667" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar contratos, propostas..."
                className={`w-full border rounded-[8px] pl-10 pr-4 py-2 font-['DM_Sans:Regular',sans-serif] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#6b7a8d]'
                    : 'bg-[#f4f6f8] border-[#e2e7ed] text-[#1a2332] placeholder:text-[#6b7a8d]'
                }`}
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className={`relative p-[6px] rounded-[8px] cursor-pointer transition-colors ${
              theme === 'dark' ? 'hover:bg-[#2d2e2c]' : 'hover:bg-[#f0f0f0]'
            }`}>
              <div className="relative size-[18px]">
                <svg className="size-full" fill="none" viewBox="0 0 18 18">
                  <g clipPath="url(#clip0_1_579)">
                    <path d={svgPaths.p27edad80} stroke={theme === 'dark' ? '#b8bcc4' : '#6B7A8D'} strokeWidth="1.5" />
                    <path d={svgPaths.pbb28200} stroke={theme === 'dark' ? '#b8bcc4' : '#6B7A8D'} strokeWidth="1.5" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_579">
                      <rect fill="white" height="18" width="18" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="absolute bg-[#ef4444] flex items-center justify-center right-[2px] rounded-[7px] size-[14px] top-[2px]">
                <p className="font-['DM_Sans:Bold',sans-serif] font-bold text-[9px] text-white">2</p>
              </div>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${
                  theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                }`}>
                  Analista
                </p>
                <p className={`font-['DM_Sans:Regular',sans-serif] text-[11px] ${
                  theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
                }`}>
                  analista@climbe.com
                </p>
              </div>
              <div className="bg-[#3abfb1] flex items-center justify-center rounded-full size-[34px]">
                <p className="font-['DM_Sans:Bold',sans-serif] font-bold text-[12px] text-white">CL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title and Actions */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`font-['DM_Sans:Bold',sans-serif] font-bold text-[24px] tracking-[-0.5px] mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
          }`}>
            Contratos
          </h1>
          <p className={`font-['DM_Sans:Regular',sans-serif] text-[13px] ${
            theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
          }`}>
            {filteredContracts.length} de {mockContracts.length} contratos
          </p>
        </div>

        {/* New Contract Button */}
        <button className="bg-[#3abfb1] flex items-center gap-2 px-[16px] py-[9px] rounded-[8px] hover:bg-[#35a89d] transition-colors">
          <svg className="size-[14px]" viewBox="0 0 14 14" fill="none">
            <path d="M7 2.91667V11.0833" stroke="white" strokeWidth="1.16667" />
            <path d="M2.91667 7H11.0833" stroke="white" strokeWidth="1.16667" />
          </svg>
          <span className="font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] text-white">
            Novo Contrato
          </span>
        </button>
      </div>

      {/* Status Filter */}
      <div className={`rounded-[10px] border p-[5px] mb-4 flex gap-[4px] flex-wrap ${
        theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e2e7ed]'
      }`}>
        {['Todos', 'Ativo', 'Em análise', 'Pendente', 'Concluído'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-[18px] py-[7px] rounded-[7px] text-[13px] font-['DM_Sans:Medium',sans-serif] transition-colors ${
              selectedStatus === status
                ? 'bg-[#1a2332] text-white'
                : theme === 'dark'
                ? 'text-[#b8bcc4] hover:bg-[#2d2e2c]'
                : 'text-[#6b7a8d] hover:bg-[#f4f6f8]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className={`rounded-t-[10px] border-b p-4 flex gap-3 ${
        theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e2e7ed]'
      }`}>
        <div className={`border rounded-[8px] flex items-center gap-2 px-[13px] py-[8px] flex-1 max-w-[320px] ${
          theme === 'dark' ? 'bg-[#2d2e2c] border-[#3d3e3c]' : 'bg-[#f4f6f8] border-[#e2e7ed]'
        }`}>
          <svg className="size-[13px]" fill="none" viewBox="0 0 13 13">
            <path d={svgPaths.p257f19f0} stroke={theme === 'dark' ? '#9ea5b0' : '#6B7A8D'} strokeWidth="1.08333" />
            <path d={svgPaths.p2b7e8600} stroke={theme === 'dark' ? '#9ea5b0' : '#6B7A8D'} strokeWidth="1.08333" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por empresa ou ID..."
            className={`bg-transparent flex-1 font-['DM_Sans:Regular',sans-serif] text-[13px] focus:outline-none ${
              theme === 'dark'
                ? 'text-white placeholder:text-[#6b7a8d]'
                : 'text-[#1a2332] placeholder:text-[#6b7a8d]'
            }`}
          />
        </div>

        <button className={`border rounded-[8px] flex items-center gap-[6px] px-[15px] py-[8px] transition-colors ${
          theme === 'dark'
            ? 'bg-[#1e1f1d] border-[#3d3e3c] hover:bg-[#2d2e2c]'
            : 'bg-white border-[#e2e7ed] hover:bg-[#f4f6f8]'
        }`}>
          <svg className="size-[13px]" fill="none" viewBox="0 0 13 13">
            <g clipPath="url(#clip0_1_1439)">
              <path d={svgPaths.p28cbbd80} stroke={theme === 'dark' ? '#b8bcc4' : '#1A2332'} strokeWidth="1.08333" />
            </g>
            <defs>
              <clipPath id="clip0_1_1439">
                <rect fill="white" height="13" width="13" />
              </clipPath>
            </defs>
          </svg>
          <span className={`font-['DM_Sans:Medium',sans-serif] text-[13px] ${
            theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
          }`}>Filtros</span>
          <svg className="size-[10px]" fill="none" viewBox="0 0 10 10">
            <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke={theme === 'dark' ? '#b8bcc4' : '#1A2332'} strokeWidth="0.833333" />
          </svg>
        </button>
      </div>

      {/* Contracts Table */}
      <div className={`rounded-b-[10px] border border-t-0 overflow-hidden ${
        theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e2e7ed]'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`text-left pb-[13px] pt-[12px] px-[20px] border-b ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                }`}>
                  <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                  }`}>
                    CONTRATO
                  </span>
                </th>
                <th className={`text-left pb-[13px] pt-[12px] px-[20px] border-b ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                }`}>
                  <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                  }`}>
                    EMPRESA
                  </span>
                </th>
                <th className={`text-left pb-[13px] pt-[12px] px-[20px] border-b ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                }`}>
                  <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                  }`}>
                    ANALISTA
                  </span>
                </th>
                <th className={`text-left pb-[13px] pt-[12px] px-[20px] border-b ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                }`}>
                  <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                  }`}>
                    VALOR
                  </span>
                </th>
                <th className={`text-left pb-[13px] pt-[12px] px-[20px] border-b ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                }`}>
                  <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                  }`}>
                    RISCO
                  </span>
                </th>
                <th className={`text-left pb-[13px] pt-[12px] px-[20px] border-b ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                }`}>
                  <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                  }`}>
                    STATUS
                  </span>
                </th>
                <th className={`text-left pb-[13px] pt-[12px] px-[20px] border-b ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                }`}>
                  <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] ${
                    theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                  }`}>
                    PROGRESSO
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  className={`border-b cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'border-[#2d2e2c] hover:bg-[#2d2e2c]'
                      : 'border-[#e2e7ed] hover:bg-[#f9fafb]'
                  }`}
                >
                  <td className="px-[20px] py-[17px]">
                    <div className="flex items-center gap-[10px]">
                      <div className={`flex items-center justify-center rounded-[7px] size-[32px] ${
                        theme === 'dark' ? 'bg-[#1e3532]' : 'bg-[#e8f7f6]'
                      }`}>
                        <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
                          <path d={svgPaths.p35935b40} stroke="#3ABFB1" strokeWidth="1.16667" />
                          <path d={svgPaths.p3d666700} stroke="#3ABFB1" strokeWidth="1.16667" />
                        </svg>
                      </div>
                      <div>
                        <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${
                          theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                        }`}>
                          {contract.code}
                        </p>
                        <p className={`font-['DM_Sans:Regular',sans-serif] text-[11px] ${
                          theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
                        }`}>
                          {contract.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-[20px] py-[22px]">
                    <p className={`font-['DM_Sans:Bold',sans-serif] font-bold text-[13px] ${
                      theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                    }`}>
                      {contract.company}
                    </p>
                  </td>
                  <td className="px-[20px] py-[22px]">
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${
                      theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                    }`}>
                      {contract.analyst}
                    </p>
                  </td>
                  <td className="px-[20px] py-[22px]">
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${
                      theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                    }`}>
                      {contract.value}
                    </p>
                  </td>
                  <td className="px-[20px] py-[22px]">
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${getRiskColor(contract.risk)}`}>
                      {contract.risk}
                    </p>
                  </td>
                  <td className="px-[20px] py-[22px]">
                    <span
                      className={`inline-flex px-[10px] py-[3px] rounded-[20px] font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[12px] ${getStatusColor(
                        contract.status
                      )}`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-[20px] py-[22px]">
                    <div className="flex items-center gap-2">
                      <div className={`h-[6px] rounded-[3px] flex-1 max-w-[120px] overflow-hidden ${
                        theme === 'dark' ? 'bg-[#3d3e3c]' : 'bg-[#e8eaed]'
                      }`}>
                        <div
                          className="bg-[#3abfb1] h-full rounded-[3px]"
                          style={{ width: `${contract.progress}%` }}
                        />
                      </div>
                      <span className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[12px] min-w-[35px] ${
                        theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                      }`}>
                        {contract.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContracts.length === 0 && (
          <div className="p-8 text-center">
            <p className={`font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[14px] ${
              theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#9ea5b0]'
            }`}>
              Nenhum contrato encontrado
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedContract && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedContract(null)}
        >
          <div
            className={`rounded-[10px] border-2 max-w-[840px] w-full max-h-[90vh] overflow-auto ${
              theme === 'dark'
                ? 'bg-[#0f1419] border-[#2d2e2c]'
                : 'bg-[#f4f6f8] border-[#c7e5e3]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`border-b p-[20px] flex items-center justify-between rounded-t-[10px] ${
              theme === 'dark'
                ? 'bg-[#1e1f1d] border-[#2d2e2c]'
                : 'bg-white border-[#e2e7ed]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center rounded-[7px] size-[29px] ${
                  theme === 'dark' ? 'bg-[#1e3532]' : 'bg-[#e8f7f6]'
                }`}>
                  <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                    <path d={svgPathsDoc.p3fbf2200} fill={theme === 'dark' ? '#3ABFB1' : '#1A2332'} />
                  </svg>
                </div>
                <h2 className={`font-['DM_Sans:Bold',sans-serif] font-bold text-[24px] ${
                  theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                }`}>
                  {selectedContract.company}
                </h2>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className={`size-[32px] flex items-center justify-center rounded-[8px] transition-colors ${
                  theme === 'dark' ? 'hover:bg-[#2d2e2c]' : 'hover:bg-[#f0f2f4]'
                }`}
              >
                <svg className="size-[14px]" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 12.5L12.5 1.5" stroke={theme === 'dark' ? '#b8bcc4' : '#1A2332'} strokeLinecap="round" strokeWidth="2" />
                  <path d="M1.5 1.5L12.5 12.5" stroke={theme === 'dark' ? '#b8bcc4' : '#1A2332'} strokeLinecap="round" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-[22px] grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side - Contract Info */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className={`border-b pb-3 ${
                    theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                  }`}>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] mb-2 ${
                      theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                    }`}>
                      ANALISTA
                    </p>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${
                      theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                    }`}>
                      {selectedContract.analyst}
                    </p>
                  </div>

                  <div className={`border-b pb-3 ${
                    theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                  }`}>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] mb-2 ${
                      theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                    }`}>
                      CONTRATO
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center rounded-[7px] size-[32px] ${
                        theme === 'dark' ? 'bg-[#1e3532]' : 'bg-[#e8f7f6]'
                      }`}>
                        <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
                          <path d={svgPaths.p35935b40} stroke="#3ABFB1" strokeWidth="1.16667" />
                          <path d={svgPaths.p3d666700} stroke="#3ABFB1" strokeWidth="1.16667" />
                        </svg>
                      </div>
                      <div>
                        <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${
                          theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                        }`}>
                          {selectedContract.code}
                        </p>
                        <p className={`font-['DM_Sans:Regular',sans-serif] text-[11px] ${
                          theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
                        }`}>
                          {selectedContract.type}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`border-b pb-3 ${
                    theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                  }`}>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] mb-2 ${
                      theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                    }`}>
                      VALOR
                    </p>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${
                      theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
                    }`}>
                      {selectedContract.value}
                    </p>
                  </div>

                  <div className={`border-b pb-3 ${
                    theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#e2e7ed]'
                  }`}>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] mb-2 ${
                      theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                    }`}>
                      RISCO
                    </p>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[13px] ${getRiskColor(selectedContract.risk)}`}>
                      {selectedContract.risk}
                    </p>
                  </div>

                  <div>
                    <p className={`font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[11px] uppercase tracking-[0.5px] mb-2 ${
                      theme === 'dark' ? 'text-[#6b7a8d]' : 'text-[#6b7a8d]'
                    }`}>
                      STATUS
                    </p>
                    <span
                      className={`inline-flex px-[10px] py-[3px] rounded-[20px] font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[12px] ${getStatusColor(
                        selectedContract.status
                      )}`}
                    >
                      {selectedContract.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Documentation */}
              <div className={`rounded-[10px] border shadow-sm overflow-hidden ${
                theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e8eaed]'
              }`}>
                <div className={`border-b p-3 ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
                }`}>
                  <p className={`font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[13px] ${
                    theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                  }`}>
                    Documentação
                  </p>
                </div>

                <div className={`divide-y ${
                  theme === 'dark' ? 'divide-[#2d2e2c]' : 'divide-[#f0f2f4]'
                }`}>
                  {selectedContract.documents.map((doc, index) => (
                    <div key={index} className="px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center size-[17px] rounded-[4px] ${
                            doc.status === 'Validado' ? 'bg-[#d1fae5]' : 'bg-[#fef3c7]'
                          }`}
                        >
                          <span
                            className={`font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[13px] ${
                              doc.status === 'Validado' ? 'text-[#10b981]' : 'text-[#d97706]'
                            }`}
                          >
                            {doc.status === 'Validado' ? '✓' : '!'}
                          </span>
                        </div>
                        <p className={`font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[11.5px] ${
                          theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                        }`}>
                          {doc.name}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-[20px] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[11.5px] ${
                          doc.status === 'Validado'
                            ? 'bg-[#d1fae5] text-[#10b981]'
                            : 'bg-[#fef3c7] text-[#d97706]'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`p-3 border-t ${
                  theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[11.5px] ${
                      theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#5c6370]'
                    }`}>
                      Conformidade documental
                    </p>
                    <p className={`font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[13px] ${
                      theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                    }`}>
                      {selectedContract.conformidade}%
                    </p>
                  </div>
                  <div className={`h-[4px] rounded-[2px] overflow-hidden ${
                    theme === 'dark' ? 'bg-[#3d3e3c]' : 'bg-[#e8eaed]'
                  }`}>
                    <div
                      className="bg-[#0abfa3] h-full rounded-[2px]"
                      style={{ width: `${selectedContract.conformidade}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
