// src/components/midia/CardMidia.tsx
import { Link } from "react-router-dom";
import { FiPlay, FiHeadphones, FiEye } from "react-icons/fi";

interface CardMidiaProps {
  midia: {
    id: number;
    titulo: string;
    descricao: string;
    imagem: string;
    tipo: string;
    duracao: string;
    visualizacoes: number;
  };
}

export const CardMidia = ({ midia }: CardMidiaProps) => {
  const Icon = midia.tipo === 'VIDEO' ? FiPlay : FiHeadphones;

  return (
    <Link 
      to={`/midia/${midia.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={midia.imagem} 
          alt={midia.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay com ícone de play */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon className="text-white text-xl" />
          </div>
        </div>

        {/* Badge de duração */}
        <span className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {midia.duracao}
        </span>

        {/* Badge de tipo */}
        <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
          {midia.tipo}
        </span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {midia.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {midia.descricao}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-gray-500">
            <FiEye size={14} />
            {midia.visualizacoes} visualizações
          </span>
          
          <span className="text-primary font-semibold">
            Assistir
          </span>
        </div>
      </div>
    </Link>
  );
};