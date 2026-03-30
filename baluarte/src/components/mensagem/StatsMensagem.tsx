export const StatsCard = ({ 
  icone: Icon, 
  titulo, 
  valor, 
  cor 
}: { 
  icone: any; 
  titulo: string; 
  valor: number; 
  cor: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${cor} rounded-lg flex items-center justify-center text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className="text-2xl font-bold text-gray-800">{valor}</p>
      </div>
    </div>
  </div>
);
