import { motion } from "framer-motion";

import { useThemeStore } from "../../store/useThemeStore";

const PerformanceCurve = () => {
  const chartWidth = 398;
  const endX = 384;
  const points = `0,80 30,72 60,75 90,60 120,65 150,45 180,50 210,30 240,35 270,18 300,22 330,10 360,12 ${endX},5`;
  const accentColor = "var(--accent-color)";
  const borderColor = "var(--border-color)";

  return (
    <motion.svg
      viewBox={`0 0 ${chartWidth} 90`}
      className="w-full h-auto"
      style={{ overflow: "visible" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
    >
      {[20, 40, 60, 80].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2={chartWidth}
          y2={y}
          stroke={borderColor}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      <motion.path
        d={`M0,90 L${points} L${chartWidth},90 Z`}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke={accentColor}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
      />
      <motion.circle
        cx={endX}
        cy="5"
        r="3.4"
        fill={accentColor}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 2.6 }}
      />
      <motion.circle
        cx={endX}
        cy="5"
        r="6.8"
        fill="none"
        stroke={accentColor}
        strokeWidth="1.15"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 2] }}
        transition={{
          duration: 2,
          delay: 2.6,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

const PatrimonioChart = () => {
  const bars = [35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 88, 82, 92];

  return (
    <motion.div
      className="flex items-end gap-[3px] h-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[4px] rounded-[1px]"
          style={{
            background: `rgba(43, 191, 164, ${0.2 + (i / bars.length) * 0.6})`,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.04, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
};

const AllocationRing = () => {
  const accentColor = "var(--accent-color)";
  const borderColor = "var(--border-color)";

  return (
    <motion.svg
      viewBox="0 0 80 80"
      className="w-20 h-20"
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: -90 }}
      transition={{ duration: 0.6, delay: 1.4 }}
    >
      <circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke={borderColor}
        strokeWidth="3"
        opacity="0.2"
      />
      <motion.circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 32}`}
        strokeDashoffset={`${2 * Math.PI * 32 * 0.35}`}
        initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
        animate={{ strokeDashoffset: 2 * Math.PI * 32 * 0.35 }}
        transition={{ duration: 1.5, delay: 1.6, ease: "easeOut" }}
      />
      <motion.circle
        cx="40"
        cy="40"
        r="26"
        fill="none"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 26}`}
        strokeDashoffset={`${2 * Math.PI * 26 * 0.55}`}
        initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
        animate={{ strokeDashoffset: 2 * Math.PI * 26 * 0.55 }}
        transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
      />
    </motion.svg>
  );
};

export default function InvestmentGraphics() {
  useThemeStore();
  const mutedColor = "var(--muted-text)";

  return (
    <div className="hidden lg:flex flex-col justify-center gap-12 h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[9px] font-medium tracking-[0.2em] uppercase"
            style={{ color: mutedColor }}
          >
            Performance patrimonial
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: mutedColor }}
          />
        </div>
        <PerformanceCurve />
        <div className="flex justify-between mt-3">
          <span className="text-[9px] font-mono" style={{ color: mutedColor }}>
            Jan
          </span>
          <span className="text-[9px] font-mono" style={{ color: mutedColor }}>
            Jun
          </span>
          <span className="text-[9px] font-mono" style={{ color: mutedColor }}>
            Dez
          </span>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div>
          <AllocationRing />
          <span
            className="text-[8px] tracking-[0.15em] uppercase mt-2 block text-center"
            style={{ color: mutedColor }}
          >
            Alocação
          </span>
        </div>
        <div className="flex-1">
          <span
            className="text-[9px] font-medium tracking-[0.2em] uppercase block mb-3"
            style={{ color: mutedColor }}
          >
            Evolução patrimonial
          </span>
          <PatrimonioChart />
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--accent-color)" }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <span className="text-[9px]" style={{ color: mutedColor }}>
          Ambiente protegido · Gestão patrimonial ativa
        </span>
      </motion.div>
    </div>
  );
}