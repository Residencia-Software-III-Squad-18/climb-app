import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  Briefcase,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  Home,
  Lock,
  LogOut,
  Moon,
  Palette,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  Sun,
  UserCog,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ClimbLogo from "@/components/login/ClimbLogo";
import { useCurrentRole, useCanViewBlock } from "@/hooks/useAccess";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getNavItemsForRole } from "@/lib/navItems";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserRoleStore } from "@/store/useUserRoleStore";

const PREFS_KEY = "climb-prefs";

interface Prefs {
  density: "compact" | "comfortable";
  notifAgenda: boolean;
  notifDocs: boolean;
  notifEmail: boolean;
  displayName: string;
  contactEmail: string;
  language: string;
  timezone: string;
}

const defaultPrefs: Prefs = {
  density: "comfortable",
  notifAgenda: true,
  notifDocs: false,
  notifEmail: true,
  displayName: "",
  contactEmail: "",
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
};

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return defaultPrefs;
  }
}

function SectionCard({
  children,
  delay = 0,
  description,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  delay?: number;
  description: string;
  icon: typeof Settings;
  title: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="overflow-hidden rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3 border-b border-border/15 px-5 pb-3 pt-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/15 bg-accent/10">
          <Icon className="h-[15px] w-[15px] text-accent" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground/50">{description}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </motion.section>
  );
}

