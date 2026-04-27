import { useState } from 'react';
import svgPaths from '../../imports/svg-d08k5ci2ha';
import { useTheme } from '../context/ThemeContext';

interface Permission {
  id: string;
  name: string;
  roles: { [key: string]: boolean };
}

const roles = [
  'Permissões',
  'Compliance',
  'CEO',
  'Membro do Conselho',
  'CSO',
  'CMO',
  'CFO',
  'AVI - Trainee',
  'AVI - junior',
  'AVI - Pleno',
  'AVI - Sênior',
  'Analista de BPO Financeiro',
  'Contador'
];

const initialPermissions: Permission[] = [
  { id: '1', name: 'Visualização, criação, edição e exclusão de Contratos', roles: {} },
  { id: '2', name: 'Visualização, criação, edição e exclusão de Cargos', roles: {} },
  { id: '3', name: 'Visualização, criação, edição e exclusão de Documentos Jurídicos', roles: {} },
  { id: '4', name: 'Aplicação de nível de complexidade de contratos', roles: {} },
  { id: '5', name: 'Visualização, criação, edição e exclusão de Empresas', roles: {} },
  { id: '6', name: 'Visualização, criação, edição e exclusão de Processos', roles: {} },
  { id: '7', name: 'Visualização, criação, edição e exclusão de Reuniões', roles: {} },
  { id: '8', name: 'Visualização, criação, edição e exclusão de Usuários', roles: {} },
];

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative size-[24px] shrink-0 transition-all hover:scale-110"
      aria-label={checked ? 'Desmarcado' : 'Marcado'}
    >
      <div
        className={`absolute inset-0 rounded-[5px] border transition-all ${
          checked
            ? 'bg-[#0abfa3] border-[#0abfa3]'
            : 'bg-[rgba(217,217,217,0)] border-[#9ea5b0]'
        }`}
      />
      {checked && (
        <svg
          className="absolute inset-0 m-auto size-[14px]"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M11.6667 3.5L5.25 9.91667L2.33333 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function PermissoesResponsive() {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const togglePermission = (permissionId: string, role: string) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === permissionId
          ? {
              ...perm,
              roles: {
                ...perm.roles,
                [role]: !perm.roles[role],
              },
            }
          : perm
      )
    );
  };

  return (
    <div className={`w-full h-full overflow-auto pt-4 p-4 md:px-7 pb-4 md:pb-7 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-[#f4f6f8]'}`}>
      {/* Header */}
      <div className={`rounded-[10px] shadow-sm border p-4 mb-4 ${
        theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e2e7ed]'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Bar */}
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
                placeholder="Buscar permissão"
                className={`w-full border rounded-[8px] pl-10 pr-4 py-2 font-['DM_Sans:Regular',sans-serif] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0abfa3] ${
                  theme === 'dark'
                    ? 'bg-[#2d2e2c] border-[#3d3e3c] text-white placeholder:text-[#6b7a8d]'
                    : 'bg-[#f4f6f8] border-[#e2e7ed] text-[#1a2332] placeholder:text-[#6b7a8d]'
                }`}
              />
            </div>
          </div>

          {/* User Info and Notifications */}
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
                <div className="absolute bg-[#ef4444] rounded-[7px] size-[14px] flex items-center justify-center -right-[3px] -top-[3px]">
                  <span className="font-['DM_Sans:Bold',sans-serif] font-bold text-[9px] text-white leading-[1]">2</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
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
              <div className="bg-[#3abfb1] rounded-full size-[34px] flex items-center justify-center shrink-0">
                <span className="font-['DM_Sans:Bold',sans-serif] font-bold text-[12px] text-white">CL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-6">
        <h1 className={`font-['DM_Sans:Bold',sans-serif] font-bold text-[20px] md:text-[24px] tracking-[-0.5px] mb-1 ${
          theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
        }`}>
          Gerenciamento de Permissões
        </h1>
        <p className={`font-['DM_Sans:Regular',sans-serif] text-[13px] ${
          theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
        }`}>
          Gerencie as permissões dos usuários
        </p>
      </div>

      {/* Responsive Table Container */}
      <div className={`rounded-[10px] shadow-sm border overflow-hidden ${
        theme === 'dark' ? 'bg-[#1e1f1d] border-[#2d2e2c]' : 'bg-white border-[#e2e7ed]'
      }`}>
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'}`}>
                <th className="text-left p-3 min-w-[280px]">
                  <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[10.5px] text-[#9ea5b0] tracking-[0.6px] uppercase">
                    Permissões
                  </span>
                </th>
                {roles.slice(1).map((role, idx) => (
                  <th key={idx} className="text-center p-3 min-w-[90px]">
                    <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[10.5px] text-[#9ea5b0] tracking-[0.6px] uppercase">
                      {role}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.id} className={`border-b transition-colors ${
                  theme === 'dark'
                    ? 'border-[#2d2e2c] hover:bg-[#2d2e2c]'
                    : 'border-[#f0f2f4] hover:bg-[#f9fafb]'
                }`}>
                  <td className="p-3">
                    <p className={`font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[12.5px] ${
                      theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
                    }`}>
                      {permission.name}
                    </p>
                  </td>
                  {roles.slice(1).map((role, idx) => (
                    <td key={idx} className="p-3 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={!!permission.roles[role]}
                          onChange={() => togglePermission(permission.id, role)}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet View */}
        <div className="lg:hidden overflow-x-auto" style={{ scrollbarGutter: 'stable' }}>
          {permissions.map((permission) => (
            <div key={permission.id} className={`border-b p-4 ${
              theme === 'dark' ? 'border-[#2d2e2c]' : 'border-[#f0f2f4]'
            }`}>
              <h3 className={`font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[13px] mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-[#1a1d23]'
              }`}>
                {permission.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-w-max">
                {roles.slice(1).map((role, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Checkbox
                      checked={!!permission.roles[role]}
                      onChange={() => togglePermission(permission.id, role)}
                    />
                    <span className={`font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[11px] ${
                      theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#5c6370]'
                    }`}>
                      {role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
