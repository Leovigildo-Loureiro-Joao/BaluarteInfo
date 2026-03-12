// src/pages/Actividades/ActividadeDetails.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  FiCalendar, 
  FiMapPin, 
  FiUser, 
  FiClock,
  FiEye,
  FiMessageCircle,
  FiShare2,
  FiHeart,
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
  FiPlay,
  FiImage,
  FiDownload,
  FiMoreVertical,
  FiFlag
} from "react-icons/fi";
import { 
  GiDuration, 
  GiPartyPopper, 
  GiPrayer, 
  GiHeartBeats,
  GiFamilyHouse,
  GiVideoCamera,
  GiPhotoCamera
} from "react-icons/gi";
import { LiaBibleSolid, LiaChairSolid } from "react-icons/lia";

// Tipos (reutilizar os mesmos)
enum TipoActividade {
  Culto = 'Culto',
  Evento = 'Evento',
  Escola = 'Escola',
  Jovens = 'Jovens',
  Familia = 'Família',
  Louvor = 'Louvor',
  Oracao = 'Oração'
}

enum PublicoActividade {
  Todos = 'Todos',
  Jovens = 'Jovens',
  Adultos = 'Adultos',
  Crianças = 'Crianças',
  Idosos = 'Idosos',
  Mulheres = 'Mulheres',
  Homens = 'Homens',
  Casais = 'Casais'
}

enum DuracaoActividade {
  Mensal = 'Mensal',
  Anual = 'Anual',
  Projecto = 'Projecto'
}

// Interface do Trailler
interface Trailler {
  id: string;
  videoId: string; // ID do vídeo existente
  titulo: string;
  thumbnail: string;
  duracao: string;
}

// Interface da Imagem (Galeria)
interface ImagemGaleria {
  id: string;
  url: string;
  titulo: string;
  data: string;
  tamanho: string;
}

// Interface do Comentário
interface Comentario {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioAvatar: string;
  texto: string;
  data: string;
  likes: number;
  isAdmin?: boolean;
  isAutor?: boolean;
  respostas?: Comentario[];
}

// Interface da Actividade (completa)
interface Actividade {
  id: string;
  titulo: string;
  descricao: string;
  tema: string;
  tipo: TipoActividade;
  publico: PublicoActividade;
  duracao: DuracaoActividade;
  dataInicio: string;
  dataFim?: string;
  horario: string;
  endereco: string;
  organizador: string;
  contato: string;
  email?: string;
  imagem: string;
  visualizacoes: number;
  inscritos: number;
  capacidade?: number;
  tags: string[];
  traillers?: Trailler[];
  galeria?: ImagemGaleria[];
  comentarios: Comentario[];
}

// Dados mockados
const actividadeMock: Actividade = {
  id: '1',
  titulo: "Conferência de Jovens",
  descricao: "Três dias de louvor, palavra e comunhão para a juventude que busca um encontro genuíno com Deus. Teremos preletores convidados, banda de louvor, momentos de oração e muito mais.",
  tema: "Fogo e Unção",
  tipo: TipoActividade.Jovens,
  publico: PublicoActividade.Jovens,
  duracao: DuracaoActividade.Anual,
  dataInicio: "2024-03-22",
  dataFim: "2024-03-24",
  horario: "20:00",
  endereco: "Igreja Baluarte - Auditório Principal, Rua da Igreja, 123 - Centro",
  organizador: "Pr. João Santos",
  contato: "(11) 98765-4321",
  email: "jovens@igrejabaluarte.com",
  imagem: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  visualizacoes: 2341,
  inscritos: 156,
  capacidade: 300,
  tags: ["jovens", "conferência", "avivamento", "fogo"],
  traillers: [
    {
      id: 't1',
      videoId: 'v1',
      titulo: 'Trailler Oficial - Conferência de Jovens 2024',
      thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
      duracao: '1:30'
    }
  ],
  galeria: [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
      titulo: 'Palco montado para o evento',
      data: '2024-03-15',
      tamanho: '2.3 MB'
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      titulo: 'Equipe de louvor ensaiando',
      data: '2024-03-14',
      tamanho: '1.8 MB'
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80',
      titulo: 'Momento de oração',
      data: '2024-03-13',
      tamanho: '2.1 MB'
    }
  ],
  comentarios: [
    {
      id: 'c1',
      usuarioId: 'user1',
      usuarioNome: 'João Silva',
      usuarioAvatar: 'https://i.pravatar.cc/150?img=1',
      texto: 'Mal posso esperar por esse evento! Deus vai fazer algo extraordinário.',
      data: '2024-03-10T14:30:00',
      likes: 12,
      respostas: [
        {
          id: 'c1r1',
          usuarioId: 'admin1',
          usuarioNome: 'Pr. João Santos',
          usuarioAvatar: 'https://i.pravatar.cc/150?img=2',
          texto: 'Amém, irmão! Será um tempo especial. Estaremos orando por todos.',
          data: '2024-03-10T15:45:00',
          likes: 5,
          isAdmin: true
        }
      ]
    },
    {
      id: 'c2',
      usuarioId: 'user2',
      usuarioNome: 'Maria Oliveira',
      usuarioAvatar: 'https://i.pravatar.cc/150?img=3',
      texto: 'Vou levar minha célula inteira! Deus tem preparado algo grande.',
      data: '2024-03-09T09:15:00',
      likes: 8,
      isAutor: true
    },
    {
      id: 'c3',
      usuarioId: 'user3',
      usuarioNome: 'Pedro Santos',
      usuarioAvatar: 'https://i.pravatar.cc/150?img=4',
      texto: 'Alguém sabe se vai ter tradução em libras?',
      data: '2024-03-08T22:10:00',
      likes: 3
    }
  ]
};

