import { LiaBibleSolid } from "react-icons/lia";
import { ComentarioAdminData, ComentarioStatus, ComentarioType } from "../../types/api";
import { FiAlertCircle, FiCheck, FiClock, FiEyeOff, FiFlag, FiMessageSquare, FiRefreshCw, FiTrash2, FiVideo, FiX } from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api.js";

export const ModalComentarioDetalhe = ({ 
  comentario, 
  onClose, 
  onOcultar,
  onExcluir,
  onMarcarResolvido,
  onRefreshList,
  pending
}: { 
  comentario: ComentarioAdminData; 
  onClose: () => void; 
  onOcultar: (id: number) => void;
  onExcluir: (id: number) => void;
  onMarcarResolvido: (id: number) => void;
  onRefreshList?: () => void;
  pending?: boolean;
}) => {
  const getSecaoIcon = (tipo: ComentarioType) => {
    switch(tipo) {
      case ComentarioType.Artigo: return <LiaBibleSolid className="text-blue-500" size={20} />;
      case ComentarioType.Midia: return <FiVideo className="text-green-500" size={20} />;
      case ComentarioType.Actividade: return <GiPartyPopper className="text-purple-500" size={20} />;
      default: return <FiMessageSquare className="text-gray-400" size={20} />;
    }
  };

  const publishedAt = comentario.dataPublicacao ? new Date(comentario.dataPublicacao) : null;

  const [respostas, setRespostas] = useState<ComentarioAdminData[]>([]);
  const [loadingRespostas, setLoadingRespostas] = useState(false);
  const [showResponder, setShowResponder] = useState(false);
  const [respostaTexto, setRespostaTexto] = useState("");
  const [sendingResposta, setSendingResposta] = useState(false);
  const [respostaError, setRespostaError] = useState("");

  const reloadRespostas = async (signal?: AbortSignal) => {
    setLoadingRespostas(true);
    setRespostaError("");
    try {
      const res = await apiFetch(`/admin/comentario/${comentario.id}/respostas`, { signal });
      if (!res.ok) throw new Error("Falha ao carregar respostas.");
      const payload = (await res.json().catch(() => [])) as ComentarioAdminData[];
      setRespostas(Array.isArray(payload) ? payload : []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setRespostas([]);
      setRespostaError(err instanceof Error ? err.message : "Não foi possível carregar respostas.");
    } finally {
      setLoadingRespostas(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void reloadRespostas(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comentario.id]);

  const handleEnviarResposta = async () => {
    const descricao = respostaTexto.trim();
    if (!descricao || sendingResposta) return;
    setSendingResposta(true);
    setRespostaError("");
    try {
      const res = await apiFetch(`/admin/comentario/${comentario.id}/resposta`, {
        method: "POST",
        body: { descricao },
      });
      if (!res.ok) throw new Error("Falha ao enviar resposta.");
      setRespostaTexto("");
      setShowResponder(false);
      await reloadRespostas();
      onRefreshList?.();
    } catch (err) {
      setRespostaError(err instanceof Error ? err.message : "Não foi possível enviar resposta.");
    } finally {
      setSendingResposta(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiMessageSquare className="text-primary-500" />
              Detalhes do Comentário
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          {/* Seção de origem */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
            {getSecaoIcon(comentario.seccao)}
            <div>
              <p className="text-sm text-gray-500">Publicado em:</p>
              <p className="font-medium">{comentario.seccaoTitulo}</p>
            </div>
            <span className={`ml-auto text-xs px-3 py-1 rounded-full ${
              comentario.status === ComentarioStatus.ATIVO ? 'bg-green-100 text-green-600' :
              comentario.status === ComentarioStatus.OCULTO ? 'bg-gray-100 text-gray-600' :
              'bg-red-100 text-red-600'
            }`}>
              {comentario.status === ComentarioStatus.ATIVO ? 'Ativo' :
               comentario.status === ComentarioStatus.OCULTO ? 'Oculto' :
               'Denunciado'}
            </span>
          </div>

          {/* Autor */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={comentario.usuarioImagem || 'https://via.placeholder.com/50'}
              alt={comentario.usuarioNome}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{comentario.usuarioNome}</h3>
              <p className="text-sm text-gray-500">{comentario.usuarioEmail}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <FiClock size={12} />
                {publishedAt ? formatDistanceToNow(publishedAt, { addSuffix: true, locale: ptBR }) : "—"}
              </p>
            </div>
          </div>

          {/* Comentário */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700">{comentario.descricao}</p>
          </div>

          {/* Estatísticas */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiMessageSquare size={16} />
              {comentario.respostas ?? respostas.length} respostas
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiAlertCircle size={16} />
              {comentario.likes} likes
            </div>
            {comentario.denuncias > 0 && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <FiFlag size={16} />
                {comentario.denuncias} denúncias
              </div>
            )}
          </div>

          {/* Respostas */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-semibold text-gray-800">
                Respostas {respostas.length > 0 ? `(${respostas.length})` : ""}
              </h3>
              <button
                onClick={() => setShowResponder((v) => !v)}
                disabled={pending || sendingResposta}
                className={`px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 ${
                  pending || sendingResposta ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Responder
              </button>
            </div>

            {(respostaError || loadingRespostas) && (
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm text-red-600">{respostaError}</p>
                <button
                  onClick={() => reloadRespostas()}
                  disabled={loadingRespostas}
                  className={`text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white ${
                    loadingRespostas ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  }`}
                >
                  <FiRefreshCw size={14} className={loadingRespostas ? "animate-spin inline-block mr-2" : "inline-block mr-2"} />
                  Atualizar
                </button>
              </div>
            )}

            {showResponder && (
              <div className="mb-4">
                <textarea
                  value={respostaTexto}
                  onChange={(e) => setRespostaTexto(e.target.value)}
                  placeholder="Escreva a resposta do admin…"
                  className="w-full min-h-[96px] p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowResponder(false);
                      setRespostaTexto("");
                    }}
                    disabled={sendingResposta}
                    className={`px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 ${
                      sendingResposta ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEnviarResposta}
                    disabled={sendingResposta || !respostaTexto.trim()}
                    className={`px-4 py-2 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600 ${
                      sendingResposta || !respostaTexto.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {sendingResposta ? "A enviar…" : "Enviar resposta"}
                  </button>
                </div>
              </div>
            )}

            {loadingRespostas && respostas.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : respostas.length === 0 ? (
              <p className="text-sm text-gray-500">Sem respostas ainda.</p>
            ) : (
              <div className="space-y-3">
                {respostas.map((r) => {
                  const rDate = r.dataPublicacao ? new Date(r.dataPublicacao) : null;
                  return (
                    <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={r.usuarioImagem || "https://via.placeholder.com/36"}
                          alt={r.usuarioNome}
                          className="w-9 h-9 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-800">{r.usuarioNome}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {rDate ? formatDistanceToNow(rDate, { addSuffix: true, locale: ptBR }) : "—"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{r.descricao}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t">
            {comentario.status === ComentarioStatus.ATIVO && (
              <button
                onClick={() => {
                  onOcultar(comentario.id);
                  onClose();
                }}
                disabled={pending}
                className={`flex-1 px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2 ${
                  pending ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {pending ? <FiRefreshCw size={18} className="animate-spin" /> : <FiEyeOff size={18} />}
                {pending ? "A processar…" : "Ocultar Comentário"}
              </button>
            )}

            {(comentario.status === ComentarioStatus.DENUNCIADO || comentario.status === ComentarioStatus.OCULTO) && (
              <button
                onClick={() => {
                  onMarcarResolvido(comentario.id);
                  onClose();
                }}
                disabled={pending}
                className={`flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2 ${
                  pending ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {pending ? <FiRefreshCw size={18} className="animate-spin" /> : <FiCheck size={18} />}
                {pending ? "A processar…" : (comentario.status === ComentarioStatus.OCULTO ? "Reativar" : "Marcar como Resolvido")}
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
                  onExcluir(comentario.id);
                  onClose();
                }
              }}
              disabled={pending}
              className={`flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center gap-2 ${
                pending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {pending ? <FiRefreshCw size={18} className="animate-spin" /> : <FiTrash2 size={18} />}
              {pending ? "A processar…" : "Excluir Permanentemente"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
