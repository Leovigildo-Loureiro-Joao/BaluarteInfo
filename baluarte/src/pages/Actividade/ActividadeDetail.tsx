// src/pages/Actividade/ActividadeDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiHeart,
  FiLayers,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiShare2,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { GiDuration } from "react-icons/gi";
import { GaleriaActividade } from "../../components/actividades/GaleriaActividade";
import {
  ActividadeSummary,
  ComentarioResult,
  PageResponse,
  ProgramacaoItemView,
  ProgramacaoTipo,
} from "../../types/api";
import { apiFetch } from "../../utils/api";
import { getAuthToken, getStoredUser } from "../../utils/auth";

const readApiErrorMessage = async (res: Response, fallback: string) => {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const json = await res.json();
      if (json?.message) return String(json.message);
      if (json?.error) return String(json.error);
    } catch {
      // ignore
    }
  }
  try {
    const text = await res.text();
    if (text) return text;
  } catch {
    // ignore
  }
  return fallback;
};

// Modal de Inscrição (convidado / convidar alguém) via endpoint público.
const InscricaoForm = ({ actividade, onClose }: { actividade: ActividadeSummary; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [inscricaoId, setInscricaoId] = useState<number | null>(null);
  const [qrBlobUrl, setQrBlobUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    return () => {
      if (qrBlobUrl) URL.revokeObjectURL(qrBlobUrl);
    };
  }, [qrBlobUrl]);

  const downloadPdf = async () => {
    if (!inscricaoId) {
      setPdfError("Não foi possível identificar a inscrição para gerar o PDF.");
      return;
    }
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    setPdfError("");
    try {
      const res = await apiFetch(`/public/inscritos/${inscricaoId}/pdf?email=${encodeURIComponent(formData.email)}`, {
        method: "GET",
        headers: { Accept: "application/pdf" },
      });
      if (!res.ok) {
        const msg = await readApiErrorMessage(res, "Não foi possível baixar o PDF.");
        throw new Error(msg || "Não foi possível baixar o PDF.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ficha-inscricao-${inscricaoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Não foi possível baixar o PDF.";
      setPdfError(msg || "Não foi possível baixar o PDF.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setSubmitError("");
      setStep(2);
    } else {
      // passo 2: confirma e gera QR (PNG) via endpoint público
      if (isSubmitting) return;
      setIsSubmitting(true);
      setSubmitError("");
      (async () => {
        try {
          const res = await apiFetch(`/public/inscritos/${Number(actividade.id)}`, {
            method: "POST",
            headers: {
              Accept: "image/png",
            },
            body: {
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone,
            },
          });

          if (!res.ok) {
            const msg = await readApiErrorMessage(res, "Não foi possível gerar o QR da inscrição.");
            throw new Error(msg || "Não foi possível gerar o QR da inscrição.");
          }

          const blob = await res.blob();
          const headerId = Number(res.headers.get("X-Inscricao-Id") || "");
          setInscricaoId(Number.isFinite(headerId) && headerId > 0 ? headerId : null);
          if (qrBlobUrl) URL.revokeObjectURL(qrBlobUrl);
          const blobUrl = URL.createObjectURL(blob);
          setQrBlobUrl(blobUrl);
          setStep(3);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Não foi possível gerar o QR da inscrição.";
          setSubmitError(msg || "Não foi possível gerar o QR da inscrição.");
        } finally {
          setIsSubmitting(false);
        }
      })();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl font-bold text-primary">Inscrição</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiAlertCircle size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp *</label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="(xx) xxxxx-xxxx"
              />
            </div>
          </>
        ) : step === 2 ? (
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">Confirmar inscrição</h4>
            <p className="text-gray-600 mb-3">
              Verifique seus dados e confirme sua inscrição para <strong>{actividade.titulo}</strong>.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
              <p>
                <strong>Nome:</strong> {formData.nome}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Telefone:</strong> {formData.telefone}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCheckCircle className="text-primary text-3xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">QR gerado</h4>
            <p className="text-gray-600 mb-3">
              Guarde este QR para validar sua inscrição. Também enviamos a ficha (PDF) no seu email.
            </p>
            {qrBlobUrl && (
              <div className="bg-gray-50 rounded-lg p-4">
                <img src={qrBlobUrl} alt="QR de inscrição" className="mx-auto max-w-[260px] w-full h-auto" />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <a
                href={qrBlobUrl || undefined}
                download={`inscricao-actividade-${actividade.id}.png`}
                className={`flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-center ${
                  qrBlobUrl ? "" : "pointer-events-none opacity-50"
                }`}
              >
                Baixar PNG
              </a>
              <button
                type="button"
                onClick={downloadPdf}
                className={`flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors ${
                  inscricaoId ? "" : "opacity-50"
                }`}
              >
                {isDownloadingPdf ? "Baixando..." : "Baixar PDF"}
              </button>
            </div>
          </div>
        )}

        {submitError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{submitError}</div>
        )}
        {pdfError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{pdfError}</div>
        )}

        <div className="flex gap-3 pt-2">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          )}
          {step !== 3 ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {step === 1 ? "Continuar" : isSubmitting ? "Gerando..." : "Confirmar e gerar QR"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
            >
              Fechar
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

const InscricaoContaModal = ({
  actividade,
  qrBlobUrl,
  onClose,
}: {
  actividade: ActividadeSummary;
  qrBlobUrl: string;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl font-bold text-primary">Inscrição confirmada</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiAlertCircle size={22} />
        </button>
      </div>

      <div className="text-center py-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <FiCheckCircle className="text-primary text-3xl" />
        </div>
        <h4 className="text-xl font-bold mb-2">QR gerado</h4>
        <p className="text-gray-600 mb-3">
          Guarde este QR para validar sua inscrição em <strong>{actividade.titulo}</strong>.
        </p>

        {qrBlobUrl ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <img src={qrBlobUrl} alt="QR de inscrição" className="mx-auto max-w-[260px] w-full h-auto" />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">QR indisponível.</div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <a
            href={qrBlobUrl || undefined}
            download={`inscricao-actividade-${actividade.id}.png`}
            className={`flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-center ${
              qrBlobUrl ? "" : "pointer-events-none opacity-50"
            }`}
          >
            Baixar PNG
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ActividadeDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const actividadeId = Number(id);

  const [actividade, setActividade] = useState<ActividadeSummary | null>(null);
  const [programacao, setProgramacao] = useState<ProgramacaoItemView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showInscricao, setShowInscricao] = useState(false);
  const [showInscricaoConta, setShowInscricaoConta] = useState(false);
  const [inscricaoContaBusy, setInscricaoContaBusy] = useState(false);
  const [inscricaoContaError, setInscricaoContaError] = useState("");
  const [inscricaoContaQrUrl, setInscricaoContaQrUrl] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"sobre" | "programacao" | "comentarios" | "edicoes" | "galeria">("sobre");

  const [comentarios, setComentarios] = useState<ComentarioResult[]>([]);
  const [comentariosLoading, setComentariosLoading] = useState(false);
  const [comentariosHasLoaded, setComentariosHasLoaded] = useState(false);
  const [comentariosError, setComentariosError] = useState("");
  const [newComentario, setNewComentario] = useState("");
  const [comentarioSubmitting, setComentarioSubmitting] = useState(false);
  const [likeComentarioBusyIds, setLikeComentarioBusyIds] = useState<number[]>([]);

  const [edicoes, setEdicoes] = useState<ActividadeSummary[]>([]);
  const [edicoesLoading, setEdicoesLoading] = useState(false);
  const [edicoesHasLoaded, setEdicoesHasLoaded] = useState(false);
  const [edicoesError, setEdicoesError] = useState("");
  const [edicoesPage, setEdicoesPage] = useState(0);
  const [edicoesTotalPages, setEdicoesTotalPages] = useState(0);

  useEffect(() => {
    return () => {
      if (inscricaoContaQrUrl) URL.revokeObjectURL(inscricaoContaQrUrl);
    };
  }, [inscricaoContaQrUrl]);

  const selectTab = (tab: "sobre" | "programacao" | "comentarios" | "edicoes" | "galeria") => {
    setActiveTab(tab);
    if (tab === "comentarios" && !comentariosHasLoaded) {
      loadComentarios();
    }
    if (tab === "edicoes" && !edicoesHasLoaded) {
      loadEdicoes(0, false);
    }
  };

  useEffect(() => {
    let active = true;

    if (!Number.isFinite(actividadeId)) {
      setLoadError("Actividade inválida.");
      setLoading(false);
      return;
    }

    const loadAll = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [actividadeRes, programacaoRes] = await Promise.all([
          apiFetch(`/user/actividade/${actividadeId}`),
          apiFetch(`/user/actividade/${actividadeId}/programacao`),
        ]);

        if (!actividadeRes.ok) throw new Error("Falha ao buscar a actividade.");
        const actividadePayload = (await actividadeRes.json()) as ActividadeSummary;
        const programacaoPayload = programacaoRes.ok
          ? ((await programacaoRes.json()) as ProgramacaoItemView[])
          : [];

        if (!active) return;
        setActividade(actividadePayload);
        setProgramacao(Array.isArray(programacaoPayload) ? programacaoPayload : []);
      } catch {
        if (!active) return;
        setLoadError("Não foi possível carregar a actividade.");
        setActividade(null);
        setProgramacao([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAll();
    return () => {
      active = false;
    };
  }, [actividadeId]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch(`/user/actividade/${actividadeId}/favorito`, { method: "GET" });
        if (!res.ok) return;
        const json = (await res.json()) as { favorito?: boolean };
        if (!active) return;
        setIsLiked(Boolean(json?.favorito));
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [actividadeId]);

  const loadComentarios = async () => {
    if (comentariosLoading) return;
    setComentariosLoading(true);
    setComentariosError("");
    try {
      const res = await apiFetch(`/user/actividade/${actividadeId}/comentarios`);
      if (!res.ok) {
        const msg = await readApiErrorMessage(res, "Não foi possível carregar os comentários.");
        throw new Error(msg || "Não foi possível carregar os comentários.");
      }
      const payload = (await res.json()) as ComentarioResult[];
      setComentarios(Array.isArray(payload) ? payload : []);
      setComentariosHasLoaded(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Não foi possível carregar os comentários.";
      setComentariosError(msg || "Não foi possível carregar os comentários.");
      setComentarios([]);
    } finally {
      setComentariosLoading(false);
    }
  };

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComentario.trim()) return;
    if (comentarioSubmitting) return;

    const token = getAuthToken();
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const user = getStoredUser() as any;
    if (!user?.id) {
      navigate("/auth/login");
      return;
    }

    setComentarioSubmitting(true);
    setComentariosError("");
    try {
      const res = await apiFetch("/user/comentario", {
        method: "POST",
        body: {
          idUser: user.id,
          idSeccao: actividadeId,
          seccao: "Actividade",
          descricao: newComentario.trim(),
        },
      });
      if (!res.ok) {
        const msg = await readApiErrorMessage(res, "Não foi possível enviar o comentário.");
        throw new Error(msg || "Não foi possível enviar o comentário.");
      }
      const payload = (await res.json()) as ComentarioResult;
      setComentarios((prev) => [payload, ...prev]);
      setNewComentario("");
      setComentariosHasLoaded(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Não foi possível enviar o comentário.";
      setComentariosError(msg || "Não foi possível enviar o comentário.");
    } finally {
      setComentarioSubmitting(false);
    }
  };

  const curtirComentario = async (comentarioId: number) => {
    if (likeComentarioBusyIds.includes(comentarioId)) return;
    const token = getAuthToken();
    if (!token) {
      navigate("/auth/login");
      return;
    }
    setLikeComentarioBusyIds((prev) => [...prev, comentarioId]);
    try {
      const res = await apiFetch(`/user/comentario/${comentarioId}/curtir`, { method: "POST" });
      if (!res.ok) return;
      const payload = (await res.json()) as { likes?: number };
      if (typeof payload?.likes === "number") {
        setComentarios((prev) =>
          prev.map((c) => (c.id === comentarioId ? { ...c, likes: payload.likes } : c))
        );
      }
    } catch {
      // ignore
    } finally {
      setLikeComentarioBusyIds((prev) => prev.filter((id) => id !== comentarioId));
    }
  };

  const loadEdicoes = async (page: number, append: boolean) => {
    if (edicoesLoading) return;
    setEdicoesLoading(true);
    setEdicoesError("");
    try {
      const res = await apiFetch(`/user/actividade/${actividadeId}/edicoes?page=${page}&size=6`);
      if (!res.ok) {
        const msg = await readApiErrorMessage(res, "Não foi possível carregar as edições.");
        throw new Error(msg || "Não foi possível carregar as edições.");
      }
      const payload = (await res.json()) as PageResponse<ActividadeSummary>;
      const list = Array.isArray(payload?.content) ? payload.content : [];
      setEdicoes((prev) => (append ? [...prev, ...list] : list));
      setEdicoesPage(typeof payload?.page === "number" ? payload.page : page);
      setEdicoesTotalPages(typeof payload?.totalPages === "number" ? payload.totalPages : 0);
      setEdicoesHasLoaded(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Não foi possível carregar as edições.";
      setEdicoesError(msg || "Não foi possível carregar as edições.");
      setEdicoes([]);
      setEdicoesTotalPages(0);
    } finally {
      setEdicoesLoading(false);
    }
  };

  const toggleFavorito = async () => {
    if (likeBusy) return;
    const token = getAuthToken();
    if (!token) {
      navigate("/auth/login");
      return;
    }
    const next = !isLiked;
    setIsLiked(next);
    setLikeBusy(true);
    try {
      const res = await apiFetch(`/user/actividade/${actividadeId}/favorito`, {
        method: next ? "POST" : "DELETE",
      });
      if (!res.ok) {
        const msg = await readApiErrorMessage(res, "Não foi possível atualizar o favorito.");
        throw new Error(msg || "Não foi possível atualizar o favorito.");
      }
      const payload = (await res.json()) as { favorito?: boolean };
      setIsLiked(Boolean(payload?.favorito));
    } catch {
      setIsLiked(!next);
    } finally {
      setLikeBusy(false);
    }
  };

  const programacaoGrouped = useMemo(() => {
    const items = [...programacao].filter((p) => p?.inicio).sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));
    const byDay = new Map<string, ProgramacaoItemView[]>();
    for (const item of items) {
      const d = new Date(item.inicio);
      const day = d.toLocaleDateString("pt-BR", { weekday: "long" });
      const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const label = `${day.charAt(0).toUpperCase() + day.slice(1)} (${date})`;
      const list = byDay.get(label) ?? [];
      list.push(item);
      byDay.set(label, list);
    }
    return Array.from(byDay.entries()).map(([label, items]) => ({ label, items }));
  }, [programacao]);

  const palestrantesList = useMemo(() => {
    const raw = (actividade?.palestrantes ?? "").trim();
    if (!raw) return [];
    return raw
      .split(/\r?\n|;|,/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [actividade?.palestrantes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!actividade) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Erro</h2>
            <p className="text-gray-600 mb-6">{loadError || "Não foi possível carregar a actividade."}</p>
            <Link
              to="/actividades"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiArrowLeft />
              Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dataEvento = actividade.dataEvento ? new Date(actividade.dataEvento) : null;
  const capacidade = typeof actividade.capacidade === "number" ? actividade.capacidade : null;
  const inscritos = typeof actividade.inscritos === "number" ? actividade.inscritos : 0;
  const vagasRestantes = capacidade != null ? Math.max(0, capacidade - inscritos) : null;
  const agora = Date.now();
  const actividadeJaPassou = dataEvento ? dataEvento.getTime() <= agora : true;
  const inscricoesEncerradas = actividadeJaPassou || (vagasRestantes != null && vagasRestantes <= 0);
  const inscricaoDisabledReason = actividadeJaPassou
    ? "Lamentamos mas esta actividade ja passou"
    : vagasRestantes != null && vagasRestantes <= 0
    ? "Lamentamos, as vagas já esgotaram."
    : "";

  const isLoggedIn = Boolean(getAuthToken());

  const handleInscreverMe = async () => {
    if (!actividade) return;
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }
    if (inscricoesEncerradas) return;
    if (inscricaoContaBusy) return;

    setInscricaoContaBusy(true);
    setInscricaoContaError("");
    try {
      const res = await apiFetch(`/user/inscritos/${Number(actividade.id)}`, {
        method: "POST",
        headers: { Accept: "image/png" },
      });
      if (!res.ok) {
        const msg = await readApiErrorMessage(res, "Não foi possível concluir a inscrição.");
        throw new Error(msg || "Não foi possível concluir a inscrição.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setInscricaoContaQrUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setShowInscricaoConta(true);
    } catch (err) {
      setInscricaoContaError(err instanceof Error ? err.message : "Não foi possível concluir a inscrição.");
    } finally {
      setInscricaoContaBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/actividades" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <FiArrowLeft />
            Voltar para Actividades
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorito}
              disabled={likeBusy}
              className={`p-2 rounded-lg transition-colors ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-primary"
              } ${likeBusy ? "opacity-60 pointer-events-none" : ""}`}
              title="Favoritar"
            >
              <FiHeart className={isLiked ? "fill-current" : ""} size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-primary rounded-lg transition-colors" title="Compartilhar">
              <FiShare2 size={20} />
            </button>
          </div>
        </div>

        {/* Hero */}
        <section className="relative h-[380px] rounded-3xl overflow-hidden mb-8">
          <img src={actividade.img} alt={actividade.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">{actividade.tipoEvento}</span>
              <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">{actividade.duracao}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{actividade.titulo}</h1>
            <p className="text-xl text-white/90 max-w-3xl">{actividade.tema}</p>
          </div>
        </section>

        {/* Main */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: "sobre", label: "Sobre", icon: FiCalendar },
                    { id: "programacao", label: "Programação", icon: FiClock },
                    { id: "comentarios", label: "Comentários", icon: FiMessageCircle },
                    { id: "edicoes", label: "Edições", icon: FiLayers },
                    { id: "galeria", label: "Galeria", icon: FiUsers },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => selectTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                          activeTab === tab.id ? "text-primary" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div layoutId="activeActividadeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "sobre" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Sobre o evento</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">{actividade.descricao}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FiCalendar className="text-primary text-xl mx-auto mb-2" />
                        <div className="text-sm font-medium">Data</div>
                        <div className="text-xs text-gray-500">{dataEvento ? dataEvento.toLocaleDateString("pt-BR") : "--"}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FiClock className="text-primary text-xl mx-auto mb-2" />
                        <div className="text-sm font-medium">Horário</div>
                        <div className="text-xs text-gray-500">
                          {dataEvento ? dataEvento.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--"}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FiUsers className="text-primary text-xl mx-auto mb-2" />
                        <div className="text-sm font-medium">Público</div>
                        <div className="text-xs text-gray-500">{actividade.publicoAlvo}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <GiDuration className="text-primary text-xl mx-auto mb-2" />
                        <div className="text-sm font-medium">Duração</div>
                        <div className="text-xs text-gray-500">{actividade.duracao}</div>
                      </div>
                    </div>

                    {palestrantesList.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-bold mb-3">Palestrantes</h3>
                        <div className="flex flex-wrap gap-2">
                          {palestrantesList.map((nome) => (
                            <span
                              key={nome}
                              className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15"
                            >
                              {nome}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "programacao" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Programação</h2>
                    {programacaoGrouped.length === 0 ? (
                      <p className="text-gray-500">A programação ainda não foi definida.</p>
                    ) : (
                      <div className="space-y-5">
                        {programacaoGrouped.map((group) => (
                          <div key={group.label}>
                            <h3 className="font-semibold text-gray-800 mb-2">{group.label}</h3>
                            <div className="space-y-2">
                              {group.items.map((item) => {
                                const d = new Date(item.inicio);
                                const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                                const isPausa = item.tipo === ProgramacaoTipo.Pausa;
                                return (
                                  <div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-20 text-sm font-semibold text-primary">{time}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium text-gray-900">{item.titulo}</p>
                                        {isPausa && (
                                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">
                                            Pausa
                                          </span>
                                        )}
                                      </div>
                                      {item.fim && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Até{" "}
                                          {new Date(item.fim).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "comentarios" && (
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h2 className="text-2xl font-bold">Comentários</h2>
                      <span className="text-sm text-gray-500">{comentarios.length}</span>
                    </div>

                    <form onSubmit={handleSubmitComentario} className="mb-6">
                      <textarea
                        value={newComentario}
                        onChange={(e) => setNewComentario(e.target.value)}
                        placeholder="Compartilhe sua opinião ou testemunho..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={comentarioSubmitting}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
                        >
                          {comentarioSubmitting ? "Enviando..." : "Comentar"}
                        </button>
                      </div>
                    </form>

                    {comentariosError && (
                      <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                        {comentariosError}
                      </div>
                    )}

                    {comentariosLoading ? (
                      <div className="text-center py-8 text-gray-500">Carregando comentários...</div>
                    ) : comentarios.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Ainda não há comentários.</div>
                    ) : (
                      <div className="space-y-6">
                        {comentarios.map((comment) => {
                          const dateLabel = comment.dataPublicacao
                            ? new Date(comment.dataPublicacao).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--";
                          const likes = typeof comment.likes === "number" ? comment.likes : 0;
                          const likeBusy = likeComentarioBusyIds.includes(comment.id);
                          return (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                            >
                              <div className="flex gap-3">
                                <img
                                  src={comment.imagem}
                                  alt={comment.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="font-semibold text-gray-800 truncate">{comment.name}</div>
                                      <div className="text-xs text-gray-500">{dateLabel}</div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => curtirComentario(comment.id)}
                                      disabled={likeBusy}
                                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors disabled:opacity-60"
                                      title="Curtir"
                                    >
                                      <FiHeart size={14} />
                                      {likes}
                                    </button>
                                  </div>
                                  <p className="text-gray-700 mt-2 whitespace-pre-line">{comment.descricao}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "edicoes" && (
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h2 className="text-2xl font-bold">Outras edições</h2>
                      {actividade.edicao != null && <span className="text-sm text-gray-500">Edição atual: {actividade.edicao}</span>}
                    </div>

                    {edicoesError && (
                      <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                        {edicoesError}
                      </div>
                    )}

                    {edicoesLoading && edicoes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Carregando edições...</div>
                    ) : edicoes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Nenhuma outra edição encontrada.</div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {edicoes.map((item) => {
                          const d = item.dataEvento ? new Date(item.dataEvento) : null;
                          const date = d ? d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "--";
                          return (
                            <Link
                              key={String(item.id)}
                              to={`/actividades/${item.id}`}
                              className="group flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <img
                                src={item.img || "https://via.placeholder.com/120"}
                                alt=""
                                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="font-semibold text-gray-900 truncate">{item.titulo}</div>
                                  {item.edicao != null && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700 flex-shrink-0">
                                      Edição {item.edicao}
                                    </span>
                                  )}
                                </div>
                                {item.tema && <div className="text-sm text-gray-600 mt-0.5 line-clamp-2">{item.tema}</div>}
                                <div className="text-xs text-gray-500 mt-2">{date}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        onClick={() => loadEdicoes(edicoesPage + 1, true)}
                        disabled={edicoesLoading || (edicoesTotalPages !== 0 && edicoesPage + 1 >= edicoesTotalPages)}
                        className="px-5 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60"
                      >
                        {edicoesLoading ? "Carregando..." : "Carregar mais"}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "galeria" && <GaleriaActividade activityId={actividadeId} />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Participe</h3>

              {capacidade != null && capacidade > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vagas</span>
                    <span className="font-semibold">
                      {inscritos}/{capacidade}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(100, (inscritos / capacidade) * 100)}%` }}
                    />
                  </div>
                  {vagasRestantes != null && <p className="mt-2 text-xs text-gray-500">{vagasRestantes} vagas restantes</p>}
                </div>
              )}

              {!inscricoesEncerradas && inscricaoContaError && (
                <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                  <FiAlertCircle className="mt-0.5" />
                  <span>{inscricaoContaError}</span>
                </div>
              )}

              {inscricoesEncerradas ? (
                <>
                  <button
                    disabled
                    className="w-full py-3 rounded-lg font-semibold bg-gray-200 text-gray-600 cursor-not-allowed"
                  >
                    Inscrições encerradas
                  </button>
                  <p className="mt-2 text-xs text-gray-500">{inscricaoDisabledReason}</p>
                </>
              ) : isLoggedIn ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleInscreverMe}
                    disabled={inscricaoContaBusy}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      inscricaoContaBusy ? "bg-primary/70 text-white cursor-wait" : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    {inscricaoContaBusy ? "Inscrevendo..." : "Inscrever-me"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInscricao(true)}
                    className="w-full py-3 rounded-lg font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Convidar alguém
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowInscricao(true)}
                    className="w-full py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Inscrever-se como convidado
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/auth/login")}
                    className="w-full py-3 rounded-lg font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Já tenho conta
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiMapPin className="text-primary" />
                Local
              </h3>
              <p className="text-gray-600 text-sm mb-2">{actividade.endereco}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(actividade.endereco)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Ver no mapa
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiUsers className="text-primary" />
                Moderador
              </h3>
              <p className="font-medium mb-2">{actividade.organizador}</p>
              {palestrantesList.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Palestrantes</p>
                  <ul className="text-sm text-gray-600 list-disc pl-5 space-y-0.5">
                    {palestrantesList.slice(0, 8).map((nome) => (
                      <li key={nome}>{nome}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="space-y-2">
                <a
                  href={`tel:${actividade.contactos}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <FiPhone size={14} />
                  <span className="text-sm">{actividade.contactos}</span>
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Modal de inscrição */}
      <AnimatePresence>
        {showInscricao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInscricao(false)}
          >
            <InscricaoForm actividade={actividade} onClose={() => setShowInscricao(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInscricaoConta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInscricaoConta(false)}
          >
            <InscricaoContaModal
              actividade={actividade}
              qrBlobUrl={inscricaoContaQrUrl}
              onClose={() => setShowInscricaoConta(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
