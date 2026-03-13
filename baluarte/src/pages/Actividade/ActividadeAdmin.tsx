// src/pages/Actividades/ActividadesPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiClock,
  FiEye,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUsers
} from "react-icons/fi";
import {
  GiCalendar,
  GiPartyPopper,
  GiPrayer,
  GiHeartBeats,
  GiFamilyHouse,
  GiDuration
} from "react-icons/gi";
import { LiaBibleSolid, LiaChairSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import {
  ActividadeSummary,
  ActividadeType,
  DuracaoActividade,
  PublicoAlvoType,
  PageResponse
} from "../../types/api";
import { apiFetch } from "../../utils/api";

const tipoOptions: { value: ActividadeType; label: string; icon: any; cor: string }[] = [
  { value: ActividadeType.Culto, label: "Culto", icon: GiPrayer, cor: "bg-purple-500" },
  { value: ActividadeType.Evento, label: "Evento Especial", icon: GiPartyPopper, cor: "bg-pink-500" },
  { value: ActividadeType.Escola, label: "Escola Bíblica", icon: LiaBibleSolid, cor: "bg-blue-500" },
  { value: ActividadeType.Jovens, label: "Juventude", icon: GiHeartBeats, cor: "bg-green-500" },
  { value: ActividadeType.Familia, label: "Família", icon: GiFamilyHouse, cor: "bg-amber-500" },
  { value: ActividadeType.Louvor, label: "Louvor", icon: LiaChairSolid, cor: "bg-indigo-500" },
  { value: ActividadeType.Oracao, label: "Oração", icon: GiPrayer, cor: "bg-red-500" },
  { value: ActividadeType.Evangelismo, label: "Evangelismo", icon: GiPartyPopper, cor: "bg-rose-500" },
  { value: ActividadeType.Acampamento, label: "Acampamento", icon: GiCalendar, cor: "bg-emerald-500" },
  { value: ActividadeType.Conferencia, label: "Conferência", icon: GiPartyPopper, cor: "bg-orange-500" }
];

const duracaoOptions: { value: DuracaoActividade; label: string }[] = [
  { value: DuracaoActividade.Curta, label: "Até 2h" },
  { value: DuracaoActividade.Media, label: "2-4h" },
  { value: DuracaoActividade.Longa, label: "4-8h" },
  { value: DuracaoActividade.Extendida, label: "Mais de 8h" },
  { value: DuracaoActividade.MultiplosDias, label: "Múltiplos dias" }
];

const publicoOptions: { value: PublicoAlvoType; label: string }[] = [
  { value: PublicoAlvoType.Todos, label: "Todos" },
  { value: PublicoAlvoType.Jovens, label: "Jovens" },
  { value: PublicoAlvoType.Adultos, label: "Adultos" },
  { value: PublicoAlvoType.Criancas, label: "Crianças" },
  { value: PublicoAlvoType.Idosos, label: "Idosos" },
  { value: PublicoAlvoType.Mulheres, label: "Mulheres" },
  { value: PublicoAlvoType.Homens, label: "Homens" },
  { value: PublicoAlvoType.Casais, label: "Casais" }
];

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
};

const formatTime = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const splitDateTime = (iso?: string) => {
  if (!iso) {
    return { data: new Date().toISOString().split("T")[0], hora: "19:00" };
  }
  const [dataPart, timePart] = iso.split("T");
  const hora = timePart ? timePart.slice(0, 5) : "19:00";
  return {
    data: dataPart || new Date().toISOString().split("T")[0],
    hora: hora || "19:00"
  };
};

const makeDateTime = (data: string, hora: string) => {
  const safeHora = hora && hora.length >= 5 ? hora : "00:00";
  return `${data}T${safeHora}:00`;
};

const tipoConfig = (tipo: ActividadeType) => {
  return tipoOptions.find((item) => item.value === tipo);
};

const labelForDuracao = (duracao: DuracaoActividade) => {
  return duracaoOptions.find((item) => item.value === duracao)?.label ?? duracao;
};

