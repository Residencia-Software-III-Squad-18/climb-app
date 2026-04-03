import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Calendar as CalendarIcon, Shield, Building2, Settings,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Plus, Bell, Search,
  Filter, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle,
  Eye, MoreHorizontal, TrendingUp, Users
} from "lucide-react";
import { Link } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";

/* ── Sidebar nav items ── */
const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: FileText, label: "Contratos", active: false },
  { icon: CalendarIcon, label: "Agenda", active: false },
  { icon: Shield, label: "Permissões", active: false },
  { icon: Building2, label: "Empresas", active: false },
  { icon: Settings, label: "Configurações", active: false },
];

/* ── Stats data ── */
const stats = [
  { label: "Contratos Ativos", value: "24", change: "+4 este mês", trend: "up", icon: FileText, color: "accent" },
  { label: "Propostas Pendentes", value: "7", change: "3 aguardando revisão", trend: "neutral", icon: TrendingUp, color: "primary" },
  { label: "Documentos Pendentes", value: "11", change: "5 prioridade alta", trend: "down", icon: AlertCircle, color: "destructive" },
  { label: "Reuniões esta semana", value: "7", change: "4 confirmadas", trend: "up", icon: Users, color: "accent" },
];

/* ── Pipeline data ── */
const pipelineData = [
  { empresa: "Gorillaz", tipo: "BPO", responsavel: "Raul", status: "Ativo", badge: "active", data: "30.01" },
  { empresa: "Jotamune", tipo: "M&A", responsavel: "Raul", status: "Análise", badge: "analysis", data: "2019" },
  { empresa: "Bjork", tipo: "Outro", responsavel: "Raul", status: "Proposta", badge: "proposal", data: "28.01" },
  { empresa: "Smiths", tipo: "BPO", responsavel: "Raul", status: "P. Direta", badge: "direct", data: "2019" },
  { empresa: "Radiohead", tipo: "M&A", responsavel: "Raul", status: "Ativo", badge: "active", data: "30.01" },
];

/* ── Notifications ── */
const notifications = [
  { text: "Contrato da Tech Solutions aguardando aprovação do analista", time: "há 15 minutos", icon: Clock, type: "warning" },
  { text: "Contrato Hamilton vence em 30 dias — revisar renovação", time: "há 2 horas", icon: AlertCircle, type: "alert" },
  { text: "Fernandes Boyden enviou o Balanço da Empresa para validação", time: "ontem", icon: CheckCircle2, type: "success" },
  { text: "Reunião com Grupo Meridian agendada para 12/03 às 14h", time: "ontem, 13:20", icon: CalendarIcon, type: "info" },
];

/* ── Pipeline stages ── */
const stages = [
  { label: "Proposta", count: 8 },
  { label: "Análise", count: 5 },
  { label: "Contrato", count: 11 },
  { label: "Ativo", count: 24 },
  { label: "Encerr.", count: 54 },
];

const badgeStyles: Record<string, string> = {
  active: "bg-accent/15 text-accent border-accent/20",
  analysis: "bg-primary/15 text-primary border-primary/20",
  proposal: "bg-destructive/15 text-destructive border-destructive/20",
  direct: "bg-muted text-muted-foreground border-border/30",
};

