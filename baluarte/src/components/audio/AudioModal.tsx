import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeadphones, FiX, FiCheck, FiUpload, FiImage, FiMusic, FiEye, FiUser } from "react-icons/fi";
import { Audio, tiposAudio } from "../../pages/Audios/Audios";
import { AudioType } from "../../types/api";
import { AudioPreviewPlayer } from "./AudioPlayerAdmin";

type ModalAudioProps = {
  audio?: Audio;
  onClose: () => void;
  onSave?: (audio: Omit<Audio, "id"> & { capaFile?: File; audioFile?: File }) => void;
  mode?: "form" | "preview";
  autoPlayPreview?: boolean;
};

type Passo = 1 | 2 | 3 | 4;

const passosMeta: ReadonlyArray<{ id: Passo; label: string }> = [
  { id: 1, label: "Informações" },
  { id: 2, label: "Mídia" },
  { id: 3, label: "Categoria" },
  { id: 4, label: "Revisão" }
];

const ModalAudio = ({
  audio,
  onClose,
  onSave,
  mode = "form",
  autoPlayPreview = false
}: ModalAudioProps) => {
  const [passo, setPasso] = useState<Passo>(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: audio?.titulo || "",
    descricao: audio?.descricao || "",
    tipo: audio?.tipo || AudioType.Sermon,
    capaFile: undefined as File | undefined,
    audioFile: undefined as File | undefined,
    capaPreview: audio?.capa || "",
    audioPreview: audio?.audioUrl || ""
  });

  const progresso = useMemo(() => {
    let completo = 0;
    const total = 5;

    if (formData.titulo) completo++;
    if (formData.descricao) completo++;
    if (formData.tipo) completo++;
    if (formData.capaPreview) completo++;
    if (formData.audioPreview) completo++;

    return Math.round((completo / total) * 100);
  }, [formData]);

  const podeAvancar = () => {
    switch (passo) {
      case 1:
        return formData.titulo && formData.descricao;
      case 2:
        return formData.capaPreview && formData.audioPreview;
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
      setShowPreviewModal(true);
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
      audioUrl: formData.audioPreview,
      capaFile: formData.capaFile,
      audioFile: formData.audioFile
    });

    onClose();
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
          Título do Áudio *
        </label>
        <input
          type="text"
          required
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          placeholder="Breve descrição do áudio..."
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
      {/* Capa do Áudio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capa do Áudio *
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="relative flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer group">
              <FiImage className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
              <span className="text-sm text-gray-600 group-hover:text-primary-600">
                {formData.capaPreview ? "Trocar imagem" : "Selecionar imagem"}
              </span>
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
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
          {formData.capaPreview && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={formData.capaPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Arquivo de Áudio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Arquivo de Áudio *
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="relative flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer group">
              <FiMusic className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
              <span className="text-sm text-gray-600 group-hover:text-primary-600">
                {formData.audioPreview ? "Trocar áudio" : "Selecionar arquivo de áudio"}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setFormData({
                    ...formData,
                    audioFile: file,
                    audioPreview: URL.createObjectURL(file)
                  });
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
          {formData.audioPreview && (
            <div className="w-20 h-20 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
              <FiMusic className="text-primary-500" size={24} />
            </div>
          )}
        </div>
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
          Tipo de Áudio *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {tiposAudio.map((tipo) => {
            const Icon = tipo.icon;
            const isSelected = formData.tipo === tipo.value;
            return (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setFormData({ ...formData, tipo: tipo.value })}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${tipo.color} border-primary-500 text-white`
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{tipo.label}</span>
                {isSelected && <FiCheck className="ml-auto" size={16} />}
              </button>
            );
          })}
        </div>
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
          Revise as informações e confira o preview completo antes de finalizar.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold mb-2">Resumo:</h4>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Título:</dt>
          <dd className="font-medium">{formData.titulo}</dd>
          <dt className="text-gray-500">Tipo:</dt>
          <dd className="font-medium">
            {tiposAudio.find((t) => t.value === formData.tipo)?.label}
          </dd>
        </dl>
      </div>

      <button
        type="button"
        onClick={() => setShowPreviewModal(true)}
        className="w-full px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
      >
        Ver Preview Completo
      </button>
    </motion.div>
  );

  // Painel de Preview Lateral
  const renderPreviewLateral = () => (
    <div className="md:col-span-1 border-l border-gray-200 pl-6 ">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FiEye className="text-primary-500" />
        Preview do Áudio
      </h3>

      <div className="bg-gray-50 rounded-xl overflow-hidden sticky top-6">
        {/* Capa Preview */}
        <div className="relative  overflow-hidden h-[20vh] bg-gray-100">
          {formData.capaPreview ? (
            <img
              src={formData.capaPreview}
              alt={formData.titulo || "Preview"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiHeadphones size={40} />
            </div>
          )}

          {/* Badge de categoria (se já selecionada) */}
          {formData.tipo && (
            <div className={`absolute top-3 left-3 ${tiposAudio.find(t => t.value === formData.tipo)?.color || 'bg-gray-500'} text-white px-2 py-1 rounded-full text-xs font-medium`}>
              {tiposAudio.find(t => t.value === formData.tipo)?.label}
            </div>
          )}

          {/* Ícone de play (decorativo) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
              <FiHeadphones className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* Informações do Preview */}
        <div className="p-4">
          <h4 className="font-bold mb-2 line-clamp-2">
            {formData.titulo || "Título do Áudio"}
          </h4>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {formData.descricao || "Descrição do áudio aparecerá aqui..."}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <FiUser size={12} />
              <span>{audio?.autor || "Autor não definido"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiImage size={12} />
              <span>{formData.capaPreview ? "Com capa" : "Sem capa"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FiHeadphones size={12} />
              {formData.audioPreview ? "Áudio pronto" : "Sem áudio"}
            </span>
            {formData.tipo && (
              <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded">
                #{formData.tipo.toLowerCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Esta é uma prévia de como o áudio será exibido
      </p>
    </div>
  );

  // Modal de Preview Completo
  if (showPreviewModal) {
    return (
      <ModalAudio
        audio={{
          id: "preview",
          titulo: formData.titulo,
          descricao: formData.descricao,
          tipo: formData.tipo,
          capa: formData.capaPreview,
          audioUrl: formData.audioPreview,
          autor: audio?.autor || "Autor",
          data: audio?.data || new Date().toISOString().split('T')[0],
          visualizacoes: 0
        }}
        onClose={() => setShowPreviewModal(false)}
        mode="preview"
        autoPlayPreview={true}
      />
    );
  }

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
              <p className="text-lg font-semibold">{audio.titulo}</p>
              <p className="text-sm text-gray-500">{audio.descricao}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>{tiposAudio.find((t) => t.value === audio.tipo)?.label}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-gray-500">Player</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <AudioPreviewPlayer
                  src={audio.audioUrl}
                  capa={audio.capa}
                  titulo={audio.titulo}
                  autoPlay={autoPlayPreview}
                  onClose={onClose}
                />
              </div>
            </div>

            {/* Botões do Preview */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Voltar à Edição
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSave) {
                    onSave({
                      titulo: audio.titulo,
                      descricao: audio.descricao,
                      tipo: audio.tipo,
                      capa: audio.capa,
                      audioUrl: audio.audioUrl
                    });
                  }
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                Confirmar e Publicar
              </button>
            </div>
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
              <FiHeadphones className="text-primary-500" />
              {audio ? "Editar Áudio" : "Novo Áudio"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Barra de Progresso */}
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

          {/* Steps + labels alinhados */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative pt-1">
              {/* Linha base */}
              <div className="absolute left-5 right-5 top-5 h-1 rounded-full bg-gray-200 z-0 pointer-events-none" />
              {/* Progresso */}
              <div
                className="absolute left-5 top-5 h-1 rounded-full bg-primary-500 transition-[width] duration-300 z-0 pointer-events-none"
                style={{
                  width: `${((passo - 1) / (passosMeta.length - 1)) * 100}%`
                }}
              />

              <div className="grid grid-cols-4 relative z-10">
                {passosMeta.map(({ id }) => (
                  <div key={id} className="flex justify-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        passo > id
                          ? "bg-primary-500 text-white"
                          : passo === id
                          ? "bg-primary-500 text-white ring-4 ring-primary-100"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {passo > id ? <FiCheck size={18} /> : id}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-4 px-1 text-xs text-gray-500">
              {passosMeta.map(({ id, label }) => (
                <span
                  key={id}
                  className={`text-center ${
                    passo === id ? "text-primary-600 font-semibold" : ""
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="md:col-span-1 h-[50vh] overflow-y-auto overflow-x-hidden">
                <AnimatePresence mode="wait">
                  {passo === 1 && renderPasso1()}
                  {passo === 2 && renderPasso2()}
                  {passo === 3 && renderPasso3()}
                  {passo === 4 && renderPasso4()}
                </AnimatePresence>

                {/* Botões de navegação */}
                <div className="flex gap-3 pt-4 border-t mt-6">
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
                      disabled={!podeAvancar()}
                      className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                        podeAvancar()
                          ? "bg-primary-500 text-white hover:bg-primary-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Avançar
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                    >
                      Revisar e Publicar
                    </button>
                  )}
                </div>
              </div>

              {/* Painel de Preview Lateral (sempre visível) */}
              {renderPreviewLateral()}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { ModalAudio };