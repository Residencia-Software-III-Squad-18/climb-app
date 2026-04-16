"use client";
import { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiLogOut, FiFolder } from "react-icons/fi";
import { IoMdCheckboxOutline } from "react-icons/io";
import { PiBuildingLight, PiGearSixLight, PiInvoice } from "react-icons/pi";
import { TbLayoutBoardSplitFilled } from "react-icons/tb";

import { useAuthContext } from "@/context";
import LogoPageBranca from "@/icons/LogoPageBranca";
import LogoPages from "@/icons/LogoPages";
import TresTracos from "@/icons/TresTracos";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface LayoutContainerProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  menuItems?: MenuItem[];
}

export const LayoutContainer = ({
  children,
  actions,
}: LayoutContainerProps) => {
  const { signOut } = useAuthContext();
  const { userData, basicUserData } = useAuthStore();
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(true);
  const [pathname, setPathname] = useState<string>(
    typeof window !== "undefined" ? window.location.pathname : ""
  );

  // Fallback para básicUserData se userData não existir
  const displayName = basicUserData?.nomeCompleto || userData?.nomeCompleto || "Usuário";
  const displayEmail = basicUserData?.email || userData?.email || "";

  useEffect(() => {
    const handleRouteChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const isMenuItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const getMenuItemClasses = (href: string) => {
    const isActive = isMenuItemActive(href);
    const baseClasses =
      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors";
    const activeClasses = "text-gray-900 dark:text-white";
    const inactiveClasses = "text-gray-700 dark:text-gray-300";

    return isActive
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses} hover:text-gray-900 dark:hover:text-white`;
  };

  const getMenuItemStyle = (href: string) => {
    const isActive = isMenuItemActive(href);
    return {
      backgroundColor: isActive ? "#8edecf" : "transparent",
    };
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#24384d]">
      {/* Sidebar */}
      <aside
        className={`relative ml-4 mr-0 mt-4 mb-4 rounded-[20px] h-[calc(100vh-32px)] bg-white dark:bg-[#1a2532] shadow-xl transition-all duration-300 z-40 ${
          isOpen ? "w-50" : "w-24"
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700 w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <div className={`overflow-hidden transition-all w-full`}>
              {theme === "dark" ? (
                <div className="w-full h-auto flex items-center justify-center">
                  <LogoPageBranca size={150} />
                </div>
              ) : (
                <LogoPages size={150} color="#2BBFA4" />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <TresTracos size={40} color="#7EC4BE" />
            </div>
          )}
        </button>

        {/* Menu Items */}
        <nav className="flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
          {/* Main Menu Items */}
          <div className="flex flex-col gap-1 px-2 pt-4">
            <a
              href="/dashboard"
              className={getMenuItemClasses("/dashboard")}
              style={getMenuItemStyle("/dashboard")}
              onMouseEnter={(e) => {
                if (!isMenuItemActive("/dashboard")) {
                  e.currentTarget.style.backgroundColor = "#8edecf";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuItemActive("/dashboard")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              <TbLayoutBoardSplitFilled size={20} />
              {isOpen && <span className="text-sm font-medium">Home</span>}
            </a>
            <a
              href="/contratos"
              className={getMenuItemClasses("/contratos")}
              style={getMenuItemStyle("/contratos")}
              onMouseEnter={(e) => {
                if (!isMenuItemActive("/contratos")) {
                  e.currentTarget.style.backgroundColor = "#8edecf";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuItemActive("/contratos")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              <PiInvoice size={20} />
              {isOpen && <span className="text-sm font-medium">Contratos</span>}
            </a>
          </div>

          {/* Operaciones Section */}
          {isOpen && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Operacional
              </p>
            </div>
          )}
          <div className="flex flex-col gap-1 px-2">
            <a
              href="/documentos"
              className={getMenuItemClasses("/documentos")}
              style={getMenuItemStyle("/documentos")}
              onMouseEnter={(e) => {
                if (!isMenuItemActive("/documentos")) {
                  e.currentTarget.style.backgroundColor = "#8edecf";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuItemActive("/documentos")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              <FiFolder size={20} />
              {isOpen && (
                <span className="text-sm font-medium">Documentos</span>
              )}
            </a>
            <a
              href="/agenda"
              className={getMenuItemClasses("/agenda")}
              style={getMenuItemStyle("/agenda")}
              onMouseEnter={(e) => {
                if (!isMenuItemActive("/agenda")) {
                  e.currentTarget.style.backgroundColor = "#8edecf";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuItemActive("/agenda")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              <FaRegCalendarAlt size={18} />
              {isOpen && <span className="text-sm font-medium">Agenda</span>}
            </a>
            <a
              href="/permissoes"
              className={getMenuItemClasses("/permissoes")}
              style={getMenuItemStyle("/permissoes")}
              onMouseEnter={(e) => {
                if (!isMenuItemActive("/permissoes")) {
                  e.currentTarget.style.backgroundColor = "#8edecf";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuItemActive("/permissoes")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              <IoMdCheckboxOutline size={20} />
              {isOpen && (
                <span className="text-sm font-medium">Permissões</span>
              )}
            </a>
            <a
              href="/empresas"
              className={getMenuItemClasses("/empresas")}
              style={getMenuItemStyle("/empresas")}
              onMouseEnter={(e) => {
                if (!isMenuItemActive("/empresas")) {
                  e.currentTarget.style.backgroundColor = "#8edecf";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuItemActive("/empresas")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              <PiBuildingLight size={20} />
              {isOpen && <span className="text-sm font-medium">Empresas</span>}
            </a>
          </div>

          {/* Configurações Section */}
          {isOpen && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Configurações
              </p>
            </div>
          )}
          <div className="flex flex-col gap-1 px-2 flex-1">
            <a
              href="/configuracoes"
              className={getMenuItemClasses("/configuracoes")}
              style={getMenuItemStyle("/configuracoes")}
              onMouseEnter={(e) => {
                if (!isMenuItemActive("/configuracoes")) {
                  e.currentTarget.style.backgroundColor = "#8edecf";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuItemActive("/configuracoes")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              <PiGearSixLight size={20} />
              {isOpen && (
                <span className="text-sm font-medium">Configurações</span>
              )}
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col mr-4 my-4 transition-all duration-300 ${
          isOpen ? "ml-[10px]" : "ml-[10px]"
        }`}
      >
        {/* Header */}
        <header className="bg-white dark:bg-[#0e1822] border-b border-gray-200 dark:border-gray-700 px-8 py-6 shadow-sm rounded-[20px] mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 pr-4">
              <CiUser size={30} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#0e1822] dark:text-white">
                {displayName}
              </h1>
              {actions && <div className="mt-2">{actions}</div>}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#0e1822] dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {displayEmail}
                </p>
              </div>

              <button
                onClick={signOut}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors pr-6"
                aria-label="Sign out"
              >
                <FiLogOut size={24} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50 dark:bg-[#0e1822] rounded-[20px] mx-4 mb-4">
          {children}
        </main>
      </div>
    </div>
  );
};
