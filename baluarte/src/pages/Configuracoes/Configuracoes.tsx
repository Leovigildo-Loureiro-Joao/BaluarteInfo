// src/pages/Admin/ConfiguracoesPage.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  FiSave,
  FiRefreshCw,
  FiClock,
  FiMail,
  FiCalendar,
  FiActivity,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiToggleLeft,
  FiToggleRight,
  FiImage,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiPartyPopper, 
  GiHeartBeats,
  GiFamilyHouse,
} from "react-icons/gi";
import { LiaBibleSolid, LiaChairSolid } from "react-icons/lia";

// Tipos baseados no JSON
interface ConfiguracaoTipoAtividade {
  id: string;
  label: string;
  color: string;
  icon: string;
}

interface ConfiguracaoDashboard {
  cards: any[];
  timeRanges: any[];
  refreshIntervalMs: number;
}

interface ConfiguracaoMensagens {
  retention: {
    unreadDays: number;
  };
  actions: {
    reenviarPendentes: boolean;
  };
}

interface ConfiguracaoInscricoes {
  qr: {
    enabled: boolean;
    autoDisableAfterActivity: boolean;
    expiresAfterHours: number;
  };
}

interface ConfiguracaoActivities {
  types: ConfiguracaoTipoAtividade[];
}

interface CarouselImage {
  id: string;
  url: string;
  titulo: string;
  legenda: string;
  ordem: number;
}

interface Configuracoes {
  dashboard: ConfiguracaoDashboard;
  messages: ConfiguracaoMensagens;
  inscricoes: ConfiguracaoInscricoes;
  activities: ConfiguracaoActivities;
  homeCarousel: CarouselImage[];
}

// Configuração mock (baseada no JSON)
const configuracoesMock: Configuracoes = {
  dashboard: {
    cards: [],
    timeRanges: [],
    refreshIntervalMs: 300000
  },
  messages: {
    retention: {
      unreadDays: 7
    },
    actions: {
      reenviarPendentes: true
    }
  },
  inscricoes: {
    qr: {
      enabled: true,
      autoDisableAfterActivity: true,
      expiresAfterHours: 6
    }
  },
  activities: {
    types: [
      { id: "Culto", label: "Culto", color: "#7c3aed", icon: "GiPrayer" },
      { id: "Evento", label: "Evento Especial", color: "#ec4899", icon: "GiPartyPopper" },
      { id: "Escola", label: "Escola Bíblica", color: "#3b82f6", icon: "GiBible" },
      { id: "Jovens", label: "Juventude", color: "#10b981", icon: "GiHeartBeats" },
      { id: "Familia", label: "Família", color: "#f59e0b", icon: "GiFamilyHouse" },
      { id: "Louvor", label: "Louvor", color: "#8b5cf6", icon: "GiChoir" },
      { id: "Oracao", label: "Oração", color: "#ef4444", icon: "GiPrayer" }
    ]
  },
  homeCarousel: [
    {
      id: "c1",
      url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      titulo: "Culto de celebração",
      legenda: "Louvor, ensino e comunhão com toda a família Baluarte.",
      ordem: 1
    },
    {
      id: "c2",
      url: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      titulo: "Jovens on fire",
      legenda: "Experiências profundas e momentos de oração impactantes.",
      ordem: 2
    },
    {
      id: "c3",
      url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
      titulo: "Ministério infantil",
      legenda: "Crianças aprendendo a Palavra com alegria e criatividade.",
      ordem: 3
    }
  ]
};

// Mapeamento de ícones (para exibição)
const iconMap: Record<string, any> = {
  GiPrayer: GiPrayer,
  GiPartyPopper: GiPartyPopper,
  GiBible: LiaBibleSolid,
  GiHeartBeats: GiHeartBeats,
  GiFamilyHouse: GiFamilyHouse,
  GiChoir: LiaChairSolid
};

