import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiVideo, FiX } from "react-icons/fi";
import { VideoType } from "../../types/api";
import { tiposVideo, Video } from "../../pages/Videos/Videos";
import { VideoPreviewPlayer } from "./VideoPlayerAdmin";

type ModalVideoProps = {
  video?: Video;
  onClose: () => void;
  onSave?: (video: Omit<Video, "id">) => void;
  mode?: "form" | "preview";
  autoPlayPreview?: boolean;
};

const ModalVideo = ({
  video,
  onClose,
  onSave,
  mode = "form",
  autoPlayPreview = false,
}: ModalVideoProps) => {
  const [formData, setFormData] = useState({
    titulo: video?.titulo || "",
    descricao: video?.descricao || "",
    tipo: video?.tipo || VideoType.Sermon,
    autor: video?.autor || "",
    data: video?.data || new Date().toISOString().split("T")[0],
    thumbnail: video?.thumbnail || "",
    videoUrl: video?.videoUrl || "",
    duracao: video?.duracao || "",
    tags: video?.tags?.join(", ") || "",
  });

  const previewSource = mode === "preview" ? video?.videoUrl : formData.videoUrl;
  const previewTitle = mode === "preview" ? video?.titulo : formData.titulo;
  const previewThumbnail = mode === "preview" ? video?.thumbnail : formData.thumbnail;
  const previewAutor = mode === "preview" ? video?.autor : formData.autor;
  const previewTipo = mode === "preview" ? video?.tipo : formData.tipo;

  const renderPreviewSection = () => {
    if (!previewSource) return null;

    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Pré-visualização</p>
            <p className="text-sm text-gray-400">Reproduz o link informado</p>
          </div>
          <span className="text-xs text-gray-400">
            {mode === "preview" ? "Modo somente leitura" : "Atualiza enquanto digita"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {previewAutor && <span>{previewAutor}</span>}
          {previewTipo && (
            <span>{tiposVideo.find((tipo) => tipo.value === previewTipo)?.label}</span>
          )}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
          <VideoPreviewPlayer
            src={previewSource}
            thumbnail={previewThumbnail}
            titulo={previewTitle}
            autoPlay={autoPlayPreview || mode === "preview"}
            onClose={mode === "preview" ? onClose : undefined}
          />
        </div>
      </section>
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSave) return;

    onSave({
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      visualizacoes: video?.visualizacoes || 0,
    });

    onClose();
  };

  const headerTitle =
    mode === "preview" ? "Pré-visualização" : video ? "Editar Vídeo" : "Novo Vídeo";

  if (mode === "preview") {
    if (!video?.videoUrl) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FiVideo className="text-primary-500" />
                {headerTitle}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-2 text-gray-600">
              <p className="text-lg font-semibold">{video.titulo}</p>
              <p className="text-sm text-gray-500">{video.descricao}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>{video.autor}</span>
                <span>{new Date(video.data).toLocaleDateString("pt-BR")}</span>
                <span>{tiposVideo.find((t) => t.value === video.tipo)?.label}</span>
              </div>
            </div>
            {renderPreviewSection()}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiVideo className="text-primary-500" />
              {headerTitle}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Vídeo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: A Vitória é Certa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    required
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Breve descrição do vídeo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vídeo *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: e.target.value as VideoType })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {tiposVideo.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor/Pregador *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.autor}
                    onChange={(e) =>
                      setFormData({ ...formData, autor: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Nome do autor"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Publicação *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Thumbnail *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={formData.thumbnail}
                      onChange={(e) =>
                        setFormData({ ...formData, thumbnail: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="https://exemplo.com/thumbnail.jpg"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiUpload size={20} />
                    </button>
                  </div>
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/800x400?text=Thumbnail+inválida")
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Vídeo *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="https://exemplo.com/video.mp4 ou YouTube"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duracao}
                    onChange={(e) =>
                      setFormData({ ...formData, duracao: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="45:30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="fé, oração, estudo"
                  />
                </div>
              </div>
            </div>

            {renderPreviewSection()}

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                {video ? "Salvar Alterações" : "Publicar Vídeo"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { ModalVideo };
