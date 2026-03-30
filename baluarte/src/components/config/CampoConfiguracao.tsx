// Componente de Campo de Configuração
export const CampoConfiguracao = ({ 
  label, 
  children,
  descricao
}: { 
  label: string; 
  children: React.ReactNode;
  descricao?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {descricao && <p className="text-xs text-gray-500 mb-2">{descricao}</p>}
    {children}
  </div>
);