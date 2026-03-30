// src/pages/Admin/ConfiguracoesPage.tsx
import { useEffect, useState } from "react";
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
  FiUpload,
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
import { apiFetch } from "../../utils/api";
import { compressImageToMaxBytes } from "../../utils/imageCompression";
import { AdminConfigDto, CarouselItemDto, ConfigType, ConfiguracaoDto } from "../../types/api";
import { SecaoConfiguracao } from "../../components/config/SeccaoConfiguracoes";
import { CampoConfiguracao } from "../../components/config/CampoConfiguracao";
import { ToggleSwitch } from "../../components/config/TogleSwitch";
import { TipoAtividadeCard } from "../../components/config/TipoActividadeCard";
import { ModalEditarTipo } from "../../components/config/ModalEditarTipo";

// Tipos baseados no JSON
export interface ConfiguracaoTipoAtividade {
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

interface ConfiguracaoCarroselVisible {
  visible: {
    enabled: boolean;
  };
}

interface ConfiguracaoContacto {
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
  horariosCulto: { dia: string; horarios: string[] }[];
}

type CarouselImage = CarouselItemDto;

interface Configuracoes {
  dashboard: ConfiguracaoDashboard;
  messages: ConfiguracaoMensagens;
  inscricoes: ConfiguracaoInscricoes;
  activities: ConfiguracaoActivities;
  homeCarousel: CarouselImage[];
  homeCarouselVisible: ConfiguracaoCarroselVisible;
  contacto: ConfiguracaoContacto;
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
  homeCarouselVisible:{
    visible: {
      enabled: true
    }
  },
  contacto: {
    telefone: "(11) 3333-4444",
    whatsapp: "+5511999999999",
    email: "contato@igrejabaluarte.com",
    endereco: "Rua da Igreja, 123 - Centro, Cidade/UF",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      twitter: "https://twitter.com",
    },
    horariosCulto: [
      { dia: "Domingo", horarios: ["09:00 - Escola Bíblica", "19:00 - Culto de Celebração"] },
      { dia: "Quarta-feira", horarios: ["20:00 - Culto de Oração"] },
      { dia: "Sábado", horarios: ["19:00 - Ensaio do Louvor"] },
    ],
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
      id: 1,
      url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      titulo: "Culto de celebração",
      legenda: "Louvor, ensino e comunhão com toda a família Baluarte.",
      ordem: 1
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      titulo: "Jovens on fire",
      legenda: "Experiências profundas e momentos de oração impactantes.",
      ordem: 2
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
      titulo: "Ministério infantil",
      legenda: "Crianças aprendendo a Palavra com alegria e criatividade.",
      ordem: 3
    }
  ]
};

