// src/components/actividades/GaleriaActividade.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiImage, FiPlay, FiVideo, FiX } from "react-icons/fi";
import { apiFetch } from "../../utils/api";
import { MidiaSimple, PageResponse } from "../../types/api";

type MediaType = "VIDEO" | "IMAGE";

type MediaItem = {
  id: number;
  type: MediaType;
  url: string;
  titulo: string;
  thumbnail?: string;
};

interface GaleriaActividadeProps {
  activityId: number;
}

const isYoutubeId = (value: string) => /^[\\w-]{11}$/.test(value);
const youtubeThumb = (idOrUrl: string) => (isYoutubeId(idOrUrl) ? `https://img.youtube.com/vi/${idOrUrl}/hqdefault.jpg` : "");

export const GaleriaActividade = ({ activityId }: GaleriaActividadeProps) => {
  const [activeTab, setActiveTab] = useState<"todas" | "videos" | "imagens">("todas");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [galeriaRes, traillerRes] = await Promise.all([
          apiFetch(`/user/actividade/galeria/${activityId}?page=0&size=50`),
          apiFetch(`/user/actividade/trailler/${activityId}?page=0&size=50`),
        ]);

        const galeriaPayload = galeriaRes.ok ? ((await galeriaRes.json()) as PageResponse<MidiaSimple>) : null;
        const traillerPayload = traillerRes.ok ? ((await traillerRes.json()) as PageResponse<MidiaSimple>) : null;

        const imagens: MediaItem[] = (galeriaPayload?.content ?? []).map((m) => ({
          id: m.id,
          type: "IMAGE",
          url: m.url,
          titulo: m.titulo ?? "Imagem",
        }));

        const videos: MediaItem[] = (traillerPayload?.content ?? []).map((m) => ({
          id: m.id,
          type: "VIDEO",
          url: m.url,
          titulo: m.titulo ?? "Vídeo",
          thumbnail: youtubeThumb(m.url),
        }));

        if (!active) return;
        setItems([...videos, ...imagens]);
      } catch {
        if (!active) return;
        setError("Não foi possível carregar a galeria.");
        setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (Number.isFinite(activityId) && activityId > 0) {
      load();
    }

    return () => {
      active = false;
    };
  }, [activityId]);

  const filtered = useMemo(() => {
    if (activeTab === "videos") return items.filter((i) => i.type === "VIDEO");
    if (activeTab === "imagens") return items.filter((i) => i.type === "IMAGE");
    return items;
  }, [items, activeTab]);

  const videos = useMemo(() => items.filter((i) => i.type === "VIDEO"), [items]);
  const imagens = useMemo(() => items.filter((i) => i.type === "IMAGE"), [items]);

  const close = () => setSelected(null);
  const next = () => {
    if (!selected || filtered.length === 0) return;
    const idx = filtered.findIndex((i) => i.id === selected.id);
    const nextIdx = (idx + 1) % filtered.length;
    setSelected(filtered[nextIdx]);
  };
  const prev = () => {
    if (!selected || filtered.length === 0) return;
    const idx = filtered.findIndex((i) => i.id === selected.id);
    const prevIdx = (idx - 1 + filtered.length) % filtered.length;
    setSelected(filtered[prevIdx]);
  };

  return (
    <div >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Galeria</h3>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("todas")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "todas" ? "bg-primary text-white" : "text-gray-600 hover:text-primary"
            }`}
          >
            Todas ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              activeTab === "videos" ? "bg-primary text-white" : "text-gray-600 hover:text-primary"
            }`}
          >
            <FiVideo size={14} />
            Vídeos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab("imagens")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              activeTab === "imagens" ? "bg-primary text-white" : "text-gray-600 hover:text-primary"
            }`}
          >
            <FiImage size={14} />
            Imagens ({imagens.length})
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</div>}
      {loading ? (
        <div className="text-sm text-gray-500 py-10 text-center">A carregar…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-500 py-10 text-center">Sem itens na galeria.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelected(item)}
            >
              <img
                src={item.type === "VIDEO" ? item.thumbnail || "https://placehold.co/600x600?text=Video" : item.url}
                alt={item.titulo}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-medium line-clamp-2">{item.titulo}</p>
                </div>
              </div>

              <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded">
                {item.type === "VIDEO" ? <FiVideo size={14} /> : <FiImage size={14} />}
              </div>

              {item.type === "VIDEO" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiPlay className="text-white text-xl ml-0.5" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={close}
          >
            <button onClick={close} className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-10">
              <FiX size={30} />
            </button>
            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors"
                >
                  <FiChevronLeft size={50} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors"
                >
                  <FiChevronRight size={50} />
                </button>
              </>
            )}

            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-6xl max-h-[80vh] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.type === "VIDEO" ? (
                <div className="w-[min(1000px,90vw)] aspect-video bg-black rounded-xl overflow-hidden">
                  {isYoutubeId(selected.url) ? (
                    <iframe
                      title={selected.titulo}
                      src={`https://www.youtube.com/embed/${selected.url}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={selected.url} className="w-full h-full" controls />
                  )}
                </div>
              ) : (
                <img src={selected.url} alt={selected.titulo} className="max-h-[80vh] max-w-[90vw] rounded-xl" />
              )}
              <div className="text-center text-white mt-4">
                <p className="font-medium">{selected.titulo}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

