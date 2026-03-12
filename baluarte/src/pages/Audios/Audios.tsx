// src/pages/Audios/AudiosPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiHeadphones, 
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
  GiMusicalNotes,
  GiSoundWaves,
  GiMegaphone
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { ModalAudio } from "../../components/audio/AudioModal";

// Tipos baseados no seu AudioType
export enum AudioType {
  Sermon = 'SERMON',
  Devotional = 'DEVOTIONAL',
  Testimony = 'TESTIMONY',
  Music = 'MUSIC',
  Prayer = 'PRAYER',
  Study = 'STUDY',
  Podcast = 'PODCAST',
  Announcement = 'ANNOUNCEMENT'
}

export const tiposAudio: { value: AudioType; label: string; icon: any; color: string }[] = [
  { value: AudioType.Sermon, label: "Sermão", icon: GiMicrophone, color: "bg-purple-500" },
  { value: AudioType.Devotional, label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: AudioType.Testimony, label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: AudioType.Music, label: "Música", icon: GiMusicalNotes, color: "bg-indigo-500" },
  { value: AudioType.Prayer, label: "Oração", icon: GiPrayer, color: "bg-blue-500" },
  { value: AudioType.Study, label: "Estudo", icon: LiaBibleSolid, color: "bg-amber-500" },
  { value: AudioType.Podcast, label: "Podcast", icon: GiSoundWaves, color: "bg-orange-500" },
  { value: AudioType.Announcement, label: "Aviso", icon: GiMegaphone, color: "bg-red-500" },
];

export interface Audio {
  id: string;
  titulo: string;
  descricao: string;
  tipo: AudioType;
  autor: string;
  data: string;
  capa: string; // imagem de capa do áudio
  audioUrl: string;
  duracao: string;
  visualizacoes: number;
  tags: string[];
}

// Dados mockados
const audiosMock: Audio[] = [
  {
    id: '1',
    titulo: "O Poder da Oração - Sermão",
    descricao: "Mensagem poderosa sobre o impacto da oração na vida do cristão.",
    tipo: AudioType.Sermon,
    autor: "Pr. Antônio Silva",
    data: "2024-03-12",
    capa: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://example.com/audio1.mp3",
    duracao: "45:30",
    visualizacoes: 1234,
    tags: ["oração", "fé", "sermão"]
  },
  {
    id: '2',
    titulo: "Devocional Matinal - Salmos 23",
    descricao: "Meditação no Salmo 23 para começar o dia com paz.",
    tipo: AudioType.Devotional,
    autor: "Pra. Maria Oliveira",
    data: "2024-03-11",
    capa: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://example.com/audio2.mp3",
    duracao: "15:20",
    visualizacoes: 856,
    tags: ["devocional", "salmos", "manhã"]
  },
  {
    id: '3',
    titulo: "Grandioso És Tu - Hino",
    descricao: "Versão acústica do clássico hino da fé cristã.",
    tipo: AudioType.Music,
    autor: "Ministério Baluarte",
    data: "2024-03-10",
    capa: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://example.com/audio3.mp3",
    duracao: "5:45",
    visualizacoes: 2341,
    tags: ["música", "louvor", "hino"]
  },
  {
    id: '4',
    titulo: "Oração pela Manhã",
    descricao: "Momento de oração e intercessão para começar o dia.",
    tipo: AudioType.Prayer,
    autor: "Pra. Maria Oliveira",
    data: "2024-03-09",
    capa: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://example.com/audio4.mp3",
    duracao: "20:15",
    visualizacoes: 567,
    tags: ["oração", "intercessão", "manhã"]
  },
  {
    id: '5',
    titulo: "Estudo de Romanos 8",
    descricao: "Análise profunda do capítulo 8 de Romanos.",
    tipo: AudioType.Study,
    autor: "Pb. Marcos Oliveira",
    data: "2024-03-08",
    capa: "https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://example.com/audio5.mp3",
    duracao: "58:20",
    visualizacoes: 432,
    tags: ["estudo", "romanos", "bíblico"]
  },
  {
    id: '6',
    titulo: "Podcast Juventude e Fé",
    descricao: "Conversa sobre os desafios da juventude cristã.",
    tipo: AudioType.Podcast,
    autor: "Pr. João Santos",
    data: "2024-03-07",
    capa: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://example.com/audio6.mp3",
    duracao: "32:15",
    visualizacoes: 789,
    tags: ["podcast", "juventude", "fé"]
  },
  {
    id: '7',
    titulo: "Testemunho: Livre das Drogas",
    descricao: "Testemunho poderoso de libertação do vício.",
    tipo: AudioType.Testimony,
    autor: "Irmão Carlos",
    data: "2024-03-06",
    capa: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://example.com/audio7.mp3",
    duracao: "28:45",
    visualizacoes: 1123,
    tags: ["testemunho", "libertação", "transformação"]
  }
];



