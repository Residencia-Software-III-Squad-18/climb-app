import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Moon, Sun, Shield } from "lucide-react";

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
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }}
      />

      {/* Ambient gradient — top right, very subtle */}
      <div className="fixed top-[-30%] right-[-20%] w-[900px] h-[900px] rounded-full pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 60%)" }}
      />
      {/* Second ambient — bottom left */}
      <div className="fixed bottom-[-30%] left-[-15%] w-[700px] h-[700px] rounded-full pointer-events-none opacity-[0.03] dark:opacity-[0.04]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 60%)" }}
      />

      {/* Full-height grid layout */}
      <div className="relative z-10 min-h-screen grid grid-rows-[auto_1fr_auto]">
        
        {/* === TOP BAR === */}
        <header className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-[10px] font-bold">C</span>
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">Climb</span>
            <span className="text-[10px] text-muted-foreground/60 tracking-wider hidden sm:inline">Investimentos</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/50 text-[9px] text-muted-foreground tracking-widest uppercase">
              <Shield className="w-2.5 h-2.5" />
              Acesso restrito
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-7 h-7 rounded border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            </button>
          </div>
        </header>

        {/* === MAIN — vertically centered, horizontally off-center === */}
        <main className="flex items-center px-6 md:px-10 lg:px-14">
          <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-[1fr_1px_380px] xl:grid-cols-[1fr_1px_420px] gap-0 items-center">
            
            {/* LEFT — Brand statement area */}
            <div className="hidden lg:block pr-16 xl:pr-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Large typographic block */}
                <h1 className="text-[3.2rem] xl:text-[3.8rem] font-black tracking-[-0.035em] text-foreground leading-[0.95] mb-6">
                  Controle<br />
                  <span className="text-muted-foreground/40">operacional.</span>
                </h1>
                
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[320px] mb-10">
                  Ambiente interno para acompanhamento de operações, análises e dados estratégicos.
                </p>

                {/* Horizontal line */}
                <div className="w-16 h-px bg-border mb-10" />

                {/* Status blocks — functional, not decorative */}
                <div className="space-y-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-bold font-mono text-foreground tracking-tight">R$ 4.2B</span>
                    <span className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">AUM</span>
                  </div>
                  
                  <div className="flex gap-8">
                    <div>
                      <span className="text-lg font-bold font-mono text-foreground">2,847</span>
                      <span className="text-[10px] text-muted-foreground/60 ml-2">ops ativas</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold font-mono text-foreground">12ms</span>
                      <span className="text-[10px] text-muted-foreground/60 ml-2">latência</span>
                    </div>
                  </div>

                  {/* Minimal activity bars */}
                  <div className="flex items-end gap-[2px] h-6">
                    {[30, 45, 38, 62, 55, 70, 48, 75, 60, 82, 68, 85, 72, 78, 65, 80, 70, 88, 75, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-[3px] rounded-[1px] bg-primary/15 dark:bg-primary/10"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.02, ease: "easeOut" }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 pt-2">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    <span className="text-[10px] text-muted-foreground/50">Todos os sistemas operacionais</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* VERTICAL SEPARATOR */}
            <div className="hidden lg:block w-px bg-border self-stretch my-12" />

            {/* RIGHT — Login form */}
            <div className="lg:pl-12 xl:pl-16 w-full max-w-sm lg:max-w-none mx-auto lg:mx-0">
              {/* Mobile-only heading */}
              <motion.div
                className="lg:hidden mb-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Acesso interno
                </h1>
                <p className="mt-2 text-xs text-muted-foreground">
                  Plataforma restrita — Climb Investimentos
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <span className="hidden lg:block text-[10px] font-medium tracking-widest uppercase text-muted-foreground/50 mb-6">
                  Identificação
                </span>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
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
                        className="w-full h-11 rounded-md border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/15 transition-all duration-200"
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
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
                        className="w-full h-11 rounded-md border border-input bg-background px-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/15 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: focusedField === "password" ? 1 : 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex justify-between items-center">
                    <button type="button" className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors">
                      Esqueceu a senha?
                    </button>
                    <button type="button" className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors">
                      Solicitar acesso
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.995] transition-all duration-150 flex items-center justify-center gap-2 group"
                  >
                    Acessar
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 text-[9px] text-muted-foreground/40 bg-background tracking-wider uppercase">ou</span>
                    </div>
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    className="w-full h-11 rounded-md border border-border/60 bg-background text-sm font-medium text-foreground hover:bg-muted/50 transition-colors duration-150 flex items-center justify-center gap-2.5"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuar com Google
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </main>

        {/* === FOOTER === */}
        <footer className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <span className="text-[9px] text-muted-foreground/30 tracking-wide">
            © 2026 Climb Investimentos Independentes
          </span>
          <span className="text-[9px] text-muted-foreground/30 font-mono">
            v3.1.0
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Index;
