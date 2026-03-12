// src/pages/Mensagens/MensagensPage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMail,
  FiSend,
  FiInbox,
  FiStar,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiClock,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiPaperclip,
  FiMoreVertical,
  FiRefreshCw,
  FiAlertCircle
} from "react-icons/fi";
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ModalResposta } from "../../components/mensagem/ModalMensagemResposta";

// Tipos baseados no backend
enum MensagemType {
  SEND = 'SEND',
  RECEIVED = 'RECEIVED'
}

enum StatusMensage {
  ENVIADO = 'ENVIADO',
  PENDENTE = 'PENDENTE',
  ERRO = 'ERRO'
}

interface Mensagem {
  id: number;
  descricao: string;
  assunto: string;
  destino: string;
  email: string; // remetente
  tipo: MensagemType;
  status: StatusMensage;
  lido: boolean;
  dataPublicacao: string;
  anexos?: string[];
}

// Dados mockados (simulando o backend)
const mensagensMock: Mensagem[] = [
  {
    id: 1,
    descricao: "Gostaria de saber mais sobre os horários dos cultos de quarta-feira. Estou querendo visitar a igreja com minha família.",
    assunto: "Dúvida sobre horários",
    destino: "admin@igrejabaluarte.com",
    email: "joao.silva@email.com",
    tipo: MensagemType.RECEIVED,
    status: StatusMensage.ENVIADO,
    lido: false,
    dataPublicacao: "2024-03-12T14:30:00"
  },
  {
    id: 2,
    descricao: "Preciso de oração pela minha saúde. Estou passando por um tratamento e gostaria que a igreja intercedesse por mim.",
    assunto: "Pedido de Oração",
    destino: "admin@igrejabaluarte.com",
    email: "maria.oliveira@email.com",
    tipo: MensagemType.RECEIVED,
    status: StatusMensage.ENVIADO,
    lido: true,
    dataPublicacao: "2024-03-11T09:15:00"
  },
  {
    id: 3,
    descricao: "Olá Maria, agradecemos sua mensagem. Estaremos em oração por você durante este período. Deus abençoe!",
    assunto: "Resposta: Pedido de Oração",
    destino: "maria.oliveira@email.com",
    email: "admin@igrejabaluarte.com",
    tipo: MensagemType.SEND,
    status: StatusMensage.ENVIADO,
    lido: true,
    dataPublicacao: "2024-03-11T10:30:00"
  },
  {
    id: 4,
    descricao: "Como faço para me inscrever na Conferência de Jovens? Ainda há vagas?",
    assunto: "Inscrição Evento",
    destino: "admin@igrejabaluarte.com",
    email: "pedro.santos@email.com",
    tipo: MensagemType.RECEIVED,
    status: StatusMensage.PENDENTE,
    lido: false,
    dataPublicacao: "2024-03-12T08:20:00"
  },
  {
    id: 5,
    descricao: "Segue em anexo o comprovante de pagamento do dízimo referente a fevereiro.",
    assunto: "Comprovante de Dízimo",
    destino: "admin@igrejabaluarte.com",
    email: "ana.carolina@email.com",
    tipo: MensagemType.RECEIVED,
    status: StatusMensage.ENVIADO,
    lido: true,
    dataPublicacao: "2024-03-10T16:45:00",
    anexos: ["comprovante.pdf"]
  }
];

// Modal de Resposta


