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
  FiToggleRight
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

interface Configuracoes {
  dashboard: ConfiguracaoDashboard;
  messages: ConfiguracaoMensagens;
  inscricoes: ConfiguracaoInscricoes;
  activities: ConfiguracaoActivities;
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
  }
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