// Componente de Seção Configurável
const SecaoConfiguracao = ({ 
  titulo, 
  icone: Icon, 
  children,
  inicialExpandido = true 
}: { 
  titulo: string; 
  icone: any; 
  children: React.ReactNode;
  inicialExpandido?: boolean;
}) => {
  const [expandido, setExpandido] = useState(inicialExpandido);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="text-primary-500" size={20} />
          <h3 className="font-semibold text-lg">{titulo}</h3>
        </div>
        {expandido ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>
      
      {expandido && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Componente de Campo de Configuração
const CampoConfiguracao = ({ 
  label, 
  children,
  descricao
}: { 
  label: string; 
  children: React.ReactNode;
  descricao?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {descricao && <p className="text-xs text-gray-500 mb-2">{descricao}</p>}
    {children}
  </div>
);

// Componente de Toggle Switch
const ToggleSwitch = ({ 
  value, 
  onChange,
  label
}: { 
  value: boolean; 
  onChange: (value: boolean) => void;
  label?: string;
}) => (
  <button
    onClick={() => onChange(!value)}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      value ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-600'
    }`}
  >
    {value ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
    <span className="text-sm font-medium">{label || (value ? 'Ativado' : 'Desativado')}</span>
  </button>
);

// Componente de Card de Tipo de Atividade (modo edição)
const TipoAtividadeCard = ({ 
  tipo, 
  onEdit,
  onDelete
}: { 
  tipo: ConfiguracaoTipoAtividade; 
  onEdit: (tipo: ConfiguracaoTipoAtividade) => void;
  onDelete: (id: string) => void;
}) => {
  const IconComponent = iconMap[tipo.icon] || GiPrayer;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: tipo.color }}>
          <IconComponent size={16} />
        </div>
        <div>
          <p className="font-medium">{tipo.label}</p>
          <p className="text-xs text-gray-500">{tipo.id}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(tipo)}
          className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-primary-500"
        >
          <FiEdit2 size={14} />
        </button>
        <button
          onClick={() => onDelete(tipo.id)}
          className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-red-500"
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  );
};

// Modal de Edição de Tipo de Atividade
const ModalEditarTipo = ({ 
  tipo, 
  onClose, 
  onSave 
}: { 
  tipo?: ConfiguracaoTipoAtividade; 
  onClose: () => void; 
  onSave: (tipo: ConfiguracaoTipoAtividade) => void;
}) => {
  const [formData, setFormData] = useState({
    id: tipo?.id || '',
    label: tipo?.label || '',
    color: tipo?.color || '#7c3aed',
    icon: tipo?.icon || 'GiPrayer'
  });

  const iconOptions = [
    { value: 'GiPrayer', label: 'Oração', icon: GiPrayer },
    { value: 'GiPartyPopper', label: 'Evento', icon: GiPartyPopper },
    { value: 'GiBible', label: 'Bíblia', icon: LiaBibleSolid },
    { value: 'GiHeartBeats', label: 'Coração', icon: GiHeartBeats },
    { value: 'GiFamilyHouse', label: 'Família', icon: GiFamilyHouse },
    { value: 'GiChoir', label: 'Louvor', icon: LiaChairSolid }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {tipo ? 'Editar Tipo' : 'Novo Tipo de Atividade'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID (único)
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
                disabled={!!tipo}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome (label)
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {iconOptions.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente Principal
export const ConfiguracoesPage = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>(configuracoesMock);
  const [editando, setEditando] = useState(false);
  const [modalTipoAberto, setModalTipoAberto] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<ConfiguracaoTipoAtividade | undefined>();
  const [carouselForm, setCarouselForm] = useState({
    url: "",
    titulo: "",
    legenda: ""
  });

  const handleSave = () => {
    // Aqui chamaria a API para salvar
    setEditando(false);
    alert('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    if (window.confirm('Restaurar configurações padrão?')) {
      setConfiguracoes(configuracoesMock);
    }
  };

  const handleAddCarouselImage = () => {
    const titulo = carouselForm.titulo.trim();
    const url = carouselForm.url.trim();
    if (!titulo || !url) return;

    const novo: CarouselImage = {
      id: `c-${Date.now()}`,
      url,
      titulo,
      legenda: carouselForm.legenda.trim(),
      ordem: configuracoes.homeCarousel.length + 1
    };

    setConfiguracoes({
      ...configuracoes,
      homeCarousel: [...configuracoes.homeCarousel, novo]
    });

    setCarouselForm({ url: "", titulo: "", legenda: "" });
  };

  const handleRemoveCarouselImage = (id: string) => {
    setConfiguracoes({
      ...configuracoes,
      homeCarousel: configuracoes.homeCarousel
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, ordem: index + 1 }))
    });
  };

  const handleMoveCarouselImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= configuracoes.homeCarousel.length) return;

    const atualizado = [...configuracoes.homeCarousel];
    [atualizado[index], atualizado[target]] = [atualizado[target], atualizado[index]];

    setConfiguracoes({
      ...configuracoes,
      homeCarousel: atualizado.map((item, idx) => ({ ...item, ordem: idx + 1 }))
    });
  };

  const handleSalvarTipo = (tipo: ConfiguracaoTipoAtividade) => {
    if (tipoEditando) {
      // Editar
      setConfiguracoes({
        ...configuracoes,
        activities: {
          types: configuracoes.activities.types.map(t => 
            t.id === tipo.id ? tipo : t
          )
        }
      });
    } else {
      // Criar novo
      setConfiguracoes({
        ...configuracoes,
        activities: {
          types: [...configuracoes.activities.types, tipo]
        }
      });
    }
  };

  const handleDeletarTipo = (id: string) => {
    if (window.confirm('Remover este tipo de atividade?')) {
      setConfiguracoes({
        ...configuracoes,
        activities: {
          types: configuracoes.activities.types.filter(t => t.id !== id)
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden py-8">
      {/* Grid decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Configurações
            </h1>
            <p className="text-gray-500">
              Gerencie as configurações do sistema
            </p>
          </div>

          <div className="flex gap-2">
            {!editando ? (
              <button
                onClick={() => setEditando(true)}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 flex items-center gap-2"
              >
                <FiEdit2 size={18} />
                Editar
              </button>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2"
                >
                  <FiRefreshCw size={18} />
                  Restaurar
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2"
                >
                  <FiSave size={18} />
                  Salvar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Configurações */}
        <div className="space-y-4">
          {/* Dashboard */}
          <SecaoConfiguracao titulo="Dashboard" icone={FiSettings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoConfiguracao 
                label="Intervalo de Atualização"
                descricao="Tempo entre atualizações automáticas (ms)"
              >
                <input
                  type="number"
                  value={configuracoes.dashboard.refreshIntervalMs}
                  onChange={(e) => setConfiguracoes({
                    ...configuracoes,
                    dashboard: {
                      ...configuracoes.dashboard,
                      refreshIntervalMs: parseInt(e.target.value)
                    }
                  })}
                  disabled={!editando}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </CampoConfiguracao>
            </div>
          </SecaoConfiguracao>

          {/* Carrossel da Home */}
          <SecaoConfiguracao titulo="Carrossel da Home" icone={FiImage}>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Defina aqui as imagens que vão aparecer no carrossel da página inicial. Reordene, edite ou remova banners para controlar a narrativa visual.
              </p>

              <div className="space-y-3">
                {configuracoes.homeCarousel.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border border-gray-100 rounded-xl p-3 shadow-sm bg-white"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={item.url} alt={item.titulo} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.titulo}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.legenda || "Legenda não definida"}</p>
                      <p className="text-xs text-gray-400 mt-1">Ordem {item.ordem}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleMoveCarouselImage(index, -1)}
                        disabled={!editando || index === 0}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 disabled:opacity-40"
                      >
                        <FiArrowUp />
                      </button>
                      <button
                        onClick={() => handleMoveCarouselImage(index, 1)}
                        disabled={!editando || index === configuracoes.homeCarousel.length - 1}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 disabled:opacity-40"
                      >
                        <FiArrowDown />
                      </button>
                      <button
                        onClick={() => handleRemoveCarouselImage(item.id)}
                        disabled={!editando}
                        className="w-10 h-10 rounded-lg border border-red-300 flex items-center justify-center text-red-500 disabled:opacity-40"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <CampoConfiguracao label="Nova imagem">
                  <input
                    type="text"
                    placeholder="URL da imagem"
                    value={carouselForm.url}
                    onChange={(e) => setCarouselForm({ ...carouselForm, url: e.target.value })}
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="Título">
                  <input
                    type="text"
                    placeholder="Título do banner"
                    value={carouselForm.titulo}
                    onChange={(e) => setCarouselForm({ ...carouselForm, titulo: e.target.value })}
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="Legenda (opcional)">
                  <input
                    type="text"
                    placeholder="Frase de apoio ou chamada"
                    value={carouselForm.legenda}
                    onChange={(e) => setCarouselForm({ ...carouselForm, legenda: e.target.value })}
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <button
                  onClick={handleAddCarouselImage}
                  disabled={!editando || !carouselForm.url.trim() || !carouselForm.titulo.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  <FiPlus />
                  Adicionar imagem
                </button>
              </div>
            </div>
          </SecaoConfiguracao>

          {/* Mensagens */}
          <SecaoConfiguracao titulo="Mensagens" icone={FiMail}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoConfiguracao 
                label="Dias para mensagens não lidas"
                descricao="Tempo máximo que mensagens não lidas são mantidas em destaque"
              >
                <input
                  type="number"
                  value={configuracoes.messages.retention.unreadDays}
                  onChange={(e) => setConfiguracoes({
                    ...configuracoes,
                    messages: {
                      ...configuracoes.messages,
                      retention: {
                        unreadDays: parseInt(e.target.value)
                      }
                    }
                  })}
                  disabled={!editando}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </CampoConfiguracao>

              <CampoConfiguracao label="Reenviar Pendentes">
                <ToggleSwitch
                  value={configuracoes.messages.actions.reenviarPendentes}
                  onChange={(value) => setConfiguracoes({
                    ...configuracoes,
                    messages: {
                      ...configuracoes.messages,
                      actions: {
                        reenviarPendentes: value
                      }
                    }
                  })}
                />
              </CampoConfiguracao>
            </div>
          </SecaoConfiguracao>

          {/* Inscrições */}
          <SecaoConfiguracao titulo="Inscrições" icone={FiCalendar}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CampoConfiguracao label="QR Code">
                  <ToggleSwitch
                    value={configuracoes.inscricoes.qr.enabled}
                    onChange={(value) => setConfiguracoes({
                      ...configuracoes,
                      inscricoes: {
                        ...configuracoes.inscricoes,
                        qr: {
                          ...configuracoes.inscricoes.qr,
                          enabled: value
                        }
                      }
                    })}
                    label="Habilitado"
                  />
                </CampoConfiguracao>

                <CampoConfiguracao label="Expirar após evento">
                  <ToggleSwitch
                    value={configuracoes.inscricoes.qr.autoDisableAfterActivity}
                    onChange={(value) => setConfiguracoes({
                      ...configuracoes,
                      inscricoes: {
                        ...configuracoes.inscricoes,
                        qr: {
                          ...configuracoes.inscricoes.qr,
                          autoDisableAfterActivity: value
                        }
                      }
                    })}
                  />
                </CampoConfiguracao>
              </div>

              <CampoConfiguracao 
                label="Validade do QR Code (horas)"
                descricao="Tempo que o QR Code permanece válido após gerado"
              >
                <input
                  type="number"
                  value={configuracoes.inscricoes.qr.expiresAfterHours}
                  onChange={(e) => setConfiguracoes({
                    ...configuracoes,
                    inscricoes: {
                      ...configuracoes.inscricoes,
                      qr: {
                        ...configuracoes.inscricoes.qr,
                        expiresAfterHours: parseInt(e.target.value)
                      }
                    }
                  })}
                  disabled={!editando}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </CampoConfiguracao>
            </div>
          </SecaoConfiguracao>

          {/* Tipos de Atividade */}
          <SecaoConfiguracao titulo="Tipos de Atividade" icone={FiActivity}>
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setTipoEditando(undefined);
                    setModalTipoAberto(true);
                  }}
                  disabled={!editando}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Novo Tipo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {configuracoes.activities.types.map((tipo) => (
                  <TipoAtividadeCard
                    key={tipo.id}
                    tipo={tipo}
                    onEdit={(t) => {
                      setTipoEditando(t);
                      setModalTipoAberto(true);
                    }}
                    onDelete={handleDeletarTipo}
                  />
                ))}
              </div>
            </div>
          </SecaoConfiguracao>

          {/* Visualização do JSON (opcional, para debug) */}
          {editando && (
            <div className="bg-gray-900 rounded-xl p-4 mt-8">
              <p className="text-gray-400 text-xs mb-2">Configuração (JSON)</p>
              <pre className="text-green-400 text-xs overflow-x-auto">
                {JSON.stringify(configuracoes, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Tipo de Atividade */}
      <AnimatePresence>
        {modalTipoAberto && (
          <ModalEditarTipo
            tipo={tipoEditando}
            onClose={() => {
              setModalTipoAberto(false);
              setTipoEditando(undefined);
            }}
            onSave={handleSalvarTipo}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
