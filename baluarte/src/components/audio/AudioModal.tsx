import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { FiHeadphones, FiUpload, FiX } from "react-icons/fi";
import { Audio, tiposAudio } from "../../pages/Audios/Audios";
import { AudioType } from "../../types/api";
import { AudioPreviewPlayer } from "./AudioPlayerAdmin";

type ModalAudioProps = {
  audio?: Audio;
  onClose: () => void;
  onSave?: (audio: Omit<Audio, "id">) => void;
  mode?: "form" | "preview";
  autoPlayPreview?: boolean;
};

const ModalAudio = ({
  audio,
  onClose,
  onSave,
  mode = "form",
  autoPlayPreview = false,
}: ModalAudioProps) => {
  const [formData, setFormData] = useState({
    titulo: audio?.titulo || "",
    descricao: audio?.descricao || "",
    tipo: audio?.tipo || AudioType.Sermon,
    autor: audio?.autor || "",
    data: audio?.data || new Date().toISOString().split("T")[0],
    capa: audio?.capa || "",
    audioUrl: audio?.audioUrl || "",
    duracao: audio?.duracao || "",
    tags: audio?.tags?.join(", ") || "",
  });

  const previewSource = mode === "preview" ? audio?.audioUrl : formData.audioUrl;
  const previewTitle = mode === "preview" ? audio?.titulo : formData.titulo;
  const previewAutor = mode === "preview" ? audio?.autor : formData.autor;
  const previewCapa = mode === "preview" ? audio?.capa : formData.capa;
  const previewTipo = mode === "preview" ? audio?.tipo : formData.tipo;

  const renderPreviewSection = () => {
    if (!previewSource) return null;

    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Pré-visualização</p>
            <p className="text-sm text-gray-400">Reproduz o arquivo informado</p>
          </div>
          <span className="text-xs text-gray-400">
            {mode === "preview" ? "Somente reprodução" : "Atualiza conforme a edição"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {previewAutor && <span>{previewAutor}</span>}
          {previewTipo && (
            <span>{tiposAudio.find((tipo) => tipo.value === previewTipo)?.label}</span>
          )}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <AudioPreviewPlayer
            src={previewSource}
            capa={previewCapa}
            titulo={previewTitle}
            autor={previewAutor}
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
      visualizacoes: audio?.visualizacoes || 0,
    });

    onClose();
  };

  const headerTitle = mode === "preview" ? "Pré-visualização" : audio ? "Editar Áudio" : "Novo Áudio";

  if (mode === "preview") {
    if (!audio?.audioUrl) return null;

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
                <FiHeadphones className="text-primary-500" />
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
              <p className="text-lg font-semibold">{audio.titulo}</p>
              <p className="text-sm text-gray-500">{audio.descricao}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>{audio.autor}</span>
                <span>{new Date(audio.data).toLocaleDateString("pt-BR")}</span>
                <span>{tiposAudio.find((t) => t.value === audio.tipo)?.label}</span>
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiHeadphones className="text-primary-500" />
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
                    Título do Áudio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: O Poder da Oração"
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
                    placeholder="Breve descrição do áudio..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Áudio *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: e.target.value as AudioType })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {tiposAudio.map((tipo) => (
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
                    URL da Capa *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={formData.capa}
                      onChange={(e) =>
                        setFormData({ ...formData, capa: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="https://exemplo.com/capa.jpg"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiUpload size={20} />
                    </button>
                  </div>
                  {formData.capa && (
                    <img
                      src={formData.capa}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/800x400?text=Capa+inválida")
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Áudio *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.audioUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, audioUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="https://exemplo.com/audio.mp3"
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
                {audio ? "Salvar Alterações" : "Publicar Áudio"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { ModalAudio };
