// src/pages/Galeria/GaleriaPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiDownload,
  FiTrash2,
  FiX,
  FiCalendar,
  FiEye,
  FiImage,
  FiRefreshCw
} from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";
import { apiFetch } from "../../utils/api";
import { GaleriaAdminItem, PageResponse } from "../../types/api";

// Interface da imagem
interface Imagem extends GaleriaAdminItem {}

// Modal de visualização da imagem
const VisualizadorImagem = ({
  imagem,
  onClose,
  onDelete,
  onDownload
}: {
  imagem: Imagem;
  onClose: () => void;
  onDelete: (id: number) => void;
  onDownload: (imagem: Imagem) => void;
}) => {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Botão fechar */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
      >
        <FiX size={30} />
      </button>

      {/* Imagem */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="max-w-7xl max-h-[90vh] px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imagem.url}
          alt={imagem.titulo}
          className="max-w-full max-h-[80vh] mx-auto rounded-lg shadow-2xl"
        />
      </motion.div>

      {/* Painel de informações (toggle) */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
      >
        <FiEye size={16} />
        {showInfo ? "Ocultar" : "Mostrar"} informações
      </button>

      {/* Ações */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {imagem.actividadeId && (
          <span className="px-4 py-2 bg-primary-500/20 text-primary-300 rounded-lg text-sm flex items-center gap-2">
            <GiPartyPopper size={16} />
            {imagem.actividadeTitulo}
          </span>
        )}
        <button
          onClick={() => onDownload(imagem)}
          className="px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <FiDownload size={16} />
          Download
        </button>
        <button
          onClick={() => {
            if (window.confirm("Tem certeza que deseja excluir esta imagem?")) {
              onDelete(imagem.id);
              onClose();
            }
          }}
          className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <FiTrash2 size={16} />
          Excluir
        </button>
      </div>

      {/* Painel de informações */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-6 bg-black/80 backdrop-blur-sm text-white rounded-xl p-4 max-w-md"
          >
            <h3 className="text-lg font-bold mb-2">{imagem.titulo}</h3>
            {imagem.descricao && (
              <p className="text-gray-300 text-sm mb-3">{imagem.descricao}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>📅 {new Date(imagem.dataPublicacao).toLocaleDateString("pt-BR")}</div>
              <div>👁️ {imagem.visualizacoes} views</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Card de imagem na galeria
const ImagemCard = ({
  imagem,
  onSelect,
  onDelete,
  onDownload
}: {
  imagem: Imagem;
  onSelect: (imagem: Imagem) => void;
  onDelete: (id: number) => void;
  onDownload: (imagem: Imagem) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Imagem */}
      <div
        className="aspect-square overflow-hidden cursor-pointer"
        onClick={() => onSelect(imagem)}
      >
        <img
          src={imagem.url}
          alt={imagem.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Badge de atividade (se tiver) */}
      {imagem.actividadeId && (
        <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow-lg">
          <GiPartyPopper size={12} />
          <span className="truncate max-w-[100px]">{imagem.actividadeTitulo}</span>
        </div>
      )}

      {/* Ações */}
      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDownload(imagem)}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
          title="Download"
        >
          <FiDownload size={14} />
        </button>
        <button
          onClick={() => {
            if (window.confirm("Tem certeza que deseja excluir esta imagem?")) {
              onDelete(imagem.id);
            }
          }}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
          title="Excluir"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* Info no hover (parte inferior) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
        <h4 className="text-sm font-medium line-clamp-1">{imagem.titulo}</h4>
        <p className="text-xs text-gray-300 flex items-center gap-2 mt-1">
          <FiCalendar size={10} />
          {new Date(imagem.dataPublicacao).toLocaleDateString("pt-BR")}
          <FiEye size={10} className="ml-2" />
          {imagem.visualizacoes}
        </p>
      </div>
    </motion.div>
  );
};

// Componente de estatísticas rápidas
const StatsCard = ({
  icone: Icon,
  titulo,
  valor,
  cor
}: {
  icone: any;
  titulo: string;
  valor: string | number;
  cor: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${cor} rounded-lg flex items-center justify-center text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className="text-xl font-bold text-gray-800">{valor}</p>
      </div>
    </div>
  </div>
);

// Componente Principal
export const GaleriaPage = () => {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<Imagem | null>(null);
  const [filterAtividade, setFilterAtividade] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [deletingImagemIds, setDeletingImagemIds] = useState<number[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "60");
        if (searchTerm.trim()) params.set("q", searchTerm.trim());

        const response = await apiFetch(`/admin/galeria?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Falha ao carregar galeria.");
        }

        const payload = (await response.json()) as PageResponse<GaleriaAdminItem>;
        if (!active) return;
        setImagens(payload.content ?? []);
        setLoadError("");
        setHasLoadedOnce(true);
      } catch (err) {
        if (!active) return;
        setLoadError("Não foi possível carregar a galeria.");
        setImagens([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchTerm, reloadToken]);

  const filteredImagens = useMemo(() => {
    return imagens.filter((img) => {
      const matchesSearch =
        searchTerm === "" ||
        img.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.actividadeTitulo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAtividade = !filterAtividade || String(img.actividadeId) === filterAtividade;

      return matchesSearch && matchesAtividade;
    });
  }, [imagens, searchTerm, filterAtividade]);

  const totalImagens = imagens.length;
  const imagensComAtividade = imagens.filter((img) => img.actividadeId).length;
  const totalVisualizacoes = imagens.reduce((acc, img) => acc + img.visualizacoes, 0);

  const atividades = Array.from(
    new Map(
      imagens
        .filter((img) => img.actividadeId)
        .map((img) => [String(img.actividadeId), img.actividadeTitulo || ""])
    ).entries()
  ).map(([id, nome]) => ({ id, nome }));

  const handleDelete = async (id: number) => {
    setDeletingImagemIds((current) => (current.includes(id) ? current : [id, ...current]));
    setActionError("");
    try {
      const response = await apiFetch(`/admin/midia/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Falha ao remover imagem.");
      }
      setReloadToken((prev) => prev + 1);
    } catch (err) {
      setActionError("Não foi possível remover a imagem.");
    } finally {
      setDeletingImagemIds((current) => current.filter((imgId) => imgId !== id));
    }
  };

  const handleDownload = (imagem: Imagem) => {
    const link = document.createElement("a");
    link.href = imagem.url;
    link.download = `${imagem.titulo}.jpg`;
    link.click();
  };

  const CardLoad = ({
    variant,
    titulo
  }: {
    variant?: "default" | "deleting";
    titulo?: string;
  }) => {
    const isDeleting = variant === "deleting";
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="group relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300"
      >
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />

          <div className="absolute top-2 left-2">
            <div className="h-6 w-28 rounded-lg bg-gray-300 animate-pulse" />
          </div>

          <div className="absolute bottom-2 right-2 flex gap-1">
            <div className="h-9 w-9 rounded-lg bg-gray-300 animate-pulse" />
            <div className="h-9 w-9 rounded-lg bg-gray-300 animate-pulse" />
          </div>

          {isDeleting && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-medium text-gray-800">
                <FiRefreshCw className="animate-spin" />
                <span className="max-w-[220px] truncate">
                  A remover{titulo ? `: ${titulo}` : "…"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="mt-2 h-3 w-2/3 rounded bg-gray-200 animate-pulse" />
        </div>
      </motion.div>
    );
  };

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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Galeria de Imagens</h1>
          <p className="text-gray-500">Gerencie todas as imagens da igreja</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCard icone={FiImage} titulo="Total de Imagens" valor={totalImagens} cor="bg-primary-500" />
          <StatsCard
            icone={GiPartyPopper}
            titulo="Vinculadas a Atividades"
            valor={imagensComAtividade}
            cor="bg-green-500"
          />
          <StatsCard
            icone={FiEye}
            titulo="Total de Visualizações"
            valor={totalVisualizacoes}
            cor="bg-blue-500"
          />
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar imagens por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtro por atividade */}
            <select
              value={filterAtividade || ""}
              onChange={(e) => setFilterAtividade(e.target.value || null)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[200px]"
            >
              <option value="">Todas as imagens</option>
              {atividades.map((atv) => (
                <option key={atv.id} value={atv.id}>
                  {atv.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredImagens.length} {filteredImagens.length === 1 ? "imagem encontrada" : "imagens encontradas"}
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

        {loadError ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Erro ao carregar</h3>
            <p className="text-gray-500 mb-4">{loadError}</p>
          </div>
        ) : (
          <>
            {((loading && hasLoadedOnce) || deletingImagemIds.length > 0) && (
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

            {filteredImagens.length === 0 ? (
              loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <CardLoad key={`loading-${index}`} />
                  ))}
                </div>
              ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma imagem encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filterAtividade
                ? "Tente buscar com outros termos ou limpar os filtros"
                : "A galeria está vazia"}
            </p>
            {(searchTerm || filterAtividade) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterAtividade(null);
                }}
                className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            )}
          </div>
              )
            ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {filteredImagens.map((imagem) => (
                deletingImagemIds.includes(imagem.id) ? (
                  <CardLoad key={imagem.id} variant="deleting" titulo={imagem.titulo} />
                ) : (
                  <ImagemCard
                    key={imagem.id}
                    imagem={imagem}
                    onSelect={setSelectedImage}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                )
              ))}
            </AnimatePresence>
          </div>
            )}
          </>
        )}
      </div>

      {/* Visualizador de imagem */}
      <AnimatePresence>
        {selectedImage && (
          <VisualizadorImagem
            imagem={selectedImage}
            onClose={() => setSelectedImage(null)}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
