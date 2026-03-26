import { motion } from "framer-motion";

const BackgroundEffects = () => {
  return (
    <>
      {/* Deep gradient base */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 100%, hsl(195 60% 8% / 0.9) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 0%, hsl(210 40% 12% / 0.8) 0%, transparent 50%),
            radial-gradient(ellipse 90% 70% at 50% 50%, hsl(216 28% 7%) 0%, hsl(220 30% 4%) 100%)
          `,
        }}
      />

      {/* Primary accent glow — top right */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          top: "-15%",
          right: "-10%",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(178 35% 40% / 0.08) 0%, hsl(178 35% 40% / 0.02) 40%, transparent 65%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary warm glow — bottom left */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          bottom: "-20%",
          left: "-10%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(195 55% 32% / 0.06) 0%, hsl(210 25% 20% / 0.03) 40%, transparent 65%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.8, 0.4],
          x: [0, -10, 0],
          y: [0, 10, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Central subtle light */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          top: "30%",
          left: "40%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(178 35% 40% / 0.03) 0%, transparent 50%)",
          filter: "blur(80px)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
        }}
      />

      {/* Refined grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012] dark:opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Abstract geometric elements — SVG layer */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(178 35% 40%)" stopOpacity="0" />
            <stop offset="30%" stopColor="hsl(178 35% 40%)" stopOpacity="0.15" />
            <stop offset="70%" stopColor="hsl(178 35% 40%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(178 35% 40%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(195 55% 32%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(195 55% 32%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(195 55% 32%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(178 35% 40%)" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(178 35% 40%)" stopOpacity="0.12" />
            <stop offset="80%" stopColor="hsl(178 35% 40%)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="hsl(178 35% 40%)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="orb-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(178 35% 40%)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="hsl(178 35% 40%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Performance curve — elegant growth line */}
        <motion.path
          d="M-50,680 C150,660 300,620 450,580 S700,480 900,420 S1200,320 1400,260 S1700,180 1950,140"
          fill="none"
          stroke="url(#curve-grad)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
        />

        {/* Secondary curve */}
        <motion.path
          d="M-50,720 C200,700 400,670 550,640 S800,550 1000,490 S1300,380 1500,320 S1800,230 1950,190"
          fill="none"
          stroke="url(#curve-grad)"
          strokeWidth="0.8"
          strokeDasharray="8 12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 4, delay: 1, ease: "easeOut" }}
        />

        {/* Diagonal fine lines */}
        <motion.line
          x1="60%" y1="0" x2="30%" y2="100%"
          stroke="url(#line-grad-2)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
        <motion.line
          x1="75%" y1="0" x2="45%" y2="100%"
          stroke="url(#line-grad-2)"
          strokeWidth="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 2, delay: 2 }}
        />

        {/* Horizontal accent line */}
        <motion.line
          x1="0" y1="75%" x2="100%" y2="75%"
          stroke="url(#line-grad-1)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.8 }}
        />

        {/* Geometric shape — diamond */}
        <motion.polygon
          points="1300,200 1350,260 1300,320 1250,260"
          fill="none"
          stroke="hsl(178 35% 40%)"
          strokeWidth="0.5"
          strokeOpacity="0.08"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 2.2 }}
        />

        {/* Circular orb */}
        <motion.circle
          cx="85%"
          cy="25%"
          r="120"
          fill="url(#orb-grad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4, 0.8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Small accent circles — constellation */}
        {[
          { cx: "70%", cy: "20%", r: 2, delay: 2 },
          { cx: "72%", cy: "22%", r: 1.5, delay: 2.2 },
          { cx: "75%", cy: "18%", r: 1, delay: 2.4 },
          { cx: "68%", cy: "24%", r: 1.2, delay: 2.6 },
          { cx: "78%", cy: "15%", r: 1.8, delay: 2.8 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="hsl(178 35% 40%)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.1, 0.3, 0] }}
            transition={{ duration: 6, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Connecting lines between dots */}
        <motion.polyline
          points="70%,20% 72%,22% 75%,18% 78%,15%"
          fill="none"
          stroke="hsl(178 35% 40%)"
          strokeWidth="0.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.12 }}
          transition={{ duration: 3, delay: 3 }}
        />
      </svg>

      {/* Floating geometric shapes — positioned elements */}
      {/* Hexagonal ring — top left area */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          top: "12%",
          left: "8%",
          width: "180px",
          height: "180px",
          border: "1px solid hsl(178 35% 40% / 0.04)",
          borderRadius: "50%",
        }}
        animate={{
          rotate: [0, 360],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Smaller ring */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          top: "15%",
          left: "10.5%",
          width: "120px",
          height: "120px",
          border: "0.5px solid hsl(178 35% 40% / 0.03)",
          borderRadius: "50%",
        }}
        animate={{
          rotate: [360, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          rotate: { duration: 45, repeat: Infinity, ease: "linear" },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Bottom right geometric accent */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          bottom: "15%",
          right: "5%",
          width: "200px",
          height: "200px",
          border: "0.5px solid hsl(195 55% 32% / 0.04)",
          transform: "rotate(45deg)",
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, hsl(220 30% 3% / 0.4) 100%)",
        }}
      />
    </>
  );
};

export default BackgroundEffects;
