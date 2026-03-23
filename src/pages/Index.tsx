import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Moon, Sun } from "lucide-react";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      {/* Subtle background texture — fine grid */}
      <svg className="fixed inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="g" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0V80H0" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>

      {/* Single ambient light — restrained */}
      <div
        className="fixed top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none opacity-[0.06] dark:opacity-[0.08]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
      />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-8 md:px-12 lg:px-16 py-6">
        <div className="flex items-center gap-3">
          {/* Brand mark */}
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold tracking-tight">C</span>
          </div>
          <div className="hidden sm:flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground tracking-tight">Climb</span>
            <span className="text-[10px] text-muted-foreground tracking-wide">Investimentos</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-muted-foreground tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Ambiente restrito
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex min-h-[calc(100vh-88px)]">
        {/* Left column — form */}
        <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-[2rem] md:text-[2.4rem] font-extrabold tracking-tight text-foreground leading-[1.1]">
              Acesso ao ambiente<br />interno
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Plataforma restrita para operações, análises e gestão patrimonial.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 space-y-5 max-w-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
                E-mail corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@climb.com.br"
                className="w-full h-11 rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-lg border border-input bg-card px-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-0.5">
              <button type="button" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                Esqueceu a senha?
              </button>
              <button type="button" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                Solicitar acesso
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:opacity-90 active:opacity-95 transition-opacity duration-150 flex items-center justify-center gap-2 group mt-2"
            >
              Acessar plataforma
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-[10px] text-muted-foreground bg-background">ou</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-11 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors duration-150 flex items-center justify-center gap-2.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com Google
            </button>
          </motion.form>

          <motion.p
            className="mt-12 text-[10px] text-muted-foreground/50 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            © 2026 Climb Investimentos Independentes
          </motion.p>
        </div>

        {/* Right side — editorial, structural, not decorative */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          {/* Vertical rule — editorial separator */}
          <div className="absolute left-0 top-[12%] bottom-[12%] w-px bg-border" />

          <motion.div
            className="relative w-full max-w-md px-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Institutional block — not a card, just structured text */}
            <div className="space-y-10">
              {/* Status indicator */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                    Sistema operacional
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold font-mono-data text-foreground tracking-tight">2,847</span>
                  <span className="text-xs text-muted-foreground">operações ativas</span>
                </div>
                {/* Mini bar chart — restrained */}
                <div className="flex items-end gap-[3px] mt-4 h-8">
                  {[35, 52, 44, 68, 58, 72, 65, 80, 74, 88, 82, 90, 85, 92, 78, 86].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-[6px] rounded-sm bg-primary/20 dark:bg-primary/15"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.03, ease: "easeOut" }}
                    />
                  ))}
                </div>
              </div>

              {/* Divider line — not decorative, structural */}
              <div className="w-12 h-px bg-border" />

              {/* Secondary metric */}
              <div>
                <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-2">
                  Latência média
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono-data text-foreground">12</span>
                  <span className="text-xs text-muted-foreground">ms</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-12 h-px bg-border" />

              {/* Tertiary — just a status line */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground">
                  Todos os serviços operacionais
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
