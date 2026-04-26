import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import InvestmentGraphics from "@/components/login/InvestmentGraphics";
import { toast } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/use-theme";
import { getGoogleAuthorizationUrl, loginWithPassword } from "@/services/auth";
import { clearGoogleOAuthHashFromUrl, parseGoogleOAuthHash, saveGoogleOAuthSession } from "@/services/google-oauth";
import { getAuthSession, saveAuthSession } from "@/services/session";

const Index = () => {
  const { isDark, setIsDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const oauthResult = parseGoogleOAuthHash(window.location.hash || window.location.search);

    if (!oauthResult) {
      return;
    }

    clearGoogleOAuthHashFromUrl();

    if (oauthResult.status === "success") {
      saveGoogleOAuthSession(oauthResult.session);
      if (oauthResult.authSession) {
        saveAuthSession(oauthResult.authSession);
        toast.success("Login Google concluido. Redirecionando para a plataforma.");
        navigate("/dashboard", { replace: true });
      } else if (getAuthSession()) {
        toast.success("Google Calendar conectado. Redirecionando para a plataforma.");
        navigate("/dashboard", { replace: true });
      } else {
        toast.success("Google Calendar conectado. Entre no sistema para agendar reunioes.");
      }
      return;
    }

    toast.error(oauthResult.error);
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const authorizationUrl = await getGoogleAuthorizationUrl();
      window.location.href = authorizationUrl;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Nao foi possivel iniciar o login com Google.",
      );
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    try {
      setIsLoginLoading(true);
      const session = await loginWithPassword(email, password);
      saveAuthSession(session);
      toast.success("Login realizado com sucesso.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel acessar a plataforma.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='256' height='256' fill='transparent'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <motion.div
        className="fixed top-[-25%] right-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.06) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-[-25%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.04) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.01] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.42) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.42) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 min-h-screen grid grid-rows-[auto_1fr_auto]">
        <header className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <ClimbLogo className="h-4 text-foreground" />

          <div className="flex items-center gap-3">
            <motion.div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/40 text-[9px] text-muted-foreground/50 tracking-[0.15em] uppercase"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              Ambiente restrito
            </motion.div>
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className="w-7 h-7 rounded border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
              aria-label="Alternar tema"
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
          </div>
        </header>

        <main className="flex items-center px-6 md:px-10 lg:px-14">
          <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-[420px_1px_1fr] xl:grid-cols-[460px_1px_1fr] gap-0 items-center">
            <div className="w-full max-w-sm lg:max-w-none mx-auto lg:mx-0 lg:pr-14 xl:pr-20">
              <div className="lg:hidden mb-6">
                <ClimbLogo className="h-4 text-foreground" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="text-[2rem] md:text-[2.4rem] font-semibold tracking-[-0.03em] text-foreground leading-[1.05] mb-3">
                  Acesso ao ambiente
                  <br />
                  <span className="text-accent">interno</span>
                </h1>
                <p className="text-sm text-muted-foreground/60 leading-relaxed mb-10 max-w-[340px]">
                  Plataforma restrita para operações, análises e gestão patrimonial.
                </p>
              </motion.div>

              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handlePasswordLogin();
                }}
                className="space-y-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              >
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground/70 mb-1.5 block tracking-wide">
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
                      className="w-full h-11 rounded-md border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accent origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground/70 mb-1.5 block tracking-wide">
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
                      className="w-full h-11 rounded-md border border-input bg-background px-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
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

                <div className="flex justify-between items-center">
                  <Link
                    to="/recuperar-senha"
                    className="text-[10px] text-muted-foreground/50 hover:text-accent transition-colors duration-200"
                  >
                    Esqueceu a senha?
                  </Link>
                  <Link
                    to="/solicitar-acesso"
                    className="text-[10px] text-muted-foreground/50 hover:text-accent transition-colors duration-200"
                  >
                    Solicitar acesso
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoginLoading}
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
                    {isLoginLoading ? "Acessando..." : "Acessar plataforma"}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </motion.button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-[9px] text-muted-foreground/30 bg-background tracking-wider uppercase">
                      ou
                    </span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full h-11 rounded-md border border-border/50 bg-background text-sm font-medium text-foreground flex items-center justify-center gap-2.5 transition-colors duration-200 hover:bg-muted/30 hover:border-border"
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {isGoogleLoading ? "Conectando ao Google..." : "Conectar Google Calendar"}
                </motion.button>
              </motion.form>
            </div>

            <div className="hidden lg:block w-px bg-border/40 self-stretch my-16" />

            <div className="hidden lg:block pl-14 xl:pl-20">
              <InvestmentGraphics />
            </div>
          </div>
        </main>

        <footer className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <motion.span
            className="text-[9px] text-muted-foreground/25 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            © 2026 Climb Investimentos Independentes
          </motion.span>
          <motion.span
            className="text-[9px] text-muted-foreground/25 font-mono"
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
