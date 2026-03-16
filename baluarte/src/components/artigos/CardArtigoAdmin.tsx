// src/components/artigos/CardArtigoAdmin.tsx
import { motion } from "framer-motion";
import { 
  FiBookOpen, 
  FiCalendar, 
  FiClock, 
  FiEdit2, 
  FiEye, 
  FiRefreshCw, 
  FiTrash2, 
  FiUser,
  FiExternalLink
} from "react-icons/fi";
import { tiposArtigo, ArtigoAdminView } from "../../pages/Artigos/ArtigosAdmin";
import rectangleImage from "../../assets/rectangle.jpg";
import { useState } from "react";
import { VisualizarArtigoModal } from "./VisualizarArtigoModal";

export const ArtigoCard = ({ 
  artigo, 
  onEdit, 
  onDelete,
  onRegenerateHtml,
}: { 
  artigo: ArtigoAdminView; 
  onEdit: (artigo: ArtigoAdminView) => void;
  onDelete: (id: number) => void;
  onRegenerateHtml?: (id: number) => void;
}) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const tipoInfo = tiposArtigo.find(t => t.value === artigo.tipo);
  const Icon = tipoInfo?.icon || FiBookOpen;
  const tempoLeitura = artigo.tempoLeitura ?? `${Math.max(1, Math.ceil((artigo.nPagina || 1) / 2))} min`;
  const visualizacoes = artigo.visualizacoes ?? 0;
  const tags = artigo.tags ?? [];
  const paginas = artigo.nPagina ?? 0;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
        onClick={() => setShowViewModal(true)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={artigo.img || rectangleImage}
            alt={artigo.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = rectangleImage;
            }}
          />
          
          {/* Badge de categoria */}
          <div className={`absolute top-4 left-4 ${tipoInfo?.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
            <Icon size={12} />
            {tipoInfo?.label}
          </div>

          {/* Badge de tempo de leitura */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <FiClock size={12} />
            {tempoLeitura}
          </div>

          {/* Overlay com ícone de visualização no hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform">
              <FiEye className="text-primary-500" size={24} />
            </div>
          </div>

          {/* Ações administrativas - sempre visíveis no hover */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {onRegenerateHtml && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerateHtml(Number(artigo.id));
                }}
                title="Regerar HTML do artigo"
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500"
              >
                <FiRefreshCw size={14} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(artigo);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500"
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
                  onDelete(Number(artigo.id));
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
                {visualizacoes}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <FiBookOpen size={12} />
                {paginas} pág
              </span>
            </div>

            <div className="flex gap-1">
              {tags.slice(0, 2).map((tag, index) => (
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

      {/* Modal de Visualização */}
      {showViewModal && (
        <VisualizarArtigoModal
          artigo={artigo}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false);
            onEdit(artigo);
          }}
        />
      )}
    </>
  );
};