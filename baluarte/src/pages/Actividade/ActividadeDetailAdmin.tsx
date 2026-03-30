// src/pages/Actividades/ActividadeDetails.tsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  FiCalendar, 
  FiMapPin, 
  FiUser, 
  FiClock,
  FiEye,
  FiMessageCircle,
  FiShare2,
  FiHeart,
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
  FiPlay,
  FiImage,
  FiDownload,
  FiMoreVertical,
  FiFlag
} from "react-icons/fi";
import { 
  GiDuration, 
  GiPartyPopper, 
  GiPrayer, 
  GiHeartBeats,
  GiFamilyHouse,
  GiVideoCamera,
  GiPhotoCamera
} from "react-icons/gi";
import { LiaBibleSolid, LiaChairSolid } from "react-icons/lia";
import { apiFetch } from "../../utils/api";
import {
  ActividadeSummary,
  ActividadeType,
  ComentarioResult,
  DuracaoActividade,
  MidiaSimple,
  MidiaType,
  PageResponse,
  ProgramacaoItemView,
  ProgramacaoStatus,
  ProgramacaoTipo,
  PublicoAlvoType,
} from "../../types/api";

type Actividade = ActividadeSummary;

const isYoutubeId = (value: string) => /^[\w-]{11}$/.test(value);

const getYoutubeThumb = (idOrUrl: string) => {
  if (isYoutubeId(idOrUrl)) return `https://img.youtube.com/vi/${idOrUrl}/hqdefault.jpg`;
  return "";
};

const getTrailerHref = (idOrUrl: string) => {
  if (isYoutubeId(idOrUrl)) return `https://www.youtube.com/watch?v=${idOrUrl}`;
  return idOrUrl;
};

