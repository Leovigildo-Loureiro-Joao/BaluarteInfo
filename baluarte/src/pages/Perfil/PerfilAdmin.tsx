// src/pages/Admin/PerfilAdminPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiLogOut,
  FiClock,
  FiGlobe,
  FiShield,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { 
  GiCrown,
  GiSecretBook,
  GiShield
} from "react-icons/gi";
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LiaQrcodeSolid } from "react-icons/lia";

// Tipos
interface AdminUser {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: 'Secretário' | 'Presbítero' | 'Administrador';
  avatar?: string;
  dataCadastro: string;
  ultimoAcesso: string;
  doisFatores?: boolean;
  endereco?: {
    cidade: string;
    estado: string;
  };
}

interface AuditLog {
  id: string;
  acao: string;
  detalhes: string;
  ip: string;
  data: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
}

// Dados mockados
const adminMock: AdminUser = {
  id: '1',
  nome: 'João Silva',
  email: 'joao.silva@igrejabaluarte.com',
  telefone: '(11) 99999-9999',
  cargo: 'Secretário',
  avatar: 'https://i.pravatar.cc/150?img=1',
  dataCadastro: '2023-01-15T10:30:00',
  ultimoAcesso: '2024-03-12T14:25:00',
  doisFatores: true,
  endereco: {
    cidade: 'São Paulo',
    estado: 'SP'
  }
};

const auditLogsMock: AuditLog[] = [
  {
    id: '1',
    acao: 'Login realizado',
    detalhes: 'Acesso ao painel administrativo',
    ip: '192.168.1.100',
    data: '2024-03-12T14:25:00',
    tipo: 'sucesso'
  },
  {
    id: '2',
    acao: 'Artigo publicado',
    detalhes: 'Título: "A Soberania de Deus em Tempos de Crise"',
    ip: '192.168.1.100',
    data: '2024-03-11T09:15:00',
    tipo: 'info'
  },
  {
    id: '3',
    acao: 'Usuário aprovado',
    detalhes: 'Novo membro: Maria Oliveira',
    ip: '192.168.1.100',
    data: '2024-03-10T16:30:00',
    tipo: 'sucesso'
  },
  {
    id: '4',
    acao: 'Tentativa de login falha',
    detalhes: 'Senha incorreta',
    ip: '192.168.1.105',
    data: '2024-03-09T22:10:00',
    tipo: 'erro'
  },
  {
    id: '5',
    acao: 'Configurações alteradas',
    detalhes: 'Intervalo do dashboard modificado',
    ip: '192.168.1.100',
    data: '2024-03-08T11:45:00',
    tipo: 'alerta'
  }
];

