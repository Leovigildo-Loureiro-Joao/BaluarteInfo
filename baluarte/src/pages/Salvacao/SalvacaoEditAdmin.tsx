import { useEffect, useMemo, useState } from "react";
import { FiImage, FiSave, FiUpload } from "react-icons/fi";
import { apiFetch } from "../../utils/api.js";
import type { SalvacaoDto } from "../../types/api";
import { ArtigoType, AudioType, VideoType } from "../../types/api";

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

type UploadResponse = { url: string };

export const SalvacaoEditAdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [payload, setPayload] = useState<SalvacaoDto>(emptyPayload);

  const artigoTipos = useMemo(() => Object.values(ArtigoType) as ArtigoType[], []);
  const audioTipos = useMemo(() => Object.values(AudioType) as AudioType[], []);
  const videoTipos = useMemo(() => Object.values(VideoType) as VideoType[], []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch("/admin/salvacao", { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar conteúdo de Salvação.");
        const data = (await res.json()) as SalvacaoDto;
        if (!active) return;
        setPayload({
          ...emptyPayload,
          ...data,
          botao: { ...emptyPayload.botao, ...(data?.botao ?? {}) },
          feed: { ...emptyPayload.feed, ...(data?.feed ?? {}) },
        });
      } catch {
        if (!active) return;
        setError("Não foi possível carregar a aba Salvação agora.");
        setPayload(emptyPayload);
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

  const uploadCover = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await apiFetch("/admin/salvacao/cover-upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Falha no upload.");
      const result = (await res.json()) as UploadResponse;
      setPayload((prev) => ({ ...prev, imagemCapaUrl: result.url ?? "" }));
      setSuccess("Imagem de capa atualizada.");
    } catch {
      setError("Não foi possível fazer upload da imagem de capa.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await apiFetch("/admin/salvacao", { method: "PUT", body: payload });
      if (!res.ok) throw new Error("Falha ao salvar.");
      const saved = (await res.json()) as SalvacaoDto;
      setPayload((prev) => ({ ...prev, ...saved }));
      setSuccess("Salvação publicada/atualizada com sucesso.");
    } catch {
      setError("Não foi possível salvar agora.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">Carregando…</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Salvação</h1>
          <p className="text-sm text-gray-500">Editar o conteúdo da página pública.</p>
        </div>
        <button
          onClick={save}
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
        >
          <FiSave />
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>

      {(error || success) && (
        <div
          className={`rounded-xl border p-4 ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}
        >
          {error ?? success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Topo</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  value={payload.titulo}
                  onChange={(e) => setPayload((p) => ({ ...p, titulo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Hoje é o dia da Salvação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL do vídeo (YouTube/Vimeo)</label>
                <input
                  value={payload.videoUrl}
                  onChange={(e) => setPayload((p) => ({ ...p, videoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo (Markdown)</label>
              <textarea
                value={payload.conteudoMarkdown}
                onChange={(e) => setPayload((p) => ({ ...p, conteudoMarkdown: e.target.value }))}
                rows={10}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                placeholder={"## 1. O Amor de Deus\n\nTexto…\n\n- Item 1\n- Item 2"}
              />
              <p className="text-xs text-gray-500 mt-2">O preview público é gerado automaticamente ao salvar.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Oração e Botão</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oração</label>
              <textarea
                value={payload.oracao}
                onChange={(e) => setPayload((p) => ({ ...p, oracao: e.target.value }))}
                rows={5}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Escreva aqui uma oração em destaque…"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto do botão</label>
                <input
                  value={payload.botao.texto}
                  onChange={(e) => setPayload((p) => ({ ...p, botao: { ...p.botao, texto: e.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Quero falar com alguém"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link do botão</label>
                <input
                  value={payload.botao.link}
                  onChange={(e) => setPayload((p) => ({ ...p, botao: { ...p.botao, link: e.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://wa.me/..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Posts (outras abas)</h2>
            <p className="text-sm text-gray-600">
              Define um “tipo” para puxar automaticamente conteúdos de Artigos, Áudios e Vídeos no fim da página.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artigos</label>
                <select
                  value={payload.feed.artigoTipo ?? ""}
                  onChange={(e) =>
                    setPayload((p) => ({ ...p, feed: { ...p.feed, artigoTipo: (e.target.value || null) as any } }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="">Desativado</option>
                  {artigoTipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Áudios</label>
                <select
                  value={payload.feed.audioTipo ?? ""}
                  onChange={(e) =>
                    setPayload((p) => ({ ...p, feed: { ...p.feed, audioTipo: (e.target.value || null) as any } }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="">Desativado</option>
                  {audioTipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vídeos</label>
                <select
                  value={payload.feed.videoTipo ?? ""}
                  onChange={(e) =>
                    setPayload((p) => ({ ...p, feed: { ...p.feed, videoTipo: (e.target.value || null) as any } }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="">Desativado</option>
                  {videoTipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limite</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={payload.feed.limit}
                  onChange={(e) => setPayload((p) => ({ ...p, feed: { ...p.feed, limit: Number(e.target.value) } }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiImage /> Imagem de capa
            </h2>

            <div className="space-y-3">
              <label className="relative flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                <FiUpload className="text-gray-400 group-hover:text-primary transition-colors" size={18} />
                <span className="text-sm text-gray-600 group-hover:text-primary">
                  {uploading ? "Enviando…" : "Enviar nova imagem"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCover(file);
                    e.currentTarget.value = "";
                  }}
                />
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ou URL da imagem</label>
                <input
                  value={payload.imagemCapaUrl}
                  onChange={(e) => setPayload((p) => ({ ...p, imagemCapaUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>

            {payload.imagemCapaUrl ? (
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-gray-200">
                <img src={payload.imagemCapaUrl} alt="Capa" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-[16/10] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400">
                Sem capa
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

