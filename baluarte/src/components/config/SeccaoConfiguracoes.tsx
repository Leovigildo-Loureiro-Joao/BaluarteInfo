import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// Componente de Seção Configurável
export const SecaoConfiguracao = ({ 
  titulo, 
  icone: Icon, 
  children,
  inicialExpandido = true 
}: { 
  titulo: string; 
  icone: any; 
  children: React.ReactNode;
  inicialExpandido?: boolean;
}) => {
  const [expandido, setExpandido] = useState(inicialExpandido);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="text-primary-500" size={20} />
          <h3 className="font-semibold text-lg">{titulo}</h3>
        </div>
        {expandido ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>
      
      {expandido && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};
