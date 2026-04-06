import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Calendar as CalendarIcon, Shield, Building2, Settings,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Plus, Bell, Search,
  Filter, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle,
  Eye, MoreHorizontal, TrendingUp, Users, Maximize2, Minimize2, X,
  Download, Briefcase, MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";

/* ══════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════ */

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FileText, label: "Contratos", path: "/dashboard" },
  { icon: CalendarIcon, label: "Agenda", path: "/agenda" },
  { icon: Shield, label: "Permissões", path: "/permissoes" },
  { icon: Building2, label: "Empresas", path: "/empresas" },
  { icon: Settings, label: "Configurações", path: "/dashboard" },
];

const stats = [
  { label: "Contratos Ativos", value: "24", change: "+4 este mês", trend: "up" as const, icon: FileText, color: "accent" },
  { label: "Propostas Pendentes", value: "7", change: "3 aguardando revisão", trend: "neutral" as const, icon: TrendingUp, color: "primary" },
  { label: "Documentos Pendentes", value: "11", change: "5 prioridade alta", trend: "down" as const, icon: AlertCircle, color: "destructive" },
  { label: "Reuniões esta semana", value: "7", change: "4 confirmadas", trend: "up" as const, icon: Users, color: "accent" },
];

/* ── Pipeline + Company data ── */
interface PipelineRow {
  empresa: string;
  tipo: string;
  responsavel: string;
  status: string;
  badge: string;
  data: string;
  isCliente: boolean;
  contratoInfo?: {
    negociado: string;
    validade: string;
    valor: string;
    ultimoContato: string;
  };
  documentos?: { name: string; status: "validated" | "processing" | "pending" }[];
  fluxo?: { name: string; done: boolean }[];
}

const pipelineData: PipelineRow[] = [
  {
    empresa: "Nova Capital", tipo: "BPO", responsavel: "Raul", status: "Ativo", badge: "active", data: "30.01",
    isCliente: true,
    contratoInfo: { negociado: "Gestão financeira e fiscal completa", validade: "30/01/2027", valor: "R$ 18.500/mês", ultimoContato: "28/02/2026" },
  },
  {
    empresa: "Apex Ventures", tipo: "M&A", responsavel: "Raul", status: "Análise", badge: "analysis", data: "20.01",
    isCliente: false, ultimoContato: "15/02/2026",
    documentos: [
      { name: "Contrato Social", status: "validated" },
      { name: "Balanço da Empresa", status: "validated" },
      { name: "Planilha Gerencial", status: "processing" },
      { name: "CNPJ", status: "processing" },
      { name: "DRE", status: "pending" },
    ],
    fluxo: [
      { name: "Reunião Comercial", done: true },
      { name: "Proposta Aprovada", done: true },
      { name: "Contrato Criado", done: false },
      { name: "Documentação da Empresa", done: false },
      { name: "Cadastro no Sistema", done: false },
      { name: "Análise & Relatório", done: false },
    ],
  } as any,
  {
    empresa: "Horizon Group", tipo: "Outro", responsavel: "Raul", status: "Proposta", badge: "proposal", data: "28.01",
    isCliente: false, ultimoContato: "22/02/2026",
    documentos: [
      { name: "Contrato Social", status: "pending" },
      { name: "Balanço da Empresa", status: "pending" },
      { name: "CNPJ", status: "pending" },
    ],
    fluxo: [
      { name: "Reunião Comercial", done: true },
      { name: "Proposta Aprovada", done: false },
      { name: "Contrato Criado", done: false },
      { name: "Documentação da Empresa", done: false },
      { name: "Cadastro no Sistema", done: false },
      { name: "Análise & Relatório", done: false },
    ],
  } as any,
  {
    empresa: "Solare Investimentos", tipo: "BPO", responsavel: "Raul", status: "P. Direta", badge: "direct", data: "20.01",
    isCliente: true,
    contratoInfo: { negociado: "Consultoria tributária e planejamento fiscal", validade: "15/06/2027", valor: "R$ 12.000/mês", ultimoContato: "10/03/2026" },
  },
  {
    empresa: "Meridian Partners", tipo: "M&A", responsavel: "Raul", status: "Ativo", badge: "active", data: "30.01",
    isCliente: true,
    contratoInfo: { negociado: "Assessoria em fusões e aquisições", validade: "01/12/2026", valor: "R$ 45.000/projeto", ultimoContato: "05/03/2026" },
  },
  {
    empresa: "Vértice Consultoria", tipo: "BPO", responsavel: "Raul", status: "Análise", badge: "analysis", data: "14.02",
    isCliente: false, ultimoContato: "01/03/2026",
    documentos: [
      { name: "Contrato Social", status: "validated" },
      { name: "Balanço da Empresa", status: "processing" },
      { name: "CNPJ", status: "validated" },
      { name: "DRE", status: "pending" },
    ],
    fluxo: [
      { name: "Reunião Comercial", done: true },
      { name: "Proposta Aprovada", done: true },
      { name: "Contrato Criado", done: true },
      { name: "Documentação da Empresa", done: false },
      { name: "Cadastro no Sistema", done: false },
      { name: "Análise & Relatório", done: false },
    ],
  } as any,
  {
    empresa: "Atlas Participações", tipo: "M&A", responsavel: "Raul", status: "Ativo", badge: "active", data: "05.03",
    isCliente: true,
    contratoInfo: { negociado: "Reestruturação societária", validade: "20/09/2027", valor: "R$ 32.000/mês", ultimoContato: "12/03/2026" },
  },
];

