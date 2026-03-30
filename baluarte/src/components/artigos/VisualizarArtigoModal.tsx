// src/components/artigos/VisualizarArtigoModal.tsx
import { motion } from "framer-motion";
import { 
  FiBookOpen, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiEye, 
  FiDownload,
  FiX,
  FiEdit2,
  FiFileText,
  FiShare2,
  FiPrinter,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiAlertCircle
} from "react-icons/fi";
import { ArtigoAdminView, tiposArtigo } from "../../pages/Artigos/ArtigosAdmin";
import rectangleImage from "../../assets/rectangle.jpg";
import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../../utils/api";
import { getAuthToken } from "../../utils/auth";
import { createPortal } from "react-dom";

interface VisualizarArtigoModalProps {
  artigo: ArtigoAdminView;
  onClose: () => void;
  onEdit?: () => void;
}

// Componente para renderizar o conteúdo HTML do artigo
const ConteudoHTML = ({ htmlContent }: { htmlContent: string }) => {
  if (!htmlContent) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="text-6xl text-amber-500 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">Conteúdo não disponível</p>
        <p className="text-sm text-gray-500">
          O HTML deste artigo ainda não foi gerado. 
          Clique no botão "Regerar HTML" para visualizar o conteúdo.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="artigo-conteudo admin-article-html article-html"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export const VisualizarArtigoModal = ({ artigo, onClose, onEdit }: VisualizarArtigoModalProps) => {
  const [isImageError, setIsImageError] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const tipoInfo = tiposArtigo.find(t => t.value === artigo.tipo);
  const Icon = tipoInfo?.icon || FiBookOpen;
  const tempoLeitura = artigo.tempoLeitura ?? `${Math.max(1, Math.ceil((artigo.nPagina || 1) / 2))} min`;
  const totalPaginas = artigo.nPagina || 1;
  
  // Impedir scroll do body quando modal está aberta
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Buscar o conteúdo HTML do artigo
  useEffect(() => {
    const fetchConteudo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Busca o artigo completo para pegar o HTML salvo (conteudo)
        const response = await apiFetch(`/user/artigo/${artigo.id}`);
        
        if (!response.ok) {
          throw new Error('Conteúdo não encontrado');
        }
        
        const payload = await response.json();
        setHtmlContent(payload?.conteudo || "");
      } catch (err) {
        console.error('Erro ao carregar conteúdo:', err);
        setError('Não foi possível carregar o conteúdo do artigo');
        
        setHtmlContent("");
      } finally {
        setLoading(false);
      }
    };

    fetchConteudo();
  }, [artigo.id, artigo.descricao]);

  const handleDownload = async () => {
    if (artigo.pdf) {
      if (getAuthToken()) {
        apiFetch(`/user/me/download/artigo/${artigo.id}`, { method: "POST" }).catch(() => {});
      }
      if (typeof artigo.pdf === 'string') {
        window.open(artigo.pdf, '_blank');
      } else if (artigo.pdf instanceof File) {
        const url = URL.createObjectURL(artigo.pdf);
        const a = document.createElement('a');
        a.href = url;
        a.download = artigo.pdf.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artigo.titulo,
          text: artigo.descricao,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleZoomIn = () => {
    setFontSize(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setFontSize(prev => Math.max(prev - 10, 70));
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const portalTarget = typeof document !== "undefined" ? document.body : null;
  if (!portalTarget) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] my-8 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com imagem de capa */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 flex-shrink-0">
          <img
            src={!isImageError ? (artigo.img || rectangleImage) : rectangleImage}
            alt={artigo.titulo}
            className="w-full h-full object-cover opacity-90"
            onError={() => setIsImageError(true)}
          />
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Badge de categoria */}
          <div className={`absolute top-4 left-4 ${tipoInfo?.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg`}>
            <Icon size={14} />
            {tipoInfo?.label}
          </div>

          {/* Título e metadados */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg line-clamp-2">
              {artigo.titulo}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <FiUser size={12} />
                <span>{artigo.escritor}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar size={12} />
                <span>{formatarData(artigo.dataPublicacao)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock size={12} />
                <span>{tempoLeitura}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiEye size={12} />
                <span>{artigo.visualizacoes ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors text-white"
            title="Fechar"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Barra de ferramentas */}
        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
      
          </div>

          <div className="flex items-center gap-1">
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ml-1 text-sm"
            >
              <FiDownload size={14} />
              PDF
            </button>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-1"
                title="Editar artigo"
              >
                <FiEdit2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Área de conteúdo com scroll */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-gray-50 p-6"
        >
          <div 
            className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-8"
            style={{ 
              fontSize: `${fontSize}%`,
              transition: 'font-size 0.2s ease'
            }}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando conteúdo...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {/* Conteúdo do artigo (exatamente como aparece para o usuário) */}
                <ConteudoHTML htmlContent={htmlContent} />

                {/* Informações adicionais no rodapé */}
                <div className="mt-12 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <FiBookOpen size={12} />
                      <span>Publicado em {formatarData(artigo.dataPublicacao)}</span>
                    </div>
                    {artigo.tags && artigo.tags.length > 0 && (
                      <div className="flex gap-1">
                        {artigo.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-100 rounded text-[10px]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Barra de status */}
        <div className="px-4 py-1.5 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span>{totalPaginas} {totalPaginas === 1 ? 'página' : 'páginas'}</span>
            <span>•</span>
            <span>Visualização do usuário</span>
          </div>
          <div>
            {artigo.pdf ? (
              <span className="text-green-600 flex items-center gap-1">
                <FiFileText size={12} />
                PDF disponível
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1">
                <FiAlertCircle size={12} />
                Sem PDF
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  , portalTarget);
};
