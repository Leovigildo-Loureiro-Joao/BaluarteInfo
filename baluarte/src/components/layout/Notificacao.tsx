import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import type { NotificacaoRecord, PageResponse } from "../../types/api";

const resolveNotificationPath = (type?: string | null) => {
  switch ((type ?? "").toUpperCase()) {
    case "LIMITE_INSCRITOS":
      return "/admin/inscricoes";
    case "GALERIA":
      return "/admin/galeria";
    case "VISTOS":
      return "/admin/dashboard";
    default:
      return "/admin/dashboard";
  }
};

export const NotificacoesBellInteligente: React.FC = () => {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [notificacoes, setNotificacoes] = useState<NotificacaoRecord[]>([]);
  const [countNaoLidas, setCountNaoLidas] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshUnread = async () => {
    setCarregando(true);
    try {
      const res = await apiFetch("/admin/notificacao?page=0&size=15");
      if (!res.ok) throw new Error("Falha ao carregar notificações.");
      const payload = (await res.json()) as PageResponse<NotificacaoRecord>;
      if (!mountedRef.current) return;
      setNotificacoes(payload.content ?? []);
      setCountNaoLidas(payload.totalElements ?? (payload.content?.length ?? 0));
    } catch {
      if (!mountedRef.current) return;
      setNotificacoes([]);
      setCountNaoLidas(0);
    } finally {
      if (mountedRef.current) setCarregando(false);
    }
  };

  useEffect(() => {
    refreshUnread();
    const interval = setInterval(() => {
      if (aberto) refreshUnread();
    }, 60_000);
    return () => clearInterval(interval);
  }, [aberto]);

  const unreadBadgeText = useMemo(() => {
    if (countNaoLidas <= 0) return "";
    return countNaoLidas > 9 ? "9+" : String(countNaoLidas);
  }, [countNaoLidas]);

  const openNotification = async (notif: NotificacaoRecord) => {
    try {
      if (!notif.lido) {
        await apiFetch(`/admin/notificacao/${notif.id}/ler`, { method: "PUT" });
      }
    } catch {
      // ignore
    } finally {
      setAberto(false);
      navigate(resolveNotificationPath(notif.type));
      refreshUnread();
    }
  };

  const clearRead = async () => {
    setCarregando(true);
    try {
      await apiFetch("/admin/notificacao", { method: "DELETE" });
    } catch {
      // ignore
    } finally {
      await refreshUnread();
      if (mountedRef.current) setCarregando(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAberto((v) => !v)}
        className={`relative p-2 rounded-lg transition-colors ${
          aberto ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        title={`${countNaoLidas} notificação(ões) não lida(s)`}
        aria-label="Notificações"
      >
        <Bell className={`w-5 h-5 ${countNaoLidas > 0 ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-300"}`} />
        {countNaoLidas > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center text-xs font-semibold text-white rounded-full px-1"
            style={{ backgroundColor: countNaoLidas > 5 ? "#EF4444" : "#3B82F6" }}
          >
            {unreadBadgeText}
          </motion.span>
        )}
      </motion.button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {aberto && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setAberto(false)}
                  className="fixed inset-0 bg-black/30 dark:bg-black/60 z-[9998]"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 sm:inset-auto sm:right-4 sm:top-20 sm:w-96 sm:rounded-xl sm:shadow-xl sm:border sm:border-gray-200 sm:dark:border-gray-700 sm:max-h-[520px] flex flex-col"
                >
                  <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sm:rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {countNaoLidas} não lida(s)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setAberto(false);
                            navigate("/admin/notificacoes");
                          }}
                          className="px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Ver todas
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={clearRead}
                          disabled={carregando}
                          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                          title="Remover notificações lidas"
                          aria-label="Limpar lidas"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAberto(false)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto sm:max-h-[380px]">
                    {carregando && notificacoes.length === 0 ? (
                      <div className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">Carregando...</div>
                    ) : notificacoes.length === 0 ? (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-16 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhuma notificação não lida</p>
                        <p className="text-gray-400 text-sm mt-2">Você está em dia</p>
                      </motion.div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {notificacoes.map((notif) => (
                          <button
                            key={String(notif.id)}
                            type="button"
                            onClick={() => openNotification(notif)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {notif.assunto || "Notificação"}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                  {notif.descricao}
                                </p>
                              </div>
                              {!notif.lido && <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

