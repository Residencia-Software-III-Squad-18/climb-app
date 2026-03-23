import { motion } from "framer-motion";

const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80 - 10}`).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const panels = [
  {
    id: "performance",
    x: "right-8 lg:right-16",
    y: "top-[18%]",
    content: (
      <div className="w-44">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Performance</span>
          <span className="text-[10px] font-mono text-accent">+12.4%</span>
        </div>
        <div className="h-12">
          <MiniChart data={[20, 25, 22, 30, 28, 35, 32, 40, 38, 45, 50, 48]} color="hsl(var(--accent))" />
        </div>
      </div>
    ),
    delay: 0.8,
    anim: "animate-float",
  },
  {
    id: "operations",
    x: "right-4 lg:right-24",
    y: "top-[45%]",
    content: (
      <div className="w-40">
        <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Operações Ativas</span>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-2xl font-bold text-foreground font-mono">2,847</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
          <span className="text-[9px] text-muted-foreground">Processando em tempo real</span>
        </div>
      </div>
    ),
    delay: 1.2,
    anim: "animate-float-delayed",
  },
  {
    id: "aum",
    x: "right-12 lg:right-8",
    y: "bottom-[22%]",
    content: (
      <div className="w-36">
        <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">AUM Total</span>
        <div className="mt-1.5">
          <span className="text-lg font-bold text-foreground font-mono">R$ 4.2B</span>
        </div>
        <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            initial={{ width: "0%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 2, delay: 2, ease: "easeOut" }}
          />
        </div>
      </div>
    ),
    delay: 1.6,
    anim: "animate-float-slow",
  },
  {
    id: "security",
    x: "left-4 lg:left-16",
    y: "bottom-[15%]",
    content: (
      <div className="w-36">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Status Segurança</span>
        </div>
        <span className="text-xs font-medium text-accent">Ambiente protegido</span>
        <div className="mt-1.5 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-5 h-1 rounded-full bg-accent/30">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 2.5 + i * 0.15 }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    delay: 2,
    anim: "animate-float-delayed",
  },
  {
    id: "latency",
    x: "left-6 lg:left-12",
    y: "top-[30%]",
    content: (
      <div className="w-32">
        <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Latência</span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-lg font-bold font-mono text-foreground">12</span>
          <span className="text-[10px] text-muted-foreground">ms</span>
        </div>
        <div className="mt-1 flex gap-[2px]">
          {[4, 6, 3, 8, 5, 7, 4, 6, 3, 5, 7, 4].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-primary/40"
              initial={{ height: 0 }}
              animate={{ height: h * 2.5 }}
              transition={{ duration: 0.4, delay: 2.8 + i * 0.05 }}
            />
          ))}
        </div>
      </div>
    ),
    delay: 1,
    anim: "animate-float-slow",
  },
];

export const FloatingPanels = () => (
  <>
    {panels.map((panel) => (
      <motion.div
        key={panel.id}
        className={`hidden md:block absolute ${panel.x} ${panel.y} glass-panel p-3.5 ${panel.anim}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: panel.delay, ease: "easeOut" }}
      >
        {panel.content}
      </motion.div>
    ))}
  </>
);
