import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

// Componente de Toggle Switch
export const ToggleSwitch = ({ 
  value, 
  onChange,
  label
}: { 
  value: boolean; 
  onChange: (value: boolean) => void;
  label?: string;
}) => (
  <button
    onClick={() => onChange(!value)}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      value ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-600'
    }`}
  >
    {value ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
    <span className="text-sm font-medium">{label || (value ? 'Ativado' : 'Desativado')}</span>
  </button>
);
