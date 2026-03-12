// src/pages/Admin/ComentariosPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageSquare,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiFilter,
  FiUser,
  FiCalendar,
  FiClock,
  FiMoreVertical,
  FiAlertCircle,
  FiFlag,
  FiBookOpen,
  FiVideo,
  FiHeadphones,
  FiCalendar as FiCalendarIcon
} from "react-icons/fi";
import { 
  GiMicrophone, 
  GiPartyPopper 
} from "react-icons/gi";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LiaBibleSolid } from "react-icons/lia";

// Tipos de seções
enum SecaoTipo {
  ARTIGO = 'ARTIGO',
  MIDIA = 'MIDIA',
  ACTIVIDADE = 'ACTIVIDADE'
}

// Interface do comentário
interface Comentario {
  id: string;
  secaoTipo: SecaoTipo;
  secaoId: string;
  secaoTitulo: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioAvatar?: string;
  texto: string;
  data: string;
  likes: number;
  status: 'ativo' | 'oculto' | 'denunciado';
  denuncias?: number;
  respostas?: number;
}

// Dados mockados
const comentariosMock: Comentario[] = [
  {
    id: '1',
    secaoTipo: SecaoTipo.ARTIGO,
    secaoId: 'art1',
    secaoTitulo: 'A Soberania de Deus em Tempos de Crise',
    usuarioNome: 'João Silva',
    usuarioEmail: 'joao.silva@email.com',
    usuarioAvatar: 'https://i.pravatar.cc/150?img=1',
    texto: 'Excelente artigo! Me ajudou muito em minhas reflexões matinais. Deus abençoe.',
    data: '2024-03-12T10:30:00',
    likes: 12,
    status: 'ativo',
    respostas: 2
  },
  {
    id: '2',
    secaoTipo: SecaoTipo.ARTIGO,
    secaoId: 'art1',
    secaoTitulo: 'A Soberania de Deus em Tempos de Crise',
    usuarioNome: 'Maria Oliveira',
    usuarioEmail: 'maria.oliveira@email.com',
    usuarioAvatar: 'https://i.pravatar.cc/150?img=2',
    texto: 'Compartilhei com meu grupo de estudos. Palavra poderosa!',
    data: '2024-03-11T15:45:00',
    likes: 8,
    status: 'ativo'
  },
  {
    id: '3',
    secaoTipo: SecaoTipo.MIDIA,
    secaoId: 'vid1',
    secaoTitulo: 'Culto de Domingo - A Vitória é Certa',
    usuarioNome: 'Pedro Santos',
    usuarioEmail: 'pedro.santos@email.com',
    usuarioAvatar: 'https://i.pravatar.cc/150?img=3',
    texto: 'Esse vídeo mudou minha semana! Glória a Deus!',
    data: '2024-03-10T20:15:00',
    likes: 23,
    status: 'ativo',
    respostas: 1
  },
  {
    id: '4',
    secaoTipo: SecaoTipo.ACTIVIDADE,
    secaoId: 'atv1',
    secaoTitulo: 'Conferência de Jovens',
    usuarioNome: 'Ana Carolina',
    usuarioEmail: 'ana.carolina@email.com',
    usuarioAvatar: 'https://i.pravatar.cc/150?img=4',
    texto: 'Mal posso esperar por esse evento! Vai ser incrível!',
    data: '2024-03-09T09:20:00',
    likes: 15,
    status: 'ativo'
  },
  {
    id: '5',
    secaoTipo: SecaoTipo.ARTIGO,
    secaoId: 'art2',
    secaoTitulo: 'O Poder da Oração Intercessória',
    usuarioNome: 'Lucas Mendes',
    usuarioEmail: 'lucas.mendes@email.com',
    usuarioAvatar: 'https://i.pravatar.cc/150?img=5',
    texto: 'Texto com informações erradas sobre o tema. Não recomendo.',
    data: '2024-03-08T14:30:00',
    likes: 2,
    status: 'denunciado',
    denuncias: 3
  },
  {
    id: '6',
    secaoTipo: SecaoTipo.MIDIA,
    secaoId: 'aud1',
    secaoTitulo: 'Podcast: Juventude e Fé',
    usuarioNome: 'Carla Souza',
    usuarioEmail: 'carla.souza@email.com',
    usuarioAvatar: 'https://i.pravatar.cc/150?img=6',
    texto: 'Conteúdo impróprio para a igreja. Deveriam revisar.',
    data: '2024-03-07T22:10:00',
    likes: 1,
    status: 'denunciado',
    denuncias: 5
  },
  {
    id: '7',
    secaoTipo: SecaoTipo.MIDIA,
    secaoId: 'vid2',
    secaoTitulo: 'Estudo Bíblico - Romanos 8',
    usuarioNome: 'Roberto Alves',
    usuarioEmail: 'roberto.alves@email.com',
    texto: 'Comentário removido por violar as diretrizes.',
    data: '2024-03-06T11:40:00',
    likes: 0,
    status: 'oculto'
  }
];

