// src/pages/Perfil/PerfilPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
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
  FiClock,
  FiCamera,
  FiCheckCircle,
  FiHeart,
  FiAlertCircle,
  FiLogOut,
  FiDownload
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiHeartBeats
} from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { LiaBibleSolid } from "react-icons/lia";
import { apiFetch } from "../../utils/api";
import { clearAuthSession, getAuthToken, setAuthSession } from "../../utils/auth";
import { ActividadeSummary, ComentarioStatus, ComentarioType, MidiaType, PageResponse, StatusIncritos, UserData, UserDownloadDto } from "../../types/api";

type PerfilTab = "info" | "actividades" | "comentarios" | "favoritos" | "downloads";

type UserProfilePayload = {
  nome?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  cidade?: string;
  estado?: string;
  igreja?: string;
  dataBatismo?: string;
  ministerio?: string;
  cargo?: string;
  observacoes?: string;
};

type UserActividadeInscrita = {
  id: number;
  titulo: string;
  tema?: string;
  endereco?: string;
  tipoEvento?: string;
  publicoAlvo?: string;
  duracao?: string;
  dataEvento?: string;
  img?: string;
  dataInscricao?: string;
  status?: StatusIncritos;
};

type UserComentarioData = {
  id: number;
  seccao: ComentarioType;
  seccaoId: number;
  seccaoTitulo: string;
  descricao: string;
  dataPublicacao?: string;
  likes: number;
  status: ComentarioStatus;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
};

const formatDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
};

const getInitials = (nome?: string) => {
  const safe = (nome ?? "").trim();
  if (!safe) return "U";
  const parts = safe.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
};

