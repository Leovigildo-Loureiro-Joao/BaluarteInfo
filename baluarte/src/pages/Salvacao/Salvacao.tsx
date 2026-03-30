import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeadphones, FiPlayCircle } from "react-icons/fi";
import { apiFetch } from "../../utils/api.js";
import type { MidiaProjection, PageResponse, SalvacaoDto } from "../../types/api";

type ArtigoApi = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  escritor: string;
  dataPublicacao: string;
  img: string;
  visualizacoes?: number;
};

const emptyPayload: SalvacaoDto = {
  imagemCapaUrl: "",
  titulo: "",
  conteudoMarkdown: "",
  conteudoHtml: "",
  videoUrl: "",
  oracao: "",
  botao: { texto: "", link: "" },
  feed: { artigoTipo: null, audioTipo: null, videoTipo: null, limit: 6 },
};

const toEmbedUrl = (rawUrl: string) => {
  const url = (rawUrl ?? "").trim();
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (!v) return "";
      return `https://www.youtube.com/embed/${v}`;
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "").trim();
      if (!id) return "";
      return `https://www.youtube.com/embed/${id}`;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (!id) return "";
      return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    // ignora
  }

  return "";
};

export const SalvacaoPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<SalvacaoDto>(emptyPayload);
  const [artigos, setArtigos] = useState<ArtigoApi[]>([]);
  const [audios, setAudios] = useState<MidiaProjection[]>([]);
  const [videos, setVideos] = useState<MidiaProjection[]>([]);

  const embedUrl = useMemo(() => toEmbedUrl(payload.videoUrl), [payload.videoUrl]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch("/public/salvacao", { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar.");
        const data = (await res.json()) as SalvacaoDto;
        if (!active) return;
        setPayload({ ...emptyPayload, ...data, botao: { ...emptyPayload.botao, ...(data?.botao ?? {}) } });
      } catch {
        if (!active) return;
        setError("Não foi possível carregar a página de Salvação agora.");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!payload?.feed) return;
    const limit = payload.feed.limit ?? 0;
    if (limit <= 0) return;

    let active = true;
    const controller = new AbortController();

    const loadRelated = async () => {
      const tasks: Promise<void>[] = [];

      if (payload.feed.artigoTipo) {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", String(limit));
        params.set("tipo", String(payload.feed.artigoTipo));
        tasks.push(
          (async () => {
            const res = await apiFetch(`/user/artigo?${params.toString()}`, { signal: controller.signal });
            if (!res.ok) return;
            const page = (await res.json()) as PageResponse<ArtigoApi>;
            if (!active) return;
            setArtigos(Array.isArray(page?.content) ? page.content : []);
          })()
        );
      } else {
        setArtigos([]);
      }

      if (payload.feed.audioTipo) {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", String(limit));
        params.set("type", "AUDIO");
        params.set("audioType", String(payload.feed.audioTipo));
        tasks.push(
          (async () => {
            const res = await apiFetch(`/user/midia?${params.toString()}`, { signal: controller.signal });
            if (!res.ok) return;
            const page = (await res.json()) as PageResponse<MidiaProjection>;
            if (!active) return;
            setAudios(Array.isArray(page?.content) ? page.content : []);
          })()
        );
      } else {
        setAudios([]);
      }

      if (payload.feed.videoTipo) {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", String(limit));
        params.set("type", "VIDEO");
        params.set("videoType", String(payload.feed.videoTipo));
        tasks.push(
          (async () => {
            const res = await apiFetch(`/user/midia?${params.toString()}`, { signal: controller.signal });
            if (!res.ok) return;
            const page = (await res.json()) as PageResponse<MidiaProjection>;
            if (!active) return;
            setVideos(Array.isArray(page?.content) ? page.content : []);
          })()
        );
      } else {
        setVideos([]);
      }

      await Promise.allSettled(tasks);
    };

    loadRelated();
    return () => {
      active = false;
      controller.abort();
    };
  }, [payload.feed?.artigoTipo, payload.feed?.audioTipo, payload.feed?.videoTipo, payload.feed?.limit]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <div className="container-custom py-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">Carregando…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <div className="container-custom py-10">
          <div className="bg-white rounded-2xl border border-red-200 p-6 text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <section className="relative h-[420px] overflow-hidden">
        {payload.imagemCapaUrl ? (
          <img src={payload.imagemCapaUrl} alt={payload.titulo || "Salvação"} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-primary/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white max-w-4xl">
              {payload.titulo || "Salvação"}
            </h1>
          </div>
        </div>
      </section>

      <section className="container-custom py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {payload.conteudoHtml ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: payload.conteudoHtml }} />
            </div>
          ) : null}

          {embedUrl ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <FiPlayCircle className="text-primary" />
                Vídeo
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={embedUrl}
                  title={payload.titulo || "Vídeo"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}

          {payload.oracao ? (
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 md:p-10">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Oração</h2>
              <p className="text-gray-700 whitespace-pre-line">{payload.oracao}</p>
              {payload.botao?.texto && payload.botao?.link ? (
                <a
                  href={payload.botao.link}
                  className="inline-flex mt-6 px-5 py-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  {payload.botao.texto}
                </a>
              ) : null}
            </div>
          ) : null}

          {(artigos.length || audios.length || videos.length) ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Conteúdos</h2>
                <div className="flex items-center gap-2">
                  <Link to="/artigos" className="text-sm text-primary hover:underline">
                    Ver artigos
                  </Link>
                  <Link to="/midia" className="text-sm text-primary hover:underline">
                    Ver mídias
                  </Link>
                </div>
              </div>

              {artigos.length ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Artigos</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {artigos.map((item) => (
                      <Link
                        key={item.id}
                        to={`/artigos/${item.id}`}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-36 bg-gray-100">
                          {item.img ? <img src={item.img} alt={item.titulo} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-gray-500">{item.tipo}</div>
                          <div className="font-semibold text-gray-900 line-clamp-2">{item.titulo}</div>
                          <div className="text-sm text-gray-600 line-clamp-2 mt-1">{item.descricao}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {audios.length ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FiHeadphones className="text-primary" /> Áudios
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {audios.map((item) => (
                      <Link
                        key={item.id}
                        to={`/midia/${item.id}`}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-36 bg-gray-100">
                          {item.imagem ? (
                            <img src={item.imagem} alt={item.titulo} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-gray-500">{item.audioType ?? "AUDIO"}</div>
                          <div className="font-semibold text-gray-900 line-clamp-2">{item.titulo}</div>
                          <div className="text-sm text-gray-600 line-clamp-2 mt-1">{item.descricao}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {videos.length ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Vídeos</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {videos.map((item) => (
                      <Link
                        key={item.id}
                        to={`/midia/${item.id}`}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-36 bg-gray-100">
                          {item.imagem ? (
                            <img src={item.imagem} alt={item.titulo} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-gray-500">{item.videoType ?? "VIDEO"}</div>
                          <div className="font-semibold text-gray-900 line-clamp-2">{item.titulo}</div>
                          <div className="text-sm text-gray-600 line-clamp-2 mt-1">{item.descricao}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
