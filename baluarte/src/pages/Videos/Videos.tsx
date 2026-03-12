// src/pages/Videos/VideosPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiVideo, 
  FiUser, 
  FiCalendar,
  FiClock,
  FiEye,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiX,
  FiPlay
} from "react-icons/fi";
import { 
  GiMicrophone, 
  GiPrayer, 
  GiAngelWings, 
  GiFilmProjector,
  GiPartyPopper,
  GiConversation
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { VideoType } from "../../types/api";
import { ModalVideo } from "../../components/video/VideoModal";


export const tiposVideo: { value: VideoType; label: string; icon: any; color: string }[] = [
  { value: VideoType.Sermon, label: "Sermão", icon: GiMicrophone, color: "bg-purple-500" },
  { value: VideoType.Devotional, label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: VideoType.Testimony, label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: VideoType.Study, label: "Estudo Bíblico", icon: LiaBibleSolid, color: "bg-blue-500" },
  { value: VideoType.Documentary, label: "Documentário", icon: GiFilmProjector, color: "bg-amber-500" },
  { value: VideoType.Event, label: "Evento", icon: GiPartyPopper, color: "bg-orange-500" },
  { value: VideoType.Interview, label: "Entrevista", icon: GiConversation, color: "bg-indigo-500" },
];

export interface Video {
  id: string;
  titulo: string;
  descricao: string;
  tipo: VideoType;
  autor: string;
  data: string;
  thumbnail: string;
  videoUrl: string;
  duracao: string;
  visualizacoes: number;
  tags: string[];
}

// Dados mockados
const videosMock: Video[] = [
  {
    id: '1',
    titulo: "A Vitória é Certa - Culto de Domingo",
    descricao: "Mensagem poderosa sobre perseverança e fé inabalável em meio às lutas.",
    tipo: VideoType.Sermon,
    autor: "Pr. Antônio Silva",
    data: "2024-03-10",
    thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video1.mp4",
    duracao: "45:30",
    visualizacoes: 1234,
    tags: ["fé", "perseverança", "vitória"]
  },
  {
    id: '2',
    titulo: "O Poder da Oração",
    descricao: "Devocional matinal sobre a importância da oração na vida do cristão.",
    tipo: VideoType.Devotional,
    autor: "Pra. Maria Oliveira",
    data: "2024-03-08",
    thumbnail: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video2.mp4",
    duracao: "15:20",
    visualizacoes: 856,
    tags: ["oração", "devocional", "manhã"]
  },
  {
    id: '3',
    titulo: "Como Deus me Libertou das Drogas",
    descricao: "Testemunho poderoso de transformação e libertação.",
    tipo: VideoType.Testimony,
    autor: "Irmão Carlos Souza",
    data: "2024-03-05",
    thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video3.mp4",
    duracao: "28:45",
    visualizacoes: 2341,
    tags: ["testemunho", "libertação", "transformação"]
  },
  {
    id: '4',
    titulo: "Estudo de Romanos 8",
    descricao: "Análise versículo por versículo do capítulo 8 de Romanos.",
    tipo: VideoType.Study,
    autor: "Pb. Marcos Oliveira",
    data: "2024-03-03",
    thumbnail: "https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video4.mp4",
    duracao: "58:20",
    visualizacoes: 567,
    tags: ["estudo", "romanos", "bíblico"]
  }
];

// Modal de Vídeo

// Card de Vídeo
const VideoCard = ({ 
  video, 
  onEdit, 
  onDelete,
  onPreview
}: { 
  video: Video; 
  onEdit: (video: Video) => void;
  onDelete: (id: string) => void;
  onPreview: (video: Video) => void;
}) => {
  const tipoInfo = tiposVideo.find(t => t.value === video.tipo);
  const Icon = tipoInfo?.icon || FiVideo;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay com botão play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPreview(video);
            }}
            className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform"
          >
            <FiPlay className="text-white text-2xl ml-1" />
          </button>
        </div>
        
        {/* Badge de categoria */}
        <div className={`absolute top-4 left-4 ${tipoInfo?.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg`}>
          <Icon size={12} />
          {tipoInfo?.label}
        </div>

        {/* Badge de duração */}
        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
          <FiClock size={12} />
          {video.duracao}
        </div>

        {/* Ações */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(video)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este vídeo?')) {
                onDelete(video.id);
              }
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-red-500 shadow-lg"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
          {video.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.descricao}
        </p>

        {/* Autor e data */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser size={10} className="text-primary-500" />
            </div>
            <span>{video.autor}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar size={10} />
            <span>{new Date(video.data).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Tags e estatísticas */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiEye size={12} />
            {video.visualizacoes} views
          </span>

          <div className="flex gap-1">
            {video.tags.slice(0, 2).map((tag, index) => (
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

// Componente Principal
export const VideosPage = () => {
  const [videos, setVideos] = useState<Video[]>(videosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<VideoType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | undefined>();
  const [previewVideo, setPreviewVideo] = useState<Video | undefined>();

  // Filtrar vídeos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchTerm === "" || 
      video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTipo = !selectedTipo || video.tipo === selectedTipo;

    return matchesSearch && matchesTipo;
  });

  const handleSave = (novoVideo: Omit<Video, 'id'>) => {
    if (editingVideo) {
      // Editar
      setVideos(videos.map(v => 
        v.id === editingVideo.id ? { ...novoVideo, id: v.id } as Video : v
      ));
    } else {
      // Criar
      const video: Video = {
        ...novoVideo,
        id: Math.random().toString(36).substr(2, 9),
      } as Video;
      setVideos([video, ...videos]);
    }
    setEditingVideo(undefined);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setShowModal(true);
  };

  const handlePreview = (video: Video) => {
    setPreviewVideo(video);
  };

  const handleDelete = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Vídeos
            </h1>
            <p className="text-gray-500">
              Gerencie todos os vídeos e mensagens da igreja
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vídeos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingVideo(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Novo Vídeo
            </button>
          </div>
        </div>

        {/* Filtros por tipo */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTipo(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedTipo
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {tiposVideo.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => setSelectedTipo(tipo.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedTipo === tipo.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tipo.icon size={14} />
                {tipo.label}
              </button>
            ))}
          </div>
          
          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'vídeo encontrado' : 'vídeos encontrados'}
          </div>
        </div>

        {/* Grid de Vídeos */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiVideo className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum vídeo encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo 
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Comece adicionando seu primeiro vídeo!'}
            </p>
            {(searchTerm || selectedTipo) ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTipo(null);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingVideo(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Adicionar Primeiro Vídeo
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Vídeo */}
      <AnimatePresence>
        {showModal && (
          <ModalVideo
            video={editingVideo}
            onClose={() => {
              setShowModal(false);
              setEditingVideo(undefined);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {previewVideo && (
          <ModalVideo
            mode="preview"
            video={previewVideo}
            autoPlayPreview
            onClose={() => setPreviewVideo(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
