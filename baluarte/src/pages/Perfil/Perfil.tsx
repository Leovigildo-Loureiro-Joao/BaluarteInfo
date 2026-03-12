// src/pages/Perfil/PerfilPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiHeart,
  FiBookmark,
  FiClock,
  FiEye,
  FiDownload,
  FiShare2,
  FiCamera,
  FiCheckCircle,
  FiLogOut
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiAngelWings,
  GiHeartBeats
} from "react-icons/gi";
import { Link } from "react-router-dom";
import { LiaBibleSolid } from "react-icons/lia";

// Componente de Informações Pessoais
const InformacoesPessoais = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nome: "João Pedro Silva",
    email: "joao.pedro@email.com",
    telefone: "(11) 98765-4321",
    dataNascimento: "1995-05-15",
    cidade: "São Paulo",
    estado: "SP",
    igreja: "Igreja Baluarte - Sede",
    dataBatismo: "2010-12-20",
    ministerio: "Louvor",
    cargo: "Vocal"
  });

  const [editData, setEditData] = useState(userData);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FiUser className="text-primary" />
          Informações Pessoais
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <FiEdit2 size={16} />
            Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={18} />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiSave size={16} />
              Salvar
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(isEditing ? editData : userData).map(([key, value]) => {
          const fields = {
            nome: { label: "Nome Completo", icon: FiUser, type: "text" },
            email: { label: "E-mail", icon: FiMail, type: "email" },
            telefone: { label: "Telefone", icon: FiPhone, type: "tel" },
            dataNascimento: { label: "Data de Nascimento", icon: FiCalendar, type: "date" },
            cidade: { label: "Cidade", icon: FiMapPin, type: "text" },
            estado: { label: "Estado", icon: FiMapPin, type: "text" },
            igreja: { label: "Igreja", icon: LiaBibleSolid, type: "text" },
            dataBatismo: { label: "Data de Batismo", icon: FiCalendar, type: "date" },
            ministerio: { label: "Ministério", icon: GiPrayer, type: "text" },
            cargo: { label: "Cargo/Função", icon: FiUser, type: "text" }
          };

          const field = fields[key as keyof typeof fields];
          if (!field) return null;

          const Icon = field.icon;

          return (
            <div key={key} className="space-y-1">
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <Icon size={14} />
                {field.label}
              </label>
              {isEditing ? (
                <input
                  type={field.type}
                  value={value as string}
                  onChange={(e) => setEditData({...editData, [key]: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              ) : (
                <p className="font-medium">{value as string}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Estatísticas Espirituais */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold mb-4">Jornada Espiritual</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-xs text-gray-500">Anos na igreja</div>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-gray-500">Estudos concluídos</div>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-xs text-gray-500">Eventos participados</div>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">45</div>
            <div className="text-xs text-gray-500">Artigos lidos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Histórico de Atividades
const HistoricoAtividades = () => {
  const [filter, setFilter] = useState<'todos' | 'inscricoes' | 'comentarios' | 'curtidas'>('todos');
  
  const atividades = [
    {
      id: 1,
      tipo: 'inscricao',
      titulo: 'Conferência de Jovens 2024',
      data: '2024-01-15',
      status: 'confirmado',
      imagem: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      tipo: 'comentario',
      titulo: 'Comentou em "A Soberania de Deus"',
      descricao: 'Excelente artigo! Me ajudou muito...',
      data: '2024-01-14',
      imagem: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      tipo: 'curtida',
      titulo: 'Curtiu "Culto de Domingo"',
      data: '2024-01-13',
      imagem: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 4,
      tipo: 'inscricao',
      titulo: 'Escola Bíblica - Módulo 1',
      data: '2024-01-10',
      status: 'pendente',
      imagem: 'https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=200&q=80'
    }
  ];

  const filteredAtividades = filter === 'todos' 
    ? atividades 
    : atividades.filter(a => a.tipo === filter);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiClock className="text-primary" />
        Histórico de Atividades
      </h3>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'inscricoes', label: 'Inscrições' },
          { id: 'comentarios', label: 'Comentários' },
          { id: 'curtidas', label: 'Curtidas' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de atividades */}
      <div className="space-y-4">
        {filteredAtividades.map((atividade) => (
          <motion.div
            key={atividade.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <img
              src={atividade.imagem}
              alt=""
              className="w-16 h-16 rounded-lg object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{atividade.titulo}</h4>
                  {atividade.descricao && (
                    <p className="text-sm text-gray-600">{atividade.descricao}</p>
                  )}
                  {atividade.status && (
                    <span className={`inline-flex items-center gap-1 text-xs mt-1 px-2 py-1 rounded-full ${
                      atividade.status === 'confirmado' 
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <FiCheckCircle size={10} />
                      {atividade.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(atividade.data).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {atividade.tipo === 'inscricao' && (
              <Link
                to={`/actividades/${atividade.id}`}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
              >
                Ver detalhes
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {filteredAtividades.length === 0 && (
        <div className="text-center py-12">
          <FiClock className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma atividade encontrada</p>
        </div>
      )}
    </div>
  );
};

// Componente de Conteúdos Salvos
const ConteudosSalvos = () => {
  const [activeTab, setActiveTab] = useState<'artigos' | 'videos' | 'audios'>('artigos');

  const savedContent = {
    artigos: [
      {
        id: 1,
        titulo: "A Soberania de Deus em Tempos de Crise",
        autor: "Pr. Antônio Silva",
        data: "2024-01-15",
        imagem: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: 2,
        titulo: "O Poder da Oração Intercessória",
        autor: "Pra. Maria Oliveira",
        data: "2024-01-10",
        imagem: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=200&q=80"
      }
    ],
    videos: [
      {
        id: 1,
        titulo: "Culto de Domingo - A Vitória é Certa",
        autor: "Pr. Antônio Silva",
        duracao: "45:30",
        imagem: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=200&q=80"
      }
    ],
    audios: [
      {
        id: 1,
        titulo: "Podcast: Juventude e Fé",
        autor: "Pr. João Santos",
        duracao: "32:15",
        imagem: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=200&q=80"
      }
    ]
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiBookmark className="text-primary" />
        Conteúdos Salvos
      </h3>

      {/* Abas */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'artigos', label: 'Artigos', count: savedContent.artigos.length },
          { id: 'videos', label: 'Vídeos', count: savedContent.videos.length },
          { id: 'audios', label: 'Áudios', count: savedContent.audios.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="space-y-4">
        {savedContent[activeTab].map((item: any) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <img
              src={item.imagem}
              alt=""
              className="w-20 h-20 rounded-lg object-cover"
            />
            
            <div className="flex-1">
              <h4 className="font-semibold group-hover:text-primary transition-colors">
                {item.titulo}
              </h4>
              <p className="text-sm text-gray-500">{item.autor}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                {item.data && <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>}
                {item.duracao && <span>{item.duracao}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/${activeTab}/${item.id}`}
                className="p-2 text-gray-500 hover:text-primary transition-colors"
              >
                <FiEye size={18} />
              </Link>
              <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                <FiShare2 size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                <FiDownload size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {savedContent[activeTab].length === 0 && (
        <div className="text-center py-12">
          <FiBookmark className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum conteúdo salvo</p>
        </div>
      )}
    </div>
  );
};

// Componente Principal do Perfil
export const PerfilPage = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'historico' | 'salvos'>('info');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header do Perfil */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                <FiCamera size={16} />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">João Pedro Silva</h1>
              <p className="text-white/80 flex items-center gap-2">
                <FiMail size={16} />
                joao.pedro@email.com
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <GiHeartBeats />
                  Membro desde 2021
                </span>
                <span className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <GiPrayer />
                  Ministério de Louvor
                </span>
              </div>
            </div>

            {/* Botão sair */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <FiLogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Abas de navegação */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'info', label: 'Informações Pessoais', icon: FiUser },
            { id: 'historico', label: 'Histórico', icon: FiClock },
            { id: 'salvos', label: 'Conteúdos Salvos', icon: FiBookmark }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo da aba */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'info' && <InformacoesPessoais />}
            {activeTab === 'historico' && <HistoricoAtividades />}
            {activeTab === 'salvos' && <ConteudosSalvos />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};