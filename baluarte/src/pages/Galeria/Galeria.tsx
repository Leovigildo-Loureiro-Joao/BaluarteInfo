// src/pages/Galeria/GaleriaPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch,
  FiDownload,
  FiTrash2,
  FiX,
  FiCalendar,
  FiEye,
  FiImage,
  FiLink,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";

// Interface da imagem
interface Imagem {
  id: string;
  url: string;
  titulo: string;
  descricao?: string;
  data: string;
  tamanho: string;
  dimensoes: string;
  atividadeId?: string;
  atividadeNome?: string;
  visualizacoes: number;
}

// Dados mockados
const imagensMock: Imagem[] = [
  {
    id: '1',
    url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80",
    titulo: "Culto de Domingo - Março 2024",
    descricao: "Momento de louvor durante o culto de celebração",
    data: "2024-03-10",
    tamanho: "2.3 MB",
    dimensoes: "1920x1080",
    atividadeId: "1",
    atividadeNome: "Culto de Celebração",
    visualizacoes: 234
  },
  {
    id: '2',
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    titulo: "Louvorzão 2024",
    descricao: "Equipe de louvor durante o evento especial",
    data: "2024-03-05",
    tamanho: "1.8 MB",
    dimensoes: "1920x1080",
    atividadeId: "3",
    atividadeNome: "Louvorzão 2024",
    visualizacoes: 156
  },
  {
    id: '3',
    url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
    titulo: "Conferência de Jovens",
    descricao: "Palestra com Pr. João Santos",
    data: "2024-03-01",
    tamanho: "3.1 MB",
    dimensoes: "1920x1080",
    atividadeId: "2",
    atividadeNome: "Conferência de Jovens",
    visualizacoes: 312
  },
  {
    id: '4',
    url: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    titulo: "Culto de Oração",
    descricao: "Momento de intercessão na capela",
    data: "2024-02-28",
    tamanho: "1.5 MB",
    dimensoes: "1920x1080",
    visualizacoes: 89
  },
  {
    id: '5',
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    titulo: "Ministério Infantil",
    descricao: "Crianças durante a escola bíblica",
    data: "2024-02-25",
    tamanho: "2.1 MB",
    dimensoes: "1920x1080",
    atividadeId: "4",
    atividadeNome: "Escola Bíblica Infantil",
    visualizacoes: 145
  },
  {
    id: '6',
    url: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80",
    titulo: "Encontro de Casais",
    descricao: "Palestra sobre relacionamento",
    data: "2024-02-20",
    tamanho: "2.7 MB",
    dimensoes: "1920x1080",
    atividadeId: "5",
    atividadeNome: "Encontro de Casais",
    visualizacoes: 198
  }
];

