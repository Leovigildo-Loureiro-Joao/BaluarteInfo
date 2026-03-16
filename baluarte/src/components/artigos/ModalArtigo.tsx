import { ChangeEvent, FormEvent, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBookOpen, 
  FiImage, 
  FiUpload, 
  FiX, 
  FiEye, 
  FiFileText,
  FiCheck,
  FiRefreshCw,
  FiUser,
  FiType
} from "react-icons/fi";
import { ArtigoCreateDto, ArtigoDetail, ArtigoType } from "../../types/api";
import { apiFetch } from "../../utils/api";

type ModalFormData = {
  titulo: string;
  descricao: string;
  escritor: string;
  tipo: ArtigoType;
};

type ArtigoUpsertPayload = ModalFormData & {
  pdf?: File;
  img?: File | null;
  markdown?: string;
};

type Passo = 1 | 2 | 3 | 4 | 5;

const passosMeta: ReadonlyArray<{ id: Passo; label: string }> = [
  { id: 1, label: "Informações" },
  { id: 2, label: "Conteúdo" },
  { id: 3, label: "Categoria" },
  { id: 4, label: "Mídia" },
  { id: 5, label: "Preview" }
];

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

const tipoColors: Record<ArtigoType, string> = {
  [ArtigoType.BibleStudy]: "bg-blue-500",
  [ArtigoType.Devotional]: "bg-green-500",
  [ArtigoType.Historical]: "bg-amber-500",
  [ArtigoType.Doctrinal]: "bg-purple-500",
  [ArtigoType.Testimony]: "bg-pink-500",
  [ArtigoType.Apologetics]: "bg-indigo-500",
  [ArtigoType.Prophetic]: "bg-orange-500",
  [ArtigoType.Theological]: "bg-red-500",
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
  const [passo, setPasso] = useState<Passo>(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const isEditing = Boolean((artigo as any)?.id);
  const [useGeneratedPreview, setUseGeneratedPreview] = useState(!isEditing);
  
  const [formData, setFormData] = useState<ModalFormData>({
    titulo: artigo?.titulo || "",
    descricao: artigo?.descricao || "",
    escritor: artigo?.escritor || "",
    tipo: artigo?.tipo || ArtigoType.Doctrinal,
  });
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewInstruction, setPreviewInstruction] = useState("");
  const [previewPages, setPreviewPages] = useState(5);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewMarkdown, setPreviewMarkdown] = useState("");
  
  // URLs para preview
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    artigo?.img && typeof artigo.img === 'string' ? artigo.img : null
  );
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(
    artigo?.pdf && typeof artigo.pdf === 'string' ? artigo.pdf : null
  );

  // Progresso
  const progresso = useMemo(() => {
    let completo = 0;
    const total = 4; // Campos obrigatórios: título, descrição, escritor, PDF

    if (formData.titulo) completo++;
    if (formData.descricao) completo++;
    if (formData.escritor) completo++;
    if (pdfFile || pdfPreviewUrl) completo++;

    return Math.round((completo / total) * 100);
  }, [formData, pdfFile, pdfPreviewUrl]);

  // Validação por passo
  const podeAvancar = () => {
    switch (passo) {
      case 1:
        return formData.titulo && formData.descricao;
      case 2:
        return formData.escritor;
      case 3:
        return formData.tipo;
      case 4:
        return pdfFile || pdfPreviewUrl || isEditing;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const avancarPasso = () => {
    if (passo < 5 && podeAvancar()) {
      const next = (passo + 1) as Passo;
      setPasso(next);
      if (next === 5) {
        setShowPreview(true);
      }
    }
  };

  const voltarPasso = () => {
    if (passo > 1) {
      setPasso((passo - 1) as Passo);
    }
  };

  // Limpar URLs ao desmontar
  useEffect(() => {
    return () => {
      if (coverPreviewUrl && coverPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      if (pdfPreviewUrl && pdfPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, []);

  const tiposDisponiveis = Object.values(ArtigoType) as ArtigoType[];

  type ArtigoEnhancePreview = { markdown: string; html: string };
  const fetchPreview = async () => {
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      if (pdfFile) {
        const data = new FormData();
        data.append("titulo", formData.titulo);
        data.append("descricao", formData.descricao);
        data.append("pdf", pdfFile);
        data.append("pages", String(previewPages));
        if (previewInstruction.trim()) {
          data.append("instruction", previewInstruction.trim());
        }
        const response = await apiFetch("/admin/artigo/enhance/preview", {
          method: "POST",
          body: data
        });
        if (!response.ok) throw new Error("Falha ao gerar preview.");
        const payload = (await response.json()) as ArtigoEnhancePreview;
        setPreviewMarkdown(payload.markdown ?? "");
        setPreviewHtml(payload.html ?? "");
        return;
      }

      if (isEditing && (artigo as any)?.id) {
        const params = new URLSearchParams();
        params.set("pages", String(previewPages));
        if (previewInstruction.trim()) params.set("instruction", previewInstruction.trim());
        const response = await apiFetch(`/admin/artigo/${(artigo as any).id}/enhance/preview?${params.toString()}`);
        if (!response.ok) throw new Error("Falha ao gerar preview.");
        const payload = (await response.json()) as ArtigoEnhancePreview;
        setPreviewMarkdown(payload.markdown ?? "");
        setPreviewHtml(payload.html ?? "");
        return;
      }

      setPreviewError("Selecione um PDF para gerar o preview.");
    } catch {
      setPreviewError("Não foi possível gerar o preview agora.");
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (passo !== 5) return;
    if (previewHtml || previewLoading) return;
    if (!pdfFile && !(isEditing && pdfPreviewUrl)) return;
    fetchPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passo]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passo === 5) {
      // Último passo - validar PDF
      if (!isEditing && !pdfFile && !pdfPreviewUrl) {
        setFileError("Selecione o PDF do artigo.");
        return;
      }

      const payload: ArtigoUpsertPayload = { ...formData, img: coverFile };
      if (pdfFile) payload.pdf = pdfFile;
      if (useGeneratedPreview) {
        if (!previewMarkdown.trim()) {
          setPreviewError("Gere a prévia antes de publicar para usar este conteúdo.");
          return;
        }
        payload.markdown = previewMarkdown;
      }
      onSave(payload);
      onClose();
    } else {
      avancarPasso();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPdfFile(file);
    
    if (file) {
      if (pdfPreviewUrl && pdfPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
      const url = URL.createObjectURL(file);
      setPdfPreviewUrl(url);
    }
    
    if (!isEditing) {
      setFileError(file ? null : "Selecione o PDF do artigo.");
    } else {
      setFileError(null);
    }

    setPreviewHtml("");
    setPreviewMarkdown("");
    setPreviewError(null);
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    
    if (file) {
      if (coverPreviewUrl && coverPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      const url = URL.createObjectURL(file);
      setCoverPreviewUrl(url);
    }
  };

  const getTipoInfo = (tipo: ArtigoType) => {
    return {
      label: tipoLabels[tipo] || tipo,
      color: tipoColors[tipo] || "bg-gray-500"
    };
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
          Título do Artigo *
        </label>
        <input
          type="text"
          required
          value={formData.titulo}
          onChange={(event) =>
            setFormData({ ...formData, titulo: event.target.value })
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
            setFormData({ ...formData, descricao: event.target.value })
          }
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          placeholder="Resumo breve do estudo"
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
          Escritor *
        </label>
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            required
            value={formData.escritor}
            onChange={(event) =>
              setFormData({ ...formData, escritor: event.target.value })
            }
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="Nome do escritor"
          />
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
          Tipo de Artigo *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {tiposDisponiveis.map((tipo) => {
            const isSelected = formData.tipo === tipo;
            const tipoInfo = getTipoInfo(tipo);
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => setFormData({ ...formData, tipo })}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${tipoInfo.color} border-primary-500 text-white`
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <FiType size={18} />
                <span className="text-sm font-medium">{tipoInfo.label}</span>
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
        <h3 className="text-xl font-bold text-gray-800 mb-2">Quase lá!</h3>
        <p className="text-gray-600 mb-4">
          Adicione o PDF e uma imagem para finalizar.
        </p>
      </div>

      {/* PDF */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          PDF do Artigo {isEditing ? "(opcional)" : "*"}
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="relative flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer group">
              <FiFileText className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
              <span className="text-sm text-gray-600 group-hover:text-primary-600">
                {pdfFile ? pdfFile.name : isEditing ? "Selecionar novo PDF" : "Selecionar PDF"}
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {(pdfFile || pdfPreviewUrl) && (
            <div className="w-20 h-20 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
              <FiFileText className="text-primary-500" size={24} />
            </div>
          )}
        </div>
        {fileError && (
          <p className="mt-2 text-sm text-red-500">{fileError}</p>
        )}
      </div>

      {/* Imagem da capa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagem da capa (opcional)
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="relative flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer group">
              <FiImage className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
              <span className="text-sm text-gray-600 group-hover:text-primary-600">
                {coverFile ? coverFile.name : "Selecionar imagem"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleCoverChange}
              />
            </label>
          </div>
          {coverPreviewUrl && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={coverPreviewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Se não enviar uma imagem, será usada uma capa padrão.
        </p>
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold mb-2">Resumo:</h4>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Título:</dt>
          <dd className="font-medium">{formData.titulo}</dd>
          <dt className="text-gray-500">Escritor:</dt>
          <dd className="font-medium">{formData.escritor}</dd>
          <dt className="text-gray-500">Tipo:</dt>
          <dd className="font-medium">{getTipoInfo(formData.tipo).label}</dd>
        </dl>
      </div>
    </motion.div>
  );

  const renderPasso5 = () => (
    <motion.div
      key="passo5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="bg-primary-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Preview do conteúdo</h3>
        <p className="text-sm text-gray-600">
          Gere uma prévia com o Gemini (até 5 páginas do PDF) e ajuste as instruções se o conteúdo vier mal
          estruturado.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Páginas</label>
            <select
              value={previewPages}
              onChange={(e) => setPreviewPages(Number(e.target.value))}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((current) => !current)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              title={showPreview ? "Ocultar preview" : "Mostrar preview"}
            >
              {showPreview ? "Ocultar card" : "Mostrar card"}
            </button>

            <button
              type="button"
              onClick={fetchPreview}
              disabled={previewLoading || (!pdfFile && !(isEditing && pdfPreviewUrl))}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                previewLoading
                  ? "bg-primary-500/70 text-white cursor-not-allowed"
                  : "bg-primary-500 text-white hover:bg-primary-600"
              }`}
            >
              <FiRefreshCw className={previewLoading ? "animate-spin" : ""} />
              Gerar prévia
            </button>
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              Usar esta prévia ao publicar
            </p>
            <p className="text-xs text-gray-500">
              O conteúdo salvo será gerado a partir do Markdown desta prévia (mais consistente).
            </p>
          </div>
          <input
            type="checkbox"
            checked={useGeneratedPreview}
            onChange={(e) => setUseGeneratedPreview(e.target.checked)}
            className="h-5 w-5 accent-primary-500"
          />
        </label>

        <div>
          <label className="block text-xs text-gray-500 mb-2">Instruções (opcional)</label>
          <textarea
            value={previewInstruction}
            onChange={(e) => setPreviewInstruction(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="Ex: melhora a estrutura, cria títulos, corrige ortografia, mantém citações bíblicas…"
          />
        </div>

        {previewError && <p className="text-xs text-red-600">{previewError}</p>}
        {!pdfFile && !pdfPreviewUrl && !isEditing && (
          <p className="text-xs text-amber-700">Selecione o PDF para gerar o preview.</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-700">Prévia do conteúdo</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMarkdown((current) => !current)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              {showMarkdown ? "Ver HTML" : "Ver Markdown"}
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[42vh] overflow-auto">
          {previewLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
            </div>
          ) : !previewHtml && !previewMarkdown ? (
            <div className="text-sm text-gray-500">
              Clique em “Gerar prévia” para visualizar o conteúdo reestruturado.
            </div>
          ) : showMarkdown ? (
            <pre className="whitespace-pre-wrap text-xs text-gray-700">{previewMarkdown}</pre>
          ) : (
            <div
              className="artigo-conteudo admin-article-html article-html"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );

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
              <FiBookOpen className="text-primary-500" />
              {isEditing ? "Editar Artigo" : "Novo Artigo"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-primary-500"
                title={showPreview ? "Ocultar preview" : "Mostrar preview"}
              >
                <FiEye size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
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

          {/* Steps */}
          <div className="max-w-2xl mx-auto w-full mb-6">
            <div className="relative pt-1">
              <div className="absolute left-5 right-5 top-5 h-1 rounded-full bg-gray-200 z-0 pointer-events-none" />
              <div
                className="absolute left-5 top-5 h-1 rounded-full bg-primary-500 transition-[width] duration-300 z-0 pointer-events-none"
                style={{
                  width: `${((passo - 1) / (passosMeta.length - 1)) * 100}%`
                }}
              />

              <div className="grid grid-cols-5 relative z-10">
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

            <div className="mt-2 grid grid-cols-5 px-1 text-xs text-gray-500">
              {passosMeta.map(({ id, label }) => (
                <span
                  key={id}
                  className={`text-center ${passo === id ? "text-primary-600 font-semibold" : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 ">
              {/* Formulário */}
              <div className={showPreview ? "md:col-span-1" : "md:col-span-2"}>
                <div className="h-[50vh] overflow-y-scroll overflow-x-hidden">
                  <AnimatePresence mode="wait">
                  {passo === 1 && renderPasso1()}
                  {passo === 2 && renderPasso2()}
                  {passo === 3 && renderPasso3()}
                  {passo === 4 && renderPasso4()}
                  {passo === 5 && renderPasso5()}
                </AnimatePresence>
              </div>
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
                  
                  {passo < 5 ? (
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
                      disabled={useGeneratedPreview && !previewMarkdown.trim()}
                      className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                        useGeneratedPreview && !previewMarkdown.trim()
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {isEditing ? "Salvar Artigo" : "Publicar Artigo"}
                    </button>
                  )}
                </div>
              </div>

              {/* Painel de Preview */}
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="md:col-span-1 border-l border-gray-200 pl-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiEye className="text-primary-500" />
                    Preview do Artigo
                  </h3>

                  <div className="bg-gray-50 rounded-xl overflow-hidden sticky top-6">
                    {/* Card de preview */}
                    <div className="relative h-40 overflow-hidden">
                      {coverPreviewUrl ? (
                        <img
                          src={coverPreviewUrl}
                          alt={formData.titulo || "Preview"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <FiBookOpen className="text-4xl text-primary-400" />
                        </div>
                      )}
                      
                      {/* Badge de categoria */}
                      <div className={`absolute top-3 left-3 ${getTipoInfo(formData.tipo).color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                        {getTipoInfo(formData.tipo).label}
                      </div>

                      {/* Badge de tempo estimado */}
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {Math.ceil((pdfPreviewUrl ? 5 : 1) / 2)} min
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold mb-2 line-clamp-2">
                        {formData.titulo || "Título do Artigo"}
                      </h4>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {formData.descricao || "Descrição do artigo aparecerá aqui..."}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiUser size={12} />
                          <span>{formData.escritor || "Nome do escritor"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiImage size={12} />
                          <span>{coverPreviewUrl ? "Com imagem" : "Sem imagem"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FiFileText size={12} />
                            {pdfFile || pdfPreviewUrl ? "PDF pronto" : "Sem PDF"}
                          </span>
                        </div>

                        {formData.tipo && (
                          <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            #{formData.tipo.toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Esta é uma prévia de como o artigo será exibido
                  </p>
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalArtigo;
