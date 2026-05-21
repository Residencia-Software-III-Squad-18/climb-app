import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/context/provider";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificacoes } from "@/services/useNotificacoes";
import { NotificationList, type Notification as AppNotification } from "@/components/notifications/NotificationList";

export function PageHeaderActions() {
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lidasIds, setLidasIds] = useState<Set<number>>(new Set());

  const authContext = useContext(AuthContext);
  const basicUserData = useAuthStore((state) => state.basicUserData);
  const { data: notificacoesApi = [] } = useNotificacoes();

  const userName = basicUserData?.nomeCompleto || "Usuário";
  const userInitials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const appNotifications = useMemo<AppNotification[]>(
    () =>
      notificacoesApi.map((n) => ({
        id: String(n.id),
        tipo: (n.tipo?.toLowerCase() === "alerta"
          ? "alerta"
          : n.tipo?.toLowerCase() === "sucesso"
            ? "sucesso"
            : "info") as AppNotification["tipo"],
        titulo: n.mensagem ?? `Notificação #${n.id}`,
        descricao: n.mensagem ?? "",
        lida: lidasIds.has(n.id),
        criadoEm: n.dataEnvio ? new Date(n.dataEnvio) : new Date(),
      })),
    [notificacoesApi, lidasIds],
  );

  const unreadCount = appNotifications.filter((n) => !n.lida).length;

  return (
    <div className="flex items-center gap-2">
      {/* Bell */}
      <div className="relative">
        <motion.button
          onClick={() => { setShowNotifPanel((p) => !p); setShowUserMenu(false); }}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/25 bg-card/20 text-muted-foreground transition-all duration-200 hover:border-accent/30 hover:text-foreground"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground">
              {unreadCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {showNotifPanel && (
            <>
              <motion.div
                className="fixed inset-0 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotifPanel(false)}
              />
              <motion.div
                className="absolute right-0 top-11 z-50"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <NotificationList
                  notifications={appNotifications}
                  onMarkRead={(id) => setLidasIds((prev) => new Set(prev).add(Number(id)))}
                  onMarkAllRead={() => setLidasIds(new Set(notificacoesApi.map((n) => n.id)))}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar */}
      <div className="relative">
        <motion.button
          onClick={() => { setShowUserMenu((p) => !p); setShowNotifPanel(false); }}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/15"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-[11px] font-semibold text-accent">{userInitials}</span>
        </motion.button>

        <AnimatePresence>
          {showUserMenu && (
            <>
              <motion.div
                className="fixed inset-0 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUserMenu(false)}
              />
              <motion.div
                className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-border/20 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="px-3 py-2.5 border-b border-border/20">
                  <p className="text-[12px] font-semibold text-foreground truncate">{userName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{basicUserData?.email ?? ""}</p>
                  {basicUserData?.cargoNome && (
                    <p className="text-[10px] text-accent/70 mt-0.5 truncate">{basicUserData.cargoNome}</p>
                  )}
                </div>
                <Link
                  to="/configuracoes"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Configurações
                </Link>
                <button
                  onClick={() => authContext?.signOut()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sair
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
