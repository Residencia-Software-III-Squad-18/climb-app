import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  FileText,
  Home,
  IdCard,
  LogOut,
  Mail,
  Moon,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  Shield,
  Sun,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ClimbLogo from "@/components/login/ClimbLogo";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCanPerformAction, useCurrentRole } from "@/hooks/useAccess";
import { useTheme } from "@/hooks/use-theme";
import { getNavItemsForRole } from "@/lib/navItems";
import { Usuario, useUsuarios } from "@/services";

import { NovoUsuarioModal } from "@/components/usuarios/NovoUsuarioModal";
import { EditarUsuarioModal } from "@/components/usuarios/EditarUsuarioModal";

type SituacaoFiltro = "TODOS" | "ATIVO" | "INATIVO";

function getSituacao(usuario: Usuario): "ATIVO" | "INATIVO" {
  return usuario.situacao === "INATIVO" ? "INATIVO" : "ATIVO";
}

function initials(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join("");
}

export default function Usuarios() {
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const canCreateUsuario = useCanPerformAction("usuario.criar");
  const { isDark, setIsDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [situacao, setSituacao] = useState<SituacaoFiltro>("TODOS");
  const [cargo, setCargo] = useState<string>("TODOS");
  const [novoOpen, setNovoOpen] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  const { data: usuarios = [], isLoading, error } = useUsuarios();

  const cargosList = useMemo(() => {
    const values = new Set<string>();
    usuarios.forEach((usuario) => {
      if (usuario.cargo) values.add(usuario.cargo);
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [usuarios]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return usuarios.filter((usuario) => {
      const matchSearch =
        !query ||
        usuario.nomeCompleto?.toLowerCase().includes(query) ||
        usuario.email?.toLowerCase().includes(query);
      const matchSituacao = situacao === "TODOS" || getSituacao(usuario) === situacao;
      const matchCargo = cargo === "TODOS" || usuario.cargo === cargo;
      return matchSearch && matchSituacao && matchCargo;
    });
  }, [usuarios, search, situacao, cargo]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${
            sidebarCollapsed ? "w-[72px]" : "w-[220px]"
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div
            className={`flex h-16 items-center border-b border-border/20 ${
              sidebarCollapsed ? "justify-center px-2" : "px-5"
            }`}
          >
            {sidebarCollapsed ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                <span className="text-xs font-bold text-accent">C</span>
              </div>
            ) : (
              <ClimbLogo className="h-[16px] text-foreground" />
            )}
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const isActive = item.label === "Usuários";
              return (
                <motion.button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`group relative flex w-full items-center gap-3 rounded-lg transition-all ${
                    sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                  } ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  }`}
                  whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive ? (
                    <motion.div
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent"
                      layoutId="activeNav"
                    />
                  ) : null}
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!sidebarCollapsed ? <span className="text-[13px] font-medium">{item.label}</span> : null}
                </motion.button>
              );
            })}
          </nav>

          <div className="space-y-1 border-t border-border/20 px-2 py-3">
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-muted/30 hover:text-foreground ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "sun" : "moon"}
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 30 }}
                >
                  {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </motion.div>
              </AnimatePresence>
              {!sidebarCollapsed ? (
                <span className="text-[13px] font-medium">{isDark ? "Modo claro" : "Modo escuro"}</span>
              ) : null}
            </motion.button>

            <Link to="/">
              <motion.button
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 transition-all hover:bg-destructive/5 hover:text-destructive ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="h-[18px] w-[18px]" />
                {!sidebarCollapsed ? <span className="text-[13px] font-medium">Sair</span> : null}
              </motion.button>
            </Link>
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border/40 bg-card text-muted-foreground shadow-sm transition-all hover:border-accent/40 hover:text-foreground"
          >
            {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </motion.aside>

        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[220px]"}`}>
          <motion.header
            className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/20 bg-background/80 px-6 backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex h-9 w-[280px] items-center gap-2 rounded-lg border border-border/25 bg-card/30 px-3 text-muted-foreground/50 backdrop-blur-sm">
              <Search className="h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground/30"
              />
            </div>

            {canCreateUsuario ? (
              <motion.button
                onClick={() => setNovoOpen(true)}
                className="flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3 text-[12px] font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="h-3.5 w-3.5" />
                Novo usuário
              </motion.button>
            ) : null}
          </motion.header>

          <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-2 pt-6">
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground">Usuários</h1>
              <p className="mt-0.5 text-[12px] text-muted-foreground/50">
                Gerencie os usuários da plataforma, seus cargos e situações.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={situacao} onValueChange={(value) => setSituacao(value as SituacaoFiltro)}>
                <SelectTrigger className="h-9 w-[150px] rounded-lg border-border/25 bg-card/40 text-[12px]">
                  <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todas situações</SelectItem>
                  <SelectItem value="ATIVO">Ativos</SelectItem>
                  <SelectItem value="INATIVO">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cargo} onValueChange={setCargo}>
                <SelectTrigger className="h-9 w-[160px] rounded-lg border-border/25 bg-card/40 text-[12px]">
                  <SelectValue placeholder="Cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os cargos</SelectItem>
                  {cargosList.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="px-6 pb-10">
            <motion.div
              className="overflow-hidden rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hidden grid-cols-[1.6fr_1.4fr_1fr_0.9fr_0.8fr_auto] items-center border-b border-border/20 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50 md:grid">
                <div>Usuário</div>
                <div>E-mail</div>
                <div>Cargo</div>
                <div>Contato</div>
                <div>Situação</div>
                <div className="pr-1 text-right">Ações</div>
              </div>

              <div className="max-h-[calc(100vh-300px)] divide-y divide-border/10 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                {isLoading ? (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/50">Carregando usuários...</div>
                ) : error ? (
                  <div className="py-12 text-center text-[12px] text-destructive">Erro ao carregar usuários</div>
                ) : filtered.length === 0 ? (
                  <div className="py-16 text-center">
                    <UsersIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground/20" />
                    <p className="text-[12px] text-muted-foreground/50">Nenhum usuário encontrado</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/30">
                      {canCreateUsuario
                        ? "Ajuste os filtros ou cadastre um novo usuário."
                        : "Ajuste os filtros para localizar outro usuário."}
                    </p>
                  </div>
                ) : (
                  filtered.map((usuario, index) => {
                    const situacaoAtual = getSituacao(usuario);
                    return (
                      <motion.div
                        key={usuario.id}
                        className="grid grid-cols-[1.6fr_1.4fr_1fr_0.9fr_0.8fr_auto] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-muted/10 group"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[11px] font-semibold text-accent">
                            {initials(usuario.nomeCompleto || "?")}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-foreground">{usuario.nomeCompleto}</p>
                            <p className="truncate text-[10px] text-muted-foreground/40">ID #{usuario.id}</p>
                          </div>
                        </div>
                        <div className="truncate text-[12px] text-foreground/70">{usuario.email}</div>
                        <div className="truncate text-[12px] text-foreground/70">{usuario.cargo || "—"}</div>
                        <div className="truncate text-[12px] text-foreground/60">{usuario.contato || "—"}</div>
                        <div>
                          <StatusBadge tone={situacaoAtual === "ATIVO" ? "success" : "neutral"} pulse={situacaoAtual === "ATIVO"}>
                            {situacaoAtual === "ATIVO" ? "Ativo" : "Inativo"}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => setSelected(usuario)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
                            aria-label="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditando(usuario)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
                            aria-label="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between border-b border-border/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-[12px] font-semibold text-accent">
                    {initials(selected.nomeCompleto || "?")}
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-foreground">{selected.nomeCompleto}</h2>
                    <p className="text-[11px] text-muted-foreground/50">{selected.cargo || "Cargo não definido"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={getSituacao(selected) === "ATIVO" ? "success" : "neutral"}>
                    {getSituacao(selected) === "ATIVO" ? "Ativo" : "Inativo"}
                  </StatusBadge>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoCard icon={Mail} label="E-mail" value={selected.email} />
                  <InfoCard icon={Phone} label="Contato" value={selected.contato || "—"} />
                  <InfoCard icon={IdCard} label="CPF" value={selected.cpf || "—"} />
                  <InfoCard icon={Shield} label="Cargo" value={selected.cargo || "—"} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {canCreateUsuario ? <NovoUsuarioModal open={novoOpen} onClose={() => setNovoOpen(false)} /> : null}
      {editando ? <EditarUsuarioModal usuario={editando} onClose={() => setEditando(null)} /> : null}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/20 bg-background/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50">{label}</p>
      </div>
      <p className="break-all text-[13px] text-foreground/80">{value}</p>
    </div>
  );
}
