// src/components/actividades/GaleriaActividade.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiX, FiChevronLeft, FiChevronRight, FiImage, FiVideo } from "react-icons/fi";

interface MediaItem {
  id: number;
  type: 'VIDEO' | 'IMAGE';
  url: string;
  thumbnail?: string;
  titulo: string;
  descricao?: string;
  duracao?: string;
}

interface GaleriaActividadeProps {
  activityId: number;
}

export const GaleriaActividade = ({ activityId }: GaleriaActividadeProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activeTab, setActiveTab] = useState<'todas' | 'videos' | 'imagens'>('todas');

  // Dados mockados - aqui viriam da API com base no activityId
  const mediaItems: MediaItem[] = [
    {
      id: 1,
      type: 'VIDEO',
      url: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
      titulo: 'Conferência de Jovens 2024 - Trailler',
      descricao: 'Um pequeno vídeo mostrando o que você vai encontrar na conferência',
      duracao: '1:30'
    },
    {
      id: 2,
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      titulo: 'Momento de Louvor',
      descricao: 'Jovens adorando durante a conferência do ano passado'
    },
    {
      id: 3,
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80',
      titulo: 'Palestra com Pr. Antônio',
      descricao: 'Momento da mensagem principal'
    },
    {
      id: 4,
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      titulo: 'Grupo de Jovens',
      descricao: 'Todos reunidos após o culto'
    },
    {
      id: 5,
      type: 'VIDEO',
      url: 'https://example.com/video2.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
      titulo: 'Mensagem completa - Pr. João',
      descricao: 'Sermão da noite de abertura',
      duracao: '45:20'
    },
    {
      id: 6,
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80',
      titulo: 'Momento de Oração',
      descricao: 'Jovens intercedendo'
    }
  ];

  const filteredMedia = mediaItems.filter(item => {
    if (activeTab === 'videos') return item.type === 'VIDEO';
    if (activeTab === 'imagens') return item.type === 'IMAGE';
    return true;
  });

  const videos = mediaItems.filter(item => item.type === 'VIDEO');
  const imagens = mediaItems.filter(item => item.type === 'IMAGE');

  const openMedia = (item: MediaItem) => setSelectedMedia(item);
  const closeMedia = () => setSelectedMedia(null);

  const nextMedia = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredMedia.findIndex(item => item.id === selectedMedia.id);
    const nextIndex = (currentIndex + 1) % filteredMedia.length;
    setSelectedMedia(filteredMedia[nextIndex]);
  };

  const prevMedia = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredMedia.findIndex(item => item.id === selectedMedia.id);
    const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setSelectedMedia(filteredMedia[prevIndex]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Cabeçalho com abas */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Galeria</h3>
        
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'todas' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
            }`}
          >
            Todas ({mediaItems.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'videos' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <FiVideo size={14} />
            Vídeos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('imagens')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'imagens' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <FiImage size={14} />
            Imagens ({imagens.length})
          </button>
        </div>
      </div>

      {/* Trailler em destaque (se houver) */}
      {videos.length > 0 && activeTab === 'todas' && (
        <div className="mb-8">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <FiPlay className="text-primary" />
            Vídeo Trailler
          </h4>
          <div 
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openMedia(videos[0])}
          >
            <img
              src={videos[0].thumbnail}
              alt={videos[0].titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <FiPlay className="text-white text-2xl ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h5 className="text-white font-semibold">{videos[0].titulo}</h5>
              <p className="text-white/80 text-sm">{videos[0].descricao}</p>
            </div>
            {videos[0].duracao && (
              <span className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                {videos[0].duracao}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grid de mídia */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openMedia(item)}
          >
            <img
              src={item.type === 'VIDEO' ? item.thumbnail : item.url}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {item.titulo}
                </p>
              </div>
            </div>

            {/* Badge de tipo */}
            <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded">
              {item.type === 'VIDEO' ? <FiVideo size={14} /> : <FiImage size={14} />}
            </div>

            {/* Badge de duração (para vídeos) */}
            {item.type === 'VIDEO' && item.duracao && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {item.duracao}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox/Modal para visualização */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeMedia}
          >
            {/* Botão fechar */}
            <button
              onClick={closeMedia}
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-10"
            >
              <FiX size={30} />
            </button>

            {/* Navegação */}
            <button
              onClick={(e) => { e.stopPropagation(); prevMedia(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors"
            >
              <FiChevronLeft size={50} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextMedia(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors"
            >
              <FiChevronRight size={50} />
            </button>

            {/* Conteúdo */}
            <motion.div
              key={selectedMedia.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-6xl max-h-[80vh] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'VIDEO' ? (
                <div className="relative aspect-video">
                  <video
                    src={selectedMedia.url}
                    poster={selectedMedia.thumbnail}
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.titulo}
                  className="max-w-full max-h-[70vh] mx-auto rounded-lg"
                />
              )}

              {/* Info da mídia */}
              <div className="text-white text-center mt-4">
                <h3 className="text-xl font-bold mb-2">{selectedMedia.titulo}</h3>
                {selectedMedia.descricao && (
                  <p className="text-gray-300">{selectedMedia.descricao}</p>
                )}
              </div>

              {/* Contador */}
              <div className="absolute top-6 left-6 text-white bg-black/50 px-3 py-1 rounded-lg">
                {filteredMedia.findIndex(item => item.id === selectedMedia.id) + 1} / {filteredMedia.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};