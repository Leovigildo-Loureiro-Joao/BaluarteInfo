import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiBell, FiCheckCircle, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
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

export const NotificacoesPage = () => {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [reloadToken, setReloadToken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PageResponse<NotificacaoRecord> | null>(null);

  const endpoint = useMemo(() => {
    const base = unreadOnly ? "/admin/notificacao" : "/admin/notificacao/all";
    return `${base}?page=${page}&size=${size}&_=${reloadToken}`;
  }, [unreadOnly, page, size, reloadToken]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar notificações.");
        const payload = (await res.json()) as PageResponse<NotificacaoRecord>;
        setData(payload);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setData(null);
        setError(err instanceof Error ? err.message : "Falha ao carregar notificações.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [endpoint]);

  const markAsRead = async (id: number) => {
    try {
      const res = await apiFetch(`/admin/notificacao/${id}/ler`, { method: "PUT" });
      if (!res.ok) return;
      setData((prev) => {
        if (!prev) return prev;
        const next = prev.content.map((n) => (n.id === id ? { ...n, lido: true } : n));
        return { ...prev, content: next };
      });
    } catch {
      // ignore
    }
  };

  const clearRead = async () => {
    try {
      await apiFetch("/admin/notificacao", { method: "DELETE" });
    } catch {
      // ignore
    } finally {
      setPage(0);
      setReloadToken((t) => t + 1);
    }
  };

  const totalPages = data?.totalPages ?? 0;
  const items = data?.content ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FiBell className="text-primary" />
              Notificações
            </h1>
            <p className="text-sm text-gray-500 mt-1">Central de notificações do painel</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearRead}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm"
              title="Remover notificações lidas"
            >
              <FiTrash2 />
              Limpar lidas
            </button>
            <button
              type="button"
              onClick={() => {
                setPage(0);
                setUnreadOnly((v) => !v);
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                unreadOnly ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {unreadOnly ? "Mostrando não lidas" : "Mostrar só não lidas"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">Carregando...</div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-xl p-6 text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <FiCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold">Nenhuma notificação encontrada</p>
            <p className="text-sm text-gray-500 mt-1">Tudo certo por aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((notif) => (
              <motion.div
                key={String(notif.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!notif.lido && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      <h3 className="font-semibold text-gray-900 truncate">{notif.assunto || "Notificação"}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{notif.descricao}</p>
                    {notif.type && <p className="text-xs text-gray-400 mt-2">Tipo: {notif.type}</p>}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notif.lido && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notif.id)}
                        className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm"
                      >
                        Marcar lida
                      </button>
                    )}
                    <Link
                      to={resolveNotificationPath(notif.type)}
                      className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-sm"
                    >
                      Abrir
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page <= 0}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiChevronLeft />
              Anterior
            </button>
            <div className="text-sm text-gray-600">
              Página <span className="font-semibold">{page + 1}</span> de <span className="font-semibold">{totalPages}</span>
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Próxima
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
