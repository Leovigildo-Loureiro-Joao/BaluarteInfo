// src/pages/Artigos/ArtigosPage.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiFilter, 
  FiBookOpen, 
  FiUser, 
  FiCalendar,
  FiClock,
  FiEye,
  FiDownload,
  FiX,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiTag,
  FiFileText,
  FiImage,
  FiRefreshCw
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiScrollQuill, 
  GiAngelWings,
  GiOpenBook 
} from "react-icons/gi";
import { LiaBibleSolid, LiaCrossSolid } from "react-icons/lia";
import  ModalArtigo  from "../../components/artigos/ModalArtigo";
import { ArtigoCard } from "../../components/artigos/CardArtigoAdmin";
import { ArtigoDetail } from "../../types/api";
import { apiFetch } from "../../utils/api.js";

// Tipos baseados no seu Enum ArtigoType
type ArtigoType = 'BIBLE_STUDY' | 'DEVOTIONAL' | 'HISTORICAL' | 'DOCTRINAL' | 
                  'TESTIMONY' | 'APOLOGETICS' | 'PROPHETIC' | 'THEOLOGICAL';

export const tiposArtigo: { value: ArtigoType; label: string; icon: any; color: string }[] = [
  { value: "BIBLE_STUDY", label: "Estudo Bíblico", icon: LiaBibleSolid, color: "bg-blue-500" },
  { value: "DEVOTIONAL", label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: "HISTORICAL", label: "Histórico", icon: GiScrollQuill, color: "bg-amber-500" },
  { value: "DOCTRINAL", label: "Doutrinário", icon: LiaCrossSolid, color: "bg-purple-500" },
  { value: "TESTIMONY", label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: "APOLOGETICS", label: "Apologética", icon: GiOpenBook, color: "bg-indigo-500" },
  { value: "PROPHETIC", label: "Profético", icon: GiScrollQuill, color: "bg-orange-500" },
  { value: "THEOLOGICAL", label: "Teológico", icon: LiaBibleSolid, color: "bg-red-500" },
];

type ArtigoApi = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: ArtigoType;
  escritor: string;
  pdf: string;
  nPagina: number;
  dataPublicacao: string;
  img: string;
  visualizacoes?: number;
};

type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ArtigoAdminView = ArtigoDetail & {
  tempoLeitura?: string;
  visualizacoes?: number;
  tags?: string[];
};

