import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import BackgroundEffects from "@/components/login/BackgroundEffects";

const RecuperarSenha = () => {
  const { isDark, setIsDark } = useTheme();
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);


  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 min-h-screen grid grid-rows-[auto_1fr_auto]">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <ClimbLogo className="h-[18px] text-foreground" />
          <motion.button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-lg border border-border/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
            aria-label="Alternar tema"
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

        {/* Main */}
        <main className="flex items-center justify-center px-6 md:px-10 lg:px-14">
          <div className="w-full max-w-[400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-accent transition-colors duration-300 mb-10"
              >
                <ArrowLeft className="w-3 h-3" />
                Voltar ao acesso
              </Link>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-[1.75rem] md:text-[2rem] font-black tracking-[-0.035em] text-foreground leading-[1.05] mb-3">
                      Recuperar <span className="text-accent">senha</span>
                    </h1>
                    <p className="text-[13px] text-muted-foreground/40 leading-relaxed mb-10 max-w-[320px]">
                      Informe o e-mail corporativo associado à sua conta para receber o link de redefinição.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                      className="space-y-5"
                    >
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
                          Enviar link de redefinição
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-7"
                      style={{
                        border: "1px solid hsl(var(--accent) / 0.2)",
                        background: "hsl(var(--accent) / 0.05)",
                        boxShadow: "0 0 30px -5px hsl(var(--accent) / 0.15)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.4 }}
                    >
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-accent"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </motion.svg>
                    </motion.div>

                    <h1 className="text-[1.6rem] font-black tracking-[-0.035em] text-foreground leading-[1.05] mb-3">
                      Link <span className="text-accent">enviado</span>
                    </h1>
                    <p className="text-[13px] text-muted-foreground/40 leading-relaxed mb-8 max-w-[320px]">
                      Se o e-mail <span className="text-foreground font-medium">{email}</span> estiver cadastrado, você receberá as instruções de redefinição em instantes.
                    </p>

                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 text-[11px] text-accent hover:text-accent/70 transition-colors duration-300 font-medium"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Voltar ao acesso
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          <span className="text-[9px] text-muted-foreground/15 tracking-wide">
            © 2026 Climb Investimentos Independentes
          </span>
          <span className="text-[9px] text-muted-foreground/15 font-mono">
            v3.1.0
          </span>
        </footer>
      </div>
    </div>
  );
};

export default RecuperarSenha;
