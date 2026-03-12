import  {motion}  from "framer-motion";
import { ArtigoDetail } from "../../types/api";
import { FiBookOpen, FiCalendar, FiClock, FiEdit2, FiEye, FiTrash2, FiUser } from "react-icons/fi";
import { tiposArtigo } from "../../pages/Artigos/ArtigosAdmin";

export const ArtigoCard = ({ 
  artigo, 
  onEdit, 
  onDelete 
}: { 
  artigo: ArtigoDetail; 
  onEdit: (artigo: ArtigoDetail) => void;
  onDelete: (id: string) => void;
}) => {
  const tipoInfo = tiposArtigo.find(t => t.value === artigo.tipo);
  const Icon = tipoInfo?.icon || FiBookOpen;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={artigo.img}
          alt={artigo.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge de categoria */}
        <div className={`absolute top-4 left-4 ${tipoInfo?.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
          <Icon size={12} />
          {tipoInfo?.label}
        </div>

        {/* Badge de tempo de leitura */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <FiClock size={12} />
          {artigo.tempoLeitura}
        </div>

        {/* Ações */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(artigo)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
                onDelete(artigo.id+"");
              }
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-red-500"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
          {artigo.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {artigo.descricao}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <FiUser size={12} />
            <span>{artigo.escritor}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar size={12} />
            <span>{new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiEye size={12} />
              {artigo.visualizacoes}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiBookOpen size={12} />
              {artigo.paginas} pág
            </span>
          </div>

          <div className="flex gap-1">
            {artigo.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};