// Componente Principal
export const ArtigosPageAdmin = () => {
  const [artigos, setArtigos] = useState<ArtigoAdminView[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<ArtigoType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArtigo, setEditingArtigo] = useState<ArtigoAdminView | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  // Regras para consumir a API no admin (somente Artigos):
  // 1) Lista: GET /admin/artigo?page&size&tipo&q
  // 2) Criar: POST /admin/artigo (multipart/form-data com pdf)
  // 3) Editar: PUT /admin/artigo/edit/{id} (multipart/form-data com pdf)
  // 4) Excluir: DELETE /admin/artigo/delete/{id}
  useEffect(() => {
    let active = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "12");
        if (selectedTipo) params.set("tipo", selectedTipo);
        if (searchTerm.trim()) params.set("q", searchTerm.trim());

        const response = await apiFetch(`/admin/artigo?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Falha ao carregar artigos.");
        }

        const payload = (await response.json()) as PageResponse<ArtigoApi>;
        if (!active) return;

        const mapped = payload.content.map((artigo) => {
          const tempoLeitura = Math.max(1, Math.ceil((artigo.nPagina || 1) / 2));
          return {
            ...artigo,
            tempoLeitura: `${tempoLeitura} min`,
            visualizacoes: artigo.visualizacoes ?? 0,
            tags: [],
          } as ArtigoAdminView;
        });

        setArtigos(mapped);
        setError("");
      } catch (err) {
        if (!active) return;
        setError("Não foi possível carregar os artigos.");
        setArtigos([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchTerm, selectedTipo, reloadToken]);

  const handleSave = async (novoArtigo: ArtigoUpsertPayload) => {
    try {
      // Enviar multipart para criar/editar (PDF obrigatório).
      const formData = new FormData();
      formData.append("titulo", novoArtigo.titulo);
      formData.append("descricao", novoArtigo.descricao);
      formData.append("escritor", novoArtigo.escritor);
      formData.append("tipo", novoArtigo.tipo);
      const isEditing = Boolean(editingArtigo);
      if (!isEditing) {
        if (!(novoArtigo.pdf instanceof File)) {
          throw new Error("PDF obrigatório para criar artigo.");
        }
        formData.append("pdf", novoArtigo.pdf);
      } else if (novoArtigo.pdf instanceof File) {
        formData.append("pdf", novoArtigo.pdf);
      }
      if (novoArtigo.img instanceof File) {
        formData.append("img", novoArtigo.img);
      }

      const endpoint = isEditing
        ? `/admin/artigo/edit/${editingArtigo?.id}`
        : "/admin/artigo";

      const response = await apiFetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar artigo.");
      }

      setShowModal(false);
      setEditingArtigo(undefined);
      setError("");

      // Recarregar a lista após salvar (mesmo se os filtros não mudaram).
      setReloadToken((current) => current + 1);
    } catch (err) {
      setError("Não foi possível salvar o artigo.");
    }
  };

  const handleEdit = (artigo: ArtigoDetail) => {
    setEditingArtigo(artigo);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiFetch(`/admin/artigo/delete/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Falha ao excluir artigo.");
      }
      setArtigos(artigos.filter(a => a.id !== id));
      setError("");
    } catch (err) {
      setError("Não foi possível excluir o artigo.");
    }
  };

  const handleRegenerateHtml = async (id: number) => {
    try {
      const response = await apiFetch(`/admin/artigo/${id}/html`, { method: "PUT" });
      if (!response.ok) {
        throw new Error("Falha ao regerar HTML.");
      }
      setReloadToken((current) => current + 1);
      setError("");
    } catch (err) {
      setError("Não foi possível regerar o HTML do artigo.");
    }
  };

  const handleRegenerateHtmlAll = async () => {
    if (!window.confirm("Regerar o HTML de TODOS os artigos? Isso pode demorar.")) return;
    try {
      const response = await apiFetch(`/admin/artigo/html`, { method: "PUT" });
      if (!response.ok) {
        throw new Error("Falha ao regerar HTML.");
      }
      setReloadToken((current) => current + 1);
      setError("");
    } catch (err) {
      setError("Não foi possível regerar o HTML de todos os artigos.");
    }
  };

 return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Grid decorativo - EXATAMENTE como você queria */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10 py-8">
        {/* Header - simplificado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Artigos
            </h1>
            <p className="text-gray-500">
              Gerencie todos os <span className="text-primary">artigos</span> e estudos da <span className="text-primary">igreja</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={handleRegenerateHtmlAll}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title="Regerar HTML de todos os artigos"
            >
              <FiRefreshCw size={18} />
              Regerar HTML
            </button>

            <button
              onClick={() => {
                setEditingArtigo(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Novo Artigo
            </button>
          </div>
        </div>

        {/* Filtros por tipo - simplificado */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTipo(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedTipo
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {tiposArtigo.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => setSelectedTipo(tipo.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedTipo === tipo.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tipo.icon size={14} />
                {tipo.label}
              </button>
            ))}
          </div>
          
          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {artigos.length} {artigos.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
          </div>
        </div>

        {/* Grid de Artigos */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Carregando artigos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Erro ao carregar</h3>
            <p className="text-gray-500 mb-4">{error}</p>
          </div>
        ) : artigos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo 
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Comece criando seu primeiro artigo!'}
            </p>
            {(searchTerm || selectedTipo) ? (
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
                  setEditingArtigo(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Criar Primeiro Artigo
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {artigos.map((artigo) => (
                <ArtigoCard
                  key={artigo.id}
                  artigo={artigo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRegenerateHtml={handleRegenerateHtml}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Artigo (manter igual) */}
      <AnimatePresence>
        {showModal && (
          <ModalArtigo
            artigo={editingArtigo}
            onClose={() => {
              setShowModal(false);
              setEditingArtigo(undefined);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
type ArtigoUpsertPayload = {
  titulo: string;
  descricao: string;
  escritor: string;
  tipo: string;
  pdf?: File;
  img?: File | null;
};
