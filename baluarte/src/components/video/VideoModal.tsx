import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiVideo, FiX, FiCheck } from "react-icons/fi";
import { VideoType } from "../../types/api";
import { tiposVideo, Video } from "../../pages/Videos/Videos";
import { VideoPreviewPlayer } from "./VideoPlayerAdmin";

type ModalVideoProps = {
  video?: Video;
  onClose: () => void;
  onSave?: (video: Omit<Video, "id"> & { capaFile?: File; videoFile?: File }) => void;
  mode?: "form" | "preview";
  autoPlayPreview?: boolean;
};

type Passo = 1 | 2 | 3 | 4;

const ModalVideo = ({
  video,
  onClose,
  onSave,
  mode = "form",
  autoPlayPreview = false
}: ModalVideoProps) => {
  const [passo, setPasso] = useState<Passo>(1);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    titulo: video?.titulo || "",
    descricao: video?.descricao || "",
    tipo: video?.tipo || VideoType.Sermon,
    capaFile: undefined as File | undefined,
    videoFile: undefined as File | undefined,
    capaPreview: video?.capa || "",
    videoPreview: video?.videoUrl || ""
  });

  const progresso = useMemo(() => {
    let completo = 0;
    const total = 5;

    if (formData.titulo) completo++;
    if (formData.descricao) completo++;
    if (formData.tipo) completo++;
    if (formData.capaPreview) completo++;
    if (formData.videoPreview) completo++;

    return Math.round((completo / total) * 100);
  }, [formData]);

  const podeAvancar = () => {
    switch (passo) {
      case 1:
        return formData.titulo && formData.descricao;
      case 2:
        return formData.capaPreview && formData.videoPreview;
      case 3:
        return formData.tipo;
      default:
        return true;
    }
  };

  const avancarPasso = () => {
    if (passo < 4 && podeAvancar()) {
      setPasso((passo + 1) as Passo);
    }
  };

  const voltarPasso = () => {
    if (passo > 1) {
      setPasso((passo - 1) as Passo);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passo === 4) {
      setShowPreview(true);
    } else {
      avancarPasso();
    }
  };

  const handleConfirmSave = () => {
    if (!onSave) return;

    onSave({
      titulo: formData.titulo,
      descricao: formData.descricao,
      tipo: formData.tipo,
      capa: formData.capaPreview,
      videoUrl: formData.videoPreview,
      capaFile: formData.capaFile,
      videoFile: formData.videoFile
    });

    onClose();
  };

  const previewSource = mode === "preview" ? video?.videoUrl : formData.videoPreview;
  const previewTitle = mode === "preview" ? video?.titulo : formData.titulo;
  const previewCapa = mode === "preview" ? video?.capa : formData.capaPreview;
  const previewTipo = mode === "preview" ? video?.tipo : formData.tipo;

  const renderPreviewSection = () => {
    if (!previewSource) return null;

    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Pré-visualização</p>
            <p className="text-sm text-gray-400">Reproduz o ficheiro informado</p>
          </div>
          <span className="text-xs text-gray-400">
            {mode === "preview" ? "Somente reprodução" : "Atualiza conforme a edição"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {previewTipo && (
            <span>{tiposVideo.find((tipo) => tipo.value === previewTipo)?.label}</span>
          )}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
          <VideoPreviewPlayer
            src={previewSource}
            thumbnail={previewCapa}
            titulo={previewTitle}
            autoPlay={autoPlayPreview || mode === "preview"}
            onClose={mode === "preview" ? onClose : undefined}
          />
        </div>
      </section>
    );
  };

  const renderPasso1 = () => (
    <motion.div
      key="passo1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título do Vídeo *
        </label>
        <input
          type="text"
          required
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          placeholder="Breve descrição do vídeo..."
        />
      </div>
    </motion.div>
  );

  const renderPasso2 = () => (
    <motion.div
      key="passo2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capa do Vídeo *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setFormData({
              ...formData,
              capaFile: file,
              capaPreview: URL.createObjectURL(file)
            });
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          required={!video?.capa}
        />
        {formData.capaPreview && (
          <img
            src={formData.capaPreview}
            alt="Preview"
            className="mt-2 w-full h-32 object-cover rounded-lg"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ficheiro de Vídeo *
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setFormData({
              ...formData,
              videoFile: file,
              videoPreview: URL.createObjectURL(file)
            });
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          required={!video?.videoUrl}
        />
      </div>
    </motion.div>
  );

  const renderPasso3 = () => (
    <motion.div
      key="passo3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Vídeo *
        </label>
        <select
          required
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as VideoType })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        >
          {tiposVideo.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );

  const renderPasso4 = () => (
    <motion.div
      key="passo4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-primary-50 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="text-primary-500 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Tudo pronto para publicar!</h3>
        <p className="text-gray-600 mb-4">
          Revise as informações e confira o preview antes de finalizar.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold mb-2">Resumo:</h4>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Título:</dt>
          <dd className="font-medium">{formData.titulo}</dd>
          <dt className="text-gray-500">Tipo:</dt>
          <dd className="font-medium">
            {tiposVideo.find((t) => t.value === formData.tipo)?.label}
          </dd>
        </dl>
      </div>

      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="w-full px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
      >
        Ver Preview Completo
      </button>
    </motion.div>
  );

  if (showPreview) {
    return (
      <ModalVideo
        video={{
          titulo: formData.titulo,
          descricao: formData.descricao,
          tipo: formData.tipo,
          capa: formData.capaPreview,
          videoUrl: formData.videoPreview
        }}
        onClose={() => setShowPreview(false)}
        mode="preview"
        autoPlayPreview
      />
    );
  }

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
                Pré-visualização
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiVideo className="text-primary-500" />
              {video ? "Editar Vídeo" : "Novo Vídeo"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Progresso</span>
              <span className="font-medium text-primary-500">{progresso}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${progresso}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    passo >= num ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {num < 4 ? num : <FiCheck size={16} />}
                </div>
                {num < 4 && (
                  <div
                    className={`w-12 h-1 ${passo > num ? "bg-primary-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {passo === 1 && renderPasso1()}
              {passo === 2 && renderPasso2()}
              {passo === 3 && renderPasso3()}
              {passo === 4 && renderPasso4()}
            </AnimatePresence>

            <div className="flex items-center gap-3 pt-4 border-t">
              {passo > 1 && (
                <button
                  type="button"
                  onClick={voltarPasso}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              {passo < 4 ? (
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Avançar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Publicar Vídeo
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { ModalVideo };
