// src/pages/Midia/MidiaPage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FiPlay, 
  FiHeadphones, 
  FiImage, 
  FiSearch,
  FiFilter,
  FiX,
  FiClock,
  FiEye,
  FiCalendar,
  FiUser
} from "react-icons/fi";
import { 
  GiMicrophone,
  GiGuitar,
  GiPrayer,
  GiMusicalNotes,
  GiAngelWings,
  GiSoundWaves,
  GiMegaphone,
  GiFilmProjector,
  GiVideoCamera
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { fadeInUp, staggerContainer } from "../../utils/animation";

// Tipos baseados nos seus Enums
const midiaTypes = [
  { value: "VIDEO", label: "Vídeos", icon: FiPlay, color: "bg-red-500" },
  { value: "AUDIO", label: "Áudios", icon: FiHeadphones, color: "bg-green-500" },
  { value: "IMAGE", label: "Imagens", icon: FiImage, color: "bg-blue-500" },
];

const audioTypes = [
  { value: "SERMON", label: "Sermões", icon: GiMicrophone, color: "bg-purple-500" },
  { value: "DEVOTIONAL", label: "Devocionais", icon: GiPrayer, color: "bg-green-500" },
  { value: "TESTIMONY", label: "Testemunhos", icon: GiAngelWings, color: "bg-pink-500" },
  { value: "MUSIC", label: "Músicas", icon: GiMusicalNotes, color: "bg-indigo-500" },
  { value: "PRAYER", label: "Orações", icon: GiPrayer, color: "bg-blue-500" },
  { value: "STUDY", label: "Estudos", icon: LiaBibleSolid, color: "bg-amber-500" },
  { value: "PODCAST", label: "Podcasts", icon: GiSoundWaves, color: "bg-orange-500" },
  { value: "ANNOUNCEMENT", label: "Avisos", icon: GiMegaphone, color: "bg-red-500" },
];

const videoTypes = [
  { value: "SERMON", label: "Sermões", icon: GiMicrophone, color: "bg-purple-500" },
  { value: "DEVOTIONAL", label: "Devocionais", icon: GiPrayer, color: "bg-green-500" },
  { value: "TESTIMONY", label: "Testemunhos", icon: GiAngelWings, color: "bg-pink-500" },
  { value: "STUDY", label: "Estudos", icon: LiaBibleSolid, color: "bg-amber-500" },
  { value: "DOCUMENTARY", label: "Documentários", icon: GiFilmProjector, color: "bg-cyan-500" },
  { value: "EVENT", label: "Eventos", icon: FiCalendar, color: "bg-red-500" },
  { value: "INTERVIEW", label: "Entrevistas", icon: GiMegaphone, color: "bg-indigo-500" },
];

// Dados mockados
const midiaMock = [
  {
    id: 1,
    titulo: "Culto de Domingo - A Vitória é Certa",
    descricao: "Mensagem poderosa sobre perseverança e fé inabalável",
    imagem: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80",
    tipo: "VIDEO",
    videoType: "SERMON",
    duracao: "45:30",
    visualizacoes: 1234,
    data: "2024-01-15",
    pregador: "Pr. Antônio Silva",
    qualidade: "1080p"
  },
  {
    id: 2,
    titulo: "Podcast: Juventude e Fé",
    descricao: "Conversa sobre desafios da juventude cristã no século XXI",
    imagem: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    tipo: "AUDIO",
    audioType: "PODCAST",
    duracao: "32:15",
    visualizacoes: 856,
    data: "2024-01-14",
    apresentador: "Pr. João Santos"
  },
  {
    id: 3,
    titulo: "Estudo Bíblico - Romanos 8",
    descricao: "Estudo aprofundado do capítulo 8 de Romanos",
    imagem: "https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=800&q=80",
    tipo: "VIDEO",
    videoType: "STUDY",
    duracao: "58:20",
    visualizacoes: 2341,
    data: "2024-01-13",
    pregador: "Pb. Marcos Oliveira",
    qualidade: "720p"
  },
  {
    id: 4,
    titulo: "Série: Os Atributos de Deus",
    descricao: "Aula 1 - A Soberania de Deus",
    imagem: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=800&q=80",
    tipo: "AUDIO",
    audioType: "STUDY",
    duracao: "45:10",
    visualizacoes: 567,
    data: "2024-01-12",
    apresentador: "Pr. Antônio Silva"
  },
  {
    id: 5,
    titulo: "Momentos do Culto - Louvor",
    descricao: "Melhores momentos do louvor da igreja",
    imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    tipo: "IMAGE",
    visualizacoes: 3456,
    data: "2024-01-11",
    local: "Templo Central"
  },
  {
    id: 6,
    titulo: "Testemunho: Libertação das Drogas",
    descricao: "Testemunho poderoso de transformação",
    imagem: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    tipo: "AUDIO",
    audioType: "TESTIMONY",
    duracao: "12:30",
    visualizacoes: 987,
    data: "2024-01-10",
    apresentador: "Irmão Carlos"
  },
  {
    id: 7,
    titulo: "Música: Grandioso És Tu",
    descricao: "Hino clássico da fé cristã",
    imagem: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80",
    tipo: "AUDIO",
    audioType: "MUSIC",
    duracao: "5:20",
    visualizacoes: 2156,
    data: "2024-01-09",
    artista: "Ministério Baluarte"
  },
  {
    id: 8,
    titulo: "Oração pela Manhã",
    descricao: "Momento de oração e intercessão",
    imagem: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    tipo: "AUDIO",
    audioType: "PRAYER",
    duracao: "20:00",
    visualizacoes: 654,
    data: "2024-01-08",
    lider: "Pra. Maria"
  }
];

export const MidiaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAudioType, setSelectedAudioType] = useState<string | null>(null);
  const [selectedVideoType, setSelectedVideoType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [midia, setMidia] = useState(midiaMock);

  // Filtrar mídia
  useEffect(() => {
    let filtered = midiaMock;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.tipo === selectedType);
    }

    if (selectedVideoType) {
      filtered = filtered.filter(item => item.videoType === selectedVideoType);
    }

    if (selectedAudioType) {
      filtered = filtered.filter(item => item.audioType === selectedAudioType);
    }

    setMidia(filtered);
  }, [searchTerm, selectedType, selectedAudioType, selectedVideoType]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType(null);
    setSelectedAudioType(null);
    setSelectedVideoType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Mídia Baluarte
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Vídeos, áudios e imagens para edificar sua fé
            </p>

            {/* Barra de pesquisa */}
            <div className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Pesquisar mensagens, músicas, estudos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Botão de filtros mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 rounded-lg text-white"
            >
              <FiFilter />
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="py-12 container-custom">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de filtros - Desktop */}
          <motion.aside 
            className="hidden md:block w-72 flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiFilter className="text-primary" />
                  Filtros
                </h3>
                {(searchTerm || selectedType || selectedAudioType) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <FiX size={16} />
                    Limpar
                  </button>
                )}
              </div>

              {/* Tipo de Mídia */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">Tipo de Mídia</h4>
                <div className="space-y-2">
                  {midiaTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          selectedType === type.value
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center text-white`}>
                          <Icon size={16} />
                        </div>
                        <span className="flex-1 text-left">{type.label}</span>
                        <span className="text-xs opacity-75">
                          {midiaMock.filter(m => m.tipo === type.value).length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de Áudio (condicional) */}
              {(!selectedType || selectedType === "AUDIO") && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Categorias de Áudio</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {audioTypes.map((type) => {
                      const Icon = type.icon;
                      const count = midiaMock.filter(m => m.audioType === type.value).length;
                      
                      return (
                        <button
                          key={type.value}
                          onClick={() => setSelectedAudioType(selectedAudioType === type.value ? null : type.value)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            selectedAudioType === type.value
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center text-white`}>
                            <Icon size={16} />
                          </div>
                          <span className="flex-1 text-left">{type.label}</span>
                          <span className="text-xs opacity-75">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {(!selectedType || selectedType === "VIDEO") && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 text-gray-700">Categorias de Vídeo</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {videoTypes.map((type) => {
                      const Icon = type.icon;
                      const count = midiaMock.filter(m => m.videoType === type.value).length;

                      return (
                        <button
                          key={type.value}
                          onClick={() => setSelectedVideoType(selectedVideoType === type.value ? null : type.value)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            selectedVideoType === type.value
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center text-white`}>
                            <Icon size={16} />
                          </div>
                          <span className="flex-1 text-left">{type.label}</span>
                          <span className="text-xs opacity-75">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>

          {/* Filtros mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden bg-white rounded-2xl shadow-lg p-4 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Filtros</h3>
                  {(searchTerm || selectedType || selectedAudioType) && (
                    <button onClick={clearFilters} className="text-primary text-sm">
                      Limpar
                    </button>
                  )}
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Tipo</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {midiaTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                          className={`flex flex-col items-center p-2 rounded-lg ${
                            selectedType === type.value
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-xs mt-1">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(!selectedType || selectedType === "AUDIO") && (
                  <div>
                    <h4 className="font-semibold mb-2">Categoria de Áudio</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {audioTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setSelectedAudioType(selectedAudioType === type.value ? null : type.value)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                              selectedAudioType === type.value
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <Icon size={16} />
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(!selectedType || selectedType === "VIDEO") && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Categoria de Vídeo</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {videoTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setSelectedVideoType(selectedVideoType === type.value ? null : type.value)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                              selectedVideoType === type.value
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <Icon size={16} />
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid de mídia */}
          <motion.div
            className="flex-1"
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate="visible"
          >
            {/* Contador de resultados */}
            <div className="mb-4 text-gray-600">
              {midia.length} {midia.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </div>

            {midia.length === 0 ? (
              <motion.div
                className="text-center py-20 bg-white rounded-2xl shadow"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <FiPlay className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum item encontrado</h3>
                <p className="text-gray-500 mb-4">Tente buscar com outros termos ou limpar os filtros</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Limpar filtros
                </button>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {midia.map((item) => {
                  const typeInfo = midiaTypes.find(t => t.value === item.tipo);
                  const audioTypeInfo = item.audioType ? audioTypes.find(t => t.value === item.audioType) : null;
                  const videoTypeInfo = item.videoType ? videoTypes.find(t => t.value === item.videoType) : null;
                  const categoryInfo = item.tipo === "VIDEO" ? videoTypeInfo : item.tipo === "AUDIO" ? audioTypeInfo : null;
                  const Icon = typeInfo?.icon || FiPlay;
                  
                  return (
                    <motion.div
                      key={item.id}
                      variants={fadeInUp}
                      className="group"
                    >
                      <Link to={`/midia/${item.id}`}>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                          {/* Thumbnail */}
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={item.imagem}
                              alt={item.titulo}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            
                            {/* Overlay com ícone */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                <Icon className="text-white text-2xl" />
                              </div>
                            </div>

                            {/* Badge de tipo */}
                            <div className={`absolute top-3 left-3 ${typeInfo?.color} text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1`}>
                              <Icon size={12} />
                              {typeInfo?.label}
                            </div>

                            {/* Badge de duração (para vídeo/áudio) */}
                            {item.duracao && (
                              <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                                <FiClock size={12} />
                                {item.duracao}
                              </div>
                            )}

                            {/* Badge de qualidade (para vídeo) */}
                            {item.qualidade && (
                              <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 rounded-lg text-xs">
                                {item.qualidade}
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-4">
                            {categoryInfo && (
                              <div className="flex items-center gap-1 mb-2">
                                <div className={`w-5 h-5 ${categoryInfo.color} rounded flex items-center justify-center text-white`}>
                                  <categoryInfo.icon size={12} />
                                </div>
                                <span className="text-xs text-gray-500">{categoryInfo.label}</span>
                              </div>
                            )}

                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                              {item.titulo}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.descricao}
                            </p>

                            {/* Metadados */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <FiEye size={12} />
                                  {item.visualizacoes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiCalendar size={12} />
                                  {new Date(item.data).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              {item.pregador && (
                                <span className="flex items-center gap-1">
                                  <FiUser size={12} />
                                  {item.pregador.split(' ')[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