// Componente de Card de Mensagem
const MensagemCard = ({ 
  mensagem, 
  onMarcarLido, 
  onResponder,
  onExcluir
}: { 
  mensagem: Mensagem; 
  onMarcarLido: (id: number) => void;
  onResponder: (mensagem: Mensagem) => void;
  onExcluir: (id: number) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getStatusColor = (status: StatusMensage) => {
    switch(status) {
      case StatusMensage.ENVIADO: return 'text-green-600 bg-green-50';
      case StatusMensage.PENDENTE: return 'text-yellow-600 bg-yellow-50';
      case StatusMensage.ERRO: return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: StatusMensage) => {
    switch(status) {
      case StatusMensage.ENVIADO: return 'Enviado';
      case StatusMensage.PENDENTE: return 'Pendente';
      case StatusMensage.ERRO: return 'Erro';
      default: return status;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl p-5 border-l-4 ${
        mensagem.tipo === MensagemType.SEND 
          ? 'border-l-blue-500' 
          : mensagem.lido 
            ? 'border-l-gray-300' 
            : 'border-l-primary-500'
      } shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        {/* Conteúdo principal */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Ícone de tipo */}
            {mensagem.tipo === MensagemType.SEND ? (
              <FiSend className="text-blue-500" size={18} />
            ) : (
              <FiInbox className={mensagem.lido ? 'text-gray-400' : 'text-primary-500'} size={18} />
            )}
            
            {/* Assunto */}
            <h3 className={`font-semibold ${!mensagem.lido && mensagem.tipo === MensagemType.RECEIVED ? 'text-primary-700' : 'text-gray-700'}`}>
              {mensagem.assunto}
            </h3>

            {/* Status */}
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(mensagem.status)}`}>
              {getStatusLabel(mensagem.status)}
            </span>

            {/* Não lido badge */}
            {!mensagem.lido && mensagem.tipo === MensagemType.RECEIVED && (
              <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                Novo
              </span>
            )}
          </div>

          {/* Remetente/Destinatário */}
          <div className="flex items-center gap-4 mb-2 text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <FiUser size={14} />
              {mensagem.tipo === MensagemType.SEND ? `Para: ${mensagem.destino}` : `De: ${mensagem.email}`}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <FiCalendar size={14} />
              {formatDistanceToNow(new Date(mensagem.dataPublicacao), { 
                addSuffix: true,
                locale: ptBR 
              })}
            </span>
          </div>

          {/* Mensagem preview */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {mensagem.descricao}
          </p>

          {/* Anexos */}
          {mensagem.anexos && mensagem.anexos.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <FiPaperclip size={14} className="text-gray-400" />
              {mensagem.anexos.map((anexo, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {anexo}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMoreVertical size={18} className="text-gray-500" />
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-48 z-10"
              >
                {/* Marcar como lido/não lido (só para recebidas) */}
                {mensagem.tipo === MensagemType.RECEIVED && (
                  <button
                    onClick={() => {
                      onMarcarLido(mensagem.id);
                      setShowOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    {mensagem.lido ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    {mensagem.lido ? 'Marcar como não lido' : 'Marcar como lido'}
                  </button>
                )}

                {/* Responder (só para recebidas) */}
                {mensagem.tipo === MensagemType.RECEIVED && (
                  <button
                    onClick={() => {
                      onResponder(mensagem);
                      setShowOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiSend size={14} />
                    Responder
                  </button>
                )}

                {/* Excluir */}
                <button
                  onClick={() => {
                    onExcluir(mensagem.id);
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
    </motion.div>
  );
};

// Componente de Estatísticas
const StatsCard = ({ 
  icone: Icon, 
  titulo, 
  valor, 
  cor 
}: { 
  icone: any; 
  titulo: string; 
  valor: number; 
  cor: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${cor} rounded-lg flex items-center justify-center text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className="text-2xl font-bold text-gray-800">{valor}</p>
      </div>
    </div>
  </div>
);

// Componente Principal
export const MensagensPage = () => {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensMock);
  const [filter, setFilter] = useState<'todas' | 'recebidas' | 'enviadas' | 'nao lidas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMensagem, setSelectedMensagem] = useState<Mensagem | null>(null);
  const [showRespostaModal, setShowRespostaModal] = useState(false);

  // Estatísticas
  const stats = {
    recebidas: mensagens.filter(m => m.tipo === MensagemType.RECEIVED).length,
    enviadas: mensagens.filter(m => m.tipo === MensagemType.SEND).length,
    naoLidas: mensagens.filter(m => m.tipo === MensagemType.RECEIVED && !m.lido).length,
    pendentes: mensagens.filter(m => m.status === StatusMensage.PENDENTE).length
  };

  // Filtrar mensagens
  const filteredMensagens = mensagens.filter(msg => {
    // Filtro de tipo
    if (filter === 'recebidas' && msg.tipo !== MensagemType.RECEIVED) return false;
    if (filter === 'enviadas' && msg.tipo !== MensagemType.SEND) return false;
    if (filter === 'nao lidas' && (msg.tipo !== MensagemType.RECEIVED || msg.lido)) return false;

    // Busca por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        msg.assunto.toLowerCase().includes(term) ||
        msg.descricao.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.destino.toLowerCase().includes(term)
      );
    }

    return true;
  });

  const handleMarcarLido = (id: number) => {
    setMensagens(mensagens.map(m => 
      m.id === id ? { ...m, lido: !m.lido } : m
    ));
  };

  const handleResponder = (mensagem: Mensagem) => {
    setSelectedMensagem(mensagem);
    setShowRespostaModal(true);
  };

  const handleEnviarResposta = (resposta: { assunto: string; descricao: string }) => {
    if (!selectedMensagem) return;

    const novaMensagem: Mensagem = {
      id: Math.max(...mensagens.map(m => m.id)) + 1,
      descricao: resposta.descricao,
      assunto: resposta.assunto,
      destino: selectedMensagem.email,
      email: 'admin@igrejabaluarte.com',
      tipo: MensagemType.SEND,
      status: StatusMensage.ENVIADO,
      lido: true,
      dataPublicacao: new Date().toISOString()
    };

    setMensagens([novaMensagem, ...mensagens]);
    
    // Marcar original como lido (opcional)
    setMensagens(mensagens.map(m => 
      m.id === selectedMensagem.id ? { ...m, lido: true } : m
    ));
  };

  const handleExcluir = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      setMensagens(mensagens.filter(m => m.id !== id));
    }
  };

  const handleReenviarPendentes = () => {
    // Simular reenvio
    setMensagens(mensagens.map(m => 
      m.status === StatusMensage.PENDENTE 
        ? { ...m, status: StatusMensage.ENVIADO }
        : m
    ));
    
    alert('Mensagens pendentes reenviadas com sucesso!');
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
            Mensagens
          </h1>
          <p className="text-gray-500">
            Gerencie todas as mensagens recebidas e enviadas
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icone={FiInbox}
            titulo="Recebidas"
            valor={stats.recebidas}
            cor="bg-primary-500"
          />
          <StatsCard
            icone={FiSend}
            titulo="Enviadas"
            valor={stats.enviadas}
            cor="bg-blue-500"
          />
          <StatsCard
            icone={FiEye}
            titulo="Não Lidas"
            valor={stats.naoLidas}
            cor="bg-amber-500"
          />
          <StatsCard
            icone={FiClock}
            titulo="Pendentes"
            valor={stats.pendentes}
            cor="bg-purple-500"
          />
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar mensagens por assunto, conteúdo ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'todas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('recebidas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filter === 'recebidas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiInbox size={14} />
                Recebidas
              </button>
              <button
                onClick={() => setFilter('enviadas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filter === 'enviadas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiSend size={14} />
                Enviadas
              </button>
              <button
                onClick={() => setFilter('nao lidas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filter === 'nao lidas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiEyeOff size={14} />
                Não Lidas
              </button>
            </div>
          </div>

          {/* Ações adicionais */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-500">
              {filteredMensagens.length} {filteredMensagens.length === 1 ? 'mensagem encontrada' : 'mensagens encontradas'}
            </span>
            
            {stats.pendentes > 0 && (
              <button
                onClick={handleReenviarPendentes}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-sm hover:bg-amber-100 transition-colors"
              >
                <FiRefreshCw size={14} />
                Reenviar pendentes ({stats.pendentes})
              </button>
            )}
          </div>
        </div>

        {/* Lista de Mensagens */}
        {filteredMensagens.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiMail className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'todas'
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Sua caixa de mensagens está vazia'}
            </p>
            {(searchTerm || filter !== 'todas') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('todas');
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
              {filteredMensagens.map((mensagem) => (
                <MensagemCard
                  key={mensagem.id}
                  mensagem={mensagem}
                  onMarcarLido={handleMarcarLido}
                  onResponder={handleResponder}
                  onExcluir={handleExcluir}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Resposta */}
      <AnimatePresence>
        {showRespostaModal && selectedMensagem && (
          <ModalResposta
            mensagem={selectedMensagem}
            onClose={() => {
              setShowRespostaModal(false);
              setSelectedMensagem(null);
            }}
            onEnviar={handleEnviarResposta}
          />
        )}
      </AnimatePresence>
    </div>
  );
};