// Componente de Seleção de Trailler
const ModalSelecionarTrailler = ({ 
  onClose, 
  onSelect 
}: { 
  onClose: () => void; 
  onSelect: (value: { titulo: string; url: string }) => void;
}) => {
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const canSubmit = titulo.trim().length > 0 && url.trim().length > 0;

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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GiVideoCamera className="text-primary-500" />
              Adicionar Trailler
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Ex: Culto de Domingo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link do vídeo (YouTube) ou URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="mt-1 text-xs text-gray-500">Se for YouTube, o backend extrai e guarda o ID.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => onSelect({ titulo: titulo.trim(), url: url.trim() })}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ComentarioItem = ({
  comentario,
  onToggleAnalise,
}: {
  comentario: ComentarioResult;
  onToggleAnalise: (id: number, analiseAtual: boolean) => void;
}) => {
  const data = comentario.dataPublicacao ? new Date(comentario.dataPublicacao) : null;
  return (
    <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
      <img
        src={comentario.imagem}
        alt={comentario.name}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm truncate">{comentario.name}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  comentario.analise ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {comentario.analise ? "Analisado" : "Em análise"}
              </span>
              {data && (
                <span className="text-xs text-gray-500">
                  {data.toLocaleDateString("pt-BR")} às{" "}
                  {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            <p className="text-gray-700 text-sm mt-2 whitespace-pre-line break-words">
              {comentario.descricao}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FiHeart size={14} />
              {comentario.likes ?? 0}
            </div>
            <button
              type="button"
              onClick={() => onToggleAnalise(comentario.id, comentario.analise)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
            >
              {comentario.analise ? "Marcar pendente" : "Marcar analisado"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Galeria
const GaleriaActividade = ({ 
  imagens, 
  onAdicionar,
  onRemover,
  onDownload
}: { 
  imagens: MidiaSimple[];
  onAdicionar: (file: File) => void;
  onRemover: (id: number) => void;
  onDownload: (imagem: MidiaSimple) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imagemSelecionada, setImagemSelecionada] = useState<MidiaSimple | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Galeria de Imagens</h3>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
        >
          <FiPlus size={16} />
          Adicionar Imagem
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onAdicionar(file);
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {imagens.map((img) => (
          <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden">
            <img
              src={img.url}
              alt={img.titulo}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setImagemSelecionada(img)}
            />
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => onDownload(img)}
                className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                title="Download"
              >
                <FiDownload size={14} />
              </button>
              <button
                onClick={() => {
                  onRemover(img.id);
                }}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                title="Remover"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Visualizador de imagem */}
      <AnimatePresence>
        {imagemSelecionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={() => setImagemSelecionada(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imagemSelecionada.url}
                alt={imagemSelecionada.titulo}
                className="max-w-full max-h-[80vh] mx-auto rounded-lg"
              />
              <div className="text-center text-white mt-4">
                <p className="font-medium">{imagemSelecionada.titulo}</p>
              </div>
              <button
                onClick={() => setImagemSelecionada(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white"
              >
                <FiX size={30} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente Principal
export const ActividadeDetails = () => {
  const { id } = useParams();
  const [actividade, setActividade] = useState<Actividade | null>(null);
  const [comentarios, setComentarios] = useState<ComentarioResult[]>([]);
  const [traillers, setTraillers] = useState<MidiaSimple[]>([]);
  const [galeria, setGaleria] = useState<MidiaSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState<'info' | 'comentarios' | 'galeria' | 'programacao'>('info');
  const [showTraillerModal, setShowTraillerModal] = useState(false);
  const actividadeId = Number(id);

  const [programacao, setProgramacao] = useState<ProgramacaoItemView[]>([]);
  const [programacaoLoading, setProgramacaoLoading] = useState(false);
  const [programacaoError, setProgramacaoError] = useState("");
  const [showProgramacaoModal, setShowProgramacaoModal] = useState(false);
  const [editingProgramacao, setEditingProgramacao] = useState<ProgramacaoItemView | null>(null);

  type ProgramacaoForm = {
    titulo: string;
    tipo: ProgramacaoTipo;
    inicio: string;
    fim: string;
    ordem: string;
  };

  const [programacaoForm, setProgramacaoForm] = useState<ProgramacaoForm>({
    titulo: "",
    tipo: ProgramacaoTipo.Sessao,
    inicio: "",
    fim: "",
    ordem: "",
  });

  useEffect(() => {
    let active = true;

    if (!Number.isFinite(actividadeId)) {
      setLoadError("Actividade inválida.");
      setLoading(false);
      return;
    }

    const loadAll = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [actividadeRes, comentariosRes, galeriaRes, traillerRes] = await Promise.all([
          apiFetch(`/user/actividade/${actividadeId}`),
          apiFetch(`/user/actividade/${actividadeId}/comentarios`),
          apiFetch(`/user/actividade/galeria/${actividadeId}?page=0&size=50`),
          apiFetch(`/user/actividade/trailler/${actividadeId}?page=0&size=50`),
        ]);

        if (!actividadeRes.ok) throw new Error("Falha ao buscar a actividade.");

        const actividadePayload = (await actividadeRes.json()) as Actividade;
        const comentariosPayload = comentariosRes.ok
          ? ((await comentariosRes.json()) as ComentarioResult[])
          : [];
        const galeriaPayload = galeriaRes.ok
          ? ((await galeriaRes.json()) as PageResponse<MidiaSimple>)
          : ({ content: [] } as any);
        const traillerPayload = traillerRes.ok
          ? ((await traillerRes.json()) as PageResponse<MidiaSimple>)
          : ({ content: [] } as any);

        if (!active) return;
        setActividade(actividadePayload);
        setComentarios(Array.isArray(comentariosPayload) ? comentariosPayload : []);
        setGaleria(Array.isArray(galeriaPayload?.content) ? galeriaPayload.content : []);
        setTraillers(Array.isArray(traillerPayload?.content) ? traillerPayload.content : []);
      } catch (err) {
        if (!active) return;
        setLoadError("Não foi possível carregar a actividade.");
        setActividade(null);
        setComentarios([]);
        setGaleria([]);
        setTraillers([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAll();
    return () => {
      active = false;
    };
  }, [actividadeId]);

  const loadProgramacao = async () => {
    if (!Number.isFinite(actividadeId)) return;
    setProgramacaoError("");
    setProgramacaoLoading(true);
    try {
      const res = await apiFetch(`/admin/actividade/${actividadeId}/programacao`);
      if (!res.ok) throw new Error("Falha ao carregar programação.");
      const payload = (await res.json()) as ProgramacaoItemView[];
      setProgramacao(Array.isArray(payload) ? payload : []);
    } catch {
      setProgramacaoError("Não foi possível carregar a programação.");
      setProgramacao([]);
    } finally {
      setProgramacaoLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "programacao") return;
    loadProgramacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, actividadeId]);

  const openAddProgramacao = () => {
    setEditingProgramacao(null);
    const base = actividade?.dataEvento ? new Date(actividade.dataEvento) : null;
    const localISO = base
      ? new Date(base.getTime() - base.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : "";
    setProgramacaoForm({
      titulo: "",
      tipo: ProgramacaoTipo.Sessao,
      inicio: localISO,
      fim: "",
      ordem: "",
    });
    setShowProgramacaoModal(true);
  };

  const openEditProgramacao = (item: ProgramacaoItemView) => {
    setEditingProgramacao(item);
    const inicio = item.inicio ? new Date(item.inicio) : null;
    const fim = item.fim ? new Date(item.fim) : null;
    const toLocalInput = (d: Date | null) =>
      d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
    setProgramacaoForm({
      titulo: item.titulo ?? "",
      tipo: item.tipo ?? ProgramacaoTipo.Sessao,
      inicio: toLocalInput(inicio),
      fim: toLocalInput(fim),
      ordem: item.ordem == null ? "" : String(item.ordem),
    });
    setShowProgramacaoModal(true);
  };

  const submitProgramacao = async () => {
    if (!Number.isFinite(actividadeId)) return;
    const titulo = programacaoForm.titulo.trim();
    if (!titulo) return;
    if (!programacaoForm.inicio) return;

    const payload = {
      titulo,
      tipo: programacaoForm.tipo,
      inicio: new Date(programacaoForm.inicio).toISOString(),
      fim: programacaoForm.fim ? new Date(programacaoForm.fim).toISOString() : null,
      ordem: programacaoForm.ordem.trim() ? Number(programacaoForm.ordem) : null,
    };

    const isEdit = Boolean(editingProgramacao?.id);
    const url = isEdit
      ? `/admin/actividade/${actividadeId}/programacao/${editingProgramacao!.id}`
      : `/admin/actividade/${actividadeId}/programacao`;
    const method = isEdit ? "PUT" : "POST";

    const res = await apiFetch(url, { method, body: payload });
    if (!res.ok) return;
    setShowProgramacaoModal(false);
    setEditingProgramacao(null);
    await loadProgramacao();
  };

  const deleteProgramacao = async (itemId: number) => {
    if (!Number.isFinite(actividadeId)) return;
    if (!window.confirm("Remover este item da programação?")) return;
    const res = await apiFetch(`/admin/actividade/${actividadeId}/programacao/${itemId}`, { method: "DELETE" });
    if (!res.ok) return;
    await loadProgramacao();
  };

  const reloadGaleria = async () => {
    if (!Number.isFinite(actividadeId)) return;
    const response = await apiFetch(`/user/actividade/galeria/${actividadeId}?page=0&size=50`);
    if (!response.ok) return;
    const payload = (await response.json()) as PageResponse<MidiaSimple>;
    setGaleria(Array.isArray(payload?.content) ? payload.content : []);
  };

  const reloadTraillers = async () => {
    if (!Number.isFinite(actividadeId)) return;
    const response = await apiFetch(`/user/actividade/trailler/${actividadeId}?page=0&size=50`);
    if (!response.ok) return;
    const payload = (await response.json()) as PageResponse<MidiaSimple>;
    setTraillers(Array.isArray(payload?.content) ? payload.content : []);
  };

  const reloadComentarios = async () => {
    if (!Number.isFinite(actividadeId)) return;
    const response = await apiFetch(`/user/actividade/${actividadeId}/comentarios`);
    if (!response.ok) return;
    const payload = (await response.json()) as ComentarioResult[];
    setComentarios(Array.isArray(payload) ? payload : []);
  };

  const handleAdicionarTrailler = async (value: { titulo: string; url: string }) => {
    if (!Number.isFinite(actividadeId)) return;
    try {
      const response = await apiFetch(`/admin/actividade/trailer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: actividadeId,
          titulo: value.titulo,
          type: MidiaType.Video,
          img: value.url,
        }),
      });
      if (!response.ok) throw new Error("Falha ao adicionar trailler.");
      setShowTraillerModal(false);
      await reloadTraillers();
    } catch {
      // noop
    }
  };

  const handleRemoverTrailler = async (midiaId: number) => {
    if (!window.confirm("Remover este trailler?")) return;
    try {
      const response = await apiFetch(`/admin/midia/${midiaId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao remover trailler.");
      await reloadTraillers();
    } catch {
      // noop
    }
  };

  const handleAdicionarImagem = async (file: File) => {
    if (!Number.isFinite(actividadeId)) return;
    try {
      const formData = new FormData();
      formData.append("id", String(actividadeId));
      formData.append("titulo", file.name);
      formData.append("type", MidiaType.Image);
      formData.append("img", file);

      const response = await apiFetch(`/admin/actividade/galeria`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Falha ao adicionar imagem.");
      await reloadGaleria();
    } catch {
      // noop
    }
  };

  const handleRemoverImagem = async (midiaId: number) => {
    if (!window.confirm("Remover esta imagem da galeria?")) return;
    try {
      const response = await apiFetch(`/admin/midia/${midiaId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao remover imagem.");
      await reloadGaleria();
    } catch {
      // noop
    }
  };

  const handleDownloadImagem = (imagem: MidiaSimple) => {
    const link = document.createElement("a");
    link.href = imagem.url;
    link.download = `${imagem.titulo || "imagem"}.jpg`;
    link.click();
  };

  const handleToggleAnalise = async (comentarioId: number, analiseAtual: boolean) => {
    try {
      const response = await apiFetch(`/admin/comentario/analise`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comentarioId, analise: !analiseAtual }),
      });
      if (!response.ok) throw new Error("Falha ao atualizar análise.");
      await reloadComentarios();
    } catch {
      // noop
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!actividade) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {loadError || "Actividade não encontrada"}
          </h2>
          <Link to="/admin/actividades" className="text-primary-500 hover:underline">
            Voltar para actividades
          </Link>
        </div>
      </div>
    );
  }

  const tipoConfig: Record<ActividadeType, { icon: any; cor: string; label: string }> = {
    [ActividadeType.Culto]: { icon: GiPrayer, cor: "bg-purple-500", label: "Culto" },
    [ActividadeType.Evento]: { icon: GiPartyPopper, cor: "bg-pink-500", label: "Evento" },
    [ActividadeType.Escola]: { icon: LiaBibleSolid, cor: "bg-blue-500", label: "Escola" },
    [ActividadeType.Jovens]: { icon: GiHeartBeats, cor: "bg-green-500", label: "Jovens" },
    [ActividadeType.Familia]: { icon: GiFamilyHouse, cor: "bg-amber-500", label: "Família" },
    [ActividadeType.Louvor]: { icon: LiaChairSolid, cor: "bg-indigo-500", label: "Louvor" },
    [ActividadeType.Oracao]: { icon: GiPrayer, cor: "bg-red-500", label: "Oração" },
    [ActividadeType.Evangelismo]: { icon: FiUsers, cor: "bg-emerald-500", label: "Evangelismo" },
    [ActividadeType.Acampamento]: { icon: GiFamilyHouse, cor: "bg-teal-500", label: "Acampamento" },
    [ActividadeType.Conferencia]: { icon: FiCalendar, cor: "bg-sky-500", label: "Conferência" },
  };

  const publicoLabel: Record<PublicoAlvoType, string> = {
    [PublicoAlvoType.Todos]: "Todos",
    [PublicoAlvoType.Jovens]: "Jovens",
    [PublicoAlvoType.Adultos]: "Adultos",
    [PublicoAlvoType.Criancas]: "Crianças",
    [PublicoAlvoType.Idosos]: "Idosos",
    [PublicoAlvoType.Mulheres]: "Mulheres",
    [PublicoAlvoType.Homens]: "Homens",
    [PublicoAlvoType.Casais]: "Casais",
  };

  const duracaoLabel: Record<DuracaoActividade, string> = {
    [DuracaoActividade.Curta]: "Curta",
    [DuracaoActividade.Media]: "Média",
    [DuracaoActividade.Longa]: "Longa",
    [DuracaoActividade.Extendida]: "Extendida",
    [DuracaoActividade.MultiplosDias]: "Múltiplos dias",
  };

  const config = tipoConfig[actividade.tipoEvento] ?? tipoConfig[ActividadeType.Evento];
  const Icon = config?.icon ?? FiFlag;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={actividade.img}
          alt={actividade.titulo}
          className="w-full h-full object-cover rounded-t-xl  "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${config.cor} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
              <Icon size={12} />
              {config.label}
            </span>
            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {duracaoLabel[actividade.duracao] ?? actividade.duracao}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{actividade.titulo}</h1>
          <p className="text-xl text-white/90">{actividade.tema}</p>
        </div>

        {/* Back button */}
        <Link
          to="/admin/actividades"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
        >
          <FiArrowLeft size={18} />
          Voltar
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container-custom">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'info'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('comentarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'comentarios'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiMessageCircle size={16} />
              Comentários ({comentarios.length})
            </button>
            <button
              onClick={() => setActiveTab('galeria')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'galeria'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <GiPhotoCamera size={16} />
              Galeria ({galeria.length})
            </button>
            <button
              onClick={() => setActiveTab('programacao')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'programacao'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiClock size={16} />
              Programação
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Descrição */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Sobre o evento</h2>
                  <p className="text-gray-700 leading-relaxed">{actividade.descricao}</p>
                </div>

                {/* Trailers */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <GiVideoCamera className="text-primary-500" />
                      Trailers
                    </h2>
                    <button
                      onClick={() => setShowTraillerModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
                    >
                      <FiPlus size={16} />
                      Adicionar Trailler
                    </button>
                  </div>

                  {traillers.length > 0 ? (
                    <div className="space-y-3">
                      {traillers.map((trailler) => {
                        const href = getTrailerHref(trailler.url);
                        const thumb = getYoutubeThumb(trailler.url);
                        return (
                          <div key={trailler.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            {thumb ? (
                              <a href={href} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={thumb}
                                  alt={trailler.titulo}
                                  className="w-32 h-20 object-cover rounded-lg"
                                />
                              </a>
                            ) : (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-32 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600"
                                title="Abrir trailler"
                              >
                                <FiPlay size={20} />
                              </a>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{trailler.titulo}</h3>
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:underline"
                              >
                                Abrir
                              </a>
                            </div>
                            <button
                              onClick={() => handleRemoverTrailler(trailler.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum trailler adicionado ainda.
                    </p>
                  )}
                </div>

                {/* Informações detalhadas */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Detalhes</h2>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-gray-500">Data</dt>
                      <dd className="font-medium">
                        {new Date(actividade.dataEvento).toLocaleDateString('pt-BR')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Horário</dt>
                      <dd className="font-medium">
                        {new Date(actividade.dataEvento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Público-alvo</dt>
                      <dd className="font-medium">
                        {publicoLabel[actividade.publicoAlvo] ?? actividade.publicoAlvo}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Duração</dt>
                      <dd className="font-medium">
                        {duracaoLabel[actividade.duracao] ?? actividade.duracao}
                      </dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            )}

            {activeTab === 'comentarios' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiMessageCircle className="text-primary-500" />
                  Comentários
                </h2>

                {/* Lista de comentários */}
                <div className="space-y-6">
                  {comentarios.length > 0 ? (
                    comentarios.map((comentario) => (
                      <ComentarioItem
                        key={comentario.id}
                        comentario={comentario}
                        onToggleAnalise={handleToggleAnalise}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-6">Nenhum comentário ainda.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'galeria' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <GaleriaActividade
                  imagens={galeria}
                  onAdicionar={handleAdicionarImagem}
                  onRemover={handleRemoverImagem}
                  onDownload={handleDownloadImagem}
                />
              </motion.div>
            )}

            {activeTab === 'programacao' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FiClock className="text-primary-500" />
                    Programação
                  </h2>
                  <button
                    onClick={openAddProgramacao}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
                  >
                    <FiPlus size={16} />
                    Adicionar item
                  </button>
                </div>

                {programacaoError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {programacaoError}
                  </div>
                )}

                {programacaoLoading ? (
                  <div className="text-sm text-gray-500 py-6">A carregar programação…</div>
                ) : programacao.length === 0 ? (
                  <div className="text-sm text-gray-500 py-6">Ainda não há itens de programação.</div>
                ) : (
                  <div className="space-y-3">
                    {programacao.map((item) => {
                      const inicio = item.inicio ? new Date(item.inicio) : null;
                      const fim = item.fim ? new Date(item.fim) : null;
                      const statusLabel =
                        item.status === ProgramacaoStatus.Done
                          ? "Concluído"
                          : item.status === ProgramacaoStatus.Ongoing
                          ? "A decorrer"
                          : "Por começar";
                      const statusClass =
                        item.status === ProgramacaoStatus.Done
                          ? "bg-green-100 text-green-700"
                          : item.status === ProgramacaoStatus.Ongoing
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700";
                      const tipoLabel = item.tipo === ProgramacaoTipo.Pausa ? "Pausa" : "Sessão";
                      const tipoClass =
                        item.tipo === ProgramacaoTipo.Pausa
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-primary-50 text-primary-700 border border-primary-100";

                      return (
                        <div key={item.id} className="p-4 bg-gray-50 rounded-xl flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-900 truncate">{item.titulo}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${tipoClass}`}>{tipoLabel}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>{statusLabel}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                              <span>
                                Início:{" "}
                                {inicio
                                  ? inicio.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
                                  : "--"}
                              </span>
                              <span>
                                Fim:{" "}
                                {fim ? fim.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--"}
                              </span>
                              {item.ordem != null && <span>Ordem: {item.ordem}</span>}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditProgramacao(item)}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                            >
                              <FiEdit2 size={14} className="inline-block mr-1" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProgramacao(item.id)}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-red-600"
                            >
                              <FiTrash2 size={14} className="inline-block mr-1" />
                              Remover
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card de Inscrição */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Participação</h3>
              
              {typeof actividade.capacidade === "number" && actividade.capacidade > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Vagas</span>
                    <span className="font-medium">{actividade.inscritos ?? 0}/{actividade.capacidade}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((actividade.inscritos ?? 0) / actividade.capacidade) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors mb-3">
                Inscrever-se
              </button>
              <button className="w-full border border-primary-500 text-primary-500 py-3 rounded-xl font-medium hover:bg-primary-50 transition-colors">
                Compartilhar
              </button>
            </div>

            {/* Localização */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiMapPin className="text-primary-500" />
                Local
              </h3>
              <p className="text-gray-600 text-sm mb-2">{actividade.endereco}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(actividade.endereco)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 text-sm hover:underline"
              >
                Ver no mapa
              </a>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiUser className="text-primary-500" />
                Moderador
              </h3>
              <p className="font-medium mb-2">{actividade.organizador}</p>
              
              <div className="space-y-2">
                <a href={`tel:${actividade.contactos}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <FiPhone size={14} />
                  <span className="text-sm">{actividade.contactos}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de seleção de trailler */}
      <AnimatePresence>
        {showTraillerModal && (
          <ModalSelecionarTrailler
            onClose={() => setShowTraillerModal(false)}
            onSelect={handleAdicionarTrailler}
          />
        )}
        {showProgramacaoModal && (
          <ModalProgramacao
            title={editingProgramacao ? "Editar item" : "Adicionar item"}
            form={programacaoForm}
            onChange={(next) => setProgramacaoForm((current) => ({ ...current, ...next }))}
            onClose={() => {
              setShowProgramacaoModal(false);
              setEditingProgramacao(null);
            }}
            onSubmit={submitProgramacao}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal simples de Programação
const ModalProgramacao = ({
  title,
  form,
  onChange,
  onClose,
  onSubmit,
}: {
  title: string;
  form: { titulo: string; tipo: ProgramacaoTipo; inicio: string; fim: string; ordem: string };
  onChange: (next: Partial<{ titulo: string; tipo: ProgramacaoTipo; inicio: string; fim: string; ordem: string }>) => void;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const canSubmit = form.titulo.trim().length > 0 && Boolean(form.inicio);
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
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                value={form.titulo}
                onChange={(e) => onChange({ titulo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Ex: Abertura / Louvor / Pausa / Mensagem..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => onChange({ tipo: e.target.value as ProgramacaoTipo })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value={ProgramacaoTipo.Sessao}>Sessão</option>
                  <option value={ProgramacaoTipo.Pausa}>Pausa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordem (opcional)</label>
                <input
                  value={form.ordem}
                  onChange={(e) => onChange({ ordem: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="Ex: 1"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                <input
                  type="datetime-local"
                  value={form.inicio}
                  onChange={(e) => onChange({ inicio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fim (opcional)</label>
                <input
                  type="datetime-local"
                  value={form.fim}
                  onChange={(e) => onChange({ fim: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={onSubmit}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
