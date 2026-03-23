import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const GridLines = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const GlowOrbs = () => (
  <>
    <motion.div
      className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsl(var(--glow-primary) / 0.08) 0%, transparent 70%)",
      }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsl(var(--glow-accent) / 0.06) 0%, transparent 70%)",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsl(var(--glow-primary) / 0.04) 0%, transparent 70%)",
      }}
      animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  </>
);

const DataLines = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    {[
      { d: "M 0 300 Q 400 250 800 320 T 1600 280", delay: 0 },
      { d: "M 0 500 Q 300 480 700 520 T 1600 490", delay: 1.5 },
      { d: "M 0 700 Q 500 650 900 710 T 1600 680", delay: 3 },
    ].map((line, i) => (
      <motion.path
        key={i}
        d={line.d}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-primary/10"
        strokeDasharray="8 12"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 3, delay: line.delay, ease: "easeOut" }}
      />
    ))}
  </svg>
);

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <GridLines />
      <GlowOrbs />
      <DataLines />
    </div>
  );
};