// Card de Áudio
const AudioCard = ({ 
  audio, 
  onEdit, 
  onDelete,
  onPreview
}: { 
  audio: Audio; 
  onEdit: (audio: Audio) => void;
  onDelete: (id: string) => void;
  onPreview: (audio: Audio) => void;
}) => {
  const tipoInfo = tiposAudio.find(t => t.value === audio.tipo);
  const Icon = tipoInfo?.icon || FiHeadphones;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary-300"
    >
      {/* Capa */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={audio.capa}
          alt={audio.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay com ondas sonoras (visual) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-pulse"
                  style={{ 
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s` 
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPreview(audio);
              }}
              className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform"
            >
              <FiPlay className="text-white text-xl ml-1" />
            </button>
          </div>
        </div>
        
        {/* Badge de categoria */}
        <div className={`absolute top-4 left-4 ${tipoInfo?.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg`}>
          <Icon size={12} />
          {tipoInfo?.label}
        </div>

        {/* Badge de duração */}
        <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
          <FiClock size={12} />
          {audio.duracao}
        </div>

        {/* Ações */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(audio)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este áudio?')) {
                onDelete(audio.id);
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
          {audio.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {audio.descricao}
        </p>

        {/* Autor e data */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser size={10} className="text-primary-500" />
            </div>
            <span>{audio.autor}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar size={10} />
            <span>{new Date(audio.data).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Tags e estatísticas */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiEye size={12} />
            {audio.visualizacoes} plays
          </span>

          <div className="flex gap-1">
            {audio.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Mini player visual (estático) */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-primary-500 rounded-full w-0" />
            </div>
            <FiHeadphones className="text-gray-400 text-xs" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal
export const AudiosPage = () => {
  const [audios, setAudios] = useState<Audio[]>(audiosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<AudioType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAudio, setEditingAudio] = useState<Audio | undefined>();
  const [previewAudio, setPreviewAudio] = useState<Audio | undefined>();

  // Filtrar áudios
  const filteredAudios = audios.filter(audio => {
    const matchesSearch = searchTerm === "" || 
      audio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTipo = !selectedTipo || audio.tipo === selectedTipo;

    return matchesSearch && matchesTipo;
  });

  const handleSave = (novoAudio: Omit<Audio, 'id'>) => {
    if (editingAudio) {
      // Editar
      setAudios(audios.map(a => 
        a.id === editingAudio.id ? { ...novoAudio, id: a.id } as Audio : a
      ));
    } else {
      // Criar
      const audio: Audio = {
        ...novoAudio,
        id: Math.random().toString(36).substr(2, 9),
      } as Audio;
      setAudios([audio, ...audios]);
    }
    setEditingAudio(undefined);
  };

  const handleEdit = (audio: Audio) => {
    setEditingAudio(audio);
    setShowModal(true);
  };

  const handlePreview = (audio: Audio) => {
    setPreviewAudio(audio);
  };

  const handleDelete = (id: string) => {
    setAudios(audios.filter(a => a.id !== id));
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
              Áudios
            </h1>
            <p className="text-gray-500">
              Gerencie todos os áudios, sermões e podcasts da igreja
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar áudios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingAudio(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Novo Áudio
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
            {tiposAudio.map((tipo) => (
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
            {filteredAudios.length} {filteredAudios.length === 1 ? 'áudio encontrado' : 'áudios encontrados'}
          </div>
        </div>

        {/* Grid de Áudios */}
        {filteredAudios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiHeadphones className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum áudio encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo 
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Comece adicionando seu primeiro áudio!'}
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
                  setEditingAudio(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Adicionar Primeiro Áudio
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredAudios.map((audio) => (
                <AudioCard
                  key={audio.id}
                  audio={audio}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Áudio */}
      <AnimatePresence>
        {showModal && (
          <ModalAudio
            audio={editingAudio}
            onClose={() => {
              setShowModal(false);
              setEditingAudio(undefined);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {previewAudio && (
          <ModalAudio
            mode="preview"
            audio={previewAudio}
            autoPlayPreview
            onClose={() => setPreviewAudio(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
