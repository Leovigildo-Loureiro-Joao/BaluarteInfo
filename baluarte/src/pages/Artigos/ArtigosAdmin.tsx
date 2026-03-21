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
import { ArtigoDetail, ArtigoType as ApiArtigoType } from "../../types/api";
import { apiFetch } from "../../utils/api.js";

type ArtigoType = ApiArtigoType;

export const tiposArtigo: { value: ArtigoType; label: string; icon: any; color: string }[] = [
  { value: ApiArtigoType.BibleStudy, label: "Estudo Bíblico", icon: LiaBibleSolid, color: "bg-blue-500" },
  { value: ApiArtigoType.Devotional, label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: ApiArtigoType.Historical, label: "Histórico", icon: GiScrollQuill, color: "bg-amber-500" },
  { value: ApiArtigoType.Doctrinal, label: "Doutrinário", icon: LiaCrossSolid, color: "bg-purple-500" },
  { value: ApiArtigoType.Testimony, label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: ApiArtigoType.Apologetics, label: "Apologética", icon: GiOpenBook, color: "bg-indigo-500" },
  { value: ApiArtigoType.Prophetic, label: "Profético", icon: GiScrollQuill, color: "bg-orange-500" },
  { value: ApiArtigoType.Theological, label: "Teológico", icon: LiaBibleSolid, color: "bg-red-500" },
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
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [creatingArtigos, setCreatingArtigos] = useState<
    {
      tempId: string;
      titulo: string;
      descricao: string;
      escritor: string;
      tipo: ArtigoType;
      startedAt: number;
    }[]
  >([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

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
        setLoadError("");
        setHasLoadedOnce(true);
      } catch (err) {
        if (!active) return;
        setLoadError("Não foi possível carregar os artigos.");
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
    const isEditing = Boolean(editingArtigo);
    const tempId = `creating-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    if (!isEditing) {
      setCreatingArtigos((current) => [
        {
          tempId,
          titulo: novoArtigo.titulo,
          descricao: novoArtigo.descricao,
          escritor: novoArtigo.escritor,
          tipo: novoArtigo.tipo,
          startedAt: Date.now(),
        },
        ...current,
      ]);
      setActionError("");
    }
    try {
      // Enviar multipart para criar/editar (PDF obrigatório).
      const formData = new FormData();
      formData.append("titulo", novoArtigo.titulo);
      formData.append("descricao", novoArtigo.descricao);
      formData.append("escritor", novoArtigo.escritor);
      formData.append("tipo", novoArtigo.tipo);
      if (novoArtigo.markdown && novoArtigo.markdown.trim()) {
        formData.append("markdown", novoArtigo.markdown.trim());
      }
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

      if (!isEditing) {
        let created: Partial<ArtigoApi> | null = null;
        try {
          created = (await response.json()) as Partial<ArtigoApi>;
        } catch {
          created = null;
        }
        if (created && typeof created.id === "number") {
          const tempoLeitura = Math.max(1, Math.ceil(((created.nPagina as number) || 1) / 2));
          const mappedCreated: ArtigoAdminView = {
            ...(created as any),
            tempoLeitura: `${tempoLeitura} min`,
            visualizacoes: (created.visualizacoes as number) ?? 0,
            tags: [],
          };
          setArtigos((current) => {
            const withoutSame = current.filter((a) => a.id !== mappedCreated.id);
            return [mappedCreated, ...withoutSame];
          });
        }
      }

      setShowModal(false);
      setEditingArtigo(undefined);
      setActionError("");

      // Recarregar a lista após salvar (mesmo se os filtros não mudaram).
      setReloadToken((current) => current + 1);
    } catch (err) {
      setActionError("Não foi possível salvar o artigo.");
    } finally {
      if (!isEditing) {
        setCreatingArtigos((current) => current.filter((a) => a.tempId !== tempId));
      }
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
      setActionError("");
    } catch (err) {
      setActionError("Não foi possível excluir o artigo.");
    }
  };

  const handleRegenerateHtml = async (id: number) => {
    try {
      const response = await apiFetch(`/admin/artigo/${id}/html`, { method: "PUT" });
      if (!response.ok) {
        throw new Error("Falha ao regerar HTML.");
      }
      setReloadToken((current) => current + 1);
      setActionError("");
    } catch (err) {
      setActionError("Não foi possível regerar o HTML do artigo.");
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
      setActionError("");
    } catch (err) {
      setActionError("Não foi possível regerar o HTML de todos os artigos.");
    }
  };

  const CardLoad = ({
    variant,
    titulo,
  }: {
    variant?: "default" | "creating";
    titulo?: string;
  }) => {
    const isCreating = variant === "creating";
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md transition-all duration-300 group cursor-pointer ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="h-6 w-28 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
          </div>

          <div className="absolute bottom-4 right-4">
            <div className="h-6 w-16 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
          </div>

          {isCreating && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-100">
                <FiRefreshCw className="animate-spin" />
                <span className="max-w-[220px] truncate">
                  A publicar{titulo ? `: ${titulo}` : "…"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    );
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Artigos
            </h1>
            <p className="text-gray-500">
              Gerencie todos os <span className="text-primary">artigos</span> e estudos da <span className="text-primary">igreja</span>
            </p>
          </div>
          
          <div className="flex w-full flex-col sm:flex-row sm:flex-wrap gap-3 lg:w-auto">
            {/* Busca */}
            <div className="relative w-full sm:flex-1 sm:min-w-[16rem] sm:max-w-[24rem] min-w-0">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-w-0 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={handleRegenerateHtmlAll}
              className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
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
              className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 whitespace-nowrap"
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

        {actionError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start justify-between gap-4">
            <p className="text-sm">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError("")}
              className="p-1 rounded-lg hover:bg-red-100 transition-colors"
              title="Fechar"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* Grid de Artigos */}
        {loadError ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Erro ao carregar</h3>
            <p className="text-gray-500 mb-4">{loadError}</p>
          </div>
        ) : (
          <>
            {((loading && hasLoadedOnce) || creatingArtigos.length > 0) && (
              <div className="mb-4 overflow-hidden rounded-xl bg-white border border-gray-100">
                <div className="h-1 bg-gray-100">
                  <motion.div
                    className="h-1 w-1/3 bg-primary-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: "300%" }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            {artigos.length === 0 && creatingArtigos.length === 0 ? (
              loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CardLoad key={`loading-${index}`} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum artigo encontrado</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedTipo
                      ? "Tente buscar com outros termos ou limpar os filtros"
                      : "Comece criando seu primeiro artigo!"}
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
              )
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {creatingArtigos.map((artigo) => (
                    <CardLoad key={artigo.tempId} variant="creating" titulo={artigo.titulo} />
                  ))}
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
          </>
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
  tipo: ArtigoType;
  pdf?: File;
  img?: File | null;
  markdown?: string;
};