/* ── Calendar helpers ── */
const calendarDays = () => {
  const days: (number | null)[] = [];
  // March 2026 starts on Sunday (day 0)
  for (let i = 0; i < 0; i++) days.push(null);
  for (let i = 1; i <= 31; i++) days.push(i);
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

const highlightedDays = [3, 7, 11, 13, 14, 19, 21, 25, 28];

const Dashboard = () => {
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)
            `,
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--accent) / 0.03) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* ── Sidebar ── */}
        <motion.aside
          className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${
            sidebarCollapsed ? "w-[72px]" : "w-[220px]"
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className={`flex items-center h-16 border-b border-border/20 ${sidebarCollapsed ? "justify-center px-2" : "px-5"}`}>
            {sidebarCollapsed ? (
              <motion.div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center" whileHover={{ scale: 1.05 }}>
                <span className="text-accent font-bold text-xs">C</span>
              </motion.div>
            ) : (
              <ClimbLogo className="h-[16px] text-foreground" />
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={() => setActiveNav(i)}
                className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${
                  sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                } ${
                  activeNav === i
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeNav === i && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className={`border-t border-border/20 py-3 px-2 space-y-1`}>
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200 ${
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
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </motion.div>
              </AnimatePresence>
              {!sidebarCollapsed && <span className="text-[13px] font-medium">{isDark ? "Modo claro" : "Modo escuro"}</span>}
            </motion.button>

            <motion.button
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all duration-200 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-[18px] h-[18px]" />
              {!sidebarCollapsed && <span className="text-[13px] font-medium">Sair</span>}
            </motion.button>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all duration-200 shadow-sm"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </motion.aside>

        {/* ── Main content ── */}
        <main
          className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[220px]"}`}
        >
          {/* Top bar */}
          <motion.header
            className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 border-b border-border/20 bg-background/80 backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground/40 tracking-[0.12em] uppercase">bem-vindo de volta</p>
                <h2 className="text-[15px] font-semibold text-foreground tracking-tight">Raul Rodrigues</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <motion.div
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/40"
                whileHover={{ borderColor: "hsl(var(--accent) / 0.3)" }}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-[12px]">Buscar...</span>
                <kbd className="ml-4 text-[9px] border border-border/30 rounded px-1.5 py-0.5 text-muted-foreground/25">⌘K</kbd>
              </motion.div>

              {/* Notifications */}
              <motion.button
                className="relative w-9 h-9 rounded-lg border border-border/25 bg-card/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[8px] font-bold text-accent-foreground flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Avatar */}
              <motion.div
                className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
              >
                <span className="text-accent font-semibold text-[11px]">RR</span>
              </motion.div>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            className="p-6 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Action bar */}
            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <motion.button
                  className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Contrato
                </motion.button>
                <div className="h-9 px-3 rounded-lg border border-border/25 bg-card/20 flex items-center gap-2 text-[12px] text-muted-foreground">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  8 Nov - 8 Dez, 2026
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 px-3 rounded-md border border-border/25 bg-card/20 text-[11px] text-muted-foreground flex items-center gap-1.5 hover:border-accent/30 transition-colors">
                  <Filter className="w-3 h-3" /> Filtros
                </button>
              </div>
            </motion.div>

            {/* Stats cards */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" variants={itemVariants}>
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative group rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm p-5 overflow-hidden transition-all duration-300 hover:border-accent/20 hover:bg-card/60"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                >
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, hsl(var(--accent) / 0.04), transparent 70%)` }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-muted-foreground/60 font-medium">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        stat.color === "accent" ? "bg-accent/10 text-accent" :
                        stat.color === "primary" ? "bg-primary/10 text-primary" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <motion.p
                      className="text-[28px] font-bold text-foreground tracking-tight leading-none mb-1.5"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-[11px] text-muted-foreground/40 flex items-center gap-1">
                      {stat.trend === "up" && <ArrowUpRight className="w-3 h-3 text-accent" />}
                      {stat.trend === "down" && <ArrowDownRight className="w-3 h-3 text-destructive" />}
                      {stat.change}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main grid: Pipeline + Notifications */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Pipeline */}
              <motion.div
                className="xl:col-span-3 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-5 pb-4 border-b border-border/15 flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Pipeline dos Contratos</h3>
                    <p className="text-[11px] text-muted-foreground/40 mt-0.5">Atualizado às 08:41h</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {["Todos", "BPO", "M&A"].map((f) => (
                      <button
                        key={f}
                        className={`h-7 px-2.5 rounded-md text-[10px] font-medium transition-all duration-200 ${
                          f === "Todos"
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/20"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pipeline stage indicators */}
                <div className="px-5 py-3 border-b border-border/10">
                  <div className="flex items-center gap-1">
                    {stages.map((stage, i) => (
                      <div key={stage.label} className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] text-muted-foreground/40 font-medium">{stage.label}</span>
                          <span className="text-[9px] text-muted-foreground/30 font-mono">{stage.count}</span>
                        </div>
                        <motion.div
                          className="h-1 rounded-full bg-muted/30 overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          <motion.div
                            className="h-full rounded-full bg-accent/40"
                            initial={{ width: 0 }}
                            animate={{ width: `${(stage.count / 54) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                          />
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="divide-y divide-border/10">
                  <div className="grid grid-cols-[1fr_80px_80px_90px_70px] px-5 py-2.5 text-[10px] text-muted-foreground/35 font-medium tracking-[0.06em] uppercase">
                    <span>Empresa</span>
                    <span>Tipo</span>
                    <span>Resp.</span>
                    <span>Status</span>
                    <span className="text-right">Data</span>
                  </div>
                  {pipelineData.map((row, i) => (
                    <motion.div
                      key={row.empresa}
                      className="grid grid-cols-[1fr_80px_80px_90px_70px] px-5 py-3 items-center hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                    >
                      <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                        {row.empresa}
                      </span>
                      <span className="text-[12px] text-muted-foreground/50">{row.tipo}</span>
                      <span className="text-[12px] text-muted-foreground/50">{row.responsavel}</span>
                      <span>
                        <span className={`inline-flex items-center h-6 px-2.5 rounded-md text-[10px] font-medium border ${badgeStyles[row.badge]}`}>
                          {row.status}
                        </span>
                      </span>
                      <span className="text-[12px] text-muted-foreground/40 text-right font-mono">{row.data}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                className="xl:col-span-2 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-5 pb-4 border-b border-border/15 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Notificações Recentes</h3>
                  <button className="text-[11px] text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
                    Ver Todas <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-border/10">
                  {notifications.map((notif, i) => (
                    <motion.div
                      key={i}
                      className="px-5 py-4 flex gap-3 hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        notif.type === "success" ? "bg-accent/10 text-accent" :
                        notif.type === "alert" ? "bg-destructive/10 text-destructive" :
                        notif.type === "warning" ? "bg-primary/10 text-primary" :
                        "bg-muted/30 text-muted-foreground"
                      }`}>
                        <notif.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                          {notif.text}
                        </p>
                        <p className="text-[10px] text-muted-foreground/30 mt-1">{notif.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom row: Documents + Calendar */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Document checklist */}
              <motion.div
                className="xl:col-span-3 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-5 pb-4 border-b border-border/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Docs</h3>
                    <span className="text-[11px] text-muted-foreground/30">·</span>
                    <span className="text-[11px] text-accent font-medium">Formulário Regular</span>
                    <span className="text-[11px] text-muted-foreground/30">·</span>
                    <span className="text-[11px] text-muted-foreground/40">Formulário Irregular</span>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-0">
                  {/* Left column - Fluxo Ativo */}
                  <div>
                    <p className="text-[10px] text-muted-foreground/35 font-medium tracking-[0.08em] uppercase mb-3">Fluxo Ativo</p>
                    {[
                      { name: "Contrato Social", status: "validated" },
                      { name: "Balanço da Empresa", status: "validated" },
                      { name: "Planilha Gerencial", status: "validated" },
                      { name: "CNPJ", status: "processing" },
                      { name: "DRE", status: "processing" },
                    ].map((doc, i) => (
                      <motion.div
                        key={doc.name}
                        className="flex items-center justify-between py-2 group"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + i * 0.05 }}
                      >
                        <span className="text-[12px] text-foreground/70">{doc.name}</span>
                        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                          doc.status === "validated"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {doc.status === "validated" ? "Validado" : "Em análise"}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right column - Fluxo Regular */}
                  <div>
                    <p className="text-[10px] text-muted-foreground/35 font-medium tracking-[0.08em] uppercase mb-3">Formulário Regular</p>
                    {[
                      { name: "Reunião Comercial", status: true },
                      { name: "Proposta Aprovada", status: true },
                      { name: "Contrato Criado", status: true },
                      { name: "Documentação da Empresa", status: false },
                      { name: "Cadastro no Sistema", status: false },
                      { name: "Análise & Relatório", status: false },
                    ].map((item, i) => (
                      <motion.div
                        key={item.name}
                        className="flex items-center gap-2.5 py-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + i * 0.05 }}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          item.status ? "border-accent bg-accent/10" : "border-border/30"
                        }`}>
                          {item.status && <CheckCircle2 className="w-3 h-3 text-accent" />}
                        </div>
                        <span className={`text-[12px] ${item.status ? "text-foreground/70" : "text-muted-foreground/40"}`}>
                          {item.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground/35">Conformidade documental</span>
                    <span className="text-[12px] font-semibold text-accent">89%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: "89%" }}
                      transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Calendar */}
              <motion.div
                className="xl:col-span-2 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-5 pb-4 border-b border-border/15 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Calendário</h3>
                  <motion.button
                    className="h-7 px-3 rounded-md bg-accent/10 text-accent text-[10px] font-medium border border-accent/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    + Agendar
                  </motion.button>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[13px] font-semibold text-foreground">Março</h4>
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                      <div key={i} className="text-center text-[9px] font-medium text-muted-foreground/30 py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays().map((day, i) => (
                      <motion.div
                        key={i}
                        className={`aspect-square rounded-md flex items-center justify-center text-[11px] transition-all duration-200 cursor-pointer ${
                          day === null
                            ? ""
                            : highlightedDays.includes(day)
                            ? "bg-accent/15 text-accent font-semibold hover:bg-accent/25"
                            : day === 15
                            ? "bg-accent text-accent-foreground font-semibold"
                            : "text-foreground/60 hover:bg-muted/20"
                        }`}
                        whileHover={day ? { scale: 1.1 } : undefined}
                        whileTap={day ? { scale: 0.95 } : undefined}
                      >
                        {day}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
