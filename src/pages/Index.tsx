import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Ambient glow — top right */}
      <motion.div
        className="fixed top-[-30%] right-[-20%] w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.05) 0%, transparent 55%)" }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Ambient glow — bottom left */}
      <motion.div
        className="fixed bottom-[-30%] left-[-15%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.04) 0%, transparent 55%)" }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative abstract lines — background investment motif */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.06]" preserveAspectRatio="none">
        <motion.path
          d="M0,75% Q25%,65% 50%,70% T100%,55%"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 1, ease: "easeOut" }}
        />
        <motion.path
          d="M0,80% Q30%,72% 55%,76% T100%,62%"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 1.5, ease: "easeOut" }}
        />
      </svg>

      {/* Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/30 text-[9px] text-muted-foreground/50 tracking-[0.15em] uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            Secure Internal Access
          </motion.div>

          <motion.button
            onClick={() => setIsDark(!isDark)}
            className="w-7 h-7 rounded border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
            aria-label="Alternar tema"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </header>

        {/* Main — centered content */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-10">
          <div className="w-full max-w-[420px]">
            {/* Logo */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <ClimbLogo className="h-[18px] text-foreground mb-2" />
              <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/40 font-medium">
                Investimentos Independentes
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="mb-10"
            >
              <h1 className="text-[1.75rem] md:text-[2rem] font-black tracking-[-0.03em] text-foreground leading-[1.1] mb-2.5">
                Acesso ao ambiente interno
              </h1>
              <p className="text-[13px] text-muted-foreground/50 leading-relaxed max-w-[340px]">
                Plataforma restrita para operações, análises e gestão patrimonial.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              {/* Email */}
              <div>
                <label className="text-[11px] font-medium text-muted-foreground/60 mb-1.5 block tracking-wide">
                  E-mail corporativo
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="nome@climb.com.br"
                    className="w-full h-11 rounded-md border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/25 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accent origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-medium text-muted-foreground/60 mb-1.5 block tracking-wide">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-md border border-input bg-background px-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/25 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/35 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accent origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: focusedField === "password" ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/recuperar-senha"
                  className="text-[10px] text-muted-foreground/40 hover:text-accent transition-colors duration-200"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="w-full h-11 rounded-md bg-accent text-accent-foreground text-sm font-semibold flex items-center justify-center gap-2 group relative overflow-hidden"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <motion.div
                  className="absolute inset-0 bg-accent"
                  whileHover={{
                    background: [
                      "hsl(var(--accent))",
                      "hsl(var(--accent) / 0.85)",
                      "hsl(var(--accent))",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Acessar plataforma
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </motion.button>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-[9px] text-muted-foreground/25 bg-background tracking-wider uppercase">
                    ou
                  </span>
                </div>
              </div>

              {/* Google */}
              <motion.button
                type="button"
                className="w-full h-11 rounded-md border border-border/40 bg-background text-sm font-medium text-foreground flex items-center justify-center gap-2.5 transition-colors duration-200 hover:bg-muted/20 hover:border-border/60"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuar com Google
              </motion.button>

              {/* Request access */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  className="text-[10px] text-muted-foreground/35 hover:text-accent transition-colors duration-200"
                >
                  Solicitar acesso →
                </button>
              </div>
            </motion.form>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <motion.span
            className="text-[9px] text-muted-foreground/20 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            © 2026 Climb Investimentos · Ambiente interno restrito
          </motion.span>
          <motion.span
            className="text-[9px] text-muted-foreground/20 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            v3.1.0
          </motion.span>
        </footer>
      </div>
    </div>
  );
};

export default Index;
