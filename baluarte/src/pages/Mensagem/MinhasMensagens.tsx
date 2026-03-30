// src/pages/Mensagem/MinhasMensagens.tsx
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiXCircle } from "react-icons/fi";
import { apiFetch } from "../../utils/api.js";
import { MensagemData, MensagemRecord, MensagemType, PageResponse, StatusMensage } from "../../types/api";

type MinhasMensagensDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const MinhasMensagensDrawer = ({ open, onClose }: MinhasMensagensDrawerProps) => {
  const [mensagens, setMensagens] = useState<MensagemRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [novaMensagem, setNovaMensagem] = useState({ assunto: "", descricao: "" });
  const [showForm, setShowForm] = useState(false);

  const queryString = useMemo(() => {
    const qs = new URLSearchParams({ page: String(page), size: String(size) });
    return qs.toString();
  }, [page, size]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch(`/user/me/mensagens?${queryString}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar mensagens.");
        const payload = (await res.json()) as PageResponse<MensagemRecord>;
        const content = payload.content ?? [];
        setTotalPages(payload.totalPages ?? 0);
        if (page === 0) setMensagens(content);
        else setMensagens((current) => [...current, ...content]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar mensagens.");
        if (page === 0) setMensagens([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [open, queryString, page, reloadToken]);

  useEffect(() => {
    if (!open) return;
    // Sempre que abrir, começa da primeira página.
    setPage(0);
  }, [open]);

  const handleEnviarMensagem = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSendError("");
    try {
      const payload: MensagemData = {
        assunto: novaMensagem.assunto,
        descricao: novaMensagem.descricao
      };
      const res = await apiFetch("/user/mensagem/send", { method: "POST", body: payload });
      if (!res.ok) throw new Error("Falha ao enviar mensagem.");
      setShowForm(false);
      setNovaMensagem({ assunto: "", descricao: "" });
      setReloadToken((v) => v + 1);
      setPage(0);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  };

  const marcarComoLida = async (mensagem: MensagemRecord) => {
    if (mensagem.tipo !== MensagemType.Send || mensagem.lido) return;
    // marca apenas mensagens enviadas pela igreja para o usuário
    setMensagens((current) => current.map((m) => (m.id === mensagem.id ? { ...m, lido: true } : m)));
    try {
      const res = await apiFetch(`/user/me/mensagens/${mensagem.id}/lido?lido=true`, { method: "PUT" });
      if (!res.ok) throw new Error("Falha ao marcar como lida.");
    } catch {
      setMensagens((current) => current.map((m) => (m.id === mensagem.id ? { ...m, lido: false } : m)));
    }
  };

  const handleClose = () => {
    setShowForm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          key="minhas-mensagens-drawer"
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="relative ml-auto h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary-500">Baluarte</p>
                <h2 className="text-2xl font-semibold text-gray-900">Minhas Mensagens</h2>
                <p className="text-sm text-gray-500">Acompanhe os pedidos enviados à igreja.</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                aria-label="Fechar painel de mensagens"
              >
                <FiXCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Histórico</h3>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600"
              >
                {showForm ? "Cancelar" : "Nova Mensagem"}
              </button>
            </div>

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-4 rounded-2xl border border-primary-100 bg-primary-50 p-4 shadow-sm"
              >
                <form onSubmit={handleEnviarMensagem} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Assunto</label>
                    <input
                      type="text"
                      value={novaMensagem.assunto}
                      onChange={(e) =>
                        setNovaMensagem({ ...novaMensagem, assunto: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Mensagem
                    </label>
                    <textarea
                      rows={3}
                      value={novaMensagem.descricao}
                      onChange={(e) =>
                        setNovaMensagem({ ...novaMensagem, descricao: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "A enviar..." : "Enviar"}
                  </button>
                </form>
                {sendError ? (
                  <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">
                    {sendError}
                  </p>
                ) : null}
              </motion.div>
            )}

            <div className="mt-5 space-y-4">
              {loadError ? (
                <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">
                  {loadError}
                </p>
              ) : null}

              {mensagens.map((msg) => (
                <motion.article
                  key={msg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  onClick={() => marcarComoLida(msg)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{msg.assunto}</h4>
                      <p className="text-xs text-gray-500">
                        {msg.dataPublicacao
                          ? new Date(msg.dataPublicacao).toLocaleDateString("pt-BR")
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                        msg.tipo === MensagemType.Send
                          ? msg.lido
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                          : msg.status === StatusMensage.Enviado
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {msg.tipo === MensagemType.Send
                        ? msg.lido
                          ? "Resposta lida"
                          : "Nova resposta"
                        : msg.status === StatusMensage.Enviado
                          ? "Enviada"
                          : "Pendente"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-700">
                    {msg.tipo === MensagemType.Send ? "💬" : "📝"} {msg.descricao}
                  </p>

                </motion.article>
              ))}

              {loading ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : null}

              {!loading && totalPages > 0 && page < totalPages - 1 ? (
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Carregar mais
                </button>
              ) : null}
            </div>
          </motion.aside>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