/* ── Notifications ── */
const allNotifications = [
  { text: "Contrato da Nova Capital aguardando aprovação do analista", time: "há 15 minutos", icon: Clock, type: "warning" },
  { text: "Contrato Meridian Partners vence em 30 dias — revisar renovação", time: "há 2 horas", icon: AlertCircle, type: "alert" },
  { text: "Vértice Consultoria enviou o Balanço da Empresa para validação", time: "ontem", icon: CheckCircle2, type: "success" },
  { text: "Reunião com Atlas Participações agendada para 12/03 às 14h", time: "ontem, 13:20", icon: CalendarIcon, type: "info" },
  { text: "Novo documento recebido da Vértice Consultoria para análise", time: "2 dias atrás", icon: FileText, type: "info" },
  { text: "Proposta da Horizon Group expirou — reenviar ou cancelar", time: "3 dias atrás", icon: AlertCircle, type: "alert" },
  { text: "Relatório mensal de compliance gerado automaticamente", time: "4 dias atrás", icon: CheckCircle2, type: "success" },
  { text: "Atlas Participações solicitou alteração contratual", time: "5 dias atrás", icon: Clock, type: "warning" },
  { text: "Reunião com Apex Ventures confirmada para 18/03 às 10h", time: "5 dias atrás", icon: CalendarIcon, type: "info" },
  { text: "Solare Investimentos enviou comprovante de pagamento", time: "1 semana atrás", icon: CheckCircle2, type: "success" },
];

/* ── Pipeline stages ── */
const stages = [
  { label: "Proposta", count: 8, docs: ["Proposta Nova Capital.pdf", "Proposta Horizon Group.pdf", "Proposta Apex v2.pdf", "Proposta Meridian.pdf", "Proposta Solare.pdf", "Proposta Atlas.pdf", "Proposta Vértice.pdf", "Proposta Alpha.pdf"] },
  { label: "Análise", count: 5, docs: ["Análise Apex Ventures.pdf", "Análise Vértice Consultoria.pdf", "Análise Horizon Group.pdf", "Relatório Due Diligence.pdf", "Parecer Jurídico.pdf"] },
  { label: "Contrato", count: 11, docs: ["Contrato Nova Capital.pdf", "Contrato Solare.pdf", "Contrato Meridian.pdf", "Contrato Atlas.pdf", "Aditivo Nova Capital.pdf", "Aditivo Solare.pdf", "Contrato Vértice.pdf", "Contrato Horizon.pdf", "Contrato Apex.pdf", "Contrato Alpha.pdf", "Contrato Beta.pdf"] },
  { label: "Ativo", count: 24, docs: ["Relatório Mensal NC.pdf", "Relatório Mensal Solare.pdf", "Relatório Meridian.pdf", "Relatório Atlas.pdf"] },
  { label: "Encerr.", count: 54, docs: ["Encerramento Projeto Alpha.pdf", "Encerramento Projeto Beta.pdf"] },
];