function RowSwitch({
  checked,
  hint,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  hint?: string;
  label: string;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-foreground">{label}</p>
        {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground/50">{hint}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function Configuracoes() {
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const showAparencia = useCanViewBlock("config.aparencia");
  const showNotificacoes = useCanViewBlock("config.notificacoes");
  const showConta = useCanViewBlock("config.conta");
  const showSeguranca = useCanViewBlock("config.seguranca");
  const showGestao = useCanViewBlock("config.gestao");
  const showAdministracao = useCanViewBlock("config.administracao");

  const userData = useAuthStore((state) => state.userData);
  const basicUserData = useAuthStore((state) => state.basicUserData);

  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs());
  const [initialPrefs, setInitialPrefs] = useState<Prefs>(prefs);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!prefs.displayName || !prefs.contactEmail) {
      const fallbackName =
        basicUserData?.nomeCompleto || userData?.nomeCompleto || userData?.pessoa?.nomeCompleto || "";
      const fallbackEmail = basicUserData?.email || userData?.email || userData?.pessoa?.email || "";
      const next = {
        ...prefs,
        displayName: prefs.displayName || fallbackName,
        contactEmail: prefs.contactEmail || fallbackEmail,
      };
      setPrefs(next);
      setInitialPrefs(next);
    }
  }, [basicUserData, prefs, userData]);

  const update = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs((current) => ({ ...current, [key]: value }));

  const handleSave = () => {
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        toast.error("Informe sua senha atual.");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("A nova senha deve ter ao menos 8 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("A confirmação não confere com a nova senha.");
        return;
      }
    }

    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      setInitialPrefs(prefs);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Preferências salvas com sucesso.");
    } catch {
      toast.error("Não foi possível salvar as preferências.");
    }
  };

  const handleCancel = () => {
    setPrefs(initialPrefs);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

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
              const active = item.label === "Configurações";
              return (
                <motion.button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`group relative flex w-full items-center gap-3 rounded-lg transition-all ${
                    sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                  } ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  }`}
                  whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {active ? (
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
            <div className="flex min-w-0 items-center gap-3">
              <Settings className="h-4 w-4 shrink-0 text-accent" />
              <span className="truncate text-[12px] font-medium text-muted-foreground/70">
                Preferências da conta e do ambiente
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/15">
                <span className="text-[11px] font-semibold text-accent">
                  {(prefs.displayName || "U").trim().charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden min-w-0 max-w-[200px] text-right lg:block">
                <p className="truncate text-[12px] font-medium text-foreground">
                  {prefs.displayName || "Usuário"}
                </p>
                <p className="truncate text-[10px] text-muted-foreground/40">{prefs.contactEmail || "—"}</p>
              </div>
            </div>
          </motion.header>

          <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-2 pt-6">
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground">Configurações</h1>
              <p className="mt-0.5 text-[12px] text-muted-foreground/50">
                Ajuste preferências da conta e do ambiente de trabalho.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">Perfil ativo</span>
              <Select
                value={currentRole}
                onValueChange={(value) => useUserRoleStore.getState().setRole(value)}
              >
                <SelectTrigger className="h-9 w-[160px] rounded-md bg-card/40 text-[12px] font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="GESTOR">Gestor</SelectItem>
                  <SelectItem value="ANALISTA">Analista</SelectItem>
                  <SelectItem value="CLIENTE">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid max-w-4xl gap-5 px-6 pb-10">
            {showAparencia ? (
              <SectionCard
                icon={Palette}
                title="Aparência"
                description="Tema e densidade da interface."
                delay={0.05}
              >
                <RowSwitch
                  label="Modo escuro"
                  hint="Alterna entre tema claro e escuro."
                  checked={isDark}
                  onCheckedChange={setIsDark}
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Label className="text-[12px] font-medium tracking-wide text-foreground">Densidade</Label>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/50">
                      Espaçamento dos elementos em listas e formulários.
                    </p>
                  </div>
                  <Select
                    value={prefs.density}
                    onValueChange={(value) => update("density", value as Prefs["density"])}
                  >
                    <SelectTrigger className="h-10 w-[180px] rounded-md bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comfortable">Confortável</SelectItem>
                      <SelectItem value="compact">Compacta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SectionCard>
            ) : null}

            {showNotificacoes ? (
              <SectionCard
                icon={BellRing}
                title="Notificações"
                description="Escolha o que você quer receber."
                delay={0.1}
              >
                <RowSwitch
                  label="Notificações por e-mail"
                  hint="Resumo diário e atualizações importantes."
                  checked={prefs.notifEmail}
                  onCheckedChange={(value) => update("notifEmail", value)}
                />
                <RowSwitch
                  label="Lembretes de agenda"
                  hint="Avisos antes de reuniões e compromissos."
                  checked={prefs.notifAgenda}
                  onCheckedChange={(value) => update("notifAgenda", value)}
                />
                <RowSwitch
                  label="Alertas de documentos e contratos"
                  hint="Pendências, vencimentos e mudanças de status."
                  checked={prefs.notifDocs}
                  onCheckedChange={(value) => update("notifDocs", value)}
                />
              </SectionCard>
            ) : null}

            {showConta ? (
              <SectionCard
                icon={UserCog}
                title="Conta"
                description="Informações exibidas no seu perfil."
                delay={0.15}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">
                      Nome exibido
                    </Label>
                    <Input
                      value={prefs.displayName}
                      onChange={(event) => update("displayName", event.target.value)}
                      placeholder="Seu nome"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">
                      E-mail de contato
                    </Label>
                    <Input
                      type="email"
                      value={prefs.contactEmail}
                      onChange={(event) => update("contactEmail", event.target.value)}
                      placeholder="voce@empresa.com"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">Idioma</Label>
                    <Select value={prefs.language} onValueChange={(value) => update("language", value)}>
                      <SelectTrigger className="h-10 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">
                      Fuso horário
                    </Label>
                    <Select value={prefs.timezone} onValueChange={(value) => update("timezone", value)}>
                      <SelectTrigger className="h-10 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/Lisbon">Lisboa (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {showSeguranca ? (
              <SectionCard
                icon={Lock}
                title="Segurança"
                description="Atualize sua senha de acesso."
                delay={0.2}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">
                      Senha atual
                    </Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-10"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">
                      Nova senha
                    </Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="h-10"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">
                      Confirmar nova senha
                    </Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repita a nova senha"
                      className="h-10"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground/50">
                  A alteração é validada antes do envio. Use ao menos 8 caracteres com letras e números.
                </p>
              </SectionCard>
            ) : null}

            {showGestao ? (
              <SectionCard
                icon={Briefcase}
                title="Gestão"
                description="Preferências operacionais para gestores e administradores."
                delay={0.25}
              >
                <RowSwitch
                  label="Resumo semanal da equipe"
                  hint="Receber consolidado de produtividade às segundas."
                  checked={prefs.notifEmail}
                  onCheckedChange={(value) => update("notifEmail", value)}
                />
                <RowSwitch
                  label="Alertas de SLA"
                  hint="Notificar quando contratos ou tarefas estourarem prazos."
                  checked={prefs.notifDocs}
                  onCheckedChange={(value) => update("notifDocs", value)}
                />
              </SectionCard>
            ) : null}

            {showAdministracao ? (
              <SectionCard
                icon={ShieldCheck}
                title="Administração do sistema"
                description="Acesso restrito a administradores."
                delay={0.3}
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/usuarios")}
                    className="h-10 justify-start rounded-lg border-border/25 bg-card/40 text-[12px] font-semibold"
                  >
                    <UsersIcon className="h-3.5 w-3.5" />
                    Gerenciar usuários
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/permissoes")}
                    className="h-10 justify-start rounded-lg border-border/25 bg-card/40 text-[12px] font-semibold"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Gerenciar permissões
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground/50">
                  Estes atalhos só ficam visíveis para o perfil ADMIN.
                </p>
              </SectionCard>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="flex items-center justify-end gap-2 pt-2"
            >
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-10 rounded-lg border-border/25 bg-card/40 text-[12px] font-semibold"
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground hover:bg-accent/90"
              >
                <Save className="h-3.5 w-3.5" />
                Salvar alterações
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
