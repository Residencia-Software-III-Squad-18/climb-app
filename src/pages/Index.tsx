import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import BackgroundEffects from "@/components/login/BackgroundEffects";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <BackgroundEffects />

      {/* Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <motion.div
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/20 backdrop-blur-sm text-[9px] text-muted-foreground/40 tracking-[0.18em] uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            Secure Internal Access
          </motion.div>

          <motion.button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-lg border border-border/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
            aria-label="Alternar tema"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </header>

        {/* Main — centered content */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-10">
          <div className="w-full max-w-[400px]">
            {/* Logo */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ClimbLogo className="h-[20px] text-foreground mb-3" />
              <div className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/30 font-medium">
                Investimentos Independentes
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-10"
            >
              <h1 className="text-[1.75rem] md:text-[2rem] font-black tracking-[-0.035em] text-foreground leading-[1.05] mb-3">
                Acesso ao ambiente
                <br />
                <span className="text-accent">interno</span>
              </h1>
              <p className="text-[13px] text-muted-foreground/40 leading-relaxed max-w-[320px]">
                Plataforma restrita para operações, análises e gestão patrimonial.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }}
              className="space-y-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Email */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground/50 mb-2 block tracking-[0.08em] uppercase">
                  E-mail corporativo
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="nome@climb.com.br"
                    className="w-full h-12 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm px-4 text-sm text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-card/50 focus:shadow-[0_0_20px_-5px_hsl(var(--accent)/0.15)] transition-all duration-300"
                  />
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-accent to-transparent origin-center"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: focusedField === "email" ? 1 : 0,
                      opacity: focusedField === "email" ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground/50 mb-2 block tracking-[0.08em] uppercase">
                  Senha
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full h-12 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-card/50 focus:shadow-[0_0_20px_-5px_hsl(var(--accent)/0.15)] transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/25 hover:text-accent transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-accent to-transparent origin-center"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: focusedField === "password" ? 1 : 0,
                      opacity: focusedField === "password" ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/recuperar-senha"
                  className="text-[10px] text-muted-foreground/30 hover:text-accent transition-colors duration-300 tracking-wide"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--accent)), hsl(178 35% 32%))",
                  color: "hsl(0 0% 100%)",
                  boxShadow: "0 4px 20px -4px hsl(var(--accent) / 0.3), inset 0 1px 0 hsl(178 35% 50% / 0.2)",
                }}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(135deg, hsl(178 35% 45%), hsl(var(--accent)))",
                  }}
                />
                <span className="relative z-10 flex items-center gap-2.5">
                  Acessar plataforma
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-[9px] text-muted-foreground/20 bg-background tracking-[0.2em] uppercase">
                    ou
                  </span>
                </div>
              </div>

              {/* Google */}
              <motion.button
                type="button"
                className="w-full h-12 rounded-lg border border-border/25 bg-card/20 backdrop-blur-sm text-sm font-medium text-foreground flex items-center justify-center gap-2.5 transition-all duration-300 hover:bg-card/40 hover:border-border/40 hover:shadow-[0_2px_15px_-3px_hsl(var(--foreground)/0.05)]"
                whileHover={{ scale: 1.005, y: -0.5 }}
                whileTap={{ scale: 0.995 }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuar com Google
              </motion.button>

              {/* Request access */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="text-[10px] text-muted-foreground/25 hover:text-accent transition-colors duration-300 tracking-wide"
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
            className="text-[9px] text-muted-foreground/15 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            © 2026 Climb Investimentos · Ambiente interno restrito
          </motion.span>
          <motion.span
            className="text-[9px] text-muted-foreground/15 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            v3.1.0
          </motion.span>
        </footer>
      </div>
    </div>
  );
};

export default Index;