// Componente de Informações Pessoais
const InformacoesPessoais = ({ 
  admin, 
  editando, 
  onEdit,
  onSave,
  onCancel
}: { 
  admin: AdminUser; 
  editando: boolean;
  onEdit: () => void;
  onSave: (data: Partial<AdminUser>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    nome: admin.nome,
    telefone: admin.telefone,
    endereco: admin.endereco
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FiUser className="text-primary-500" />
          Informações Pessoais
        </h3>
        
        {!editando ? (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <FiEdit2 size={16} />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={18} />
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <FiSave size={16} />
              Salvar
            </button>
          </div>
        )}
      </div>

      {editando ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="text"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={formData.endereco?.cidade || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  endereco: { 
                    cidade: e.target.value, 
                    estado: formData.endereco?.estado || '' 
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <input
                type="text"
                value={formData.endereco?.estado || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  endereco: { 
                    cidade: formData.endereco?.cidade || '', 
                    estado: e.target.value 
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </form>
      ) : (
        <dl className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <dt className="w-24 text-sm text-gray-500">Nome:</dt>
            <dd className="flex-1 font-medium">{admin.nome}</dd>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <dt className="w-24 text-sm text-gray-500">Email:</dt>
            <dd className="flex-1 font-medium">{admin.email}</dd>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <dt className="w-24 text-sm text-gray-500">Telefone:</dt>
            <dd className="flex-1 font-medium">{admin.telefone}</dd>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <dt className="w-24 text-sm text-gray-500">Cargo:</dt>
            <dd className="flex-1 font-medium flex items-center gap-2">
              {admin.cargo === 'Secretário' ? <GiSecretBook className="text-purple-500" /> : 
               admin.cargo === 'Presbítero' ? <GiCrown className="text-blue-500" /> : 
               <GiShield className="text-green-500" />}
              {admin.cargo}
            </dd>
          </div>
          {admin.endereco && (
            <div className="flex items-center gap-3 py-2 border-b border-gray-100">
              <dt className="w-24 text-sm text-gray-500">Local:</dt>
              <dd className="flex-1 font-medium flex items-center gap-1">
                <FiMapPin size={14} className="text-gray-400" />
                {admin.endereco.cidade}/{admin.endereco.estado}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
};

// Componente de Segurança
const SegurancaCard = ({ admin }: { admin: AdminUser }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <FiShield className="text-primary-500" />
        Segurança
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Autenticação de dois fatores</p>
            <p className="text-sm text-gray-500">
              {admin.doisFatores ? 'Ativado' : 'Desativado'}
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            admin.doisFatores ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
          }`}>
            {admin.doisFatores ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Último acesso</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(admin.ultimoAcesso), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </p>
          </div>
          <FiClock className="text-gray-400" size={18} />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Membro desde</p>
            <p className="text-sm text-gray-500">
              {format(new Date(admin.dataCadastro), 'dd/MM/yyyy')}
            </p>
          </div>
          <FiCalendar className="text-gray-400" size={18} />
        </div>
      </div>
    </div>
  );
};

// Componente de Audit Log
const AuditLogItem = ({ log }: { log: AuditLog }) => {
  const getIcon = () => {
    switch(log.tipo) {
      case 'sucesso': return <FiCheckCircle className="text-green-500" size={16} />;
      case 'alerta': return <FiAlertCircle className="text-yellow-500" size={16} />;
      case 'erro': return <FiX className="text-red-500" size={16} />;
      default: return <FiClock className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{log.acao}</p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(log.data), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
        <p className="text-sm text-gray-500">{log.detalhes}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FiGlobe size={10} />
            {log.ip}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export const PerfilAdminPage = () => {
  const [admin, setAdmin] = useState<AdminUser>(adminMock);
  const [editando, setEditando] = useState(false);
  const [auditLogs] = useState<AuditLog[]>(auditLogsMock);
  const [filtroAudit, setFiltroAudit] = useState<string>('todos');

  const handleSave = (data: Partial<AdminUser>) => {
    setAdmin({ ...admin, ...data });
    setEditando(false);
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filtroAudit === 'todos') return true;
    return log.tipo === filtroAudit;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden py-8">
      {/* Grid decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom max-w-5xl relative z-10">
        {/* Header do Perfil */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 flex items-center gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
                <img
                  src={admin.avatar}
                  alt={admin.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                <FiCamera size={14} />
              </button>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold">{admin.nome}</h1>
              <p className="text-white/80 flex items-center gap-2">
                <FiMail size={14} />
                {admin.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  {admin.cargo === 'Secretário' ? <GiSecretBook size={12} /> : 
                   admin.cargo === 'Presbítero' ? <GiCrown size={12} /> : 
                   <GiShield size={12} />}
                  {admin.cargo}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Informações e Segurança */}
          <div className="md:col-span-2 space-y-6">
            <InformacoesPessoais
              admin={admin}
              editando={editando}
              onEdit={() => setEditando(true)}
              onSave={handleSave}
              onCancel={() => setEditando(false)}
            />

            {/* Audit Logs */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FiClock className="text-primary-500" />
                  Audit Logs
                </h3>

                <select
                  value={filtroAudit}
                  onChange={(e) => setFiltroAudit(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="todos">Todos</option>
                  <option value="sucesso">Sucesso</option>
                  <option value="alerta">Alertas</option>
                  <option value="erro">Erros</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                {filteredLogs.map((log) => (
                  <AuditLogItem key={log.id} log={log} />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Segurança e Ações */}
          <div className="space-y-6">
            <SegurancaCard admin={admin} />

            {/* Sessão */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Sessão</h3>
              <button className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <FiLogOut size={18} />
                Encerrar todas as sessões
              </button>
            </div>

            {/* QR Code (opcional) */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <LiaQrcodeSolid className="text-primary-500" />
                Acesso Rápido
              </h3>
              <div className="bg-gray-100 p-4 rounded-xl text-center">
                <div className="w-32 h-32 bg-white mx-auto mb-3 flex items-center justify-center">
                  {/* Placeholder QR Code */}
                  <LiaQrcodeSolid size={80} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-500">
              Escaneie para acessar o painel pelo celular
            </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};