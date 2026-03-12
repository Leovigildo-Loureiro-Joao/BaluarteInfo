import { FiSend, FiX } from "react-icons/fi";
import { MensagemData, MensagemRecord } from "../../types/api";
import {motion} from "framer-motion"
import { useState } from "react";

export const ModalResposta = ({ 
  mensagem, 
  onClose, 
  onEnviar 
}: { 
  mensagem: MensagemRecord; 
  onClose: () => void; 
  onEnviar: (resposta: { assunto: string; descricao: string }) => void;
}) => {
  const [formData, setFormData] = useState({
    assunto: `Resposta: ${mensagem.assunto}`,
    descricao: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnviar(formData);
    onClose();
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
              <FiSend className="text-primary-500" />
              Responder Mensagem
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Respondendo para:</p>
            <p className="font-medium">{mensagem.email}</p>
            <p className="text-xs text-gray-400 mt-2">Mensagem original: {mensagem.descricao.substring(0, 100)}...</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assunto
              </label>
              <input
                type="text"
                value={formData.assunto}
                onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Escreva sua resposta..."
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Enviar Resposta
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};