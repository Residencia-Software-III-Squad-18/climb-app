import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Calendar as CalendarIcon, Shield, Building2, Settings,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Plus, Bell, Search,
  Clock, MapPin, X, GripVertical, Video, Users as UsersIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";

/* ══════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════ */

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FileText, label: "Contratos", path: "/dashboard" },
  { icon: CalendarIcon, label: "Agenda", path: "/agenda" },
  { icon: Shield, label: "Permissões", path: "/dashboard" },
  { icon: Building2, label: "Empresas", path: "/dashboard" },
  { icon: Settings, label: "Configurações", path: "/dashboard" },
];

interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  endTime: string;
  empresa: string;
  local?: string;
  type: "virtual" | "presencial";
  color: string;
}

interface KanbanCard {
  id: string;
  title: string;
  empresa: string;
  date: string;
  type: "virtual" | "presencial";
  priority: "alta" | "media" | "baixa";
}

const weekEvents: Record<number, AgendaEvent[]> = {
  0: [
    { id: "1", title: "Reunião com Nova Capital", time: "09:00", endTime: "10:00", empresa: "Nova Capital", local: "Sala 3", type: "virtual", color: "accent" },
    { id: "2", title: "Análise documental Alpha", time: "11:00", endTime: "12:00", empresa: "Apex Ventures", local: "Sala 1", type: "presencial", color: "primary" },
  ],
  1: [
    { id: "3", title: "Apresentação Horizon Group", time: "14:00", endTime: "15:30", empresa: "Horizon Group", local: "Google Meet", type: "virtual", color: "accent" },
  ],
  2: [
    { id: "4", title: "Follow-up Vértice Consultoria", time: "10:00", endTime: "10:30", empresa: "Vértice Consultoria", local: "Zoom", type: "virtual", color: "accent" },
  ],
  3: [
    { id: "5", title: "Revisão contrato Meridian", time: "16:00", endTime: "17:00", empresa: "Meridian Partners", local: "Sala 2", type: "presencial", color: "primary" },
  ],
  4: [
    { id: "6", title: "Reunião de alinhamento", time: "09:00", endTime: "09:30", empresa: "Atlas Participações", local: "Zoom", type: "virtual", color: "accent" },
    { id: "7", title: "Visita Solare Investimentos", time: "14:00", endTime: "16:00", empresa: "Solare Investimentos", local: "Escritório", type: "presencial", color: "primary" },
  ],
};

const kanbanColumns: { id: string; title: string; color: string }[] = [
  { id: "agendado", title: "Agendado", color: "accent" },
  { id: "confirmado", title: "Confirmado", color: "primary" },
  { id: "realizado", title: "Realizado", color: "accent" },
  { id: "cancelado", title: "Cancelado", color: "destructive" },
];

const initialKanbanCards: Record<string, KanbanCard[]> = {
  agendado: [
    { id: "k1", title: "Onboarding Nova Capital", empresa: "Nova Capital", date: "18/03", type: "virtual", priority: "alta" },
    { id: "k2", title: "Due Diligence Apex", empresa: "Apex Ventures", date: "20/03", type: "presencial", priority: "media" },
  ],
  confirmado: [
    { id: "k3", title: "Revisão Contratual Meridian", empresa: "Meridian Partners", date: "17/03", type: "virtual", priority: "alta" },
    { id: "k4", title: "Apresentação Horizon", empresa: "Horizon Group", date: "19/03", type: "presencial", priority: "baixa" },
  ],
  realizado: [
    { id: "k5", title: "Alinhamento Solare", empresa: "Solare Investimentos", date: "14/03", type: "virtual", priority: "media" },
  ],
  cancelado: [
    { id: "k6", title: "Follow-up Vértice", empresa: "Vértice Consultoria", date: "12/03", type: "virtual", priority: "baixa" },
  ],
};

const weekDays = ["SEG", "TER", "QUA", "QUI", "SEX"];
const weekDates = [16, 17, 18, 19, 20];

/* ══════════════════════════════════════════════════
   AGENDA PAGE
   ══════════════════════════════════════════════════ */

