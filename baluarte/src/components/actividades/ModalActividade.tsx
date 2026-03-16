import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiCalendar, FiMapPin, FiUser, FiPhone, FiUsers, FiImage, FiEye } from "react-icons/fi";
import { GiPartyPopper, GiPrayer, GiHeartBeats, GiFamilyHouse, GiDuration } from "react-icons/gi";
import { ActividadeType, PublicoAlvoType, DuracaoActividade } from "../../types/api";
import { LiaBibleSolid, LiaChairSolid } from "react-icons/lia";

// Tipos (ajuste conforme sua estrutura)
type ActividadeSummary = {
  id?: string;
  titulo: string;
  descricao: string;
  tema: string;
  tipoEvento: ActividadeType;
  publicoAlvo: PublicoAlvoType;
  duracao: DuracaoActividade;
  dataEvento: string;
  endereco: string;
  organizador: string;
  contactos: string;
  capacidade?: number;
  img?: string;
};

type ModalActividadeProps = {
  actividade?: ActividadeSummary;
  onClose: () => void;
  onSave: (actividade: {
    titulo: string;
    descricao: string;
    tema: string;
    tipoEvento: ActividadeType;
    publicoAlvo: PublicoAlvoType;
    duracao: DuracaoActividade;
    data: string;
    hora: string;
    endereco: string;
    organizador: string;
    contactos: string;
    capacidade: number;
    imgFile: File;
  }) => void;
};

type Passo = 1 | 2 | 3 | 4;

const passosMeta: ReadonlyArray<{ id: Passo; label: string }> = [
  { id: 1, label: "Informações" },
  { id: 2, label: "Data e Local" },
  { id: 3, label: "Organização" },
  { id: 4, label: "Imagem" }
];

// Opções para selects (ajuste conforme seus enums)
const tipoOptions = [
  { value: ActividadeType.Culto, label: "Culto", icon: GiPrayer, color: "bg-purple-500" },
  { value: ActividadeType.Evento, label: "Evento", icon: GiPartyPopper, color: "bg-pink-500" },
  { value: ActividadeType.Escola, label: "Escola Bíblica", icon: LiaBibleSolid, color: "bg-blue-500" },
  { value: ActividadeType.Jovens, label: "Juventude", icon: GiHeartBeats, color: "bg-green-500" },
  { value: ActividadeType.Familia, label: "Família", icon: GiFamilyHouse, color: "bg-amber-500" },
  { value: ActividadeType.Louvor, label: "Louvor", icon: LiaChairSolid, color: "bg-indigo-500" },
  { value: ActividadeType.Oracao, label: "Oração", icon: GiPrayer, color: "bg-red-500" }
];

const publicoOptions = [
  { value: PublicoAlvoType.Todos, label: "Todos" },
  { value: PublicoAlvoType.Jovens, label: "Jovens" },
  { value: PublicoAlvoType.Adultos, label: "Adultos" },
  { value: PublicoAlvoType.Criancas, label: "Crianças" },
  { value: PublicoAlvoType.Idosos, label: "Idosos" },
  { value: PublicoAlvoType.Mulheres, label: "Mulheres" },
  { value: PublicoAlvoType.Homens, label: "Homens" },
  { value: PublicoAlvoType.Casais, label: "Casais" }
];

const duracaoOptions = [
  { value: DuracaoActividade.Curta, label: "Curta (até 2h)" },
  { value: DuracaoActividade.Media, label: "Média (2-4h)" },
  { value: DuracaoActividade.Longa, label: "Longa (4-8h)" },
  { value: DuracaoActividade.Extendida, label: "Estendida (8h+)" },
  { value: DuracaoActividade.MultiplosDias, label: "Múltiplos dias" }
];

const splitDateTime = (dataEvento?: string) => {
  if (!dataEvento) return { data: "", hora: "" };
  const [data, hora] = dataEvento.split("T");
  return { data, hora: hora?.substring(0, 5) || "" };
};

