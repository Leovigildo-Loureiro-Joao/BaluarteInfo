import { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiImage, FiUpload, FiX } from "react-icons/fi";
import { ArtigoCreateDto, ArtigoDetail, ArtigoType } from "../../types/api";

type ModalFormData = {
  titulo: string;
  descricao: string;
  escritor: string;
  tipo: ArtigoType;
};

type ArtigoUpsertPayload = ModalFormData & {
  pdf?: File;
  img?: File | null;
};

const tipoLabels: Record<ArtigoType, string> = {
  [ArtigoType.BibleStudy]: "Estudo Bíblico",
  [ArtigoType.Devotional]: "Devocional",
  [ArtigoType.Historical]: "Histórico",
  [ArtigoType.Doctrinal]: "Doutrinário",
  [ArtigoType.Testimony]: "Testemunho",
  [ArtigoType.Apologetics]: "Apologética",
  [ArtigoType.Prophetic]: "Profético",
  [ArtigoType.Theological]: "Teológico",
};

const ModalArtigo = ({
  artigo,
  onClose,
  onSave,
}: {
  artigo?: ArtigoCreateDto | ArtigoDetail;
  onClose: () => void;
  onSave: (artigo: ArtigoUpsertPayload) => void;
}) => {
  const isEditing = Boolean((artigo as any)?.id);
  const [formData, setFormData] = useState<ModalFormData>({
    titulo: artigo?.titulo || "",
    descricao: artigo?.descricao || "",
    escritor: artigo?.escritor || "",
    tipo: artigo?.tipo || ArtigoType.Doctrinal,
  });
  // Se estiver editando, o backend não envia o File; evita pré-carregar string/URL.
  const initialPdf =
    artigo?.pdf instanceof File ? artigo.pdf : null;
  const [pdfFile, setPdfFile] = useState<File | null>(initialPdf);
  const [fileError, setFileError] = useState<string | null>(null);

  const initialCover = artigo?.img instanceof File ? artigo.img : null;
  const [coverFile, setCoverFile] = useState<File | null>(initialCover);

  const tiposDisponiveis = Object.values(ArtigoType) as ArtigoType[];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEditing && !pdfFile) {
      setFileError("Selecione o PDF do artigo.");
      return;
    }

    const payload: ArtigoUpsertPayload = { ...formData, img: coverFile };
    if (pdfFile) payload.pdf = pdfFile;
    onSave(payload);

    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPdfFile(file);
    if (!isEditing) {
      setFileError(file ? null : "Selecione o PDF do artigo.");
    } else {
      setFileError(null);
    }
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
  };

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
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiBookOpen className="text-primary-500" />
              {artigo ? "Editar Artigo" : "Novo Artigo"}
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
                    Título do Artigo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        titulo: event.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: A soberania em tempos difíceis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição curta *
                  </label>
                  <textarea
                    required
                    value={formData.descricao}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        descricao: event.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Resumo breve do estudo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Escritor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.escritor}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        escritor: event.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Nome do escritor"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Artigo *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        tipo: event.target.value as ArtigoType,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {tiposDisponiveis.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipoLabels[tipo] ?? tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF do Artigo {isEditing ? "(opcional)" : "*"}
                  </label>
                  <label className="flex items-center justify-between gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      <FiUpload />
                      {pdfFile ? pdfFile.name : isEditing ? "Selecionar novo PDF" : "Selecionar PDF"}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  {fileError && (
                    <p className="text-xs text-red-600 mt-2">{fileError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem da capa (opcional)
                  </label>
                  <label className="flex items-center justify-between gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      <FiImage />
                      {coverFile ? coverFile.name : "Selecionar imagem"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleCoverChange}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Se não enviar uma imagem, será usada uma capa padrão.
                  </p>
                </div>
              </div>
            </div>

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
                {artigo ? "Salvar Artigo" : "Publicar Artigo"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalArtigo;
