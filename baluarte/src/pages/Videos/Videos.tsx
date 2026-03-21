// src/pages/Videos/VideosPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiVideo,
  FiClock,
  FiEye,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPlay,
  FiRefreshCw,
  FiX,
  FiUser
} from "react-icons/fi";
import {
  GiMicrophone,
  GiPrayer,
  GiAngelWings,
  GiFilmProjector,
  GiPartyPopper,
  GiConversation
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import {
  MidiaProjection,
  MidiaType,
  PageResponse,
  VideoType
} from "../../types/api";
import { apiFetch } from "../../utils/api";
import { ModalVideo } from "../../components/video/VideoModal";

export const tiposVideo: { value: VideoType; label: string; icon: any; color: string }[] = [
  { value: VideoType.Sermon, label: "Sermão", icon: GiMicrophone, color: "bg-purple-500" },
  { value: VideoType.Devotional, label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: VideoType.Testimony, label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: VideoType.Study, label: "Estudo Bíblico", icon: LiaBibleSolid, color: "bg-blue-500" },
  { value: VideoType.Documentary, label: "Documentário", icon: GiFilmProjector, color: "bg-amber-500" },
  { value: VideoType.Event, label: "Evento", icon: GiPartyPopper, color: "bg-orange-500" },
  { value: VideoType.Interview, label: "Entrevista", icon: GiConversation, color: "bg-indigo-500" }
];

export interface Video {
  id?: string | number;
  titulo: string;
  descricao: string;
  tipo: VideoType;
  capa?: string;
  videoUrl?: string;
  tempo?: string;
  data?:string;
  autor?:string;
  visualizacoes?:number
}

const resolveYoutubeId = (value: string) => {
  if (!value) return null;
  if (value.length === 11 && !value.includes("/")) return value;
  const patterns = [
    /youtu\.be\/([\w-]{11})/i,
    /youtube\.com\/(?:watch\?v=|embed\/)([\w-]{11})/i
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

const resolveLegacyYoutubeThumbnail = (value: string) => {
  const id = resolveYoutubeId(value);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

const mapToFormVideo = (video: MidiaProjection): Video => ({
  id: video.id,
  titulo: video.titulo,
  descricao: video.descricao,
  tipo: video.videoType || VideoType.Sermon,
  autor: video.autor,
  capa: video.imagem,
  videoUrl: video.url,
  tempo: video.tempo
});

// Card de Vídeo
const VideoCard = ({
  video,
  onEdit,
  onDelete,
  onPreview
}: {
  video: MidiaProjection;
  onEdit: (video: MidiaProjection) => void;
  onDelete: (id: number) => void;
  onPreview: (video: MidiaProjection) => void;
}) => {
  const tipoInfo = tiposVideo.find((t) => t.value === video.videoType);
  const Icon = tipoInfo?.icon || FiVideo;
  const thumbnail = video.imagem || resolveLegacyYoutubeThumbnail(video.url);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <FiVideo size={40} />
          </div>
        )}

        {/* Overlay com botão play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPreview(video);
            }}
            className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform"
          >
            <FiPlay className="text-white text-2xl ml-1" />
          </button>
        </div>

        {/* Badge de categoria */}
        {tipoInfo && (
          <div
            className={`absolute top-4 left-4 ${tipoInfo.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg`}
          >
            <Icon size={12} />
            {tipoInfo.label}
          </div>
        )}

        {/* Ações */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(video)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Tem certeza que deseja excluir este vídeo?")) {
                onDelete(video.id);
              }
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-red-500 shadow-lg"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
          {video.titulo}
        </h3>

        {video.autor && (
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <FiUser size={12} />
            {video.autor}
          </p>
        )}

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.descricao}</p>

        {/* Estatísticas */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiEye size={12} />
            {video.visualizacoes ?? 0} views
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiClock size={12} />
            {video.tempo || "--:--"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal
export const VideosPage = () => {
  const [videos, setVideos] = useState<MidiaProjection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<VideoType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | undefined>();
  const [previewVideo, setPreviewVideo] = useState<Video | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [creatingVideos, setCreatingVideos] = useState<
    { tempId: string; titulo: string; startedAt: number }[]
  >([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "50");
        params.set("type", MidiaType.Video);
        if (selectedTipo) params.set("videoType", selectedTipo);
        if (searchTerm.trim()) params.set("q", searchTerm.trim());

        const response = await apiFetch(`/admin/midia?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Falha ao carregar vídeos.");
        }

        const payload = (await response.json()) as PageResponse<MidiaProjection>;
        if (!active) return;
        setVideos(payload.content ?? []);
        setLoadError("");
        setHasLoadedOnce(true);
      } catch (err) {
        if (!active) return;
        setLoadError("Não foi possível carregar os vídeos.");
        setVideos([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchTerm, selectedTipo, reloadToken]);

  const handleSave = async (
    novoVideo: Omit<Video, "id"> & { capaFile?: File; videoFile?: File }
  ) => {
    const isEditing = Boolean(editingVideo);
    const tempId = `creating-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    if (!isEditing) {
      setCreatingVideos((current) => [
        { tempId, titulo: novoVideo.titulo, startedAt: Date.now() },
        ...current
      ]);
      setActionError("");
    }
    try {
      const formData = new FormData();
      formData.append("titulo", novoVideo.titulo);
      if (novoVideo.autor?.trim()) formData.append("autor", novoVideo.autor.trim());
      formData.append("descricao", novoVideo.descricao);
      formData.append("type", MidiaType.Video);
      formData.append("videoType", novoVideo.tipo);

      if (!isEditing) {
        if (!novoVideo.capaFile || !novoVideo.videoFile) {
          setActionError("Capa e vídeo são obrigatórios.");
          return;
        }
        formData.append("imagem", novoVideo.capaFile);
        formData.append("url", novoVideo.videoFile);
      } else {
        if (novoVideo.capaFile) formData.append("imagem", novoVideo.capaFile);
        if (novoVideo.videoFile) formData.append("url", novoVideo.videoFile);
      }

      const endpoint = isEditing
        ? `/admin/midia/video/${editingVideo?.id}`
        : "/admin/midia/video";
      const method = isEditing ? "PUT" : "POST";

      const response = await apiFetch(endpoint, {
        method,
        body: formData
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar o vídeo.");
      }

      if (!isEditing) {
        let created: Partial<MidiaProjection> | null = null;
        try {
          created = (await response.json()) as Partial<MidiaProjection>;
        } catch {
          created = null;
        }
        if (created && typeof created.id === "number") {
          setVideos((current) => {
            const withoutSame = current.filter((v) => v.id !== created!.id);
            return [created as MidiaProjection, ...withoutSame];
          });
        }
      }

      setReloadToken((prev) => prev + 1);
      setEditingVideo(undefined);
      setActionError("");
    } catch (err) {
      setActionError("Não foi possível salvar o vídeo.");
    } finally {
      if (!isEditing) {
        setCreatingVideos((current) => current.filter((v) => v.tempId !== tempId));
      }
    }
  };

  const handleEdit = (video: MidiaProjection) => {
    setEditingVideo(mapToFormVideo(video));
    setShowModal(true);
  };

  const handlePreview = (video: MidiaProjection) => {
    setPreviewVideo(mapToFormVideo(video));
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiFetch(`/admin/midia/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Falha ao remover o vídeo.");
      }
      setReloadToken((prev) => prev + 1);
    } catch (err) {
      setActionError("Não foi possível remover o vídeo.");
    }
  };

  const resultados = useMemo(() => videos.length, [videos]);

  const CardLoad = ({
    variant,
    titulo
  }: {
    variant?: "default" | "creating";
    titulo?: string;
  }) => {
    const isCreating = variant === "creating";
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 border border-gray-200"
      >
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <div className="absolute top-4 left-4">
            <div className="h-6 w-28 rounded-full bg-gray-300 animate-pulse" />
          </div>
          <div className="absolute top-4 right-4">
            <div className="h-9 w-9 rounded-lg bg-gray-300 animate-pulse" />
          </div>
          {isCreating && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-medium text-gray-800">
                <FiRefreshCw className="animate-spin" />
                <span className="max-w-[220px] truncate">
                  A publicar{titulo ? `: ${titulo}` : "…"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Grid decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0 L30 60 M0 30 L60 30\' stroke=\'%23CB2020\' stroke-width=\'1\'/%3E%3C/svg%3E")'
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Vídeos</h1>
            <p className="text-gray-500">Gerencie todos os vídeos e mensagens da igreja</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vídeos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingVideo(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Novo Vídeo
            </button>
          </div>
        </div>

        {/* Filtros por tipo */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTipo(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedTipo
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {tiposVideo.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => setSelectedTipo(tipo.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedTipo === tipo.value
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <tipo.icon size={14} />
                {tipo.label}
              </button>
            ))}
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {resultados} {resultados === 1 ? "vídeo encontrado" : "vídeos encontrados"}
          </div>
        </div>

        {actionError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start justify-between gap-4">
            <p className="text-sm">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError("")}
              className="p-1 rounded-lg hover:bg-red-100 transition-colors"
              title="Fechar"
            >
              <FiX />
            </button>
          </div>
        )}

        {loadError ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiVideo className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Erro ao carregar</h3>
            <p className="text-gray-500 mb-4">{loadError}</p>
          </div>
        ) : (
          <>
            {((loading && hasLoadedOnce) || creatingVideos.length > 0) && (
              <div className="mb-4 overflow-hidden rounded-xl bg-white border border-gray-100">
                <div className="h-1 bg-gray-100">
                  <motion.div
                    className="h-1 w-1/3 bg-primary-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: "300%" }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            {videos.length === 0 && creatingVideos.length === 0 ? (
              loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CardLoad key={`loading-${index}`} />
                  ))}
                </div>
              ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiVideo className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum vídeo encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo
                ? "Tente buscar com outros termos ou limpar os filtros"
                : "Comece adicionando seu primeiro vídeo!"}
            </p>
            {searchTerm || selectedTipo ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTipo(null);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingVideo(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Adicionar Primeiro Vídeo
              </button>
            )}
          </div>
              )
            ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {creatingVideos.map((video) => (
                <CardLoad key={video.tempId} variant="creating" titulo={video.titulo} />
              ))}
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              ))}
            </AnimatePresence>
          </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Vídeo */}
      <AnimatePresence>
        {showModal && (
          <ModalVideo
            video={editingVideo}
            onClose={() => {
              setShowModal(false);
              setEditingVideo(undefined);
            }}
            onSave={(payload) => {
              handleSave(payload);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {previewVideo && (
          <ModalVideo
            mode="preview"
            video={previewVideo}
            autoPlayPreview
            onClose={() => setPreviewVideo(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
