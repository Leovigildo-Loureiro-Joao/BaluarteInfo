// src/pages/Mensagens/MensagensPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMail,
  FiSend,
  FiInbox,
  FiStar,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiClock,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiMoreVertical,
  FiRefreshCw,
  FiAlertCircle
} from "react-icons/fi";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ModalResposta } from "../../components/mensagem/ModalMensagemResposta";
import { apiFetch } from "../../utils/api.js";
import { MensagemData, MensagemRecord, MensagemType, PageResponse, StatusMensage } from "../../types/api";
import { MensagemCard } from "../../components/mensagem/MensagemCardAdmin.js";
import { StatsCard } from "../../components/mensagem/StatsMensagem.js";


// Componente Principal
export const MensagensPage = () => {
  const [mensagens, setMensagens] = useState<MensagemRecord[]>([]);
  const [filter, setFilter] = useState<'todas' | 'recebidas' | 'enviadas' | 'nao lidas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMensagem, setSelectedMensagem] = useState<MensagemRecord | null>(null);
  const [showRespostaModal, setShowRespostaModal] = useState(false);
  const [sendingMensagemIds, setSendingMensagemIds] = useState<number[]>([]);
  const [resendingPendentes, setResendingPendentes] = useState(false);
  const [actionError, setActionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);

  const apiParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));

    if (filter === "recebidas") {
      params.set("tipo", MensagemType.Received);
    } else if (filter === "enviadas") {
      params.set("tipo", MensagemType.Send);
    } else if (filter === "nao lidas") {
      params.set("tipo", MensagemType.Received);
      params.set("lido", "false");
    }

    return params.toString();
  }, [filter, page, size]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch(`/admin/mensagem/all?${apiParams}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar mensagens.");
        const payload = (await res.json()) as PageResponse<MensagemRecord>;
        setMensagens(payload.content ?? []);
        setTotalPages(payload.totalPages ?? 0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setMensagens([]);
        setTotalPages(0);
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar mensagens.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [apiParams, reloadToken]);

  // Estatísticas
  const stats = {
    recebidas: mensagens.filter(m => m.tipo === MensagemType.Received).length,
    enviadas: mensagens.filter(m => m.tipo === MensagemType.Send).length,
    naoLidas: mensagens.filter(m => m.tipo === MensagemType.Received && !m.lido).length,
    pendentes: mensagens.filter(m => m.status === StatusMensage.Pendente).length
  };

  // Filtrar mensagens
  const filteredMensagens = mensagens.filter(msg => {
    // Filtro de tipo
    if (filter === 'recebidas' && msg.tipo !== MensagemType.Received) return false;
    if (filter === 'enviadas' && msg.tipo !== MensagemType.Send) return false;
    if (filter === 'nao lidas' && (msg.tipo !== MensagemType.Received || msg.lido)) return false;

    // Busca por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        msg.assunto.toLowerCase().includes(term) ||
        msg.descricao.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.destino.toLowerCase().includes(term)
      );
    }

    return true;
  });

  const handleMarcarLido = async (id: number) => {
    const target = mensagens.find((m) => m.id === id);
    if (!target) return;
    const next = !target.lido;
    setActionError("");
    setMensagens((current) => current.map((m) => (m.id === id ? { ...m, lido: next } : m)));

    try {
      const res = await apiFetch(`/admin/mensagem/${id}/lido?lido=${next}`, { method: "PUT" });
      if (!res.ok) throw new Error("Falha ao atualizar estado de leitura.");
    } catch (err) {
      setMensagens((current) => current.map((m) => (m.id === id ? { ...m, lido: !next } : m)));
      setActionError(err instanceof Error ? err.message : "Não foi possível atualizar a mensagem.");
    }
  };

  const handleResponder = (mensagem: MensagemRecord) => {
    setSelectedMensagem(mensagem);
    setShowRespostaModal(true);
  };

  const handleEnviarResposta = async (resposta: { assunto: string; descricao: string }) => {
    if (!selectedMensagem) return;
    const messageId = selectedMensagem.id;
    setSendingMensagemIds((current) => [messageId, ...current]);
    setActionError("");
    try {
      const payload: MensagemData = { assunto: resposta.assunto, descricao: resposta.descricao };
      const res = await apiFetch(`/admin/mensagem/${messageId}/received`, {
        method: "POST",
        body: payload
      });
      if (!res.ok) {
        let message = "Falha ao enviar resposta.";
        try {
          const contentType = res.headers.get("Content-Type") || "";
          if (contentType.includes("application/json")) {
            const body = await res.json().catch(() => null);
            message = body?.message || body?.error || body?.details || message;
          } else {
            const text = await res.text().catch(() => "");
            if (text) message = text;
          }
        } catch {
          // ignore
        }
        throw new Error(message);
      }
      setShowRespostaModal(false);
      setSelectedMensagem(null);
      setReloadToken((v) => v + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível enviar a resposta.");
    } finally {
      setSendingMensagemIds((current) => current.filter((id) => id !== messageId));
    }
  };

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      setActionError("");
      try {
        const res = await apiFetch(`/admin/mensagem/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Falha ao excluir mensagem.");
        setMensagens((current) => current.filter((m) => m.id !== id));
        setReloadToken((v) => v + 1);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "Não foi possível excluir a mensagem.");
      }
    }
  };

  const handleReenviarPendentes = async () => {
    if (resendingPendentes) return;
    setResendingPendentes(true);
    setActionError("");
    // Não existe endpoint direto para reenviar pendentes; o backend usa job.
    // Aqui só atualizamos a lista para refletir o estado mais recente.
    setReloadToken((v) => v + 1);
    setResendingPendentes(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Grid decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Mensagens
          </h1>
          <p className="text-gray-500">
            Gerencie todas as mensagens recebidas e enviadas
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icone={FiInbox}
            titulo="Recebidas"
            valor={stats.recebidas}
            cor="bg-primary-500"
          />
          <StatsCard
            icone={FiSend}
            titulo="Enviadas"
            valor={stats.enviadas}
            cor="bg-blue-500"
          />
          <StatsCard
            icone={FiEye}
            titulo="Não Lidas"
            valor={stats.naoLidas}
            cor="bg-amber-500"
          />
          <StatsCard
            icone={FiClock}
            titulo="Pendentes"
            valor={stats.pendentes}
            cor="bg-purple-500"
          />
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar mensagens por assunto, conteúdo ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'todas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => {
                  setPage(0);
                  setFilter('recebidas');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filter === 'recebidas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiInbox size={14} />
                Recebidas
              </button>
              <button
                onClick={() => {
                  setPage(0);
                  setFilter('enviadas');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filter === 'enviadas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiSend size={14} />
                Enviadas
              </button>
              <button
                onClick={() => {
                  setPage(0);
                  setFilter('nao lidas');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filter === 'nao lidas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiEyeOff size={14} />
                Não Lidas
              </button>
            </div>
          </div>

          {/* Ações adicionais */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-500">
              {filteredMensagens.length} {filteredMensagens.length === 1 ? 'mensagem encontrada' : 'mensagens encontradas'}
            </span>
            
            {stats.pendentes > 0 && (
              <button
                onClick={handleReenviarPendentes}
                disabled={resendingPendentes}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-sm hover:bg-amber-100 transition-colors"
              >
                <FiRefreshCw size={14} className={resendingPendentes ? "animate-spin" : ""} />
                {resendingPendentes ? "A atualizar…" : `Atualizar pendentes (${stats.pendentes})`}
              </button>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-500">
                Página {page + 1} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={loading || page <= 0}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-60"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading || page >= totalPages - 1}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-60"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>

        {loadError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start justify-between gap-4">
            <p className="text-sm">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setLoadError("");
                setReloadToken((v) => v + 1);
              }}
              className="p-1 rounded-lg hover:bg-red-100 transition-colors"
              title="Tentar novamente"
            >
              <FiRefreshCw />
            </button>
          </div>
        )}

        {actionError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start justify-between gap-4">
            <p className="text-sm">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError("")}
              className="p-1 rounded-lg hover:bg-red-100 transition-colors"
              title="Fechar"
            >
              <FiX />
            </button>
          </div>
        )}

        {(sendingMensagemIds.length > 0 || resendingPendentes) && (
          <div className="mb-4 overflow-hidden rounded-xl bg-white border border-gray-100">
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-1 w-1/3 bg-primary-500"
                initial={{ x: "-100%" }}
                animate={{ x: "300%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {/* Lista de Mensagens */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="h-4 w-2/3 bg-gray-200 rounded mb-3 animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredMensagens.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiMail className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'todas'
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Sua caixa de mensagens está vazia'}
            </p>
            {(searchTerm || filter !== 'todas') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('todas');
                }}
                className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredMensagens.map((mensagem) => (
                <MensagemCard
                  key={mensagem.id}
                  mensagem={mensagem}
                  onMarcarLido={handleMarcarLido}
                  onResponder={handleResponder}
                  onExcluir={handleExcluir}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Resposta */}
      <AnimatePresence>
        {showRespostaModal && selectedMensagem && (
          <ModalResposta
            mensagem={selectedMensagem}
            onClose={() => {
              setShowRespostaModal(false);
              setSelectedMensagem(null);
            }}
            onEnviar={handleEnviarResposta}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