// Mock de vídeos existentes (para selecionar trailler)
const videosExistentes = [
  {
    id: 'v1',
    titulo: 'Culto de Domingo - A Vitória é Certa',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    duracao: '45:30'
  },
  {
    id: 'v2',
    titulo: 'Estudo Bíblico - Romanos 8',
    thumbnail: 'https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=800&q=80',
    duracao: '58:20'
  },
  {
    id: 'v3',
    titulo: 'Podcast: Juventude e Fé',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    duracao: '32:15'
  }
];

// Componente de Seleção de Trailler
const ModalSelecionarTrailler = ({ 
  onClose, 
  onSelect 
}: { 
  onClose: () => void; 
  onSelect: (video: any) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GiVideoCamera className="text-primary-500" />
              Selecionar Vídeo para Trailler
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {videosExistentes.map((video) => (
              <button
                key={video.id}
                onClick={() => onSelect(video)}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left border border-gray-200"
              >
                <img
                  src={video.thumbnail}
                  alt={video.titulo}
                  className="w-20 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{video.titulo}</h4>
                  <p className="text-sm text-gray-500">Duração: {video.duracao}</p>
                </div>
                <FiPlay className="text-primary-500" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente de Comentário
const ComentarioItem = ({ 
  comentario, 
  nivel = 0,
  onResponder,
  onExcluir,
  usuarioAtual = 'user2' // Mock: usuário atual
}: { 
  comentario: Comentario; 
  nivel?: number;
  onResponder: (comentarioId: string, texto: string) => void;
  onExcluir: (comentarioId: string) => void;
  usuarioAtual?: string;
}) => {
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [textoResposta, setTextoResposta] = useState('');
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);

  const handleResponder = () => {
    if (textoResposta.trim()) {
      onResponder(comentario.id, textoResposta);
      setTextoResposta('');
      setMostrarResposta(false);
    }
  };

  const podeExcluir = usuarioAtual === comentario.usuarioId || comentario.isAdmin;

  return (
    <div className={`${nivel > 0 ? 'ml-12' : ''}`}>
      <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
        <img
          src={comentario.usuarioAvatar}
          alt={comentario.usuarioNome}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">{comentario.usuarioNome}</h4>
              {comentario.isAdmin && (
                <span className="bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
              {comentario.isAutor && (
                <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                  Autor
                </span>
              )}
              <span className="text-xs text-gray-500">
                {new Date(comentario.data).toLocaleDateString('pt-BR')} às {' '}
                {new Date(comentario.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setMostrarOpcoes(!mostrarOpcoes)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiMoreVertical size={16} className="text-gray-500" />
              </button>
              
              <AnimatePresence>
                {mostrarOpcoes && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-32 z-10"
                  >
                    {podeExcluir && (
                      <button
                        onClick={() => {
                          onExcluir(comentario.id);
                          setMostrarOpcoes(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FiTrash2 size={14} />
                        Excluir
                      </button>
                    )}
                    <button
                      onClick={() => setMostrarOpcoes(false)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiFlag size={14} />
                      Reportar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-2">{comentario.texto}</p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-500 transition-colors">
              <FiHeart size={14} />
              {comentario.likes}
            </button>
            <button
              onClick={() => setMostrarResposta(!mostrarResposta)}
              className="text-xs text-gray-500 hover:text-primary-500 transition-colors"
            >
              Responder
            </button>
          </div>

          {/* Resposta inline */}
          <AnimatePresence>
            {mostrarResposta && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex gap-2"
              >
                <input
                  type="text"
                  value={textoResposta}
                  onChange={(e) => setTextoResposta(e.target.value)}
                  placeholder="Escreva sua resposta..."
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  autoFocus
                />
                <button
                  onClick={handleResponder}
                  className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
                >
                  Enviar
                </button>
                <button
                  onClick={() => setMostrarResposta(false)}
                  className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300"
                >
                  <FiX size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Respostas existentes */}
      {comentario.respostas && comentario.respostas.length > 0 && (
        <div className="mt-3 space-y-3">
          {comentario.respostas.map((resposta) => (
            <ComentarioItem
              key={resposta.id}
              comentario={resposta}
              nivel={nivel + 1}
              onResponder={onResponder}
              onExcluir={onExcluir}
              usuarioAtual={usuarioAtual}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente de Galeria
const GaleriaActividade = ({ 
  imagens, 
  onAdicionar,
  onRemover,
  onDownload
}: { 
  imagens: ImagemGaleria[];
  onAdicionar: () => void;
  onRemover: (id: string) => void;
  onDownload: (imagem: ImagemGaleria) => void;
}) => {
  const [imagemSelecionada, setImagemSelecionada] = useState<ImagemGaleria | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Galeria de Imagens</h3>
        <button
          onClick={onAdicionar}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
        >
          <FiPlus size={16} />
          Adicionar Imagem
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {imagens.map((img) => (
          <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden">
            <img
              src={img.url}
              alt={img.titulo}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setImagemSelecionada(img)}
            />
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => onDownload(img)}
                className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                title="Download"
              >
                <FiDownload size={14} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Remover esta imagem da galeria?')) {
                    onRemover(img.id);
                  }
                }}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                title="Remover"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Visualizador de imagem */}
      <AnimatePresence>
        {imagemSelecionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={() => setImagemSelecionada(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imagemSelecionada.url}
                alt={imagemSelecionada.titulo}
                className="max-w-full max-h-[80vh] mx-auto rounded-lg"
              />
              <div className="text-center text-white mt-4">
                <p className="font-medium">{imagemSelecionada.titulo}</p>
                <p className="text-sm text-gray-400">
                  {new Date(imagemSelecionada.data).toLocaleDateString('pt-BR')} • {imagemSelecionada.tamanho}
                </p>
              </div>
              <button
                onClick={() => setImagemSelecionada(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white"
              >
                <FiX size={30} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente Principal
export const ActividadeDetails = () => {
  const { id } = useParams();
  const [actividade, setActividade] = useState<Actividade | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'comentarios' | 'galeria'>('info');
  const [showTraillerModal, setShowTraillerModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setActividade(actividadeMock);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAdicionarTrailler = (video: any) => {
    if (!actividade) return;
    
    const novoTrailler: Trailler = {
      id: `t${Date.now()}`,
      videoId: video.id,
      titulo: video.titulo,
      thumbnail: video.thumbnail,
      duracao: video.duracao
    };

    setActividade({
      ...actividade,
      traillers: [...(actividade.traillers || []), novoTrailler]
    });
    setShowTraillerModal(false);
  };

  const handleRemoverTrailler = (traillerId: string) => {
    if (!actividade) return;
    
    if (window.confirm('Remover este trailler?')) {
      setActividade({
        ...actividade,
        traillers: actividade.traillers?.filter(t => t.id !== traillerId)
      });
    }
  };

  const handleAdicionarComentario = () => {
    if (!actividade || !novoComentario.trim()) return;

    const comentario: Comentario = {
      id: `c${Date.now()}`,
      usuarioId: 'user2', // Mock: usuário atual
      usuarioNome: 'Maria Oliveira',
      usuarioAvatar: 'https://i.pravatar.cc/150?img=3',
      texto: novoComentario,
      data: new Date().toISOString(),
      likes: 0,
      isAutor: true
    };

    setActividade({
      ...actividade,
      comentarios: [comentario, ...actividade.comentarios]
    });
    setNovoComentario('');
  };

  const handleResponderComentario = (comentarioId: string, texto: string) => {
    if (!actividade) return;

    const resposta: Comentario = {
      id: `r${Date.now()}`,
      usuarioId: 'admin1', // Mock: admin
      usuarioNome: 'Pr. João Santos',
      usuarioAvatar: 'https://i.pravatar.cc/150?img=2',
      texto: texto,
      data: new Date().toISOString(),
      likes: 0,
      isAdmin: true
    };

    const atualizarComentarios = (comentarios: Comentario[]): Comentario[] => {
      return comentarios.map(c => {
        if (c.id === comentarioId) {
          return {
            ...c,
            respostas: [...(c.respostas || []), resposta]
          };
        }
        if (c.respostas) {
          return {
            ...c,
            respostas: atualizarComentarios(c.respostas)
          };
        }
        return c;
      });
    };

    setActividade({
      ...actividade,
      comentarios: atualizarComentarios(actividade.comentarios)
    });
  };

  const handleExcluirComentario = (comentarioId: string) => {
    if (!actividade) return;

    const excluirRecursivo = (comentarios: Comentario[]): Comentario[] => {
      return comentarios.filter(c => {
        if (c.id === comentarioId) return false;
        if (c.respostas) {
          c.respostas = excluirRecursivo(c.respostas);
        }
        return true;
      });
    };

    setActividade({
      ...actividade,
      comentarios: excluirRecursivo(actividade.comentarios)
    });
  };

  const handleAdicionarImagem = () => {
    // Mock: adicionar imagem
    const novaImagem: ImagemGaleria = {
      id: `g${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      titulo: 'Nova imagem adicionada',
      data: new Date().toISOString().split('T')[0],
      tamanho: '1.5 MB'
    };

    setActividade({
      ...actividade!,
      galeria: [...(actividade!.galeria || []), novaImagem]
    });
  };

  const handleRemoverImagem = (imagemId: string) => {
    setActividade({
      ...actividade!,
      galeria: actividade!.galeria?.filter(img => img.id !== imagemId)
    });
  };

  const handleDownloadImagem = (imagem: ImagemGaleria) => {
    const link = document.createElement('a');
    link.href = imagem.url;
    link.download = `${imagem.titulo}.jpg`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!actividade) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Actividade não encontrada</h2>
          <Link to="admin/actividades" className="text-primary-500 hover:underline">
            Voltar para actividades
          </Link>
        </div>
      </div>
    );
  }

  const tipoConfig: Record<TipoActividade, { icon: any; cor: string; label: string }> = {
    [TipoActividade.Culto]: { icon: GiPrayer, cor: "bg-purple-500", label: "Culto" },
    [TipoActividade.Evento]: { icon: GiPartyPopper, cor: "bg-pink-500", label: "Evento Especial" },
    [TipoActividade.Escola]: { icon: LiaBibleSolid, cor: "bg-blue-500", label: "Escola Bíblica" },
    [TipoActividade.Jovens]: { icon: GiHeartBeats, cor: "bg-green-500", label: "Juventude" },
    [TipoActividade.Familia]: { icon: GiFamilyHouse, cor: "bg-amber-500", label: "Família" },
    [TipoActividade.Louvor]: { icon: LiaChairSolid, cor: "bg-indigo-500", label: "Louvor" },
    [TipoActividade.Oracao]: { icon: GiPrayer, cor: "bg-red-500", label: "Oração" }
  };

  const config = tipoConfig[actividade.tipo];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={actividade.imagem}
          alt={actividade.titulo}
          className="w-full h-full object-cover rounded-t-xl  "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${config.cor} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
              <Icon size={12} />
              {config.label}
            </span>
            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {actividade.duracao}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{actividade.titulo}</h1>
          <p className="text-xl text-white/90">{actividade.tema}</p>
        </div>

        {/* Back button */}
        <Link
          to="/admin/actividades"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
        >
          <FiArrowLeft size={18} />
          Voltar
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container-custom">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'info'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('comentarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'comentarios'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiMessageCircle size={16} />
              Comentários ({actividade.comentarios.length})
            </button>
            <button
              onClick={() => setActiveTab('galeria')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'galeria'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <GiPhotoCamera size={16} />
              Galeria ({actividade.galeria?.length || 0})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Descrição */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Sobre o evento</h2>
                  <p className="text-gray-700 leading-relaxed">{actividade.descricao}</p>
                </div>

                {/* Trailers */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <GiVideoCamera className="text-primary-500" />
                      Trailers
                    </h2>
                    <button
                      onClick={() => setShowTraillerModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
                    >
                      <FiPlus size={16} />
                      Adicionar Trailler
                    </button>
                  </div>

                  {actividade.traillers && actividade.traillers.length > 0 ? (
                    <div className="space-y-3">
                      {actividade.traillers.map((trailler) => (
                        <div key={trailler.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={trailler.thumbnail}
                            alt={trailler.titulo}
                            className="w-32 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{trailler.titulo}</h3>
                            <p className="text-sm text-gray-500">Duração: {trailler.duracao}</p>
                          </div>
                          <button
                            onClick={() => handleRemoverTrailler(trailler.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum trailler adicionado ainda.
                    </p>
                  )}
                </div>

                {/* Informações detalhadas */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Detalhes</h2>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-gray-500">Data</dt>
                      <dd className="font-medium">
                        {new Date(actividade.dataInicio).toLocaleDateString('pt-BR')}
                        {actividade.dataFim && ` - ${new Date(actividade.dataFim).toLocaleDateString('pt-BR')}`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Horário</dt>
                      <dd className="font-medium">{actividade.horario}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Público-alvo</dt>
                      <dd className="font-medium">{actividade.publico}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Duração</dt>
                      <dd className="font-medium">{actividade.duracao}</dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            )}

            {activeTab === 'comentarios' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiMessageCircle className="text-primary-500" />
                  Comentários
                </h2>

                {/* Novo comentário */}
                <div className="flex gap-3 mb-8">
                  <img
                    src="https://i.pravatar.cc/150?img=3"
                    alt="Seu avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      placeholder="Escreva um comentário..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAdicionarComentario}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
                      >
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de comentários */}
                <div className="space-y-6">
                  {actividade.comentarios.map((comentario) => (
                    <ComentarioItem
                      key={comentario.id}
                      comentario={comentario}
                      onResponder={handleResponderComentario}
                      onExcluir={handleExcluirComentario}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'galeria' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <GaleriaActividade
                  imagens={actividade.galeria || []}
                  onAdicionar={handleAdicionarImagem}
                  onRemover={handleRemoverImagem}
                  onDownload={handleDownloadImagem}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card de Inscrição */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Participação</h3>
              
              {actividade.capacidade && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Vagas</span>
                    <span className="font-medium">{actividade.inscritos}/{actividade.capacidade}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(actividade.inscritos / actividade.capacidade) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <button className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors mb-3">
                Inscrever-se
              </button>
              <button className="w-full border border-primary-500 text-primary-500 py-3 rounded-xl font-medium hover:bg-primary-50 transition-colors">
                Compartilhar
              </button>
            </div>

            {/* Localização */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiMapPin className="text-primary-500" />
                Local
              </h3>
              <p className="text-gray-600 text-sm mb-2">{actividade.endereco}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(actividade.endereco)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 text-sm hover:underline"
              >
                Ver no mapa
              </a>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiUser className="text-primary-500" />
                Organizador
              </h3>
              <p className="font-medium mb-2">{actividade.organizador}</p>
              
              <div className="space-y-2">
                <a href={`tel:${actividade.contato}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <FiPhone size={14} />
                  <span className="text-sm">{actividade.contato}</span>
                </a>
                {actividade.email && (
                  <a href={`mailto:${actividade.email}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors">
                    <FiMail size={14} />
                    <span className="text-sm">{actividade.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {actividade.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de seleção de trailler */}
      <AnimatePresence>
        {showTraillerModal && (
          <ModalSelecionarTrailler
            onClose={() => setShowTraillerModal(false)}
            onSelect={handleAdicionarTrailler}
          />
        )}
      </AnimatePresence>
    </div>
  );
};