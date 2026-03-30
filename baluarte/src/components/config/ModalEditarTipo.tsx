import { useState } from "react";
import { ConfiguracaoTipoAtividade } from "../../pages/Configuracoes/Configuracoes";
import { GiFamilyHouse, GiHeartBeats, GiPartyPopper, GiPrayer } from "react-icons/gi";
import { LiaBibleSolid, LiaChairSolid } from "react-icons/lia";
import { motion } from "framer-motion";

// Modal de Edição de Tipo de Atividade
export const ModalEditarTipo = ({ 
  tipo, 
  onClose, 
  onSave 
}: { 
  tipo?: ConfiguracaoTipoAtividade; 
  onClose: () => void; 
  onSave: (tipo: ConfiguracaoTipoAtividade) => void;
}) => {
  const [formData, setFormData] = useState({
    id: tipo?.id || '',
    label: tipo?.label || '',
    color: tipo?.color || '#7c3aed',
    icon: tipo?.icon || 'GiPrayer'
  });

  const iconOptions = [
    { value: 'GiPrayer', label: 'Oração', icon: GiPrayer },
    { value: 'GiPartyPopper', label: 'Evento', icon: GiPartyPopper },
    { value: 'GiBible', label: 'Bíblia', icon: LiaBibleSolid },
    { value: 'GiHeartBeats', label: 'Coração', icon: GiHeartBeats },
    { value: 'GiFamilyHouse', label: 'Família', icon: GiFamilyHouse },
    { value: 'GiChoir', label: 'Louvor', icon: LiaChairSolid }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {tipo ? 'Editar Tipo' : 'Novo Tipo de Atividade'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID (único)
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
                disabled={!!tipo}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome (label)
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {iconOptions.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
