// src/pages/Admin/ComentariosPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageSquare,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiClock,
  FiMoreVertical,
  FiAlertCircle,
  FiFlag,
  FiRefreshCw,
  FiVideo
} from "react-icons/fi";
import { 
  GiPartyPopper 
} from "react-icons/gi";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LiaBibleSolid } from "react-icons/lia";
import { ComentarioAdminData, ComentarioStatus, ComentarioType, PageResponse } from "../../types/api";
import { apiFetch } from "../../utils/api.js";
import { ModalComentarioDetalhe } from "../../components/comentarios/ComentarioEditar.js";
import { ComentarioCard } from "../../components/comentarios/ComentarioCard.js";


export const ComentariosPage = () => {
  const [comentarios, setComentarios] = useState<ComentarioAdminData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSecao, setFilterSecao] = useState<ComentarioType | 'todas'>('todas');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'denunciado' | 'oculto'>('todos');
  const [selectedComentario, setSelectedComentario] = useState<ComentarioAdminData | null>(null);
  const [showDetalheModal, setShowDetalheModal] = useState(false);
  const [pendingComentarioIds, setPendingComentarioIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [filterStatus]);

  const apiParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));

    if (filterStatus === "ativo") {
      params.set("status", ComentarioStatus.ATIVO);
    } else if (filterStatus === "denunciado") {
      params.set("status", ComentarioStatus.DENUNCIADO);
    } else if (filterStatus === "oculto") {
      params.set("status", ComentarioStatus.OCULTO);
    }

    return params.toString();
  }, [filterStatus, page, size]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch(`/admin/comentario?${apiParams}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar comentários.");
        const payload = (await res.json()) as PageResponse<ComentarioAdminData>;
        setComentarios(payload.content ?? []);
        setTotalPages(payload.totalPages ?? 0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setComentarios([]);
        setTotalPages(0);
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar comentários.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [apiParams, reloadToken]);


  // Estatísticas
  const stats = {
    total: comentarios.length,
    ativos: comentarios.filter(c => c.status === ComentarioStatus.ATIVO).length,
    denunciados: comentarios.filter(c => c.status === ComentarioStatus.DENUNCIADO).length,
    ocultos: comentarios.filter(c => c.status === ComentarioStatus.OCULTO).length,
    artigos: comentarios.filter(c => c.seccao === ComentarioType.Artigo).length,
    midia: comentarios.filter(c => c.seccao === ComentarioType.Midia).length,
    actividades: comentarios.filter(c => c.seccao === ComentarioType.Actividade).length
  };

  const selectedStatusEnum =
    filterStatus === "ativo"
      ? ComentarioStatus.ATIVO
      : filterStatus === "denunciado"
        ? ComentarioStatus.DENUNCIADO
        : filterStatus === "oculto"
          ? ComentarioStatus.OCULTO
          : null;

  // Filtrar comentários
  const filteredComentarios = comentarios.filter(c => {
    // Busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        c.descricao.toLowerCase().includes(term) ||
        c.usuarioNome.toLowerCase().includes(term) ||
        c.seccaoTitulo.toLowerCase().includes(term);
      if (!matches) return false;
    }

    // Filtro por seção
    if (filterSecao !== 'todas' && c.seccao !== filterSecao) return false;

    // Filtro por status
    if (selectedStatusEnum && c.status !== selectedStatusEnum) return false;

    return true;
  });

  const startPending = (id: number) => {
    setPendingComentarioIds((current) => (current.includes(id) ? current : [id, ...current]));
  };

  const stopPending = (id: number) => {
    setPendingComentarioIds((current) => current.filter((pid) => pid !== id));
  };

  const handleOcultar = async (id: number) => {
    if (pendingComentarioIds.includes(id)) return;
    startPending(id);
    setActionError("");
    try {
      const res = await apiFetch(`/admin/comentario/${id}/status`, {
        method: "PUT",
        body: { status: ComentarioStatus.OCULTO },
      });
      if (!res.ok) throw new Error("Falha ao ocultar comentário.");
      const updated = (await res.json().catch(() => null)) as ComentarioAdminData | null;
      if (updated?.id) {
        setComentarios((current) => current.map((c) => (c.id === id ? updated : c)));
      } else {
        setReloadToken((v) => v + 1);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível ocultar o comentário.");
    } finally {
      stopPending(id);
    }
  };

  const handleExcluir = async (id: number) => {
    if (pendingComentarioIds.includes(id)) return;
    startPending(id);
    setActionError("");
    try {
      const res = await apiFetch(`/user/comentario/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir comentário.");
      setComentarios((current) => current.filter((c) => c.id !== id));
      setReloadToken((v) => v + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível excluir o comentário.");
    } finally {
      stopPending(id);
    }
  };

  const handleMarcarResolvido = async (id: number) => {
    if (pendingComentarioIds.includes(id)) return;
    startPending(id);
    setActionError("");
    try {
      const res = await apiFetch(`/admin/comentario/${id}/status`, {
        method: "PUT",
        body: { status: ComentarioStatus.ATIVO },
      });
      if (!res.ok) throw new Error("Falha ao atualizar status do comentário.");
      const updated = (await res.json().catch(() => null)) as ComentarioAdminData | null;
      if (updated?.id) {
        setComentarios((current) => current.map((c) => (c.id === id ? updated : c)));
      } else {
        setReloadToken((v) => v + 1);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível marcar como resolvido.");
    } finally {
      stopPending(id);
    }
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
            Moderação de Comentários
          </h1>
          <p className="text-gray-500">
            Gerencie todos os comentários de artigos, mídias e atividades
          </p>
        </div>

        {(loadError || actionError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="text-sm">
              <p className="font-semibold">Aconteceu um erro</p>
              <p className="mt-1">{actionError || loadError}</p>
            </div>
            <button
              onClick={() => setReloadToken((v) => v + 1)}
              className="shrink-0 px-4 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-100 text-sm flex items-center gap-2"
            >
              <FiRefreshCw size={14} />
              Tentar novamente
            </button>
          </div>
        )}

        {loading && comentarios.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-primary-500">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-green-500">
            <p className="text-sm text-gray-500">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-red-500">
            <p className="text-sm text-gray-500">Denunciados</p>
            <p className="text-2xl font-bold text-red-600">{stats.denunciados}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-gray-500">
            <p className="text-sm text-gray-500">Ocultos</p>
            <p className="text-2xl font-bold text-gray-600">{stats.ocultos}</p>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por comentário, usuário ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtro por seção */}
            <select
              value={filterSecao}
              onChange={(e) => setFilterSecao(e.target.value as ComentarioType | 'todas')}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todas">Todas seções</option>
              <option value={ComentarioType.Artigo}>Artigos</option>
              <option value={ComentarioType.Midia}>Mídia</option>
              <option value={ComentarioType.Actividade}>Actividades</option>
            </select>

            {/* Filtro por status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todos">Todos status</option>
              <option value="ativo">Ativos</option>
              <option value="denunciado">Denunciados</option>
              <option value="oculto">Ocultos</option>
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredComentarios.length} {filteredComentarios.length === 1 ? 'comentário encontrado' : 'comentários encontrados'}
          </div>
        </div>

        {/* Lista de Comentários */}
        {pendingComentarioIds.length > 0 && (
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

        {filteredComentarios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <FiMessageSquare className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum comentário encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filterSecao !== 'todas' || filterStatus !== 'todos'
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Nenhum comentário para moderar'}
            </p>
            {(searchTerm || filterSecao !== 'todas' || filterStatus !== 'todos') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterSecao('todas');
                  setFilterStatus('todos');
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
              {filteredComentarios.map((comentario) => (
                <ComentarioCard
                  key={comentario.id}
                  comentario={comentario}
                  pending={pendingComentarioIds.includes(comentario.id)}
                  onVerDetalhe={(c) => {
                    setSelectedComentario(c);
                    setShowDetalheModal(true);
                  }}
                  onOcultar={handleOcultar}
                  onMarcarResolvido={handleMarcarResolvido}
                  onExcluir={handleExcluir}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={loading || page <= 0}
                className={`px-4 py-2 rounded-lg border border-gray-200 text-sm ${
                  loading || page <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={loading || page >= totalPages - 1}
                className={`px-4 py-2 rounded-lg border border-gray-200 text-sm ${
                  loading || page >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                Próxima
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>
                Página <span className="font-semibold">{page + 1}</span> de{" "}
                <span className="font-semibold">{totalPages}</span>
              </span>
              <button
                onClick={() => setReloadToken((v) => v + 1)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm flex items-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Atualizar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {showDetalheModal && selectedComentario && (
          <ModalComentarioDetalhe
            comentario={selectedComentario}
            onClose={() => {
              setShowDetalheModal(false);
              setSelectedComentario(null);
            }}
            pending={pendingComentarioIds.includes(selectedComentario.id)}
            onOcultar={handleOcultar}
            onExcluir={handleExcluir}
            onMarcarResolvido={handleMarcarResolvido}
            onRefreshList={() => setReloadToken((v) => v + 1)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
