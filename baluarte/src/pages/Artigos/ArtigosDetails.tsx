// src/pages/Artigos/ArtigoDetalhe.tsx
import { useState, useEffect } from "react";
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

// Componente de comentários
const CommentSection = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      autor: "João Pedro",
      avatar: "https://i.pravatar.cc/150?img=1",
      data: "2024-01-15T10:30:00",
      conteudo: "Excelente artigo! Muito edificante e esclarecedor. Me ajudou muito em minhas reflexões matinais.",
      likes: 12
    },
    {
      id: 2,
      autor: "Maria Silva",
      avatar: "https://i.pravatar.cc/150?img=2",
      data: "2024-01-14T22:15:00",
      conteudo: "Que palavra poderosa! Compartilhei com meu grupo de estudos e todos foram abençoados.",
      likes: 8
    }
  ]);

  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      autor: "Visitante",
      avatar: "https://i.pravatar.cc/150?img=3",
      data: new Date().toISOString(),
      conteudo: newComment,
      likes: 0
    };

    setComments([comment, ...comments]);
    setNewComment("");
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
      <div className="space-y-6">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <img
              src={comment.avatar}
              alt={comment.autor}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{comment.autor}</h4>
                <span className="text-xs text-gray-500">
                  {new Date(comment.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{comment.conteudo}</p>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
                <FiHeart size={14} />
                {comment.likes}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const ArtigoDetalhe = () => {
  const { id } = useParams();
  const [artigo, setArtigo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular busca de dados
    setTimeout(() => {
      setArtigo({
        id: 1,
        titulo: "A Soberania de Deus em Tempos de Crise",
        descricao: "Uma reflexão profunda sobre como a soberania divina se manifesta mesmo nos momentos mais difíceis de nossas vidas, trazendo conforto e esperança.",
        conteudo: `
          <p class="mb-4">Em meio às tempestades da vida, é natural questionarmos: "Onde está Deus?" ou "Por que isso está acontecendo comigo?". A Bíblia nos ensina que Deus é soberano sobre todas as coisas, inclusive sobre as crises que enfrentamos.</p>
          
          <p class="mb-4">A soberania de Deus significa que Ele tem controle absoluto sobre toda a criação. Nada acontece sem a Sua permissão ou fora do Seu plano perfeito. Isso não significa que Deus é o autor do mal, mas que Ele permite circunstâncias difíceis para cumprir propósitos maiores que nem sempre compreendemos.</p>
          
          <h2 class="text-2xl font-bold mb-4">Deus no Controle da História</h2>
          
          <p class="mb-4">Ao longo da Bíblia, vemos exemplos de como Deus usou crises para abençoar Seu povo. José foi vendido como escravo, mas declarou: "Vocês planejaram o mal contra mim, mas Deus o planejou para o bem" (Gênesis 50:20).</p>
          
          <p class="mb-4">Jó perdeu tudo, mas no final declarou: "Eu sei que o meu Redentor vive" (Jó 19:25). Paulo e Silas louvaram na prisão e viram Deus agir poderosamente.</p>
          
          <h2 class="text-2xl font-bold mb-4">Lições para Nossas Crises</h2>
          
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Deus está presente:</strong> "Não temas, porque eu sou contigo" (Isaías 41:10).</li>
            <li><strong>Deus tem um propósito:</strong> "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus" (Romanos 8:28).</li>
            <li><strong>Deus nos fortalece:</strong> "Quando sou fraco, então sou forte" (2 Coríntios 12:10).</li>
            <li><strong>Deus nos dá paz:</strong> "Deixo-vos a paz, a minha paz vos dou" (João 14:27).</li>
          </ul>
          
          <h2 class="text-2xl font-bold mb-4">Confiança em Meio à Tempestade</h2>
          
          <p class="mb-4">A confiança em Deus não elimina as crises, mas nos dá segurança para enfrentá-las. É como a âncora que mantém o navio firme mesmo na tempestade mais violenta.</p>
          
          <p class="mb-4">O salmista declarou: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia" (Salmos 46:1). Quando confiamos na soberania divina, podemos descansar sabendo que Aquele que controla o universo também controla nossa história.</p>
          
          <p class="mb-4">Que possamos, como Jesus no barco, acalmar as tempestades da alma com a certeza de que o Mestre está conosco. Ele não dorme nem descansa enquanto cuida de nós.</p>
          
          <p class="italic mt-8">"Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós." (1 Pedro 5:7)</p>
        `,
        imagem: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
        tipo: "DOCTRINAL",
        autor: "Pr. Antônio Silva",
        data: "2024-01-15",
        paginas: 12,
        visualizacoes: 1234,
        tempoLeitura: "8 min",
        autorBio: "Pastor há 20 anos, formado em Teologia pelo Seminário Teológico Batista do Sul, autor de 5 livros e conferencista internacional.",
        autorFoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const tipoInfo = artigo && {
    DOCTRINAL: { label: "Doutrinário", icon: LiaCrossSolid, color: "bg-purple-500" }
  }[artigo.tipo];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero do artigo */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={artigo.imagem}
          alt={artigo.titulo}
          className="w-full h-full object-cover"
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
            <span className={`inline-flex items-center gap-1 ${tipoInfo?.color} text-white px-3 py-1 rounded-full text-sm mb-4`}>
              {tipoInfo?.icon && <tipoInfo.icon size={14} />}
              {tipoInfo?.label}
            </span>

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
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiDownload size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiPrinter size={20} />
                  </button>
                </div>
              </div>

              {/* Conteúdo HTML */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
              />

              {/* Tags/Assuntos */}
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-semibold mb-3">Assuntos relacionados:</h4>
                <div className="flex flex-wrap gap-2">
                  {["Soberania de Deus", "Crise", "Fé", "Esperança", "Confiança"].map((tag) => (
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
            </motion.article>

            {/* Seção de comentários */}
            <motion.div
              className="mt-8 bg-white rounded-2xl shadow-lg p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CommentSection />
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
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiUser className="text-primary" />
                Sobre o autor
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={artigo.autorFoto}
                  alt={artigo.autor}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{artigo.autor}</h4>
                  <p className="text-sm text-gray-500">Pastor</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {artigo.autorBio}
              </p>
            </div>

            {/* Card do PDF */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-lg p-6 mb-6">
              <FiBookOpen className="text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Versão em PDF</h3>
              <p className="text-white/80 text-sm mb-4">
                Baixe este artigo para ler offline ou compartilhar
              </p>
              <button className="w-full bg-white text-primary py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <FiDownload />
                Baixar PDF ({artigo.paginas} páginas)
              </button>
            </div>

            {/* Artigos relacionados */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Artigos relacionados</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    to={`/artigos/${i}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=100&q=80`}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        Título do artigo relacionado
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {artigo.autor} • {artigo.tempoLeitura}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
};