const Agenda = () => {
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"semana" | "kanban">("semana");
  const [kanbanCards, setKanbanCards] = useState(initialKanbanCards);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; fromCol: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleDragStart = (card: KanbanCard, fromCol: string) => {
    setDraggedCard({ card, fromCol });
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverCol(colId);
  };

  const handleDrop = (colId: string) => {
    if (!draggedCard || draggedCard.fromCol === colId) {
      setDraggedCard(null);
      setDragOverCol(null);
      return;
    }
    setKanbanCards(prev => {
      const newCards = { ...prev };
      newCards[draggedCard.fromCol] = prev[draggedCard.fromCol].filter(c => c.id !== draggedCard.card.id);
      newCards[colId] = [...prev[colId], draggedCard.card];
      return newCards;
    });
    setDraggedCard(null);
    setDragOverCol(null);
  };

  const priorityColors: Record<string, string> = {
    alta: "bg-destructive/10 text-destructive border-destructive/20",
    media: "bg-primary/10 text-primary border-primary/20",
    baixa: "bg-muted/30 text-muted-foreground border-border/20",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)
          `,
        }} />
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.03) 0%, transparent 60%)", filter: "blur(80px)" }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* ── Sidebar ── */}
        <motion.aside
          className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${sidebarCollapsed ? "w-[72px]" : "w-[220px]"}`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`flex items-center h-16 border-b border-border/20 ${sidebarCollapsed ? "justify-center px-2" : "px-5"}`}>
            {sidebarCollapsed ? (
              <motion.div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center" whileHover={{ scale: 1.05 }}>
                <span className="text-accent font-bold text-xs">C</span>
              </motion.div>
            ) : (
              <ClimbLogo className="h-[16px] text-foreground" />
            )}
          </div>

          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${
                  item.label === "Agenda" ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label === "Agenda" && (
                  <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" layoutId="activeNav" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
              </motion.button>
            ))}
          </nav>

          <div className="border-t border-border/20 py-3 px-2 space-y-1">
            <motion.button onClick={() => setIsDark(!isDark)} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200 ${sidebarCollapsed ? "justify-center" : ""}`} whileTap={{ scale: 0.98 }}>
              <AnimatePresence mode="wait">
                <motion.div key={isDark ? "sun" : "moon"} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }} transition={{ duration: 0.2 }}>
                  {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </motion.div>
              </AnimatePresence>
              {!sidebarCollapsed && <span className="text-[13px] font-medium">{isDark ? "Modo claro" : "Modo escuro"}</span>}
            </motion.button>
            <Link to="/">
              <motion.button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all duration-200 ${sidebarCollapsed ? "justify-center" : ""}`} whileTap={{ scale: 0.98 }}>
                <LogOut className="w-[18px] h-[18px]" />
                {!sidebarCollapsed && <span className="text-[13px] font-medium">Sair</span>}
              </motion.button>
            </Link>
          </div>

          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all duration-200 shadow-sm">
            {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </motion.aside>

        {/* ── Main content ── */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[220px]"}`}>
          {/* Top bar */}
          <motion.header className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 border-b border-border/20 bg-background/80 backdrop-blur-xl" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div>
              <h2 className="text-[18px] font-semibold text-foreground tracking-tight">Agenda</h2>
              <p className="text-[11px] text-muted-foreground/50">Semana de 16 a 20 de Março, 2026</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center h-9 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm overflow-hidden">
                {(["semana", "kanban"] as const).map(v => (
                  <motion.button
                    key={v}
                    onClick={() => setActiveView(v)}
                    className={`h-full px-4 text-[12px] font-medium transition-all duration-200 ${activeView === v ? "bg-accent/15 text-accent" : "text-muted-foreground/50 hover:text-foreground"}`}
                    whileTap={{ scale: 0.97 }}
                  >
                    {v === "semana" ? "Semana" : "Kanban"}
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button className="w-8 h-8 rounded-lg border border-border/25 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all" whileTap={{ scale: 0.95 }}>
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <button className="h-8 px-3 rounded-lg border border-border/25 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
                  Hoje
                </button>
                <motion.button className="w-8 h-8 rounded-lg border border-border/25 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all" whileTap={{ scale: 0.95 }}>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
              <motion.button
                onClick={() => setShowAddEvent(true)}
                className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-3.5 h-3.5" /> Agendar
              </motion.button>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
            <AnimatePresence mode="wait">
              {activeView === "semana" ? (
                <motion.div
                  key="semana"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden"
                >
                  {/* Week header */}
                  <div className="grid grid-cols-5 border-b border-border/15">
                    {weekDays.map((day, i) => (
                      <div key={day} className={`px-4 py-4 text-center border-r border-border/10 last:border-r-0 ${i === 2 ? "bg-accent/5" : ""}`}>
                        <p className="text-[10px] text-muted-foreground/40 font-medium tracking-wider uppercase">{day}</p>
                        <p className={`text-[24px] font-bold mt-1 ${i === 2 ? "text-accent" : "text-foreground"}`}>{weekDates[i]}</p>
                      </div>
                    ))}
                  </div>

                  {/* Events grid */}
                  <div className="grid grid-cols-5 min-h-[500px]">
                    {[0, 1, 2, 3, 4].map(dayIndex => (
                      <div key={dayIndex} className={`border-r border-border/10 last:border-r-0 p-3 space-y-2 ${dayIndex === 2 ? "bg-accent/[0.02]" : ""}`}>
                        {(weekEvents[dayIndex] || []).map((event, i) => (
                          <motion.div
                            key={event.id}
                            className={`rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                              event.type === "presencial"
                                ? "bg-primary/8 border border-primary/15 hover:border-primary/30"
                                : "bg-accent/8 border border-accent/15 hover:border-accent/30"
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.08 + dayIndex * 0.05 }}
                            whileHover={{ y: -2, scale: 1.01 }}
                          >
                            <p className="text-[12px] font-semibold text-foreground leading-snug mb-1.5">{event.title}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 mb-1">
                              <Clock className="w-3 h-3" />
                              <span>{event.time} – {event.endTime}</span>
                            </div>
                            <div className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                              event.type === "virtual" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                            }`}>
                              {event.type === "virtual" ? <Video className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                              {event.type === "virtual" ? "Virtual" : "Presencial"}
                            </div>
                          </motion.div>
                        ))}
                        {(!weekEvents[dayIndex] || weekEvents[dayIndex].length === 0) && (
                          <div className="flex items-center justify-center h-20 text-[10px] text-muted-foreground/20">
                            Sem eventos
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── KANBAN VIEW ── */
                <motion.div
                  key="kanban"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-4 gap-4"
                >
                  {kanbanColumns.map((col, colIndex) => (
                    <motion.div
                      key={col.id}
                      className={`rounded-xl border bg-card/40 backdrop-blur-sm overflow-hidden flex flex-col transition-all duration-200 ${
                        dragOverCol === col.id ? "border-accent/40 bg-accent/[0.03]" : "border-border/25"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: colIndex * 0.08 }}
                      onDragOver={e => handleDragOver(e, col.id)}
                      onDragLeave={() => setDragOverCol(null)}
                      onDrop={() => handleDrop(col.id)}
                    >
                      {/* Column header */}
                      <div className="px-4 py-3 border-b border-border/15 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-${col.color}`} style={{ backgroundColor: `hsl(var(--${col.color}))` }} />
                          <span className="text-[12px] font-semibold text-foreground">{col.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground/40 bg-muted/20 px-1.5 py-0.5 rounded">
                          {kanbanCards[col.id]?.length || 0}
                        </span>
                      </div>

                      {/* Cards */}
                      <div className="p-3 space-y-2 flex-1 min-h-[400px]">
                        {(kanbanCards[col.id] || []).map((card, i) => (
                          <motion.div
                            key={card.id}
                            draggable
                            onDragStart={() => handleDragStart(card, col.id)}
                            className="rounded-lg border border-border/20 bg-background/60 p-3 cursor-grab active:cursor-grabbing hover:border-accent/20 hover:shadow-sm transition-all duration-200 group"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            whileHover={{ y: -1 }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-[12px] font-medium text-foreground leading-snug pr-2">{card.title}</p>
                              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/40 shrink-0 mt-0.5 transition-colors" />
                            </div>
                            <p className="text-[10px] text-muted-foreground/50 mb-2">{card.empresa}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/40">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{card.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full border ${priorityColors[card.priority]}`}>
                                  {card.priority}
                                </span>
                                <span className={`inline-flex items-center gap-0.5 text-[8px] font-medium px-1.5 py-0.5 rounded-full ${
                                  card.type === "virtual" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                                }`}>
                                  {card.type === "virtual" ? <Video className="w-2 h-2" /> : <MapPin className="w-2 h-2" />}
                                  {card.type === "virtual" ? "Virtual" : "Presencial"}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {(kanbanCards[col.id] || []).length === 0 && (
                          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-border/20 text-[10px] text-muted-foreground/20">
                            Arraste cards aqui
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>

      {/* ── Add Event Modal ── */}
      <AnimatePresence>
        {showAddEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowAddEvent(false)} />
            <motion.div
              className="relative z-10 w-full max-w-md rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <h2 className="text-[16px] font-semibold text-foreground">Agendar Reunião</h2>
                <motion.button onClick={() => setShowAddEvent(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] text-muted-foreground/50 font-medium tracking-wider uppercase mb-1.5 block">Pauta</label>
                  <input type="text" placeholder="Pauta da reunião..." className="w-full h-10 px-3 rounded-lg border border-border/25 bg-background/50 text-[13px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-foreground/30" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground/50 font-medium tracking-wider uppercase mb-1.5 block">Empresa</label>
                  <input type="text" placeholder="Nome da empresa" className="w-full h-10 px-3 rounded-lg border border-border/25 bg-background/50 text-[13px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-foreground/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground/50 font-medium tracking-wider uppercase mb-1.5 block">Data</label>
                    <input type="date" className="w-full h-10 px-3 rounded-lg border border-border/25 bg-background/50 text-[13px] outline-none focus:border-accent/40 transition-colors text-foreground" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground/50 font-medium tracking-wider uppercase mb-1.5 block">Horário</label>
                    <input type="time" className="w-full h-10 px-3 rounded-lg border border-border/25 bg-background/50 text-[13px] outline-none focus:border-accent/40 transition-colors text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground/50 font-medium tracking-wider uppercase mb-1.5 block">Valor</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="tipo" defaultChecked className="accent-[hsl(var(--accent))]" />
                      <span className="text-[12px] text-foreground/70">Virtual</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="tipo" className="accent-[hsl(var(--accent))]" />
                      <span className="text-[12px] text-foreground/70">Presencial</span>
                    </label>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowAddEvent(false)}
                  className="w-full h-10 rounded-lg bg-accent text-accent-foreground text-[13px] font-semibold shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirmar Agendamento
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Agenda;
