// src/components/artigos/CardArtigo.tsx
import { Link } from "react-router-dom";
import { FiBookOpen, FiUser } from "react-icons/fi";

interface CardArtigoProps {
  artigo: {
    id: number;
    titulo: string;
    descricao: string;
    imagem: string;
    tipo: string;
    data: string;
    autor: string;
  };
}

export const CardArtigo = ({ artigo }: CardArtigoProps) => {
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Link 
      to={`/artigos/${artigo.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={artigo.imagem} 
          alt={artigo.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
          {artigo.tipo}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <FiUser size={14} />
          <span>{artigo.autor}</span>
          <span className="mx-2">•</span>
          <span>{formatarData(artigo.data)}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {artigo.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {artigo.descricao}
        </p>
        
        <div className="flex items-center text-primary font-semibold text-sm">
          Ler artigo
          <FiBookOpen className="ml-2 group-hover:ml-3 transition-all" />
        </div>
      </div>
    </Link>
  );
};