const badgeStyles: Record<string, string> = {
  active: "bg-accent/15 text-accent border-accent/20",
  analysis: "bg-primary/15 text-primary border-primary/20",
  proposal: "bg-destructive/15 text-destructive border-destructive/20",
  direct: "bg-muted text-muted-foreground border-border/30",
};

/* ── Calendar / Meetings data ── */
interface Meeting {
  title: string;
  time: string;
  empresa: string;
  local?: string;
}

const meetingsData: Record<number, Meeting[]> = {
  3: [{ title: "Reunião de onboarding", time: "09:00", empresa: "Apex Ventures", local: "Sala 3" }],
  7: [{ title: "Alinhamento financeiro", time: "14:00", empresa: "Nova Capital", local: "Google Meet" }],
  11: [
    { title: "Due diligence review", time: "10:30", empresa: "Meridian Partners", local: "Sala 1" },
    { title: "Revisão de contrato", time: "15:00", empresa: "Solare Investimentos", local: "Zoom" },
  ],
  13: [{ title: "Apresentação de proposta", time: "11:00", empresa: "Horizon Group", local: "Sala 2" }],
  14: [{ title: "Análise documental", time: "09:30", empresa: "Vértice Consultoria", local: "Sala 1" }],
  19: [{ title: "Comitê de investimentos", time: "14:00", empresa: "Atlas Participações", local: "Auditório" }],
  21: [{ title: "Follow-up comercial", time: "16:00", empresa: "Apex Ventures", local: "Google Meet" }],
  25: [{ title: "Revisão trimestral", time: "10:00", empresa: "Nova Capital", local: "Sala 3" }],
  28: [{ title: "Fechamento mensal", time: "09:00", empresa: "Climb Interno", local: "Auditório" }],
};

const highlightedDays = Object.keys(meetingsData).map(Number);