// Mapeamento de ícones (para exibição)
export const iconMap: Record<string, any> = {
  GiPrayer: GiPrayer,
  GiPartyPopper: GiPartyPopper,
  GiBible: LiaBibleSolid,
  GiHeartBeats: GiHeartBeats,
  GiFamilyHouse: GiFamilyHouse,
  GiChoir: LiaChairSolid
};


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
  const [carouselUpload, setCarouselUpload] = useState<{
    file: File | null;
    titulo: string;
    legenda: string;
  }>({
    file: null,
    titulo: "",
    legenda: "",
  });
  const [carouselUploading, setCarouselUploading] = useState(false);

  const asNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const asBoolean = (value: unknown) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "sim"].includes(normalized)) return true;
      if (["false", "0", "no", "nao", "não"].includes(normalized)) return false;
    }
    return null;
  };

  const asString = (value: unknown) => {
    if (typeof value === "string") return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    return null;
  };

  const asHorariosCulto = (value: unknown) => {
    if (!Array.isArray(value)) return null;
    const items = value
      .map((item) => {
        const dia = typeof item?.dia === "string" ? item.dia : "";
        const horarios = Array.isArray(item?.horarios)
          ? item.horarios.filter((h: any) => typeof h === "string" && h.trim()).map((h: string) => h.trim())
          : [];
        return { dia: dia.trim(), horarios };
      })
      .filter((i) => i.dia && i.horarios.length > 0);
    return items;
  };

  function switchTypeConfig(config: ConfiguracaoDto) {
    switch (config.type as ConfigType) {
      case "HomeCarouselVisible": {
        const enabled = asBoolean(config.value);
        if (enabled === null) return;
        setConfiguracoes((prev) => ({
          ...prev,
          homeCarouselVisible: { visible: { enabled } },
        }));
        break;
      }
      case "DashboardRefreshIntervalMs": {
        const refreshIntervalMs = asNumber(config.value);
        if (refreshIntervalMs === null) return;
        setConfiguracoes((prev) => ({
          ...prev,
          dashboard: { ...prev.dashboard, refreshIntervalMs: Math.max(0, Math.trunc(refreshIntervalMs)) },
        }));
        break;
      }
      case "MensagemUnreadDays": {
        const unreadDays = asNumber(config.value);
        if (unreadDays === null) return;
        setConfiguracoes((prev) => ({
          ...prev,
          messages: {
            ...prev.messages,
            retention: { unreadDays: Math.max(0, Math.trunc(unreadDays)) },
          },
        }));
        break;
      }
      case "MensagemReenviarPendentes": {
        const reenviarPendentes = asBoolean(config.value);
        if (reenviarPendentes === null) return;
        setConfiguracoes((prev) => ({
          ...prev,
          messages: {
            ...prev.messages,
            actions: { reenviarPendentes },
          },
        }));
        break;
      }
      case "InscricaoQrEnabled": {
        const enabled = asBoolean(config.value);
        if (enabled === null) return;
        setConfiguracoes((prev) => ({
          ...prev,
          inscricoes: {
            ...prev.inscricoes,
            qr: { ...prev.inscricoes.qr, enabled },
          },
        }));
        break;
      }
      case "InscricaoQrAutoDisable": {
        const autoDisableAfterActivity = asBoolean(config.value);
        if (autoDisableAfterActivity === null) return;
        setConfiguracoes((prev) => ({
          ...prev,
          inscricoes: {
            ...prev.inscricoes,
            qr: { ...prev.inscricoes.qr, autoDisableAfterActivity },
          },
        }));
        break;
      }
      case "InscricaoQrExpiresHours": {
        const expiresAfterHours = asNumber(config.value);
        if (expiresAfterHours === null) return;
        setConfiguracoes((prev) => ({
          ...prev,
          inscricoes: {
            ...prev.inscricoes,
            qr: { ...prev.inscricoes.qr, expiresAfterHours: Math.max(0, Math.trunc(expiresAfterHours)) },
          },
        }));
        break;
      }
      case "ContactTelefone": {
        const telefone = asString(config.value);
        if (telefone === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, telefone } }));
        break;
      }
      case "ContactWhatsapp": {
        const whatsapp = asString(config.value);
        if (whatsapp === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, whatsapp } }));
        break;
      }
      case "ContactEmail": {
        const email = asString(config.value);
        if (email === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, email } }));
        break;
      }
      case "ContactEndereco": {
        const endereco = asString(config.value);
        if (endereco === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, endereco } }));
        break;
      }
      case "ContactFacebookUrl": {
        const facebook = asString(config.value);
        if (facebook === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, facebook } } }));
        break;
      }
      case "ContactInstagramUrl": {
        const instagram = asString(config.value);
        if (instagram === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, instagram } } }));
        break;
      }
      case "ContactYoutubeUrl": {
        const youtube = asString(config.value);
        if (youtube === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, youtube } } }));
        break;
      }
      case "ContactTwitterUrl": {
        const twitter = asString(config.value);
        if (twitter === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, twitter } } }));
        break;
      }
      case "ContactHorariosCulto": {
        const horariosCulto = asHorariosCulto(config.value);
        if (horariosCulto === null) return;
        setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, horariosCulto } }));
        break;
      }
      default:
        break;
    }
  }

  const loadConfiguracoes = async () => {
    const [appRes, allRes] = await Promise.all([
      apiFetch(`/admin/config/app`),
      apiFetch(`/admin/config/all`),
    ]);

    if (appRes.ok) {
      const payload = (await appRes.json()) as AdminConfigDto;
      setConfiguracoes((prev) => ({
        ...prev,
        dashboard: payload.dashboard,
        messages: payload.messages,
        inscricoes: payload.inscricoes,
        activities: payload.activities,
        homeCarousel: payload.homeCarousel,
      }));
    }

    if (allRes.ok) {
      const payload = (await allRes.json()) as ConfiguracaoDto[];
      payload.forEach((item) => switchTypeConfig(item));
    }
  };

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(async () => {
      try {
        if (!active) return;
        await loadConfiguracoes();
      } catch {
        // noop
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, []);

  const handleSave = async () => {
    try {
      const appPayload: AdminConfigDto = {
        dashboard: configuracoes.dashboard,
        messages: configuracoes.messages,
        inscricoes: configuracoes.inscricoes,
        activities: configuracoes.activities,
        homeCarousel: configuracoes.homeCarousel,
      };

      const [appRes, visibleRes, ...contactRes] = await Promise.all([
        apiFetch(`/admin/config/app`, { method: "PUT", body: appPayload }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: {
            type: ConfigType.HomeCarouselVisible,
            value: configuracoes.homeCarouselVisible.visible.enabled ? 1 : 0,
          } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactTelefone, value: configuracoes.contacto.telefone } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactWhatsapp, value: configuracoes.contacto.whatsapp } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactEmail, value: configuracoes.contacto.email } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactEndereco, value: configuracoes.contacto.endereco } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactFacebookUrl, value: configuracoes.contacto.socials.facebook } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactInstagramUrl, value: configuracoes.contacto.socials.instagram } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactYoutubeUrl, value: configuracoes.contacto.socials.youtube } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactTwitterUrl, value: configuracoes.contacto.socials.twitter } satisfies ConfiguracaoDto,
        }),
        apiFetch(`/admin/config/edit`, {
          method: "PUT",
          body: { type: ConfigType.ContactHorariosCulto, value: configuracoes.contacto.horariosCulto } satisfies ConfiguracaoDto,
        }),
      ]);

      if (!appRes.ok || !visibleRes.ok || contactRes.some((r) => !r.ok)) {
        throw new Error("Falha ao salvar configurações.");
      }

      await loadConfiguracoes();
      setEditando(false);
      alert("Configurações salvas com sucesso!");
    } catch {
      alert("Não foi possível salvar as configurações.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Restaurar configurações padrão?")) {
      loadConfiguracoes().catch(() => {});
    }
  };

  const handleAddCarouselImage = () => {
    const titulo = carouselForm.titulo.trim();
    const url = carouselForm.url.trim();
    if (!titulo || !url) return;

    const novo: CarouselImage = {
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

  const handleUploadCarouselImage = async () => {
    if (!carouselUpload.file) return;
    const titulo = carouselUpload.titulo.trim();
    if (!titulo) return;

    try {
      setCarouselUploading(true);
      const file = await compressImageToMaxBytes(carouselUpload.file, { maxBytes: 1_000_000 });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("titulo", titulo);
      if (carouselUpload.legenda.trim()) {
        formData.append("legenda", carouselUpload.legenda.trim());
      }

      const response = await apiFetch(`/admin/config/home-carousel/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Falha ao fazer upload.");
      }

      const created = (await response.json()) as CarouselItemDto;
      setConfiguracoes((prev) => ({
        ...prev,
        homeCarousel: [...prev.homeCarousel, created].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)),
      }));
      setCarouselUpload({ file: null, titulo: "", legenda: "" });
    } catch {
      alert("Não foi possível fazer upload da imagem.");
    } finally {
      setCarouselUploading(false);
    }
  };

  const handleRemoveCarouselImage = (id: number | undefined, index: number) => {
    setConfiguracoes({
      ...configuracoes,
      homeCarousel: configuracoes.homeCarousel
        .filter((item, idx) => (typeof id === "number" ? item.id !== id : idx !== index))
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
            <div className="space-y-4 mb-8">
              <p className="text-sm text-gray-500">
                Defina aqui as imagens que vão aparecer no carrossel da página inicial. Reordene, edite ou remova banners para controlar a narrativa visual.
              </p>

              <div className="space-y-3">
                {configuracoes.homeCarousel.map((item, index) => (
                  <div
                    key={item.id ?? item.url ?? index}
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
                        onClick={() => handleRemoveCarouselImage(item.id, index)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Adicionar por URL</p>
                    <CampoConfiguracao label="URL da imagem">
                      <input
                        type="text"
                        placeholder="https://..."
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
                      Adicionar (URL)
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Upload (Cloudinary)</p>
                    <CampoConfiguracao label="Imagem">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                          <label className={`"relative flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl ${editando&&"hover:border-primary-500 hover:bg-primary-50/30"}  transition-all cursor-pointer group"`}>
                            <FiImage className={`text-gray-400 ${editando&&"group-hover:text-primary-500"} transition-colors`} size={20} />
                            <span  className={`text-sm text-gray-600 ${editando?"group-hover:text-primary-600":""} `}>
                              {carouselUpload.file ? "Trocar imagem" : "Selecionar imagem"}
                            </span>
                            <input
                              type="file"
                              disabled={!editando}
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                e.target.value = "";
                                setCarouselUpload((prev) => ({ ...prev, file }));
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </label>
                        </div>
                        {carouselUpload.file&& (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={carouselUpload.file.name}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      {carouselUpload.file && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{carouselUpload.file.name}</p>
                      )}
                    </CampoConfiguracao>
                    <CampoConfiguracao label="Título">
                      <input
                        type="text"
                        placeholder="Título do banner"
                        value={carouselUpload.titulo}
                        onChange={(e) => setCarouselUpload((prev) => ({ ...prev, titulo: e.target.value }))}
                        disabled={!editando}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </CampoConfiguracao>
                    <CampoConfiguracao label="Legenda (opcional)">
                      <input
                        type="text"
                        placeholder="Frase de apoio ou chamada"
                        value={carouselUpload.legenda}
                        onChange={(e) => setCarouselUpload((prev) => ({ ...prev, legenda: e.target.value }))}
                        disabled={!editando}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </CampoConfiguracao>
                    <button
                      onClick={handleUploadCarouselImage}
                      disabled={!editando || carouselUploading || !carouselUpload.file || !carouselUpload.titulo.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      <FiUpload />
                      {carouselUploading ? "A comprimir..." : "Fazer upload"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
              <CampoConfiguracao label="Permitir Carrosel no Home">
                <ToggleSwitch
                  value={configuracoes.homeCarouselVisible.visible.enabled}
                  onChange={(value) => setConfiguracoes({
                    ...configuracoes,
                    homeCarouselVisible: {
                      ...configuracoes.homeCarouselVisible,
                      visible: {
                         ...configuracoes.homeCarouselVisible.visible,
                          enabled: value
                      }
                    }
                  })}
                />
              </CampoConfiguracao>
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

              <CampoConfiguracao descricao="Reenviar mensagens " label="Reenviar Pendentes">
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

          {/* Contacto */}
          <SecaoConfiguracao titulo="Contacto" icone={FiMail}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CampoConfiguracao label="Telefone" descricao="Número para aparecer na tela de contacto">
                  <input
                    type="text"
                    value={configuracoes.contacto.telefone}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, telefone: e.target.value } }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="WhatsApp" descricao="Use formato internacional (ex: +2449xxxxxxx)">
                  <input
                    type="text"
                    value={configuracoes.contacto.whatsapp}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, whatsapp: e.target.value } }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="E-mail" descricao="E-mail público da igreja">
                  <input
                    type="email"
                    value={configuracoes.contacto.email}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, email: e.target.value } }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="Endereço" descricao="Endereço mostrado na tela de contacto">
                  <input
                    type="text"
                    value={configuracoes.contacto.endereco}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({ ...prev, contacto: { ...prev.contacto, endereco: e.target.value } }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CampoConfiguracao label="Facebook URL">
                  <input
                    type="text"
                    value={configuracoes.contacto.socials.facebook}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, facebook: e.target.value } },
                      }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="Instagram URL">
                  <input
                    type="text"
                    value={configuracoes.contacto.socials.instagram}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, instagram: e.target.value } },
                      }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="YouTube URL">
                  <input
                    type="text"
                    value={configuracoes.contacto.socials.youtube}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, youtube: e.target.value } },
                      }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
                <CampoConfiguracao label="Twitter/X URL">
                  <input
                    type="text"
                    value={configuracoes.contacto.socials.twitter}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        contacto: { ...prev.contacto, socials: { ...prev.contacto.socials, twitter: e.target.value } },
                      }))
                    }
                    disabled={!editando}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </CampoConfiguracao>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Horários de Culto</p>
                  <button
                    type="button"
                    disabled={!editando}
                    onClick={() =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        contacto: {
                          ...prev.contacto,
                          horariosCulto: [...prev.contacto.horariosCulto, { dia: "Novo dia", horarios: ["00:00 - ..."] }],
                        },
                      }))
                    }
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FiPlus size={16} />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-3">
                  {configuracoes.contacto.horariosCulto.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="text"
                          value={item.dia}
                          disabled={!editando}
                          onChange={(e) =>
                            setConfiguracoes((prev) => ({
                              ...prev,
                              contacto: {
                                ...prev.contacto,
                                horariosCulto: prev.contacto.horariosCulto.map((h, i) =>
                                  i === idx ? { ...h, dia: e.target.value } : h
                                ),
                              },
                            }))
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                          placeholder="Dia (ex: Domingo)"
                        />
                        <button
                          type="button"
                          disabled={!editando}
                          onClick={() =>
                            setConfiguracoes((prev) => ({
                              ...prev,
                              contacto: {
                                ...prev.contacto,
                                horariosCulto: prev.contacto.horariosCulto.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                          className="w-10 h-10 rounded-lg border border-red-300 flex items-center justify-center text-red-500 disabled:opacity-40"
                          title="Remover"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <textarea
                        value={item.horarios.join("\n")}
                        disabled={!editando}
                        onChange={(e) => {
                          const horarios = e.target.value
                            .split(/\r?\n/g)
                            .map((s) => s.trim())
                            .filter(Boolean);
                          setConfiguracoes((prev) => ({
                            ...prev,
                            contacto: {
                              ...prev.contacto,
                              horariosCulto: prev.contacto.horariosCulto.map((h, i) => (i === idx ? { ...h, horarios } : h)),
                            },
                          }));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                        rows={3}
                        placeholder={"Um por linha\n09:00 - Escola Bíblica\n19:00 - Culto"}
                      />
                      <p className="text-xs text-gray-500 mt-2">Escreva um horário por linha.</p>
                    </div>
                  ))}
                </div>
              </div>
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
