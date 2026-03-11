// src/components/actividades/CardActividade.tsx
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

interface CardActividadeProps {
  actividade: {
    id: number;
    titulo: string;
    data: string;
    hora: string;
    local: string;
    tipo: string;
    imagem: string;
  };
}

export const CardActividade = ({ actividade }: CardActividadeProps) => {
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long'
    });
  };

  return (
    <Link 
      to={`/actividades/${actividade.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={actividade.imagem} 
          alt={actividade.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
          {actividade.tipo}
        </span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {actividade.titulo}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-primary" />
            <span>{formatarData(actividade.data)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-primary" />
            <span>{actividade.hora}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-primary" />
            <span>{actividade.local}</span>
          </div>
        </div>
        
        <div className="text-primary font-semibold text-sm">
          Saiba mais →
        </div>
      </div>
    </Link>
  );
};