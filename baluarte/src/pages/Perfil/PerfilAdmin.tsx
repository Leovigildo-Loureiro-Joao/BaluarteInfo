// src/pages/Admin/PerfilAdminPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
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
import { apiFetch } from "../../utils/api.js";
import { clearAuthSession } from "../../utils/auth.js";
import type { AdminAuditLogDto, AdminAuditType, AdminProfileDto, PageResponse } from "../../types/api";
import { AdminAuditType as AdminAuditTypeEnum } from "../../types/api";
import { useNavigate } from "react-router-dom";

type AdminUser = AdminProfileDto;

type ProfileUpdatePayload = {
  nome?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
};

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
  onSave: (data: ProfileUpdatePayload) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    nome: admin.nome,
    telefone: admin.telefone ?? "",
    cidade: admin.cidade ?? "",
    estado: admin.estado ?? ""
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
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
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
              <GiShield className="text-green-500" />
              {admin.cargo}
            </dd>
          </div>
          {admin.cidade && admin.estado && (
            <div className="flex items-center gap-3 py-2 border-b border-gray-100">
              <dt className="w-24 text-sm text-gray-500">Local:</dt>
              <dd className="flex-1 font-medium flex items-center gap-1">
                <FiMapPin size={14} className="text-gray-400" />
                {admin.cidade}/{admin.estado}
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
              {admin.ultimoAcesso
                ? formatDistanceToNow(new Date(admin.ultimoAcesso), { 
                addSuffix: true, 
                locale: ptBR 
              })
                : "-"}
            </p>
          </div>
          <FiClock className="text-gray-400" size={18} />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Membro desde</p>
            <p className="text-sm text-gray-500">
              {admin.dataCadastro ? format(new Date(admin.dataCadastro), 'dd/MM/yyyy') : "-"}
            </p>
          </div>
          <FiCalendar className="text-gray-400" size={18} />
        </div>
      </div>
    </div>
  );
};

// Componente de Audit Log
const AuditLogItem = ({ log }: { log: AdminAuditLogDto }) => {
  const getIcon = () => {
    switch(log.tipo) {
      case AdminAuditTypeEnum.SUCESSO: return <FiCheckCircle className="text-green-500" size={16} />;
      case AdminAuditTypeEnum.ALERTA: return <FiAlertCircle className="text-yellow-500" size={16} />;
      case AdminAuditTypeEnum.ERRO: return <FiX className="text-red-500" size={16} />;
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
        {log.detalhes && <p className="text-sm text-gray-500">{log.detalhes}</p>}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FiGlobe size={10} />
            {log.ip ?? "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export const PerfilAdminPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [editando, setEditando] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogDto[]>([]);
  const [filtroAudit, setFiltroAudit] = useState<AdminAuditType | 'todos'>('todos');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState("");
  const [auditPage, setAuditPage] = useState(0);
  const [auditSize] = useState(10);
  const [auditTotalPages, setAuditTotalPages] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch("/admin/profile", { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar perfil do admin.");
        const payload = (await res.json()) as AdminProfileDto;
        setAdmin(payload);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAdmin(null);
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar o perfil do admin.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [reloadToken]);

  const auditQueryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(auditPage));
    params.set("size", String(auditSize));
    if (filtroAudit !== "todos") {
      params.set("tipo", String(filtroAudit));
    }
    return params.toString();
  }, [auditPage, auditSize, filtroAudit]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setAuditLoading(true);
      setAuditError("");
      try {
        const res = await apiFetch(`/admin/profile/audit?${auditQueryString}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar audit logs.");
        const payload = (await res.json()) as PageResponse<AdminAuditLogDto>;
        setAuditLogs(payload.content ?? []);
        setAuditTotalPages(payload.totalPages ?? 0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAuditLogs([]);
        setAuditTotalPages(0);
        setAuditError(err instanceof Error ? err.message : "Não foi possível carregar audit logs.");
      } finally {
        setAuditLoading(false);
      }
    })();
    return () => controller.abort();
  }, [auditQueryString, reloadToken]);

  const handleSave = async (data: ProfileUpdatePayload) => {
    if (!admin) return;
    if (savingProfile) return;
    setActionError("");
    setSavingProfile(true);
    try {
      const res = await apiFetch("/admin/profile", { method: "PUT", body: data });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Falha ao salvar perfil.");
      }
      const payload = (await res.json()) as AdminProfileDto;
      setAdmin(payload);
      setEditando(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível salvar o perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    if (uploadingAvatar) return;
    setActionError("");
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append("img", file);
      const res = await apiFetch("/user/me/avatar", { method: "PUT", body: form });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Falha ao atualizar avatar.");
      }
      setReloadToken((t) => t + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Falha ao atualizar avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      clearAuthSession();
      navigate('/auth/login');
    }
  };

  const filteredLogs = auditLogs;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-custom max-w-5xl">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">Carregando perfil...</div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-custom max-w-5xl">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-red-600 text-sm">{loadError || "Não foi possível carregar o perfil do admin."}</p>
            <button
              onClick={() => setReloadToken((t) => t + 1)}
              className="mt-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadAvatar(file);
                }}
              />
              <button
                type="button"
                disabled={uploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
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
                  <GiShield size={12} />
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
                  onChange={(e) => {
                    setAuditPage(0);
                    setFiltroAudit(e.target.value as any);
                  }}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="todos">Todos</option>
                  <option value={AdminAuditTypeEnum.SUCESSO}>Sucesso</option>
                  <option value={AdminAuditTypeEnum.ALERTA}>Alertas</option>
                  <option value={AdminAuditTypeEnum.ERRO}>Erros</option>
                  <option value={AdminAuditTypeEnum.INFO}>Info</option>
                </select>
              </div>

              <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                {auditLoading && <div className="text-sm text-gray-500 p-3">Carregando logs...</div>}
                {!auditLoading && auditError && <div className="text-sm text-red-600 p-3">{auditError}</div>}
                {!auditLoading && !auditError && filteredLogs.map((log) => (
                  <AuditLogItem key={log.id} log={log} />
                ))}
              </div>

              {auditTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setAuditPage((p) => Math.max(0, p - 1))}
                    disabled={auditLoading || auditPage <= 0}
                    className={`px-4 py-2 rounded-lg border border-gray-200 ${
                      auditLoading || auditPage <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                  >
                    Anterior
                  </button>
                  <div className="text-sm text-gray-600">
                    Página <span className="font-semibold">{auditPage + 1}</span> de{" "}
                    <span className="font-semibold">{auditTotalPages}</span>
                  </div>
                  <button
                    onClick={() => setAuditPage((p) => Math.min(auditTotalPages - 1, p + 1))}
                    disabled={auditLoading || auditPage >= auditTotalPages - 1}
                    className={`px-4 py-2 rounded-lg border border-gray-200 ${
                      auditLoading || auditPage >= auditTotalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita - Segurança e Ações */}
          <div className="space-y-6">
            <SegurancaCard admin={admin} />

            {/* Sessão */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Sessão</h3>
              {actionError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {actionError}
                </div>
              )}
              <button
                type="button"
                onClick={handleLogoutAll}
                className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
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
