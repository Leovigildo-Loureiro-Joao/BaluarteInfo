import { FiCalendar, FiEye, FiEyeOff, FiInbox, FiMoreVertical, FiRefreshCw, FiSend, FiTrash2, FiUser } from "react-icons/fi";
import { MensagemRecord, MensagemType, StatusMensage } from "../../types/api";
import { AnimatePresence,motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export const MensagemCard = ({ 
  mensagem, 
  onMarcarLido, 
  onResponder,
  onExcluir
}: { 
  mensagem: MensagemRecord; 
  onMarcarLido: (id: number) => void;
  onResponder: (mensagem: MensagemRecord) => void;
  onExcluir: (id: number) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const isPending = mensagem.status === StatusMensage.Pendente;

  const getStatusColor = (status: StatusMensage) => {
    switch(status) {
      case StatusMensage.Enviado: return 'text-green-600 bg-green-50';
      case StatusMensage.Pendente: return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: StatusMensage) => {
    switch(status) {
      case StatusMensage.Enviado: return 'Enviado';
      case StatusMensage.Pendente: return 'Pendente';
      default: return status;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl p-5 border-l-4 ${
        mensagem.tipo === MensagemType.Send 
          ? 'border-l-blue-500' 
          : mensagem.lido 
            ? 'border-l-gray-300' 
            : 'border-l-primary-500'
      } shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        {/* Conteúdo principal */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Ícone de tipo */}
            {mensagem.tipo === MensagemType.Send ? (
              <FiSend className="text-blue-500" size={18} />
            ) : (
              <FiInbox className={mensagem.lido ? 'text-gray-400' : 'text-primary-500'} size={18} />
            )}
            
            {/* Assunto */}
            <h3 className={`font-semibold ${!mensagem.lido && mensagem.tipo === MensagemType.Received ? 'text-primary-700' : 'text-gray-700'}`}>
              {mensagem.assunto}
            </h3>

            {/* Status */}
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(mensagem.status)}`}>
              <span className="inline-flex items-center gap-1">
                {mensagem.status === StatusMensage.Pendente && (
                  <FiRefreshCw size={12} className="animate-spin" />
                )}
                {getStatusLabel(mensagem.status)}
              </span>
            </span>

            {/* Não lido badge */}
            {!mensagem.lido && mensagem.tipo === MensagemType.Received && (
              <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                Novo
              </span>
            )}
          </div>

          {/* Remetente/Destinatário */}
          <div className="flex items-center gap-4 mb-2 text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <FiUser size={14} />
              {mensagem.tipo === MensagemType.Send ? `Para: ${mensagem.destino}` : `De: ${mensagem.email}`}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <FiCalendar size={14} />
              {mensagem.dataPublicacao
                ? formatDistanceToNow(new Date(mensagem.dataPublicacao), { addSuffix: true, locale: ptBR })
                : "—"}
            </span>
          </div>

          {/* Mensagem preview */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {mensagem.descricao}
          </p>

          {/* Anexos */}
          {/* anexos ainda não implementados no backend */}
        </div>

        {/* Ações */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            disabled={isPending}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiMoreVertical size={18} className="text-gray-500" />
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-48 z-10"
              >
                {/* Marcar como lido/não lido (só para recebidas) */}
                {mensagem.tipo === MensagemType.Received && (
                  <button
                    onClick={() => {
                      onMarcarLido(mensagem.id);
                      setShowOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    {mensagem.lido ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    {mensagem.lido ? 'Marcar como não lido' : 'Marcar como lido'}
                  </button>
                )}

                {/* Responder (só para recebidas) */}
                {mensagem.tipo === MensagemType.Received && (
                  <button
                    onClick={() => {
                      onResponder(mensagem);
                      setShowOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiSend size={14} />
                    Responder
                  </button>
                )}

                {/* Excluir */}
                <button
                  onClick={() => {
                    onExcluir(mensagem.id);
                    setShowOptions(false);
                  }}
                  disabled={isPending}
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
    </motion.div>
  );
};
