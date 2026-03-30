// src/pages/Admin/UsuariosPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiUserMinus,
  FiShield,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiFilter,
  FiMail,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiMessageSquare,
  FiDownload,
  FiX,
  FiUser
} from "react-icons/fi";
import { 
  GiCrown,
  GiSecretBook,
  GiChurch,
  GiPrayer 
} from "react-icons/gi";
import { apiFetch } from "../../utils/api.js";
import { UserStatus } from "../../types/api";
import type { UserData } from "../../types/api";

type Usuario = UserData;

type RoleKind = "ADMIN" | "PRESBITERO" | "USER";

const resolveRoleKind = (roles?: string | null): RoleKind => {
  const normalized = (roles ?? "").toUpperCase();
  if (normalized.includes("ADMIN")) return "ADMIN";
  if (normalized.includes("PRESBITERO") || normalized.includes("PRESBITER")) return "PRESBITERO";
  return "USER";
};

const roleBadgeMeta: Record<
  RoleKind,
  { cor: string; icon: React.ComponentType<{ size?: number }>; label: string }
> = {
  ADMIN: { cor: "bg-purple-100 text-purple-600", icon: GiCrown, label: "Admin" },
  PRESBITERO: { cor: "bg-blue-100 text-blue-600", icon: GiSecretBook, label: "Presbítero" },
  USER: { cor: "bg-gray-100 text-gray-600", icon: GiChurch, label: "Usuário" },
};

