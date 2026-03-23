import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <motion.div
      className="relative z-10 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Top badge */}
      <motion.div
        className="flex items-center gap-2 mb-8"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel">
          <Shield className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
            Secure Internal Access
          </span>
        </div>
      </motion.div>

      {/* Brand */}
      <motion.div
        className="mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
          Climb<span className="text-gradient">.</span>
        </h1>
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mt-1">
          Investimentos Independentes
        </p>
      </motion.div>

      {/* Title */}
      <motion.div
        className="mt-8 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-foreground">
          Ambiente interno de inteligência patrimonial
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm">
          Plataforma interna para acompanhamento de operações, análises e dados estratégicos.
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        className="mt-8 glass-panel-strong p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground tracking-wide">
              E-mail corporativo
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="nome@climb.com.br"
                className="input-premium"
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full origin-left"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: emailFocused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground tracking-wide">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="••••••••"
                className="input-premium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full origin-left"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: passwordFocused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button type="button" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
              Esqueceu a senha?
            </button>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn-primary-premium group"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <span className="flex items-center justify-center gap-2">
              Acessar plataforma
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[10px] tracking-wider uppercase text-muted-foreground" style={{ background: "hsl(var(--glass-bg))" }}>
                ou
              </span>
            </div>
          </div>

          {/* Google */}
          <motion.button
            type="button"
            className="btn-google group"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <span className="flex items-center justify-center gap-2.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com Google
            </span>
          </motion.button>
        </form>

        {/* Request access */}
        <div className="mt-6 text-center">
          <button type="button" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
            Solicitar acesso →
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-[10px] text-muted-foreground/60 tracking-wide">
          © 2026 Climb Investimentos · Ambiente interno restrito
        </p>
      </motion.div>
    </motion.div>
  );
};
