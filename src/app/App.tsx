import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import PermissoesResponsive from './components/PermissoesResponsive';
import ClimbeInvestimentosResponsive from './components/ClimbeInvestimentosResponsive';
import ContratosResponsive from './components/ContratosResponsive';
import { ThemeProvider, useTheme } from './context/ThemeContext';

type PageType = 'home' | 'contratos' | 'climbe' | 'permissoes' | 'empresas' | 'configuracoes';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { theme } = useTheme();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'permissoes':
        return <PermissoesResponsive />;
      case 'climbe':
        return <ClimbeInvestimentosResponsive />;
      case 'contratos':
        return <ContratosResponsive />;
      case 'empresas':
        return (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-[#f4f6f8]'}`}>
            <div className="text-center">
              <p className={`font-['DM_Sans:Bold',sans-serif] font-bold text-[24px] mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
              }`}>
                Empresas
              </p>
              <p className={`font-['DM_Sans:Regular',sans-serif] text-[14px] ${
                theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
              }`}>
                Página em desenvolvimento
              </p>
            </div>
          </div>
        );
      case 'configuracoes':
        return (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-[#f4f6f8]'}`}>
            <div className="text-center">
              <p className={`font-['DM_Sans:Bold',sans-serif] font-bold text-[24px] mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-[#1a2332]'
              }`}>
                Configurações
              </p>
              <p className={`font-['DM_Sans:Regular',sans-serif] text-[14px] ${
                theme === 'dark' ? 'text-[#b8bcc4]' : 'text-[#6b7a8d]'
              }`}>
                Página em desenvolvimento
              </p>
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={`size-full flex ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-[#f4f6f8]'}`}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}