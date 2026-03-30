import { FiEdit2, FiX } from "react-icons/fi";
import { ConfiguracaoTipoAtividade, iconMap } from "../../pages/Configuracoes/Configuracoes";
import { GiPrayer } from "react-icons/gi";

// Componente de Card de Tipo de Atividade (modo edição)
export const TipoAtividadeCard = ({ 
  tipo, 
  onEdit,
  onDelete
}: { 
  tipo: ConfiguracaoTipoAtividade; 
  onEdit: (tipo: ConfiguracaoTipoAtividade) => void;
  onDelete: (id: string) => void;
}) => {
  const IconComponent = iconMap[tipo.icon] || GiPrayer;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: tipo.color }}>
          <IconComponent size={16} />
        </div>
        <div>
          <p className="font-medium">{tipo.label}</p>
          <p className="text-xs text-gray-500">{tipo.id}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(tipo)}
          className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-primary-500"
        >
          <FiEdit2 size={14} />
        </button>
        <button
          onClick={() => onDelete(tipo.id)}
          className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-red-500"
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  );
};