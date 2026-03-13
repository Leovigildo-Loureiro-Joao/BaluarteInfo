// src/pages/Audios/AudiosPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiHeadphones,
  FiClock,
  FiEye,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPlay
} from "react-icons/fi";
import {
  GiMicrophone,
  GiPrayer,
  GiAngelWings,
  GiMusicalNotes,
  GiSoundWaves,
  GiMegaphone
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import {
  AudioType,
  MidiaProjection,
  MidiaType,
  PageResponse
} from "../../types/api";
import { apiFetch } from "../../utils/api";
import { ModalAudio } from "../../components/audio/AudioModal";

export const tiposAudio: { value: AudioType; label: string; icon: any; color: string }[] = [
  { value: AudioType.Sermon, label: "Sermão", icon: GiMicrophone, color: "bg-purple-500" },
  { value: AudioType.Devotional, label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: AudioType.Testimony, label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: AudioType.Music, label: "Música", icon: GiMusicalNotes, color: "bg-indigo-500" },
  { value: AudioType.Prayer, label: "Oração", icon: GiPrayer, color: "bg-blue-500" },
  { value: AudioType.Study, label: "Estudo", icon: LiaBibleSolid, color: "bg-amber-500" },
  { value: AudioType.Podcast, label: "Podcast", icon: GiSoundWaves, color: "bg-orange-500" },
  { value: AudioType.Announcement, label: "Aviso", icon: GiMegaphone, color: "bg-red-500" }
];

export interface Audio {
  id?: number;
  titulo: string;
  descricao: string;
  tipo: AudioType;
  capa?: string;
  audioUrl?: string;
  tempo?: string;
}

const mapToFormAudio = (audio: MidiaProjection): Audio => ({
  id: audio.id,
  titulo: audio.titulo,
  descricao: audio.descricao,
  tipo: audio.audioType || AudioType.Sermon,
  capa: audio.imagem,
  audioUrl: audio.url,
  tempo: audio.tempo
});

// Card de Áudio
const AudioCard = ({
  audio,
  onEdit,
  onDelete,
  onPreview
}: {
  audio: MidiaProjection;
  onEdit: (audio: MidiaProjection) => void;
  onDelete: (id: number) => void;
  onPreview: (audio: MidiaProjection) => void;
}) => {
  const tipoInfo = tiposAudio.find((t) => t.value === audio.audioType);
  const Icon = tipoInfo?.icon || FiHeadphones;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary-300"
    >
      {/* Capa */}
      <div className="relative aspect-square overflow-hidden">
        {audio.imagem ? (
          <img
            src={audio.imagem}
            alt={audio.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <FiHeadphones size={36} />
          </div>
        )}

        {/* Overlay com ondas sonoras (visual) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPreview(audio);
              }}
              className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform"
            >
              <FiPlay className="text-white text-xl ml-1" />
            </button>
          </div>
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

        {/* Badge de duração */}
        <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
          <FiClock size={12} />
          {audio.tempo || "--:--"}
        </div>

        {/* Ações */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(audio)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Tem certeza que deseja excluir este áudio?")) {
                onDelete(audio.id);
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
          {audio.titulo}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{audio.descricao}</p>

        {/* Estatísticas */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiEye size={12} />
            {audio.visualizacoes ?? 0} plays
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal
export const AudiosPage = () => {
  const [audios, setAudios] = useState<MidiaProjection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<AudioType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAudio, setEditingAudio] = useState<Audio | undefined>();
  const [previewAudio, setPreviewAudio] = useState<Audio | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "50");
        params.set("type", MidiaType.Audio);
        if (selectedTipo) params.set("audioType", selectedTipo);
        if (searchTerm.trim()) params.set("q", searchTerm.trim());

        const response = await apiFetch(`/admin/midia?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Falha ao carregar áudios.");
        }

        const payload = (await response.json()) as PageResponse<MidiaProjection>;
        if (!active) return;
        setAudios(payload.content ?? []);
        setError("");
      } catch (err) {
        if (!active) return;
        setError("Não foi possível carregar os áudios.");
        setAudios([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchTerm, selectedTipo, reloadToken]);

  const handleSave = async (novoAudio: Omit<Audio, "id"> & { capaFile?: File; audioFile?: File }) => {
    const formData = new FormData();
    formData.append("titulo", novoAudio.titulo);
    formData.append("descricao", novoAudio.descricao);
    formData.append("type", MidiaType.Audio);
    formData.append("audioType", novoAudio.tipo);

    if (!editingAudio) {
      if (!novoAudio.capaFile || !novoAudio.audioFile) {
        throw new Error("Capa e áudio são obrigatórios.");
      }
      formData.append("imagem", novoAudio.capaFile);
      formData.append("url", novoAudio.audioFile);
    } else {
      if (novoAudio.capaFile) formData.append("imagem", novoAudio.capaFile);
      if (novoAudio.audioFile) formData.append("url", novoAudio.audioFile);
    }

    const endpoint = editingAudio
      ? `/admin/midia/audio/${editingAudio.id}`
      : "/admin/midia/audio";
    const method = editingAudio ? "PUT" : "POST";

    const response = await apiFetch(endpoint, {
      method,
      body: formData
    });

    if (!response.ok) {
      throw new Error("Falha ao salvar o áudio.");
    }

    setReloadToken((prev) => prev + 1);
    setEditingAudio(undefined);
  };

  const handleEdit = (audio: MidiaProjection) => {
    setEditingAudio(mapToFormAudio(audio));
    setShowModal(true);
  };

  const handlePreview = (audio: MidiaProjection) => {
    setPreviewAudio(mapToFormAudio(audio));
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiFetch(`/admin/midia/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Falha ao remover o áudio.");
      }
      setReloadToken((prev) => prev + 1);
    } catch (err) {
      setError("Não foi possível remover o áudio.");
    }
  };

  const resultados = useMemo(() => audios.length, [audios]);

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Áudios</h1>
            <p className="text-gray-500">Gerencie todos os áudios, sermões e podcasts da igreja</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar áudios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingAudio(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Novo Áudio
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
            {tiposAudio.map((tipo) => (
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
            {resultados} {resultados === 1 ? "áudio encontrado" : "áudios encontrados"}
          </div>
        </div>

        {error && <div className="mb-6 text-sm text-red-500">{error}</div>}

        {loading ? (
          <div className="text-center py-20 text-gray-500">A carregar áudios...</div>
        ) : audios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiHeadphones className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum áudio encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo
                ? "Tente buscar com outros termos ou limpar os filtros"
                : "Comece adicionando seu primeiro áudio!"}
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
                  setEditingAudio(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Adicionar Primeiro Áudio
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {audios.map((audio) => (
                <AudioCard
                  key={audio.id}
                  audio={audio}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Áudio */}
      <AnimatePresence>
        {showModal && (
          <ModalAudio
            audio={editingAudio}
            onClose={() => {
              setShowModal(false);
              setEditingAudio(undefined);
            }}
            onSave={(payload) => {
              handleSave(payload).catch(() => {
                setError("Não foi possível salvar o áudio.");
              });
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {previewAudio && (
          <ModalAudio
            mode="preview"
            audio={previewAudio}
            autoPlayPreview
            onClose={() => setPreviewAudio(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