// Modal de Detalhes do Usuário
const ModalUsuarioDetalhe = ({ 
  usuario, 
  onClose, 
  onAprovar,
  onBloquear,
  onDesbloquear,
  onExcluir,
  onEditar
}: { 
  usuario: Usuario; 
  onClose: () => void; 
  onAprovar: (id: number) => void;
  onBloquear: (id: number, motivo: string) => void;
  onDesbloquear: (id: number) => void;
  onExcluir: (id: number) => void;
  onEditar: (usuario: Usuario) => void;
}) => {
  const [motivoBloqueio, setMotivoBloqueio] = useState('');
  const [showBloqueioForm, setShowBloqueioForm] = useState(false);

  const roleInfo = roleBadgeMeta[resolveRoleKind(usuario.roles)];
  const RoleIcon = roleInfo.icon;

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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Detalhes do Usuário</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          {/* Info principal */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={usuario.img || 'https://via.placeholder.com/100'}
              alt={usuario.nome}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold">{usuario.nome}</h3>
              <p className="text-gray-500">{usuario.email}</p>
              {usuario.telefone && <p className="text-gray-500 text-sm">{usuario.telefone}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${roleInfo.cor}`}>
                  <RoleIcon size={12} />
                  {roleInfo.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  usuario.status === UserStatus.ATIVO ? 'bg-green-100 text-green-600' :
                  usuario.status === UserStatus.BLOQUEADO ? 'bg-red-100 text-red-600' :
                  usuario.status === UserStatus.PENDENTE ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {usuario.status ?? UserStatus.ATIVO}
                </span>
              </div>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Data de Cadastro</p>
              <p className="font-medium">
                {usuario.dataCadastro ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR') : "-"}
              </p>
            </div>
            {usuario.dataAprovacao && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Aprovado em</p>
                <p className="font-medium">{new Date(usuario.dataAprovacao).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
            {usuario.ultimoAcesso && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Último Acesso</p>
                <p className="font-medium">
                  {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')} às {' '}
                  {new Date(usuario.ultimoAcesso).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            )}
            {usuario.cidade && usuario.estado && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Localização</p>
                <p className="font-medium">{usuario.cidade}/{usuario.estado}</p>
              </div>
            )}
          </div>

          {/* Ministérios */}
          {usuario.ministerio && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Ministério</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                  {usuario.ministerio}
                </span>
              </div>
            </div>
          )}

          {/* Observações */}
          {usuario.observacoes && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">{usuario.observacoes}</p>
            </div>
          )}

          {/* Motivo de bloqueio */}
          {usuario.motivoBloqueio && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl">
              <p className="text-sm font-medium text-red-700 mb-1">Motivo do bloqueio:</p>
              <p className="text-sm text-red-600">{usuario.motivoBloqueio}</p>
            </div>
          )}

          {/* Formulário de bloqueio */}
          {showBloqueioForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium mb-2">Motivo do bloqueio</h4>
              <textarea
                value={motivoBloqueio}
                onChange={(e) => setMotivoBloqueio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                rows={3}
                placeholder="Descreva o motivo do bloqueio..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onBloquear(usuario.id, motivoBloqueio);
                    setShowBloqueioForm(false);
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirmar Bloqueio
                </button>
                <button
                  onClick={() => setShowBloqueioForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {usuario.status === UserStatus.PENDENTE && (
              <button
                onClick={() => {
                  onAprovar(usuario.id);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <FiCheckCircle size={18} />
                Aprovar Aderência
              </button>
            )}

            {usuario.status === UserStatus.ATIVO && (
              <button
                onClick={() => setShowBloqueioForm(true)}
                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2"
              >
                <FiLock size={18} />
                Bloquear Usuário
              </button>
            )}

            {usuario.status === UserStatus.BLOQUEADO && (
              <button
                onClick={() => onDesbloquear(usuario.id)}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <FiUnlock size={18} />
                Reativar Usuário
              </button>
            )}

            <button
              onClick={() => onEditar(usuario)}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <FiEdit2 size={18} />
              Editar
            </button>

            <button
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja excluir ${usuario.nome}?`)) {
                  onExcluir(usuario.id);
                  onClose();
                }
              }}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <FiTrash2 size={18} />
              Excluir
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente de Card de Usuário (versão pendente)
const UsuarioPendenteCard = ({ 
  usuario, 
  onAprovar,
  onRecusar,
  onVerDetalhe
}: { 
  usuario: Usuario; 
  onAprovar: (id: number) => void;
  onRecusar: (id: number) => void;
  onVerDetalhe: (usuario: Usuario) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border-l-4 border-l-yellow-500 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <img
          src={usuario.img || 'https://via.placeholder.com/60'}
          alt={usuario.nome}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{usuario.nome}</h3>
              <p className="text-sm text-gray-500">{usuario.email}</p>
              {usuario.telefone && <p className="text-sm text-gray-500">{usuario.telefone}</p>}
            </div>
            <span className="bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full">
              Pendente
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiCalendar size={14} />
              Solicitado em {usuario.dataCadastro ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR') : "-"}
            </span>
          </div>

          {usuario.observacoes && (
            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
              📝 {usuario.observacoes}
            </p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => onAprovar(usuario.id)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-1"
            >
              <FiCheckCircle size={16} />
              Aprovar
            </button>
            <button
              onClick={() => onRecusar(usuario.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1"
            >
              <FiXCircle size={16} />
              Recusar
            </button>
            <button
              onClick={() => onVerDetalhe(usuario)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
            >
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de Card de Usuário (versão normal)
const UsuarioCard = ({ 
  usuario, 
  onVerDetalhe,
  onBloquear,
  onEditar
}: { 
  usuario: Usuario; 
  onVerDetalhe: (usuario: Usuario) => void;
  onBloquear: (id: number) => void;
  onEditar: (usuario: Usuario) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const roleKind = resolveRoleKind(usuario.roles);
  const roleMeta = roleBadgeMeta[roleKind];
  const RoleIcon = roleMeta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start gap-3">
        <img
          src={usuario.img || 'https://via.placeholder.com/50'}
          alt={usuario.nome}
          className="w-12 h-12 rounded-full object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold truncate">{usuario.nome}</h3>
              <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiMoreVertical size={18} className="text-gray-500" />
              </button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 w-40 z-10"
                  >
                    <button
                      onClick={() => {
                        onVerDetalhe(usuario);
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiEye size={14} />
                      Detalhes
                    </button>
                    <button
                      onClick={() => {
                        onEditar(usuario);
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiEdit2 size={14} />
                      Editar
                    </button>
                    {usuario.status === UserStatus.ATIVO && (
                      <button
                        onClick={() => {
                          onBloquear(usuario.id);
                          setShowOptions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                      >
                        <FiLock size={14} />
                        Bloquear
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <RoleIcon size={16} />
              {roleMeta.label}
            </span>
            <span className={`w-2 h-2 rounded-full ${
              usuario.status === UserStatus.ATIVO ? 'bg-green-500' :
              usuario.status === UserStatus.BLOQUEADO ? 'bg-red-500' :
              'bg-gray-500'
            }`} />
            <span className="text-xs text-gray-400">
              {usuario.dataCadastro ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR') : "-"}
            </span>
          </div>

          {usuario.cidade && usuario.estado && (
            <p className="text-xs text-gray-400 mt-1">
              {usuario.cidade}/{usuario.estado}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal
export const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<RoleKind | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'todos'>('todos');
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [showDetalheModal, setShowDetalheModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'pendentes'>('todos');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch("/admin/user", { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar usuários.");
        const payload = (await res.json()) as Usuario[];
        setUsuarios(payload ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setUsuarios([]);
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar usuários.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [reloadToken]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = usuarios.length;
    const pendentes = usuarios.filter((u) => u.status === UserStatus.PENDENTE).length;
    const ativos = usuarios.filter((u) => u.status === UserStatus.ATIVO).length;
    const bloqueados = usuarios.filter((u) => u.status === UserStatus.BLOQUEADO).length;
    return { total, pendentes, ativos, bloqueados };
  }, [usuarios]);

  // Filtrar usuários
  const filteredUsuarios = usuarios.filter(u => {
    // Filtro por aba
    if (activeTab === 'pendentes' && u.status !== UserStatus.PENDENTE) return false;

    // Busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        u.nome.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.telefone ?? "").includes(term);
      if (!matches) return false;
    }

    // Filtro por role
    if (filterRole !== 'todos' && resolveRoleKind(u.roles) !== filterRole) return false;

    // Filtro por status
    if (filterStatus !== 'todos' && u.status !== filterStatus) return false;

    return true;
  });

  const withPending = (id: number, active: boolean) => {
    setPendingIds((current) => (active ? [...current, id] : current.filter((x) => x !== id)));
  };

  const handleAprovar = async (id: number) => {
    setActionError("");
    withPending(id, true);
    try {
      const res = await apiFetch(`/admin/user/${id}/aprovar`, { method: "PUT" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Falha ao aprovar usuário.");
      }
      const payload = (await res.json()) as Usuario;
      setUsuarios((current) => current.map((u) => (u.id === id ? payload : u)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Falha ao aprovar usuário.");
    } finally {
      withPending(id, false);
    }
  };

  const handleDesbloquear = async (id: number) => {
    setActionError("");
    withPending(id, true);
    try {
      const res = await apiFetch(`/admin/user/${id}/desbloquear`, { method: "PUT" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Falha ao desbloquear usuário.");
      }
      const payload = (await res.json()) as Usuario;
      setUsuarios((current) => current.map((u) => (u.id === id ? payload : u)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Falha ao desbloquear usuário.");
    } finally {
      withPending(id, false);
    }
  };

  const handleRecusar = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja recusar este pedido?")) return;
    await handleExcluir(id);
  };

  const handleBloquear = async (id: number, motivo: string) => {
    setActionError("");
    withPending(id, true);
    try {
      const res = await apiFetch(`/admin/user/${id}/bloquear`, { method: "PUT", body: { motivo } });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Falha ao bloquear usuário.");
      }
      const payload = (await res.json()) as Usuario;
      setUsuarios((current) => current.map((u) => (u.id === id ? payload : u)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Falha ao bloquear usuário.");
    } finally {
      withPending(id, false);
    }
  };

  const handleExcluir = async (id: number) => {
    setActionError("");
    withPending(id, true);
    try {
      const res = await apiFetch(`/admin/user/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Falha ao excluir usuário.");
      }
      setUsuarios((current) => current.filter((u) => u.id !== id));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Falha ao excluir usuário.");
    } finally {
      withPending(id, false);
    }
  };

  const handleEditar = (usuarioEditado: Usuario) => {
    // Aqui abriria modal de edição
    console.log('Editar:', usuarioEditado);
  };

  const openUserDetails = async (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowDetalheModal(true);
    setActionError("");
    try {
      const res = await apiFetch(`/admin/user/${usuario.id}`);
      if (!res.ok) return;
      const payload = (await res.json()) as Usuario;
      setSelectedUsuario(payload);
      setUsuarios((current) => current.map((u) => (u.id === payload.id ? payload : u)));
    } catch {
      // ignore (mantém dados da lista)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
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
            Gestão de Usuários
          </h1>
          <p className="text-gray-500">
            Gerencie membros, visitantes e pedidos de adesão à comunidade
          </p>
          {(loading || loadError || actionError) && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
              <div className="text-sm">
                {loading && <span className="text-gray-500">Carregando...</span>}
                {!loading && loadError && <span className="text-red-600">{loadError}</span>}
                {!loading && !loadError && actionError && <span className="text-red-600">{actionError}</span>}
              </div>
              <button
                onClick={() => setReloadToken((t) => t + 1)}
                disabled={loading}
                className={`px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Atualizar
              </button>
            </div>
          )}
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border-l-4 border-l-primary-500">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border-l-4 border-l-yellow-500">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border-l-4 border-l-green-500">
            <p className="text-sm text-gray-500">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border-l-4 border-l-red-500">
            <p className="text-sm text-gray-500">Bloqueados</p>
            <p className="text-2xl font-bold text-red-600">{stats.bloqueados}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('todos')}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors relative ${
                activeTab === 'todos'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todos os Usuários
              {activeTab === 'todos' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('pendentes')}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors relative flex items-center justify-center gap-2 ${
                activeTab === 'pendentes'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pedidos de Aderência
              {stats.pendentes > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendentes}
                </span>
              )}
              {activeTab === 'pendentes' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                />
              )}
            </button>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtro por role */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as RoleKind | 'todos')}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todos">Todos os cargos</option>
              <option value="ADMIN">Admins</option>
              <option value="PRESBITERO">Presbíteros</option>
              <option value="USER">Usuários</option>
            </select>

            {/* Filtro por status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as UserStatus | 'todos')}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todos">Todos os status</option>
              <option value={UserStatus.ATIVO}>Ativos</option>
              <option value={UserStatus.PENDENTE}>Pendentes</option>
              <option value={UserStatus.BLOQUEADO}>Bloqueados</option>
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
          </div>
        </div>

        {/* Lista de Usuários */}
        {filteredUsuarios.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
            <FiUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filterRole !== 'todos' || filterStatus !== 'todos'
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Nenhum usuário cadastrado'}
            </p>
            {(searchTerm || filterRole !== 'todos' || filterStatus !== 'todos') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('todos');
                  setFilterStatus('todos');
                }}
                className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'pendentes' ? (
              // Cards de pendentes (formato especial)
              filteredUsuarios.map((usuario) => (
                <UsuarioPendenteCard
                  key={usuario.id}
                  usuario={usuario}
                  onAprovar={handleAprovar}
                  onRecusar={handleRecusar}
                  onVerDetalhe={(u) => {
                    openUserDetails(u);
                  }}
                />
              ))
            ) : (
              // Grid de cards normais
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredUsuarios.map((usuario) => (
                    <UsuarioCard
                      key={usuario.id}
                      usuario={usuario}
                      onVerDetalhe={(u) => {
                        openUserDetails(u);
                      }}
                      onBloquear={(id) => handleBloquear(id, 'Motivo padrão')}
                      onEditar={handleEditar}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {showDetalheModal && selectedUsuario && (
            <ModalUsuarioDetalhe
              usuario={selectedUsuario}
              onClose={() => {
                setShowDetalheModal(false);
                setSelectedUsuario(null);
              }}
              onAprovar={handleAprovar}
              onBloquear={handleBloquear}
              onDesbloquear={handleDesbloquear}
              onExcluir={handleExcluir}
              onEditar={handleEditar}
            />
        )}
      </AnimatePresence>
    </div>
  );
};
