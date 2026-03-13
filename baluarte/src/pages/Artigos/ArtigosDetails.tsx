// src/pages/Artigos/ArtigoDetalhe.tsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  FiUser, 
  FiCalendar, 
  FiEye, 
  FiBookOpen,
  FiDownload,
  FiShare2,
  FiHeart,
  FiMessageCircle,
  FiArrowLeft,
  FiPrinter
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiScrollQuill, 
  GiAngelWings,
  GiOpenBook 
} from "react-icons/gi";
import { LiaCrossSolid } from "react-icons/lia";
import { apiFetch } from "../../utils/api.js";
import { getStoredUser } from "../../utils/auth.js";
import rectangleImage from "../../assets/rectangle.jpg";

const PREVIEW_PAGES = 3;

// Componente de comentários
const CommentSection = ({ artigoId }: { artigoId: number }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    let active = true;
    const loadComments = async () => {
      try {
        const response = await apiFetch(`/user/artigo/${artigoId}/comentarioAll`);
        if (!response.ok) return;
        const payload = await response.json();
        if (active) {
          setComments(payload || []);
          setLoading(false);
        }
      } catch (error) {
        if (active) {
          setError("Não foi possível carregar os comentários.");
          setLoading(false);
        }
      }
    };

    loadComments();
    return () => {
      active = false;
    };
  }, [artigoId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const user = getStoredUser();
    if (!user?.id) {
      setError("Faça login para comentar.");
      return;
    }

    try {
      const response = await apiFetch("/user/comentario", {
        method: "POST",
        body: {
          idUser: user.id,
          idSeccao: artigoId,
          seccao: "Artigo",
          descricao: newComment.trim(),
        },
      });

      if (!response.ok) {
        setError("Não foi possível enviar o comentário.");
        return;
      }

      const payload = await response.json();
      setComments([payload, ...comments]);
      setNewComment("");
      setError("");
    } catch (error) {
      setError("Não foi possível enviar o comentário.");
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiMessageCircle />
        Comentários ({comments.length})
      </h3>

      {/* Formulário de comentário */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Compartilhe sua opinião ou testemunho..."
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows={4}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Comentar
          </button>
        </div>
      </form>

      {/* Lista de comentários */}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">Nenhum comentário por aqui ainda.</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={comment.imagem}
                alt={comment.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{comment.name}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.dataPublicacao).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{comment.descricao}</p>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
                  <FiHeart size={14} />
                  {comment.likes}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ArtigoDetalhe = () => {
  const { id } = useParams();
  const [artigo, setArtigo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadArtigo = async () => {
      if (!id) return;
      try {
        const response = await apiFetch(`/user/artigo/${id}`);
        if (!response.ok) {
          setError("Não foi possível carregar o artigo.");
          setLoading(false);
          return;
        }

        const payload = await response.json();
        if (!active) return;

        const conteudo = payload.conteudo || "";
        const plainText = conteudo.replace(/<[^>]*>/g, " ");
        const words = plainText.trim().split(/\s+/).filter(Boolean).length;
        const tempoLeitura = words > 0 ? `${Math.max(1, Math.ceil(words / 200))} min` : "--";

        setArtigo({
          id: payload.id,
          titulo: payload.titulo,
          descricao: payload.descricao,
          conteudo,
          imagem: payload.img,
          tipo: payload.tipo,
          autor: payload.escritor,
          data: payload.dataPublicacao,
          paginas: payload.nPagina,
          pdf: payload.pdf,
          visualizacoes: payload.visualizacoes ?? payload.vistos?.length ?? 0,
          tempoLeitura,
          autorBio: payload.autorBio,
          autorFoto: payload.autorFoto,
          tags: payload.tags || [],
        });
        setLoading(false);
      } catch (error) {
        if (!active) return;
        setError("Não foi possível carregar o artigo.");
        setLoading(false);
      }
    };

    loadArtigo();
    return () => {
      active = false;
    };
  }, [id]);

  const tipoInfo = useMemo(() => {
    if (!artigo?.tipo) return null;
    const map: Record<string, { label: string; icon: any; color: string }> = {
      DOCTRINAL: { label: "Doutrinário", icon: LiaCrossSolid, color: "bg-purple-500" }
    };
    return map[artigo.tipo] || { label: artigo.tipo, icon: LiaCrossSolid, color: "bg-gray-600" };
  }, [artigo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !artigo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{error || "Artigo não encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero do artigo */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={artigo.imagem || rectangleImage}
          alt={artigo.titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = rectangleImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/artigos" className="hover:text-white transition-colors">Artigos</Link>
              <span>/</span>
              <span className="text-white">{artigo.titulo.slice(0, 30)}...</span>
            </div>

            {/* Badge */}
            {tipoInfo && (
              <span className={`inline-flex items-center gap-1 ${tipoInfo.color} text-white px-3 py-1 rounded-full text-sm mb-4`}>
                {tipoInfo.icon && <tipoInfo.icon size={14} />}
                {tipoInfo.label}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {artigo.titulo}
            </h1>

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <FiUser />
                {artigo.autor}
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar />
                {new Date(artigo.data).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-2">
                <FiEye />
                {artigo.visualizacoes} visualizações
              </span>
              <span className="flex items-center gap-2">
                <FiBookOpen />
                {artigo.tempoLeitura} de leitura
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conteúdo do artigo */}
      <section className="py-12 container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2">
            <motion.article 
              className="bg-white rounded-2xl shadow-lg p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Ações do artigo */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b">
                <Link
                  to="/artigos"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <FiArrowLeft />
                  Voltar para artigos
                </Link>
                
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiHeart size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiShare2 size={20} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      if (artigo.pdf) window.open(artigo.pdf, "_blank", "noreferrer");
                    }}
                    aria-label="Baixar PDF"
                    title="Baixar PDF"
                  >
                    <FiDownload size={20} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => window.print()}
                    aria-label="Imprimir"
                    title="Imprimir"
                  >
                    <FiPrinter size={20} />
                  </button>
                </div>
              </div>

              {artigo.pdf && artigo.paginas > PREVIEW_PAGES && (
                <div className="mb-6 p-4 rounded-xl bg-gray-50 border text-sm text-gray-700">
                  Mostrando prévia das primeiras {PREVIEW_PAGES} páginas. Para ler o conteúdo completo, baixe o PDF{" "}
                  <a
                    href={artigo.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4 font-semibold"
                  >
                    aqui
                  </a>
                  .
                </div>
              )}

              {/* Conteúdo HTML */}
              <div 
                className="article-html"
                dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
              />

              {/* Tags/Assuntos */}
              {Array.isArray(artigo.tags) && artigo.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-semibold mb-3">Assuntos relacionados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {artigo.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        to={`/artigos?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>

            {/* Seção de comentários */}
            <motion.div
              className="mt-8 bg-white rounded-2xl shadow-lg p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
            <CommentSection artigoId={artigo.id} />
          </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Card do autor */}
            {(artigo.autorBio || artigo.autorFoto) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FiUser className="text-primary" />
                  Sobre o autor
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  {artigo.autorFoto && (
                    <img
                      src={artigo.autorFoto}
                      alt={artigo.autor}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">{artigo.autor}</h4>
                    <p className="text-sm text-gray-500">Pastor</p>
                  </div>
                </div>
                {artigo.autorBio && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {artigo.autorBio}
                  </p>
                )}
              </div>
            )}

            {/* Card do PDF */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-lg p-6 mb-6">
              <FiBookOpen className="text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Versão em PDF</h3>
              <p className="text-white/80 text-sm mb-4">
                Baixe este artigo para ler offline ou compartilhar
              </p>
              {artigo.pdf ? (
                <a
                  href={artigo.pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white text-primary py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FiDownload />
                  Baixar PDF ({artigo.paginas} páginas)
                </a>
              ) : (
                <p className="text-white/80 text-sm">PDF indisponível.</p>
              )}
            </div>

            {/* Artigos relacionados */}
            {Array.isArray(artigo.related) && artigo.related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Artigos relacionados</h3>
                <div className="space-y-4">
                  {artigo.related.map((item: any) => (
                    <Link
                      key={item.id}
                      to={`/artigos/${item.id}`}
                      className="flex gap-3 group"
                    >
                      <img
                        src={item.imagem}
                        alt={item.titulo}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {item.titulo}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.autor} • {item.tempoLeitura}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </section>
    </div>
  );
};