// Modal de visualização da imagem
const VisualizadorImagem = ({ 
  imagem, 
  onClose, 
  onDelete,
  onDownload
}: { 
  imagem: Imagem; 
  onClose: () => void; 
  onDelete: (id: string) => void;
  onDownload: (imagem: Imagem) => void;
}) => {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Botão fechar */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
      >
        <FiX size={30} />
      </button>

      {/* Imagem */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="max-w-7xl max-h-[90vh] px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imagem.url}
          alt={imagem.titulo}
          className="max-w-full max-h-[80vh] mx-auto rounded-lg shadow-2xl"
        />
      </motion.div>

      {/* Painel de informações (toggle) */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
      >
        <FiEye size={16} />
        {showInfo ? 'Ocultar' : 'Mostrar'} informações
      </button>

      {/* Ações */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {imagem.atividadeId && (
          <span className="px-4 py-2 bg-primary-500/20 text-primary-300 rounded-lg text-sm flex items-center gap-2">
            <GiPartyPopper size={16} />
            {imagem.atividadeNome}
          </span>
        )}
        <button
          onClick={() => onDownload(imagem)}
          className="px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <FiDownload size={16} />
          Download
        </button>
        <button
          onClick={() => {
            if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
              onDelete(imagem.id);
              onClose();
            }
          }}
          className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <FiTrash2 size={16} />
          Excluir
        </button>
      </div>

      {/* Painel de informações */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-6 bg-black/80 backdrop-blur-sm text-white rounded-xl p-4 max-w-md"
          >
            <h3 className="text-lg font-bold mb-2">{imagem.titulo}</h3>
            {imagem.descricao && (
              <p className="text-gray-300 text-sm mb-3">{imagem.descricao}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>📅 {new Date(imagem.data).toLocaleDateString('pt-BR')}</div>
              <div>📏 {imagem.dimensoes}</div>
              <div>💾 {imagem.tamanho}</div>
              <div>👁️ {imagem.visualizacoes} views</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Card de imagem na galeria
const ImagemCard = ({ 
  imagem, 
  onSelect,
  onDelete,
  onDownload
}: { 
  imagem: Imagem; 
  onSelect: (imagem: Imagem) => void;
  onDelete: (id: string) => void;
  onDownload: (imagem: Imagem) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Imagem */}
      <div 
        className="aspect-square overflow-hidden cursor-pointer"
        onClick={() => onSelect(imagem)}
      >
        <img
          src={imagem.url}
          alt={imagem.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Badge de atividade (se tiver) */}
      {imagem.atividadeId && (
        <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow-lg">
          <GiPartyPopper size={12} />
          <span className="truncate max-w-[100px]">{imagem.atividadeNome}</span>
        </div>
      )}

      {/* Ações */}
      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDownload(imagem)}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
          title="Download"
        >
          <FiDownload size={14} />
        </button>
        <button
          onClick={() => {
            if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
              onDelete(imagem.id);
            }
          }}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
          title="Excluir"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* Info no hover (parte inferior) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
        <h4 className="text-sm font-medium line-clamp-1">{imagem.titulo}</h4>
        <p className="text-xs text-gray-300 flex items-center gap-2 mt-1">
          <FiCalendar size={10} />
          {new Date(imagem.data).toLocaleDateString('pt-BR')}
          <FiEye size={10} className="ml-2" />
          {imagem.visualizacoes}
        </p>
      </div>
    </motion.div>
  );
};

// Componente de estatísticas rápidas
const StatsCard = ({ 
  icone: Icon, 
  titulo, 
  valor, 
  cor 
}: { 
  icone: any; 
  titulo: string; 
  valor: string | number; 
  cor: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${cor} rounded-lg flex items-center justify-center text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className="text-xl font-bold text-gray-800">{valor}</p>
      </div>
    </div>
  </div>
);

// Componente Principal
export const GaleriaPage = () => {
  const [imagens, setImagens] = useState<Imagem[]>(imagensMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<Imagem | null>(null);
  const [filterAtividade, setFilterAtividade] = useState<string | null>(null);

  // Filtrar imagens
  const filteredImagens = imagens.filter(img => {
    const matchesSearch = searchTerm === "" || 
      img.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.atividadeNome?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAtividade = !filterAtividade || img.atividadeId === filterAtividade;

    return matchesSearch && matchesAtividade;
  });

  // Estatísticas
  const totalImagens = imagens.length;
  const imagensComAtividade = imagens.filter(img => img.atividadeId).length;
  const totalVisualizacoes = imagens.reduce((acc, img) => acc + img.visualizacoes, 0);

  // Lista única de atividades para filtro
  const atividades = Array.from(
    new Set(imagens.filter(img => img.atividadeId).map(img => ({
      id: img.atividadeId!,
      nome: img.atividadeNome!
    })))
  );

  const handleDelete = (id: string) => {
    setImagens(imagens.filter(img => img.id !== id));
  };

  const handleDownload = (imagem: Imagem) => {
    // Simular download
    const link = document.createElement('a');
    link.href = imagem.url;
    link.download = `${imagem.titulo}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Grid decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Galeria de Imagens
          </h1>
          <p className="text-gray-500">
            Gerencie todas as imagens da igreja
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icone={FiImage}
            titulo="Total de Imagens"
            valor={totalImagens}
            cor="bg-primary-500"
          />
          <StatsCard
            icone={GiPartyPopper}
            titulo="Vinculadas a Atividades"
            valor={imagensComAtividade}
            cor="bg-green-500"
          />
          <StatsCard
            icone={FiEye}
            titulo="Total de Visualizações"
            valor={totalVisualizacoes}
            cor="bg-blue-500"
          />
          <StatsCard
            icone={FiDownload}
            titulo="Downloads (mês)"
            valor={456}
            cor="bg-purple-500"
          />
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar imagens por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtro por atividade */}
            <select
              value={filterAtividade || ''}
              onChange={(e) => setFilterAtividade(e.target.value || null)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[200px]"
            >
              <option value="">Todas as imagens</option>
              {atividades.map((atv) => (
                <option key={atv.id} value={atv.id}>
                  {atv.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredImagens.length} {filteredImagens.length === 1 ? 'imagem encontrada' : 'imagens encontradas'}
          </div>
        </div>

        {/* Grid de Imagens */}
        {filteredImagens.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma imagem encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filterAtividade 
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'A galeria está vazia'}
            </p>
            {(searchTerm || filterAtividade) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterAtividade(null);
                }}
                className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {filteredImagens.map((imagem) => (
                <ImagemCard
                  key={imagem.id}
                  imagem={imagem}
                  onSelect={setSelectedImage}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Visualizador de imagem */}
      <AnimatePresence>
        {selectedImage && (
          <VisualizadorImagem
            imagem={selectedImage}
            onClose={() => setSelectedImage(null)}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}
      </AnimatePresence>
    </div>
  );
};