// Componente de Informações Pessoais
const InformacoesPessoais = ({ user, onUserUpdated }: { user: UserData; onUserUpdated: (u: UserData) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const initialEditData = useMemo<UserProfilePayload>(() => {
    return {
      nome: user.nome ?? "",
      email: user.email ?? "",
      telefone: user.telefone ?? "",
      dataNascimento: user.dataNascimento ?? "",
      cidade: user.cidade ?? "",
      estado: user.estado ?? "",
      igreja: user.igreja ?? "",
      dataBatismo: user.dataBatismo ?? "",
      ministerio: user.ministerio ?? "",
      cargo: user.cargo ?? "",
      observacoes: user.observacoes ?? "",
    };
  }, [user]);

  const [editData, setEditData] = useState<UserProfilePayload>(initialEditData);

  useEffect(() => {
    setEditData(initialEditData);
  }, [initialEditData]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const payload: UserProfilePayload = {
        nome: editData.nome?.trim() || undefined,
        email: editData.email?.trim() || undefined,
        telefone: editData.telefone?.trim() || undefined,
        dataNascimento: editData.dataNascimento || undefined,
        cidade: editData.cidade?.trim() || undefined,
        estado: editData.estado?.trim() || undefined,
        igreja: editData.igreja?.trim() || undefined,
        dataBatismo: editData.dataBatismo || undefined,
        ministerio: editData.ministerio?.trim() || undefined,
        cargo: editData.cargo?.trim() || undefined,
        observacoes: editData.observacoes?.trim() || undefined,
      };

      const res = await apiFetch("/user/me", { method: "PUT", body: payload });
      if (!res.ok) {
        let msg = "Não foi possível salvar o perfil.";
        try {
          const json = await res.json();
          if (json?.message) msg = json.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const updated = (await res.json()) as UserData;
      onUserUpdated(updated);
      setAuthSession({ token: getAuthToken(), user: updated });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  const fields = useMemo(() => {
    return [
      { key: "nome", label: "Nome Completo", icon: FiUser, type: "text" as const },
      { key: "email", label: "E-mail", icon: FiMail, type: "email" as const },
      { key: "telefone", label: "Telefone", icon: FiPhone, type: "tel" as const },
      { key: "dataNascimento", label: "Data de Nascimento", icon: FiCalendar, type: "date" as const },
      { key: "cidade", label: "Cidade", icon: FiMapPin, type: "text" as const },
      { key: "estado", label: "Estado", icon: FiMapPin, type: "text" as const },
      { key: "igreja", label: "Igreja", icon: LiaBibleSolid, type: "text" as const },
      { key: "dataBatismo", label: "Data de Batismo", icon: FiCalendar, type: "date" as const },
      { key: "ministerio", label: "Ministério", icon: GiPrayer, type: "text" as const },
      { key: "cargo", label: "Cargo/Função", icon: FiUser, type: "text" as const },
    ] as const;
  }, []);

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
              onClick={() => {
                setEditData(initialEditData);
                setIsEditing(false);
                setError("");
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={18} />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiSave size={16} />
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const Icon = field.icon;
          const key = field.key;
          const value = isEditing ? (editData as any)[key] : (user as any)[key];

          if (!isEditing && (value == null || String(value).trim() === "")) {
            return null;
          }

          return (
            <div key={String(key)} className="space-y-1">
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <Icon size={14} />
                {field.label}
              </label>
              {isEditing ? (
                <input
                  type={field.type}
                  value={String(value ?? "")}
                  onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              ) : (
                <p className="font-medium">{key === "dataNascimento" || key === "dataBatismo" ? formatDate(String(value)) : String(value)}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold mb-4">Conta</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-gray-500">Status</span>
            <span className="font-medium">{user.status ?? "--"}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-gray-500">Permissões</span>
            <span className="font-medium">{user.roles ?? "--"}</span>
          </div>
          {user.dataCadastro && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-500">Cadastro</span>
              <span className="font-medium">{formatDateTime(user.dataCadastro)}</span>
            </div>
          )}
          {user.ultimoAcesso && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-500">Último acesso</span>
              <span className="font-medium">{formatDateTime(user.ultimoAcesso)}</span>
            </div>
          )}
          {user.motivoBloqueio && (
            <div className="md:col-span-2 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3">
              <div className="text-gray-600 text-xs mb-1">Motivo do bloqueio</div>
              <div className="font-medium text-gray-900">{user.motivoBloqueio}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MinhasActividades = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PageResponse<UserActividadeInscrita> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch("/user/me/actividades?page=0&size=20");
        if (!res.ok) {
          let msg = "Não foi possível carregar suas actividades.";
          try {
            const json = await res.json();
            if (json?.message) msg = json.message;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }
        const payload = (await res.json()) as PageResponse<UserActividadeInscrita>;
        if (!active) return;
        setData(payload);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Não foi possível carregar suas actividades.");
        setData(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiClock className="text-primary" />
        Minhas Actividades
      </h3>

      {loading ? (
        <div className="py-10 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      ) : (data?.content?.length ?? 0) === 0 ? (
        <div className="text-center py-12">
          <FiClock className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma actividade encontrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(data?.content ?? []).map((atividade) => (
            <motion.div
              key={atividade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <img
                src={atividade.img || "https://via.placeholder.com/100"}
                alt=""
                className="w-16 h-16 rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{atividade.titulo}</h4>
                    {atividade.tema && <p className="text-sm text-gray-600">{atividade.tema}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                      {atividade.dataEvento && <span>{formatDateTime(atividade.dataEvento)}</span>}
                      {atividade.status && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                          <FiCheckCircle size={10} />
                          {atividade.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={`/actividades/${atividade.id}`}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
              >
                Ver
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const MeusComentarios = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PageResponse<UserComentarioData> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch("/user/me/comentarios?page=0&size=20");
        if (!res.ok) {
          let msg = "Não foi possível carregar seus comentários.";
          try {
            const json = await res.json();
            if (json?.message) msg = json.message;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }
        const payload = (await res.json()) as PageResponse<UserComentarioData>;
        if (!active) return;
        setData(payload);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Não foi possível carregar seus comentários.");
        setData(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiClock className="text-primary" />
        Meus Comentários
      </h3>

      {loading ? (
        <div className="py-10 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      ) : (data?.content?.length ?? 0) === 0 ? (
        <div className="text-center py-12">
          <FiClock className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum comentário encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(data?.content ?? []).map((comentario) => {
            const link =
              comentario.seccao === ComentarioType.Actividade
                ? `/actividades/${comentario.seccaoId}`
                : comentario.seccao === ComentarioType.Artigo
                ? `/artigos/${comentario.seccaoId}`
                : `/midia/${comentario.seccaoId}`;

            return (
              <motion.div
                key={comentario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {comentario.seccao} • {comentario.dataPublicacao ? formatDate(comentario.dataPublicacao) : "--"}
                    </div>
                    <div className="font-semibold">{comentario.seccaoTitulo}</div>
                    <div className="text-sm text-gray-700 mt-1">{comentario.descricao}</div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{comentario.likes ?? 0} likes</span>
                      <span className="px-2 py-1 rounded-full bg-white border border-gray-200">{comentario.status}</span>
                    </div>
                  </div>
                  <Link to={link} className="text-sm text-primary hover:underline">
                    Ver
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MeusFavoritos = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PageResponse<ActividadeSummary> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch("/user/me/favoritos/actividades?page=0&size=20");
        if (!res.ok) {
          let msg = "Não foi possível carregar seus favoritos.";
          try {
            const json = await res.json();
            if (json?.message) msg = json.message;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }
        const payload = (await res.json()) as PageResponse<ActividadeSummary>;
        if (!active) return;
        setData(payload);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Não foi possível carregar seus favoritos.");
        setData(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiHeart className="text-primary" />
        Favoritos
      </h3>

      {loading ? (
        <div className="py-10 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      ) : (data?.content?.length ?? 0) === 0 ? (
        <div className="text-center py-12">
          <FiHeart className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma actividade favoritada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(data?.content ?? []).map((atividade) => (
            <motion.div
              key={String(atividade.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <img src={atividade.img || "https://via.placeholder.com/100"} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{atividade.titulo}</div>
                {atividade.tema && <div className="text-sm text-gray-600">{atividade.tema}</div>}
                {atividade.dataEvento && <div className="text-xs text-gray-500 mt-1">{formatDateTime(atividade.dataEvento)}</div>}
              </div>
              <Link
                to={`/actividades/${atividade.id}`}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
              >
                Ver
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const MeusDownloads = () => {
  const [active, setActive] = useState<"artigos" | "midias">("artigos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [artigosPage, setArtigosPage] = useState(0);
  const [midiasPage, setMidiasPage] = useState(0);
  const [midiasType, setMidiasType] = useState<MidiaType | "TODOS">("TODOS");
  const [artigos, setArtigos] = useState<PageResponse<UserDownloadDto> | null>(null);
  const [midias, setMidias] = useState<PageResponse<UserDownloadDto> | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (active === "artigos") {
          const res = await apiFetch(`/user/me/downloads/artigos?page=${artigosPage}&size=10`);
          if (!res.ok) throw new Error("Não foi possível carregar seus downloads de artigos.");
          const payload = (await res.json()) as PageResponse<UserDownloadDto>;
          if (!mounted) return;
          setArtigos(payload);
        } else {
          const params = new URLSearchParams();
          params.set("page", String(midiasPage));
          params.set("size", "10");
          if (midiasType !== "TODOS") params.set("midiaType", String(midiasType));
          const res = await apiFetch(`/user/me/downloads/midias?${params.toString()}`);
          if (!res.ok) throw new Error("Não foi possível carregar seus downloads de mídias.");
          const payload = (await res.json()) as PageResponse<UserDownloadDto>;
          if (!mounted) return;
          setMidias(payload);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Não foi possível carregar seus downloads.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [active, artigosPage, midiasPage, midiasType]);

  const data = active === "artigos" ? artigos : midias;
  const items = data?.content ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FiDownload className="text-primary" />
          Meus Downloads
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActive("artigos");
              setError("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === "artigos" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Artigos
          </button>
          <button
            onClick={() => {
              setActive("midias");
              setError("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === "midias" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Mídias
          </button>
        </div>
      </div>

      {active === "midias" && (
        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm text-gray-600">Tipo:</label>
          <select
            value={midiasType}
            onChange={(e) => {
              setMidiasPage(0);
              setMidiasType(e.target.value as any);
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="TODOS">Todos</option>
            <option value={MidiaType.Video}>Vídeo</option>
            <option value={MidiaType.Audio}>Áudio</option>
            <option value={MidiaType.Image}>Imagem</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="py-10 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <FiDownload className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum download registrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const titulo =
              active === "artigos"
                ? item.artigoTitulo || `Artigo #${item.artigoId ?? "-"}`
                : item.midiaTitulo || `Mídia #${item.midiaId ?? "-"}`;

            const link =
              active === "artigos"
                ? item.artigoId
                  ? `/artigos/${item.artigoId}`
                  : null
                : item.midiaId
                ? `/midia/${item.midiaId}`
                : null;

            const image = active === "artigos" ? item.artigoImagem : item.midiaImagem;
            const openUrl = active === "artigos" ? item.artigoPdf : item.midiaUrl;

            return (
              <motion.div
                key={String(item.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={image || "https://via.placeholder.com/64"}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover bg-white"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{titulo}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.data ? formatDateTime(item.data) : "--"}
                          {active === "midias" && item.midiaType ? ` • ${item.midiaType}` : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {openUrl && (
                          <a
                            href={openUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                          >
                            Abrir
                          </a>
                        )}
                        {link && (
                          <Link to={link} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20">
                            Ver
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && !error && (data?.totalPages ?? 0) > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => (active === "artigos" ? setArtigosPage((p) => Math.max(0, p - 1)) : setMidiasPage((p) => Math.max(0, p - 1)))}
            disabled={(active === "artigos" ? artigosPage : midiasPage) <= 0}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <div className="text-sm text-gray-600">
            Página <span className="font-semibold">{(active === "artigos" ? artigosPage : midiasPage) + 1}</span> de{" "}
            <span className="font-semibold">{data?.totalPages ?? 1}</span>
          </div>
          <button
            onClick={() =>
              active === "artigos"
                ? setArtigosPage((p) => Math.min((artigos?.totalPages ?? 1) - 1, p + 1))
                : setMidiasPage((p) => Math.min((midias?.totalPages ?? 1) - 1, p + 1))
            }
            disabled={(active === "artigos" ? artigosPage : midiasPage) >= (data?.totalPages ?? 1) - 1}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

// Componente Principal do Perfil
export const PerfilPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PerfilTab>("info");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarUrlOk, setAvatarUrlOk] = useState(true);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch("/user/me");
        if (!res.ok) {
          let msg = "Não foi possível carregar o perfil.";
          try {
            const json = await res.json();
            if (json?.message) msg = json.message;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }
        const payload = (await res.json()) as UserData;
        if (!active) return;
        setUser(payload);
        setAuthSession({ token: getAuthToken(), user: payload });
      } catch (err) {
        if (!active) return;
        setUser(null);
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar o perfil.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const avatarUrl = useMemo(() => {
    const raw = (user?.img ?? "").trim();
    return raw ? raw : "";
  }, [user?.img]);

  useEffect(() => {
    setAvatarUrlOk(true);
  }, [avatarUrl]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/auth/login");
  };

  const handlePickAvatar = () => {
    if (avatarBusy) return;
    setAvatarError("");
    fileRef.current?.click();
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!file || avatarBusy) return;
    setAvatarBusy(true);
    setAvatarError("");
    try {
      const formData = new FormData();
      formData.append("img", file);
      const res = await apiFetch("/user/me/avatar", { method: "PUT", body: formData });
      if (!res.ok) {
        let msg = "Não foi possível atualizar a foto.";
        try {
          const json = await res.json();
          if (json?.message) msg = json.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const updated = (await res.json()) as UserData;
      setUser(updated);
      setAuthSession({ token: getAuthToken(), user: updated });
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Não foi possível atualizar a foto.");
    } finally {
      setAvatarBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-2xl shadow p-6 text-sm text-red-700 border border-red-100 flex items-center gap-2">
            <FiAlertCircle />
            <span>{loadError}</span>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-700">Perfil indisponível.</div>
        ) : (
          <>
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
                {avatarUrl && avatarUrlOk ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarUrlOk(false)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/20 text-white text-3xl font-bold">
                    {getInitials(user.nome)}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handlePickAvatar}
                className={`absolute bottom-0 right-0 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors ${
                  avatarBusy ? "opacity-60 pointer-events-none" : ""
                }`}
                title="Alterar foto"
              >
                <FiCamera size={16} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
              />
              {(avatarBusy || avatarError) && (
                <div className="mt-2 text-xs">
                  {avatarBusy ? <span className="text-white/90">Atualizando foto...</span> : <span className="text-red-100">{avatarError}</span>}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.nome}</h1>
              <p className="text-white/80 flex items-center gap-2">
                <FiMail size={16} />
                {user.email}
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                {user.dataCadastro && (
                  <span className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                    <GiHeartBeats />
                    Membro desde {new Date(user.dataCadastro).getFullYear()}
                  </span>
                )}
                {user.ministerio && (
                  <span className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                    <GiPrayer />
                    {user.ministerio}
                  </span>
                )}
              </div>
            </div>

            {/* Botão sair */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <FiLogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Abas de navegação */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'info', label: 'Informações Pessoais', icon: FiUser },
            { id: 'actividades', label: 'Actividades', icon: FiClock },
            { id: 'comentarios', label: 'Comentários', icon: FiClock },
            { id: 'favoritos', label: 'Favoritos', icon: FiHeart },
            { id: 'downloads', label: 'Downloads', icon: FiDownload }
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
            {activeTab === "info" && <InformacoesPessoais user={user} onUserUpdated={setUser} />}
            {activeTab === "actividades" && <MinhasActividades />}
            {activeTab === "comentarios" && <MeusComentarios />}
            {activeTab === "favoritos" && <MeusFavoritos />}
            {activeTab === "downloads" && <MeusDownloads />}
          </motion.div>
        </AnimatePresence>
        </>
        )}
      </div>
    </div>
  );
};