const calendarDays = () => {
  const days: (number | null)[] = [];
  for (let i = 1; i <= 31; i++) days.push(i);
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

/* ── Get next meeting ── */
const getNextMeeting = () => {
  const today = 15; // simulating today is March 15
  const futureDays = highlightedDays.filter(d => d >= today).sort((a, b) => a - b);
  if (futureDays.length > 0) {
    const day = futureDays[0];
    const meeting = meetingsData[day]?.[0];
    if (meeting) return { day, ...meeting };
  }
  return null;
};

/* ══════════════════════════════════════════════════
   MAXIMIZE MODAL WRAPPER
   ══════════════════════════════════════════════════ */

const MaximizeModal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-4xl max-h-[85vh] rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between p-5 border-b border-border/20">
            <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
            <motion.button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Section header with maximize button ── */
const SectionHeader = ({ title, subtitle, onMaximize, isMaximized, extra }: {
  title: string;
  subtitle?: string;
  onMaximize: () => void;
  isMaximized?: boolean;
  extra?: React.ReactNode;
}) => (
  <div className="p-5 pb-4 border-b border-border/15 flex items-center justify-between">
    <div>
      <h3 className="text-[14px] font-semibold text-foreground tracking-tight">{title}</h3>
      {subtitle && <p className="text-[11px] text-muted-foreground/40 mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-2">
      {extra}
      {!isMaximized && (
        <motion.button
          onClick={onMaximize}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-muted/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Maximizar"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════
   DASHBOARD COMPONENT
   ══════════════════════════════════════════════════ */

const Dashboard = () => {
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const navigate = useNavigate();

  // Maximize states
  const [maxPipeline, setMaxPipeline] = useState(false);
  const [maxNotifications, setMaxNotifications] = useState(false);
  const [maxEmpresas, setMaxEmpresas] = useState(false);
  const [maxCalendar, setMaxCalendar] = useState(false);

  // Pipeline search & selected company
  const [pipelineSearch, setPipelineSearch] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState("Todos");
  const [selectedCompany, setSelectedCompany] = useState<PipelineRow | null>(null);

  // Empresas filter
  const [empresaFilter, setEmpresaFilter] = useState<"todos" | "pendentes">("pendentes");
  const [empresaSearch, setEmpresaSearch] = useState("");

  // Calendar
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [selectedStage, setSelectedStage] = useState<{ label: string; docs: string[] } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Filtered pipeline
  const filteredPipeline = useMemo(() => {
    return pipelineData.filter(row => {
      const matchSearch = row.empresa.toLowerCase().includes(pipelineSearch.toLowerCase());
      const matchFilter = pipelineFilter === "Todos" || row.tipo === pipelineFilter;
      return matchSearch && matchFilter;
    });
  }, [pipelineSearch, pipelineFilter]);

  // Filtered empresas
  const filteredEmpresas = useMemo(() => {
    return pipelineData.filter(row => {
      if (row.isCliente) return false; // Only show pending companies
      const matchSearch = row.empresa.toLowerCase().includes(empresaSearch.toLowerCase());
      return matchSearch;
    });
  }, [empresaSearch]);

  const nextMeeting = getNextMeeting();

  // ── Handle company click from pipeline ──
  const handleCompanyClick = (row: PipelineRow) => {
    setSelectedCompany(row);
    setMaxEmpresas(true);
  };

  /* ── Pipeline table renderer (reused in mini and maximized) ── */
  const renderPipelineTable = (data: PipelineRow[], showSearch = false) => (
    <>
      {showSearch && (
        <div className="px-5 py-3 border-b border-border/10">
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-background/50 text-muted-foreground">
            <Search className="w-3.5 h-3.5 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={pipelineSearch}
              onChange={e => setPipelineSearch(e.target.value)}
              className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30"
            />
          </div>
        </div>
      )}
      {/* Stage indicators */}
      <div className="px-5 py-3 border-b border-border/10">
        <div className="flex items-center gap-1">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-muted-foreground/40 font-medium">{stage.label}</span>
                <span className="text-[9px] text-muted-foreground/30 font-mono">{stage.count}</span>
              </div>
              <motion.div className="h-1 rounded-full bg-muted/30 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <motion.div className="h-full rounded-full bg-accent/40" initial={{ width: 0 }} animate={{ width: `${(stage.count / 54) * 100}%` }} transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="divide-y divide-border/10">
        <div className="grid grid-cols-[1fr_80px_80px_90px_70px] px-5 py-2.5 text-[10px] text-muted-foreground/35 font-medium tracking-[0.06em] uppercase">
          <span>Empresa</span><span>Tipo</span><span>Resp.</span><span>Status</span><span className="text-right">Data</span>
        </div>
        {data.map((row, i) => (
          <motion.div
            key={row.empresa}
            className="grid grid-cols-[1fr_80px_80px_90px_70px] px-5 py-3 items-center hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
            onClick={() => handleCompanyClick(row)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">{row.empresa}</span>
            <span className="text-[12px] text-muted-foreground/50">{row.tipo}</span>
            <span className="text-[12px] text-muted-foreground/50">{row.responsavel}</span>
            <span><span className={`inline-flex items-center h-6 px-2.5 rounded-md text-[10px] font-medium border ${badgeStyles[row.badge]}`}>{row.status}</span></span>
            <span className="text-[12px] text-muted-foreground/40 text-right font-mono">{row.data}</span>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="px-5 py-8 text-center text-[12px] text-muted-foreground/30">Nenhuma empresa encontrada</div>
        )}
      </div>
    </>
  );

  /* ── Notifications renderer ── */
  const renderNotifications = (items: typeof allNotifications) => (
    <div className="divide-y divide-border/10">
      {items.map((notif, i) => (
        <motion.div
          key={i}
          className="px-5 py-4 flex gap-3 hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
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
            <p className="text-[12px] text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">{notif.text}</p>
            <p className="text-[10px] text-muted-foreground/30 mt-1">{notif.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  /* ── Empresa detail content ── */
  const renderEmpresaDetail = (company: PipelineRow) => {
    if (company.isCliente && company.contratoInfo) {
      return (
        <div className="space-y-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-foreground">{company.empresa}</h4>
              <p className="text-[11px] text-accent font-medium">Cliente ativo · {company.tipo}</p>
            </div>
            <span className={`ml-auto inline-flex items-center h-6 px-2.5 rounded-md text-[10px] font-medium border ${badgeStyles[company.badge]}`}>{company.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/20 bg-background/50 p-4 space-y-3">
              <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">Detalhes do contrato</p>
              <div className="space-y-2">
                <div><p className="text-[10px] text-muted-foreground/40">Negociado</p><p className="text-[12px] text-foreground/80">{company.contratoInfo.negociado}</p></div>
                <div><p className="text-[10px] text-muted-foreground/40">Valor</p><p className="text-[13px] font-semibold text-accent">{company.contratoInfo.valor}</p></div>
                <div><p className="text-[10px] text-muted-foreground/40">Validade</p><p className="text-[12px] text-foreground/80">{company.contratoInfo.validade}</p></div>
                <div><p className="text-[10px] text-muted-foreground/40">Último contato</p><p className="text-[12px] text-foreground/80">{company.contratoInfo.ultimoContato}</p></div>
              </div>
            </div>
            <div className="rounded-xl border border-border/20 bg-background/50 p-4 space-y-3">
              <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">Ações</p>
              <div className="space-y-2">
                <motion.button className="w-full h-9 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 flex items-center justify-center gap-2 hover:border-accent/30 hover:text-accent transition-all" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Download className="w-3.5 h-3.5" /> Baixar contrato
                </motion.button>
                <motion.button className="w-full h-9 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 flex items-center justify-center gap-2 hover:border-accent/30 hover:text-accent transition-all" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Eye className="w-3.5 h-3.5" /> Ver histórico
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Pendente
    const docs = (company as any).documentos || [];
    const fluxo = (company as any).fluxo || [];
    const validatedCount = docs.filter((d: any) => d.status === "validated").length;
    const compliance = docs.length > 0 ? Math.round((validatedCount / docs.length) * 100) : 0;

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-foreground">{company.empresa}</h4>
            <p className="text-[11px] text-primary font-medium">Pendente · {company.tipo}</p>
          </div>
          <span className={`ml-auto inline-flex items-center h-6 px-2.5 rounded-md text-[10px] font-medium border ${badgeStyles[company.badge]}`}>{company.status}</span>
        </div>
        <p className="text-[11px] text-muted-foreground/40">Último contato: {(company as any).ultimoContato || "—"}</p>

        <div className="grid grid-cols-2 gap-x-8">
          {/* Docs */}
          <div>
            <p className="text-[10px] text-muted-foreground/35 font-medium tracking-[0.08em] uppercase mb-3">Fluxo Ativo</p>
            {docs.map((doc: any, i: number) => (
              <div key={doc.name} className="flex items-center justify-between py-2">
                <span className="text-[12px] text-foreground/70">{doc.name}</span>
                <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                  doc.status === "validated" ? "bg-accent/10 text-accent" :
                  doc.status === "processing" ? "bg-primary/10 text-primary" :
                  "bg-muted/30 text-muted-foreground/40"
                }`}>
                  {doc.status === "validated" ? "Validado" : doc.status === "processing" ? "Em análise" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
          {/* Fluxo */}
          <div>
            <p className="text-[10px] text-muted-foreground/35 font-medium tracking-[0.08em] uppercase mb-3">Formulário Regular</p>
            {fluxo.map((item: any) => (
              <div key={item.name} className="flex items-center gap-2.5 py-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${item.done ? "border-accent bg-accent/10" : "border-border/30"}`}>
                  {item.done && <CheckCircle2 className="w-3 h-3 text-accent" />}
                </div>
                <span className={`text-[12px] ${item.done ? "text-foreground/70" : "text-muted-foreground/40"}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground/35">Conformidade documental</span>
            <span className="text-[12px] font-semibold text-accent">{compliance}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent" initial={{ width: 0 }} animate={{ width: `${compliance}%` }} transition={{ duration: 1, ease: "easeOut" }} />
          </div>
        </div>
      </div>
    );
  };

  /* ── Calendar renderer ── */
  const renderCalendar = (expanded = false) => (
    <div className={expanded ? "" : ""}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[13px] font-semibold text-foreground">Março 2026</h4>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-[9px] font-medium text-muted-foreground/30 py-1">{d}</div>
        ))}
      </div>

      <div className={`grid grid-cols-7 ${expanded ? "gap-2" : "gap-1"}`}>
        {calendarDays().map((day, i) => {
          const hasMeeting = day !== null && highlightedDays.includes(day);
          const isToday = day === 15;
          const isSelected = day === selectedDay;
          return (
            <motion.div
              key={i}
              className={`${expanded ? "aspect-square min-h-[48px]" : "aspect-square"} rounded-md flex flex-col items-center justify-center text-[11px] transition-all duration-200 cursor-pointer relative ${
                day === null ? "" :
                isSelected ? "bg-accent text-accent-foreground font-semibold ring-2 ring-accent/30" :
                isToday ? "bg-accent text-accent-foreground font-semibold" :
                hasMeeting ? "bg-accent/15 text-accent font-semibold hover:bg-accent/25" :
                "text-foreground/60 hover:bg-muted/20"
              }`}
              whileHover={day ? { scale: expanded ? 1.05 : 1.1 } : undefined}
              whileTap={day ? { scale: 0.95 } : undefined}
              onClick={() => {
                if (day && hasMeeting) setSelectedDay(day === selectedDay ? null : day);
              }}
            >
              {day}
              {hasMeeting && !isToday && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected day details */}
      <AnimatePresence>
        {selectedDay && meetingsData[selectedDay] && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase mb-2">
              Reuniões em {selectedDay}/03
            </p>
            {meetingsData[selectedDay].map((m, i) => (
              <motion.div
                key={i}
                className="rounded-lg border border-border/20 bg-background/50 p-3 space-y-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-medium text-foreground">{m.title}</p>
                  <span className="text-[10px] font-mono text-accent">{m.time}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {m.empresa}</span>
                  {m.local && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.local}</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add meeting form (maximized only) */}
      {expanded && (
        <div className="mt-5 pt-4 border-t border-border/15">
          {!showAddMeeting ? (
            <motion.button
              onClick={() => setShowAddMeeting(true)}
              className="w-full h-9 rounded-lg border border-dashed border-accent/30 text-[12px] text-accent font-medium flex items-center justify-center gap-2 hover:bg-accent/5 transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar reunião
            </motion.button>
          ) : (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-[11px] font-medium text-foreground">Nova reunião</p>
              <input type="text" placeholder="Título" className="w-full h-9 px-3 rounded-lg border border-border/25 bg-background/50 text-[12px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-foreground/30" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Empresa" className="h-9 px-3 rounded-lg border border-border/25 bg-background/50 text-[12px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-foreground/30" />
                <input type="text" placeholder="Horário (HH:MM)" className="h-9 px-3 rounded-lg border border-border/25 bg-background/50 text-[12px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-foreground/30" />
              </div>
              <input type="text" placeholder="Local / Link" className="w-full h-9 px-3 rounded-lg border border-border/25 bg-background/50 text-[12px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-foreground/30" />
              <div className="flex items-center gap-2 justify-end">
                <motion.button onClick={() => setShowAddMeeting(false)} className="h-8 px-3 rounded-md text-[11px] text-muted-foreground hover:text-foreground transition-colors" whileTap={{ scale: 0.98 }}>
                  Cancelar
                </motion.button>
                <motion.button onClick={() => setShowAddMeeting(false)} className="h-8 px-4 rounded-md bg-accent text-accent-foreground text-[11px] font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );

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
                onClick={() => { setActiveNav(i); navigate(item.path); }}
                className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${
                  activeNav === i ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeNav === i && (
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
              <p className="text-[10px] text-muted-foreground/40 tracking-[0.12em] uppercase">bem-vindo de volta</p>
              <h2 className="text-[15px] font-semibold text-foreground tracking-tight">Raul Rodrigues</h2>
            </div>
            <div className="flex items-center gap-2">
              <motion.div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/40" whileHover={{ borderColor: "hsl(var(--accent) / 0.3)" }}>
                <Search className="w-3.5 h-3.5" />
                <span className="text-[12px]">Buscar...</span>
                <kbd className="ml-4 text-[9px] border border-border/30 rounded px-1.5 py-0.5 text-muted-foreground/25">⌘K</kbd>
              </motion.div>
              <motion.button onClick={() => setMaxNotifications(true)} className="relative w-9 h-9 rounded-lg border border-border/25 bg-card/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-200" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[8px] font-bold text-accent-foreground flex items-center justify-center">3</span>
              </motion.button>
              <motion.div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center" whileHover={{ scale: 1.03 }}>
                <span className="text-accent font-semibold text-[11px]">RR</span>
              </motion.div>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div className="p-6 space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {/* Action bar */}
            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <motion.button className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Plus className="w-3.5 h-3.5" /> Novo Contrato
                </motion.button>
                <div className="h-9 px-3 rounded-lg border border-border/25 bg-card/20 flex items-center gap-2 text-[12px] text-muted-foreground">
                  <CalendarIcon className="w-3.5 h-3.5" /> 8 Nov - 8 Dez, 2026
                </div>
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
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, hsl(var(--accent) / 0.04), transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-muted-foreground/60 font-medium">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color === "accent" ? "bg-accent/10 text-accent" : stat.color === "primary" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <motion.p className="text-[28px] font-bold text-foreground tracking-tight leading-none mb-1.5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}>
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

            {/* ── Pipeline + Notifications ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Pipeline */}
              <motion.div className="xl:col-span-3 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" variants={itemVariants}>
                <SectionHeader
                  title="Pipeline dos Contratos"
                  subtitle="Atualizado às 08:41h"
                  onMaximize={() => setMaxPipeline(true)}
                  extra={
                    <div className="flex items-center gap-2">
                      {["Todos", "BPO", "M&A"].map((f) => (
                        <button key={f} onClick={() => setPipelineFilter(f)} className={`h-7 px-2.5 rounded-md text-[10px] font-medium transition-all duration-200 ${f === pipelineFilter ? "bg-accent/10 text-accent border border-accent/20" : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/20"}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  }
                />
                {/* Search */}
                <div className="px-5 py-3 border-b border-border/10">
                  <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border/20 bg-background/40 text-muted-foreground">
                    <Search className="w-3.5 h-3.5 text-muted-foreground/30" />
                    <input type="text" placeholder="Buscar empresa..." value={pipelineSearch} onChange={e => setPipelineSearch(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/25" />
                  </div>
                </div>
                {renderPipelineTable(filteredPipeline)}
              </motion.div>

              {/* Notifications */}
              <motion.div className="xl:col-span-2 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" variants={itemVariants}>
                <SectionHeader
                  title="Notificações Recentes"
                  onMaximize={() => setMaxNotifications(true)}
                  extra={
                    <button onClick={() => setMaxNotifications(true)} className="text-[11px] text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
                      Ver Todas <ArrowUpRight className="w-3 h-3" />
                    </button>
                  }
                />
                {renderNotifications(allNotifications.slice(0, 4))}
              </motion.div>
            </div>

            {/* ── Empresas + Calendar ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Empresas */}
              <motion.div className="xl:col-span-3 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" variants={itemVariants}>
                <SectionHeader
                  title="Empresas"
                  subtitle="Pendentes — documentação em análise"
                  onMaximize={() => { setSelectedCompany(null); setMaxEmpresas(true); }}
                />
                {/* Search */}
                <div className="px-5 py-3 border-b border-border/10">
                  <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border/20 bg-background/40 text-muted-foreground">
                    <Search className="w-3.5 h-3.5 text-muted-foreground/30" />
                    <input type="text" placeholder="Buscar empresa..." value={empresaSearch} onChange={e => setEmpresaSearch(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/25" />
                  </div>
                </div>
                {/* Mini empresa list */}
                <div className="divide-y divide-border/10 max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {filteredEmpresas.map((row, i) => (
                    <motion.div
                      key={row.empresa}
                      className="px-5 py-3 flex items-center justify-between hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
                      onClick={() => handleCompanyClick(row)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">{row.empresa}</p>
                          <p className="text-[10px] text-muted-foreground/40">{row.tipo} · {row.responsavel} · Contato: {(row as any).ultimoContato || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center h-6 px-2.5 rounded-md text-[10px] font-medium border ${badgeStyles[row.badge]}`}>{row.status}</span>
                      </div>
                    </motion.div>
                  ))}
                  {filteredEmpresas.length === 0 && (
                    <div className="px-5 py-8 text-center text-[12px] text-muted-foreground/30">Nenhuma empresa encontrada</div>
                  )}
                </div>
              </motion.div>

              {/* Calendar */}
              <motion.div className="xl:col-span-2 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" variants={itemVariants}>
                <SectionHeader
                  title="Calendário"
                  onMaximize={() => setMaxCalendar(true)}
                  extra={
                    <motion.button onClick={() => { setMaxCalendar(true); setShowAddMeeting(true); }} className="h-7 px-3 rounded-md bg-accent/10 text-accent text-[10px] font-medium border border-accent/20" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      + Agendar
                    </motion.button>
                  }
                />
                <div className="p-5">
                  {/* Next meeting banner */}
                  {nextMeeting && (
                    <motion.div
                      className="mb-4 rounded-lg border border-accent/15 bg-accent/5 p-3 flex items-center gap-3"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <CalendarIcon className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-wider">Próxima reunião</p>
                        <p className="text-[12px] font-medium text-foreground">{nextMeeting.title}</p>
                        <p className="text-[10px] text-muted-foreground/50">{nextMeeting.day}/03 às {nextMeeting.time} · {nextMeeting.empresa}</p>
                      </div>
                    </motion.div>
                  )}
                  {renderCalendar()}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* ══════════════════════════════════════════
         MAXIMIZE MODALS
         ══════════════════════════════════════════ */}

      {/* Pipeline maximized */}
      <MaximizeModal isOpen={maxPipeline} onClose={() => setMaxPipeline(false)} title="Pipeline dos Contratos">
        <div className="mb-4 flex items-center gap-2">
          {["Todos", "BPO", "M&A"].map((f) => (
            <button key={f} onClick={() => setPipelineFilter(f)} className={`h-7 px-2.5 rounded-md text-[10px] font-medium transition-all ${f === pipelineFilter ? "bg-accent/10 text-accent border border-accent/20" : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/20"}`}>{f}</button>
          ))}
        </div>
        {renderPipelineTable(filteredPipeline, true)}
      </MaximizeModal>

      {/* Notifications maximized */}
      <MaximizeModal isOpen={maxNotifications} onClose={() => setMaxNotifications(false)} title="Todas as Notificações">
        {renderNotifications(allNotifications)}
      </MaximizeModal>

      {/* Empresas maximized */}
      <MaximizeModal isOpen={maxEmpresas} onClose={() => { setMaxEmpresas(false); setSelectedCompany(null); }} title={selectedCompany ? selectedCompany.empresa : "Empresas"}>
        {selectedCompany ? (
          <div>
            <motion.button onClick={() => setSelectedCompany(null)} className="mb-4 text-[11px] text-accent flex items-center gap-1 hover:underline" whileTap={{ scale: 0.98 }}>
              <ChevronLeft className="w-3 h-3" /> Voltar à lista
            </motion.button>
            {renderEmpresaDetail(selectedCompany)}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border/20 bg-background/40">
                  <Search className="w-3.5 h-3.5 text-muted-foreground/30" />
                  <input type="text" placeholder="Buscar empresa pendente..." value={empresaSearch} onChange={e => setEmpresaSearch(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/25 text-foreground" />
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/10">
              {filteredEmpresas.map((row, i) => (
                <motion.div
                  key={row.empresa}
                  className="py-3 flex items-center justify-between hover:bg-muted/10 transition-colors duration-200 cursor-pointer group rounded-lg px-3 -mx-3"
                  onClick={() => setSelectedCompany(row)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${row.isCliente ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                      {row.isCliente ? <Building2 className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">{row.empresa}</p>
                      <p className="text-[10px] text-muted-foreground/40">{row.tipo} · {row.responsavel} · Contato: {row.isCliente ? row.contratoInfo?.ultimoContato : (row as any).ultimoContato || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${row.isCliente ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                      {row.isCliente ? "Cliente" : "Pendente"}
                    </span>
                    <span className={`inline-flex items-center h-6 px-2.5 rounded-md text-[10px] font-medium border ${badgeStyles[row.badge]}`}>{row.status}</span>
                  </div>
                </motion.div>
              ))}
              {filteredEmpresas.length === 0 && (
                <div className="py-8 text-center text-[12px] text-muted-foreground/30">Nenhuma empresa encontrada</div>
              )}
            </div>
          </div>
        )}
      </MaximizeModal>

      {/* Calendar maximized */}
      <MaximizeModal isOpen={maxCalendar} onClose={() => { setMaxCalendar(false); setShowAddMeeting(false); }} title="Calendário — Março 2026">
        {renderCalendar(true)}
      </MaximizeModal>
    </div>
  );
};

export default Dashboard;