const labelForPublico = (publico: PublicoAlvoType) => {
  return publicoOptions.find((item) => item.value === publico)?.label ?? publico;
};

// Modal de Actividade
const ModalActividade = ({
  actividade,
  onClose,
  onSave
}: {
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
}) => {
  const defaultDateTime = splitDateTime(actividade?.dataEvento);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GiCalendar className="text-primary-500" />
              {actividade ? "Editar Actividade" : "Nova Actividade"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto h-[70vh]">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
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
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Descreva a actividade..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Actividade *
                  </label>
                  <select
                    required
                    value={formData.tipoEvento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoEvento: e.target.value as ActividadeType
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {tipoOptions.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração *
                    </label>
                    <select
                      required
                      value={formData.duracao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duracao: e.target.value as DuracaoActividade
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      {duracaoOptions.map((dur) => (
                        <option key={dur.value} value={dur.value}>
                          {dur.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Público-alvo *
                    </label>
                    <select
                      required
                      value={formData.publicoAlvo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publicoAlvo: e.target.value as PublicoAlvoType
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      {publicoOptions.map((pub) => (
                        <option key={pub.value} value={pub.value}>
                          {pub.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactos: e.target.value.replace(/\D/g, "")
                        })
                      }
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
                    Imagem *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  {formData.imgPreview && (
                    <img
                      src={formData.imgPreview}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Botões */}
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
                {actividade ? "Salvar Alterações" : "Criar Actividade"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Card de Actividade (simples, como pedido)
const ActividadeCard = ({
  actividade,
  onEdit,
  onDelete,
  onDetail
}: {
  actividade: ActividadeSummary;
  onEdit: (actividade: ActividadeSummary) => void;
  onDelete: (id: number) => void;
  onDetail: (id: number) => void;
}) => {
  const config = tipoConfig(actividade.tipoEvento);
  const Icon = config?.icon ?? GiCalendar;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={actividade.img}
          alt={actividade.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badge de tipo */}
        {config && (
          <div
            className={`absolute top-4 left-4 ${config.cor} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg`}
          >
            <Icon size={12} />
            {config.label}
          </div>
        )}

        {/* Badge de duração */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
          <GiDuration size={12} />
          {labelForDuracao(actividade.duracao)}
        </div>

        {/* Ações */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(actividade)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDetail(actividade.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEye size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Tem certeza que deseja excluir esta actividade?")) {
                onDelete(actividade.id);
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
        <h3 className="text-lg font-bold mb-1 group-hover:text-primary-500 transition-colors">
          {actividade.titulo}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{actividade.tema}</p>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{actividade.descricao}</p>

        {/* Info rápida */}
        <div className="space-y-2 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-primary-400" size={14} />
            <span>{formatDate(actividade.dataEvento)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-primary-400" size={14} />
            <span>{formatTime(actividade.dataEvento)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-primary-400" size={14} />
            <span className="truncate">{actividade.endereco}</span>
          </div>
        </div>

        {/* Organizador e público */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <FiUser size={12} />
            {actividade.organizador.split(" ")[0]}
          </span>
          <span className="flex items-center gap-1">
            <FiUsers size={12} />
            {labelForPublico(actividade.publicoAlvo)}
          </span>
        </div>

        {/* Capacidade (se houver) */}
        {typeof actividade.capacidade === "number" && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Inscritos</span>
              <span className="font-medium">
                {actividade.inscritos ?? 0}/{actividade.capacidade}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{
                  width: `${Math.min(actividade.inscritos ?? 0, actividade.capacidade) /
                    (actividade.capacidade || 1) *
                    100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Componente Principal
export const ActividadesPageAdmin = () => {
  const [actividades, setActividades] = useState<ActividadeSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<ActividadeType | null>(null);
  const [selectedDuracao, setSelectedDuracao] = useState<DuracaoActividade | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingActividade, setEditingActividade] = useState<ActividadeSummary | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "50");
        if (searchTerm.trim()) params.set("q", searchTerm.trim());
        if (selectedTipo) params.set("tipoEvento", selectedTipo);
        if (selectedDuracao) params.set("duracao", selectedDuracao);

        const response = await apiFetch(`/admin/actividade?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Falha ao carregar actividades.");
        }

        const payload = (await response.json()) as PageResponse<ActividadeSummary>;
        if (!active) return;
        setActividades(payload.content ?? []);
        setError("");
      } catch (err) {
        if (!active) return;
        setError("Não foi possível carregar as actividades.");
        setActividades([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchTerm, selectedTipo, selectedDuracao, reloadToken]);

  const handleSave = async (novaActividade: {
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
  }) => {
    const formData = new FormData();
    formData.append("titulo", novaActividade.titulo);
    formData.append("descricao", novaActividade.descricao);
    formData.append("tema", novaActividade.tema);
    formData.append("tipoEvento", novaActividade.tipoEvento);
    formData.append("publicoAlvo", novaActividade.publicoAlvo);
    formData.append("duracao", novaActividade.duracao);
    formData.append("endereco", novaActividade.endereco);
    formData.append("organizador", novaActividade.organizador);
    formData.append("contactos", novaActividade.contactos);
    formData.append("capacidade", String(novaActividade.capacidade));
    formData.append("dataEvento", makeDateTime(novaActividade.data, novaActividade.hora));
    formData.append("img", novaActividade.imgFile);

    const endpoint = editingActividade
      ? `/admin/actividade/${editingActividade.id}`
      : "/admin/actividade";
    const method = editingActividade ? "PUT" : "POST";

    const response = await apiFetch(endpoint, {
      method,
      body: formData
    });

    if (!response.ok) {
      throw new Error("Falha ao salvar actividade.");
    }

    setReloadToken((prev) => prev + 1);
    setEditingActividade(undefined);
  };

  const handleEdit = (actividade: ActividadeSummary) => {
    setEditingActividade(actividade);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiFetch(`/admin/actividade/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Falha ao remover actividade.");
      }
      setReloadToken((prev) => prev + 1);
    } catch (err) {
      setError("Não foi possível remover a actividade.");
    }
  };

  const handleDetail = (id: number) => {
    navigate(`/admin/actividades/${id}`);
  };

  const resultados = useMemo(() => actividades.length, [actividades]);

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Actividades
            </h1>
            <p className="text-gray-500">
              Gerencie todas as actividades e eventos da igreja
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingActividade(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Nova Actividade
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtro por tipo */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <select
                value={selectedTipo || ""}
                onChange={(e) => setSelectedTipo((e.target.value as ActividadeType) || null)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">Todos os tipos</option>
                {tipoOptions.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por duração */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Duração</label>
              <select
                value={selectedDuracao || ""}
                onChange={(e) =>
                  setSelectedDuracao((e.target.value as DuracaoActividade) || null)
                }
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">Todas as durações</option>
                {duracaoOptions.map((dur) => (
                  <option key={dur.value} value={dur.value}>
                    {dur.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {resultados} {resultados === 1 ? "actividade encontrada" : "actividades encontradas"}
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-500">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">A carregar actividades...</div>
        ) : actividades.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <GiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Nenhuma actividade encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo || selectedDuracao
                ? "Tente buscar com outros termos ou limpar os filtros"
                : "Comece criando sua primeira actividade!"}
            </p>
            {searchTerm || selectedTipo || selectedDuracao ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTipo(null);
                  setSelectedDuracao(null);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingActividade(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Criar Primeira Actividade
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {actividades.map((actividade) => (
                <ActividadeCard
                  key={actividade.id}
                  actividade={actividade}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDetail={handleDetail}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Actividade */}
      <AnimatePresence>
        {showModal && (
          <ModalActividade
            actividade={editingActividade}
            onClose={() => {
              setShowModal(false);
              setEditingActividade(undefined);
            }}
            onSave={(payload) => {
              handleSave(payload).catch(() => {
                setError("Não foi possível salvar a actividade.");
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
