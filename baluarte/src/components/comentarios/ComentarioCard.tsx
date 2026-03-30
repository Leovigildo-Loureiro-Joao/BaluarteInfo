import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiVideo, FiRefreshCw, FiFlag, FiMoreVertical, FiEye, FiEyeOff, FiCheck, FiTrash2 } from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { ComentarioAdminData, ComentarioType, ComentarioStatus } from "../../types/api";

export const ComentarioCard = ({ 
  comentario, 
  onVerDetalhe,
  onOcultar,
  onExcluir,
  onMarcarResolvido,
  pending
}: { 
  comentario: ComentarioAdminData; 
  onVerDetalhe: (comentario: ComentarioAdminData) => void;
  onOcultar: (id: number) => void;
  onExcluir: (id: number) => void;
  onMarcarResolvido: (id: number) => void;
  pending?: boolean;
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getSecaoIcon = (tipo: ComentarioType) => {
    switch(tipo) {
      case ComentarioType.Artigo: return <LiaBibleSolid className="text-blue-500" size={14} />;
      case ComentarioType.Midia: return <FiVideo className="text-green-500" size={14} />;
      case ComentarioType.Actividade: return <GiPartyPopper className="text-purple-500" size={14} />;
    }
  };

  const getSecaoLabel = (tipo: ComentarioType) => {
    switch(tipo) {
      case ComentarioType.Artigo: return 'Artigo';
      case ComentarioType.Midia: return 'Mídia';
      case ComentarioType.Actividade: return 'Actividade';
    }
  };

  const publishedAt = comentario.dataPublicacao ? new Date(comentario.dataPublicacao) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl p-5 border-l-4 ${
        comentario.status === ComentarioStatus.DENUNCIADO ? 'border-l-red-500' :
        comentario.status === ComentarioStatus.OCULTO ? 'border-l-gray-500' :
        'border-l-green-500'
      } shadow-sm hover:shadow-md transition-shadow relative`}
    >
      {pending && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium text-gray-700">
            <FiRefreshCw className="animate-spin" />
            A processar…
          </div>
        </div>
      )}
      <div className="flex items-start gap-3">
        <img
          src={comentario.usuarioImagem || 'https://via.placeholder.com/40'}
          alt={comentario.usuarioNome}
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{comentario.usuarioNome}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {publishedAt ? formatDistanceToNow(publishedAt, { addSuffix: true, locale: ptBR }) : "—"}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                {comentario.descricao}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  {getSecaoIcon(comentario.seccao)}
                  {getSecaoLabel(comentario.seccao)} • {comentario.seccaoTitulo}
                </span>
                {(comentario.respostas ?? 0) > 0 && (
                  <span className="text-gray-600 flex items-center gap-1">
                    <span>💬</span>
                    {comentario.respostas} respostas
                  </span>
                )}
                {comentario.denuncias > 0 && (
                  <span className="text-red-500 flex items-center gap-1">
                    <FiFlag size={12} />
                    {comentario.denuncias} denúncias
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                disabled={pending}
                className={`p-1 hover:bg-gray-100 rounded-lg transition-colors ${
                  pending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiMoreVertical size={16} className="text-gray-500" />
              </button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-40 z-10"
                  >
                    <button
                      onClick={() => {
                        onVerDetalhe(comentario);
                        setShowOptions(false);
                      }}
                      disabled={pending}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiEye size={14} />
                      Ver detalhes
                    </button>
                    {comentario.status === ComentarioStatus.ATIVO && (
                      <button
                        onClick={() => {
                          onOcultar(comentario.id);
                          setShowOptions(false);
                        }}
                        disabled={pending}
                        className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                      >
                        <FiEyeOff size={14} />
                        Ocultar
                      </button>
                    )}
                    {(comentario.status === ComentarioStatus.DENUNCIADO || comentario.status === ComentarioStatus.OCULTO) && (
                      <button
                        onClick={() => {
                          onMarcarResolvido(comentario.id);
                          setShowOptions(false);
                        }}
                        disabled={pending}
                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                      >
                        <FiCheck size={14} />
                        {comentario.status === ComentarioStatus.OCULTO ? "Reativar" : "Marcar resolvido"}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Excluir este comentário?')) {
                          onExcluir(comentario.id);
                        }
                        setShowOptions(false);
                      }}
                      disabled={pending}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiTrash2 size={14} />
                      Excluir
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