// Modal de Detalhes do Comentário
const ModalComentarioDetalhe = ({ 
  comentario, 
  onClose, 
  onOcultar,
  onExcluir,
  onMarcarResolvido
}: { 
  comentario: Comentario; 
  onClose: () => void; 
  onOcultar: (id: string) => void;
  onExcluir: (id: string) => void;
  onMarcarResolvido: (id: string) => void;
}) => {
  const getSecaoIcon = (tipo: SecaoTipo) => {
    switch(tipo) {
      case SecaoTipo.ARTIGO: return <LiaBibleSolid className="text-blue-500" size={20} />;
      case SecaoTipo.MIDIA: return <FiVideo className="text-green-500" size={20} />;
      case SecaoTipo.ACTIVIDADE: return <GiPartyPopper className="text-purple-500" size={20} />;
    }
  };

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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiMessageSquare className="text-primary-500" />
              Detalhes do Comentário
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          {/* Seção de origem */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
            {getSecaoIcon(comentario.secaoTipo)}
            <div>
              <p className="text-sm text-gray-500">Publicado em:</p>
              <p className="font-medium">{comentario.secaoTitulo}</p>
            </div>
            <span className={`ml-auto text-xs px-3 py-1 rounded-full ${
              comentario.status === 'ativo' ? 'bg-green-100 text-green-600' :
              comentario.status === 'oculto' ? 'bg-gray-100 text-gray-600' :
              'bg-red-100 text-red-600'
            }`}>
              {comentario.status === 'ativo' ? 'Ativo' :
               comentario.status === 'oculto' ? 'Oculto' :
               'Denunciado'}
            </span>
          </div>

          {/* Autor */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={comentario.usuarioAvatar || 'https://via.placeholder.com/50'}
              alt={comentario.usuarioNome}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{comentario.usuarioNome}</h3>
              <p className="text-sm text-gray-500">{comentario.usuarioEmail}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <FiClock size={12} />
                {formatDistanceToNow(new Date(comentario.data), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Comentário */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700">{comentario.texto}</p>
          </div>

          {/* Estatísticas */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiMessageSquare size={16} />
              {comentario.respostas || 0} respostas
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiAlertCircle size={16} />
              {comentario.likes} likes
            </div>
            {comentario.denuncias && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <FiFlag size={16} />
                {comentario.denuncias} denúncias
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t">
            {comentario.status === 'ativo' && (
              <button
                onClick={() => {
                  onOcultar(comentario.id);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2"
              >
                <FiEyeOff size={18} />
                Ocultar Comentário
              </button>
            )}

            {comentario.status === 'denunciado' && (
              <button
                onClick={() => {
                  onMarcarResolvido(comentario.id);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <FiCheck size={18} />
                Marcar como Resolvido
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
                  onExcluir(comentario.id);
                  onClose();
                }
              }}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <FiTrash2 size={18} />
              Excluir Permanentemente
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Card de Comentário
const ComentarioCard = ({ 
  comentario, 
  onVerDetalhe,
  onOcultar,
  onExcluir 
}: { 
  comentario: Comentario; 
  onVerDetalhe: (comentario: Comentario) => void;
  onOcultar: (id: string) => void;
  onExcluir: (id: string) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getSecaoIcon = (tipo: SecaoTipo) => {
    switch(tipo) {
      case SecaoTipo.ARTIGO: return <LiaBibleSolid className="text-blue-500" size={14} />;
      case SecaoTipo.MIDIA: return <FiVideo className="text-green-500" size={14} />;
      case SecaoTipo.ACTIVIDADE: return <GiPartyPopper className="text-purple-500" size={14} />;
    }
  };

  const getSecaoLabel = (tipo: SecaoTipo) => {
    switch(tipo) {
      case SecaoTipo.ARTIGO: return 'Artigo';
      case SecaoTipo.MIDIA: return 'Mídia';
      case SecaoTipo.ACTIVIDADE: return 'Actividade';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl p-5 border-l-4 ${
        comentario.status === 'denunciado' ? 'border-l-red-500' :
        comentario.status === 'oculto' ? 'border-l-gray-500' :
        'border-l-green-500'
      } shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <img
          src={comentario.usuarioAvatar || 'https://via.placeholder.com/40'}
          alt={comentario.usuarioNome}
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{comentario.usuarioNome}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comentario.data), { addSuffix: true, locale: ptBR })}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                {comentario.texto}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  {getSecaoIcon(comentario.secaoTipo)}
                  {getSecaoLabel(comentario.secaoTipo)} • {comentario.secaoTitulo}
                </span>
                {comentario.respostas && (
                  <span>💬 {comentario.respostas} respostas</span>
                )}
                {comentario.denuncias && (
                  <span className="text-red-500 flex items-center gap-1">
                    <FiFlag size={12} />
                    {comentario.denuncias} denúncias
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiMoreVertical size={16} className="text-gray-500" />
              </button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-40 z-10"
                  >
                    <button
                      onClick={() => {
                        onVerDetalhe(comentario);
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiEye size={14} />
                      Ver detalhes
                    </button>
                    {comentario.status === 'ativo' && (
                      <button
                        onClick={() => {
                          onOcultar(comentario.id);
                          setShowOptions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                      >
                        <FiEyeOff size={14} />
                        Ocultar
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Excluir este comentário?')) {
                          onExcluir(comentario.id);
                        }
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiTrash2 size={14} />
                      Excluir
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal
export const ComentariosPage = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>(comentariosMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSecao, setFilterSecao] = useState<SecaoTipo | 'todas'>('todas');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'denunciado' | 'oculto'>('todos');
  const [selectedComentario, setSelectedComentario] = useState<Comentario | null>(null);
  const [showDetalheModal, setShowDetalheModal] = useState(false);

  // Estatísticas
  const stats = {
    total: comentarios.length,
    ativos: comentarios.filter(c => c.status === 'ativo').length,
    denunciados: comentarios.filter(c => c.status === 'denunciado').length,
    ocultos: comentarios.filter(c => c.status === 'oculto').length,
    artigos: comentarios.filter(c => c.secaoTipo === SecaoTipo.ARTIGO).length,
    midia: comentarios.filter(c => c.secaoTipo === SecaoTipo.MIDIA).length,
    atividades: comentarios.filter(c => c.secaoTipo === SecaoTipo.ACTIVIDADE).length
  };

  // Filtrar comentários
  const filteredComentarios = comentarios.filter(c => {
    // Busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        c.texto.toLowerCase().includes(term) ||
        c.usuarioNome.toLowerCase().includes(term) ||
        c.secaoTitulo.toLowerCase().includes(term);
      if (!matches) return false;
    }

    // Filtro por seção
    if (filterSecao !== 'todas' && c.secaoTipo !== filterSecao) return false;

    // Filtro por status
    if (filterStatus !== 'todos' && c.status !== filterStatus) return false;

    return true;
  });

  const handleOcultar = (id: string) => {
    setComentarios(comentarios.map(c => 
      c.id === id ? { ...c, status: 'oculto' } : c
    ));
  };

  const handleExcluir = (id: string) => {
    setComentarios(comentarios.filter(c => c.id !== id));
  };

  const handleMarcarResolvido = (id: string) => {
    setComentarios(comentarios.map(c => 
      c.id === id ? { ...c, status: 'ativo', denuncias: 0 } : c
    ));
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
            Moderação de Comentários
          </h1>
          <p className="text-gray-500">
            Gerencie todos os comentários de artigos, mídias e atividades
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-primary-500">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-green-500">
            <p className="text-sm text-gray-500">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-red-500">
            <p className="text-sm text-gray-500">Denunciados</p>
            <p className="text-2xl font-bold text-red-600">{stats.denunciados}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-gray-500">
            <p className="text-sm text-gray-500">Ocultos</p>
            <p className="text-2xl font-bold text-gray-600">{stats.ocultos}</p>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por comentário, usuário ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtro por seção */}
            <select
              value={filterSecao}
              onChange={(e) => setFilterSecao(e.target.value as SecaoTipo | 'todas')}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todas">Todas seções</option>
              <option value={SecaoTipo.ARTIGO}>Artigos</option>
              <option value={SecaoTipo.MIDIA}>Mídia</option>
              <option value={SecaoTipo.ACTIVIDADE}>Actividades</option>
            </select>

            {/* Filtro por status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todos">Todos status</option>
              <option value="ativo">Ativos</option>
              <option value="denunciado">Denunciados</option>
              <option value="oculto">Ocultos</option>
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredComentarios.length} {filteredComentarios.length === 1 ? 'comentário encontrado' : 'comentários encontrados'}
          </div>
        </div>

        {/* Lista de Comentários */}
        {filteredComentarios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <FiMessageSquare className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum comentário encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filterSecao !== 'todas' || filterStatus !== 'todos'
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Nenhum comentário para moderar'}
            </p>
            {(searchTerm || filterSecao !== 'todas' || filterStatus !== 'todos') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterSecao('todas');
                  setFilterStatus('todos');
                }}
                className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredComentarios.map((comentario) => (
                <ComentarioCard
                  key={comentario.id}
                  comentario={comentario}
                  onVerDetalhe={(c) => {
                    setSelectedComentario(c);
                    setShowDetalheModal(true);
                  }}
                  onOcultar={handleOcultar}
                  onExcluir={handleExcluir}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {showDetalheModal && selectedComentario && (
          <ModalComentarioDetalhe
            comentario={selectedComentario}
            onClose={() => {
              setShowDetalheModal(false);
              setSelectedComentario(null);
            }}
            onOcultar={handleOcultar}
            onExcluir={handleExcluir}
            onMarcarResolvido={handleMarcarResolvido}
          />
        )}
      </AnimatePresence>
    </div>
  );
};