const ModalActividade = ({
  actividade,
  onClose,
  onSave
}: ModalActividadeProps) => {
  const defaultDateTime = splitDateTime(actividade?.dataEvento);
  const [passo, setPasso] = useState<Passo>(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: actividade?.titulo || "",
    descricao: actividade?.descricao || "",
    tema: actividade?.tema || "",
    tipoEvento: actividade?.tipoEvento || ActividadeType.Culto,
    publicoAlvo: actividade?.publicoAlvo || PublicoAlvoType.Todos,
    duracao: actividade?.duracao || DuracaoActividade.Curta,
    data: defaultDateTime.data,
    hora: defaultDateTime.hora,
    endereco: actividade?.endereco || "",
    organizador: actividade?.organizador || "",
    contactos: actividade?.contactos || "",
    capacidade: actividade?.capacidade ? String(actividade.capacidade) : "",
    imgFile: undefined as File | undefined,
    imgPreview: actividade?.img || ""
  });

  const [error, setError] = useState("");

  const progresso = useMemo(() => {
    let completo = 0;
    const total = 8; // Campos obrigatórios principais

    if (formData.titulo) completo++;
    if (formData.descricao) completo++;
    if (formData.tema) completo++;
    if (formData.data && formData.hora) completo++;
    if (formData.endereco) completo++;
    if (formData.organizador) completo++;
    if (formData.contactos) completo++;
    if (formData.capacidade) completo++;

    return Math.round((completo / total) * 100);
  }, [formData]);

  const podeAvancar = () => {
    switch (passo) {
      case 1:
        return formData.titulo && formData.descricao && formData.tema;
      case 2:
        return formData.data && formData.hora && formData.endereco;
      case 3:
        return formData.organizador && formData.contactos && formData.capacidade;
      case 4:
        return true; // Imagem é validada no submit final
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
      // Último passo - validar imagem e salvar
      if (!formData.imgFile) {
        setError("Selecione uma imagem para continuar.");
        return;
      }

      onSave({
        titulo: formData.titulo,
        descricao: formData.descricao,
        tema: formData.tema,
        tipoEvento: formData.tipoEvento,
        publicoAlvo: formData.publicoAlvo,
        duracao: formData.duracao,
        data: formData.data,
        hora: formData.hora,
        endereco: formData.endereco,
        organizador: formData.organizador,
        contactos: formData.contactos,
        capacidade: Number(formData.capacidade),
        imgFile: formData.imgFile
      });
      onClose();
    } else {
      avancarPasso();
    }
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imgFile: file,
      imgPreview: preview
    }));
    setError("");
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
          Título da Actividade *
        </label>
        <input
          type="text"
          required
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          placeholder="Ex: Conferência de Jovens"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tema *
        </label>
        <input
          type="text"
          required
          value={formData.tema}
          onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          placeholder="Ex: Fogo e Unção"
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
          placeholder="Descreva a actividade..."
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data do Evento *
          </label>
          <input
            type="date"
            required
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora *
          </label>
          <input
            type="time"
            required
            value={formData.hora}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Endereço/Local *
        </label>
        <input
          type="text"
          required
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          placeholder="Ex: Templo Principal"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Actividade *
          </label>
          <select
            required
            value={formData.tipoEvento}
            onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value as ActividadeType })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            {tipoOptions.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duração *
          </label>
          <select
            required
            value={formData.duracao}
            onChange={(e) => setFormData({ ...formData, duracao: e.target.value as DuracaoActividade })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            {duracaoOptions.map((dur) => (
              <option key={dur.value} value={dur.value}>
                {dur.label}
              </option>
            ))}
          </select>
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
          Organizador/Responsável *
        </label>
        <input
          type="text"
          required
          value={formData.organizador}
          onChange={(e) => setFormData({ ...formData, organizador: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          placeholder="Ex: Pr. Antônio Silva"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contato *
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            value={formData.contactos}
            onChange={(e) => setFormData({ ...formData, contactos: e.target.value.replace(/\D/g, "") })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="999999999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacidade *
          </label>
          <input
            type="number"
            required
            min={1}
            value={formData.capacidade}
            onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="Ex: 200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Público-alvo *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {publicoOptions.map((pub) => {
            const isSelected = formData.publicoAlvo === pub.value;
            return (
              <button
                key={pub.value}
                type="button"
                onClick={() => setFormData({ ...formData, publicoAlvo: pub.value as PublicoAlvoType })}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <FiUsers size={16} className={isSelected ? 'text-primary-500' : 'text-gray-400'} />
                <span className="text-sm font-medium">{pub.label}</span>
                {isSelected && <FiCheck className="ml-auto text-primary-500" size={16} />}
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
          Adicione uma imagem para finalizar a criação da actividade.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagem da Actividade *
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="relative flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer group">
              <FiImage className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
              <span className="text-sm text-gray-600 group-hover:text-primary-600">
                {formData.imgPreview ? "Trocar imagem" : "Selecionar imagem"}
              </span>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
          {formData.imgPreview && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={formData.imgPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold mb-2">Resumo:</h4>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Título:</dt>
          <dd className="font-medium">{formData.titulo}</dd>
          <dt className="text-gray-500">Tema:</dt>
          <dd className="font-medium">{formData.tema}</dd>
          <dt className="text-gray-500">Data:</dt>
          <dd className="font-medium">{new Date(formData.data).toLocaleDateString('pt-BR')}</dd>
          <dt className="text-gray-500">Capacidade:</dt>
          <dd className="font-medium">{formData.capacidade} pessoas</dd>
        </dl>
      </div>
    </motion.div>
  );

  // Painel de Preview Lateral
  const renderPreviewLateral = () => {
    const tipoInfo = tipoOptions.find(t => t.value === formData.tipoEvento);
    const Icon = tipoInfo?.icon || FiCalendar;

    return (
      <div className="md:col-span-1 border-l border-gray-200 pl-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiEye className="text-primary-500" />
          Preview da Actividade
        </h3>

        <div className="bg-gray-50 rounded-xl overflow-hidden sticky top-6">
          {/* Imagem Preview */}
          <div className="relative h-40 overflow-hidden bg-gray-100">
            {formData.imgPreview ? (
              <img
                src={formData.imgPreview}
                alt={formData.titulo || "Preview"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FiImage size={40} />
              </div>
            )}

            {/* Badge de categoria */}
            {tipoInfo && (
              <div className={`absolute top-3 left-3 ${tipoInfo.color} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                <Icon size={12} />
                {tipoInfo.label}
              </div>
            )}

            {/* Badge de data (simplificada) */}
            {formData.data && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {new Date(formData.data).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>

          {/* Informações do Preview */}
          <div className="p-4">
            <h4 className="font-bold mb-2 line-clamp-2">
              {formData.titulo || "Título da Actividade"}
            </h4>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {formData.descricao || "Descrição da actividade aparecerá aqui..."}
            </p>

            <div className="space-y-2 text-sm text-gray-500">
              {formData.tema && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tema:</span>
                  <span className="text-gray-600">{formData.tema}</span>
                </div>
              )}
              
              {formData.endereco && (
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-primary-500" />
                  <span className="truncate">{formData.endereco}</span>
                </div>
              )}

              {formData.organizador && (
                <div className="flex items-center gap-2">
                  <FiUser size={14} className="text-primary-500" />
                  <span>{formData.organizador}</span>
                </div>
              )}

              {formData.capacidade && (
                <div className="flex items-center gap-2">
                  <FiUsers size={14} className="text-primary-500" />
                  <span>{formData.capacidade} pessoas</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <FiCalendar size={12} />
                {formData.data ? new Date(formData.data).toLocaleDateString('pt-BR') : 'Data não definida'} {formData.hora && `às ${formData.hora}`}
              </span>
              {formData.publicoAlvo && (
                <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {publicoOptions.find(p => p.value === formData.publicoAlvo)?.label}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Esta é uma prévia de como a actividade será exibida
        </p>
      </div>
    );
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiCalendar className="text-primary-500" />
              {actividade ? "Editar Actividade" : "Nova Actividade"}
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
                  className={`text-center ${passo === id ? "text-primary-600 font-semibold" : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="md:col-span-1">
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
                      className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      {actividade ? "Salvar Alterações" : "Criar Actividade"}
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

export { ModalActividade };