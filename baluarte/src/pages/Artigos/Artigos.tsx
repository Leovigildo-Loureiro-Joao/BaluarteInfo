// src/pages/Artigos/ArtigosPage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
  FiCrosshair
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiScrollQuill, 
  GiAngelWings,
  GiOpenBook 
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { fadeInUp, staggerContainer } from "../../utils/animation";


// Tipos baseados no seu Enum ArtigoType
const tiposArtigo = [
  { value: "BIBLE_STUDY", label: "Estudo Bíblico", icon: LiaBibleSolid, color: "bg-blue-500" },
  { value: "DEVOTIONAL", label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: "HISTORICAL", label: "Histórico", icon: GiScrollQuill, color: "bg-amber-500" },
  { value: "DOCTRINAL", label: "Doutrinário", icon: FiCrosshair, color: "bg-purple-500" },
  { value: "TESTIMONY", label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: "APOLOGETICS", label: "Apologética", icon: GiOpenBook, color: "bg-indigo-500" },
  { value: "PROPHETIC", label: "Profético", icon: GiScrollQuill, color: "bg-orange-500" },
  { value: "THEOLOGICAL", label: "Teológico", icon: LiaBibleSolid, color: "bg-red-500" },
];

// Dados mockados
const artigosMock = [
  {
    id: 1,
    titulo: "A Soberania de Deus em Tempos de Crise",
    descricao: "Uma reflexão profunda sobre como a soberania divina se manifesta mesmo nos momentos mais difíceis de nossas vidas, trazendo conforto e esperança.",
    imagem: "https://placehold.co/1000x600/1b1c1f/ffffff?text=Soberania+de+Deus",
    tipo: "DOCTRINAL",
    autor: "Pr. Antônio Silva",
    data: "2024-01-15",
    paginas: 12,
    visualizacoes: 1234,
    tempoLeitura: "8 min"
  },
  {
    id: 2,
    titulo: "O Poder da Oração Intercessória",
    descricao: "Descubra o impacto transformador da oração intercessória e como ela pode mudar realidades, baseado em exemplos bíblicos e testemunhos contemporâneos.",
    imagem: "https://placehold.co/1000x600/083c36/ffffff?text=Oração+Intercessória",
    tipo: "DEVOTIONAL",
    autor: "Pra. Maria Oliveira",
    data: "2024-01-10",
    paginas: 8,
    visualizacoes: 856,
    tempoLeitura: "5 min"
  },
  {
    id: 3,
    titulo: "Os 7 Selos do Apocalipse: Uma Análise Profética",
    descricao: "Estudo detalhado sobre os sete selos mencionados no livro do Apocalipse, suas interpretações históricas e significado para os dias atuais.",
    imagem: "https://placehold.co/1000x600/3c2f5f/ffffff?text=7+Selos+do+Apocalipse",
    tipo: "PROPHETIC",
    autor: "Pr. João Santos",
    data: "2024-01-05",
    paginas: 24,
    visualizacoes: 2341,
    tempoLeitura: "15 min"
  },
  {
    id: 4,
    titulo: "Defendendo a Fé: Guia de Apologética Básica",
    descricao: "Aprenda a defender sua fé com razão e respeito, respondendo às principais objeções contemporâneas ao cristianismo.",
    imagem: "https://placehold.co/1000x600/2a2f4a/ffffff?text=Apologética+Básica",
    tipo: "APOLOGETICS",
    autor: "Pb. Marcos Oliveira",
    data: "2024-01-01",
    paginas: 32,
    visualizacoes: 567,
    tempoLeitura: "20 min"
  },
  {
    id: 5,
    titulo: "Como Deus me Libertou das Drogas",
    descricao: "Um testemunho poderoso de transformação e libertação através do poder de Deus, mostrando que para Ele não existe causa perdida.",
    imagem: "https://placehold.co/1000x600/5b1b1b/ffffff?text=Libertação+das+Drogas",
    tipo: "TESTIMONY",
    autor: "Irmão Carlos Souza",
    data: "2023-12-28",
    paginas: 6,
    visualizacoes: 3456,
    tempoLeitura: "4 min"
  },
  {
    id: 6,
    titulo: "Estudo Exegético de Romanos 8",
    descricao: "Uma análise verse-a-verso do capítulo 8 de Romanos, explorando o contexto histórico, linguístico e teológico desta passagem fundamental.",
    imagem: "https://placehold.co/1000x600/1c3f2f/ffffff?text=Romanos+8",
    tipo: "BIBLE_STUDY",
    autor: "Pr. Antônio Silva",
    data: "2023-12-20",
    paginas: 28,
    visualizacoes: 1876,
    tempoLeitura: "18 min"
  }
];

export const ArtigosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [artigos, setArtigos] = useState(artigosMock);

  // Filtrar artigos
  useEffect(() => {
    let filtered = artigosMock;

    if (searchTerm) {
      filtered = filtered.filter(artigo => 
        artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artigo.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artigo.autor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTipo) {
      filtered = filtered.filter(artigo => artigo.tipo === selectedTipo);
    }

    setArtigos(filtered);
  }, [searchTerm, selectedTipo]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTipo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Artigos & Estudos
            </h1>
            <p className="text-xl text-white/90 mb-8">
            Aprofunde seu conhecimento da Palavra com nossos artigos, estudos bíblicos e reflexões teológicas
            </p>

            {/* Barra de pesquisa */}
            <div className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Pesquisar artigos por título, autor ou assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Botão de filtros mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 rounded-lg text-white"
            >
              <FiFilter />
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="py-12 container-custom">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de filtros - Desktop */}
          <motion.aside 
            className="hidden md:block w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiFilter className="text-primary" />
                  Filtros
                </h3>
                {(searchTerm || selectedTipo) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <FiX size={16} />
                    Limpar
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">Categorias</h4>
                  <div className="space-y-2">
                    {tiposArtigo.map((tipo) => {
                      const Icon = tipo.icon;
                      return (
                        <button
                          key={tipo.value}
                          onClick={() => setSelectedTipo(selectedTipo === tipo.value ? null : tipo.value)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                            selectedTipo === tipo.value
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon className={selectedTipo === tipo.value ? 'text-white' : tipo.color.replace('bg-', 'text-')} />
                          <span className="flex-1 text-left">{tipo.label}</span>
                          <span className="text-xs opacity-75">
                            {artigosMock.filter(a => a.tipo === tipo.value).length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Filtros mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden bg-white rounded-2xl shadow-lg p-4 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Filtros</h3>
                  {(searchTerm || selectedTipo) && (
                    <button onClick={clearFilters} className="text-primary text-sm">
                      Limpar
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tiposArtigo.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <button
                        key={tipo.value}
                        onClick={() => setSelectedTipo(selectedTipo === tipo.value ? null : tipo.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          selectedTipo === tipo.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon />
                        {tipo.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid de artigos */}
          <motion.div
            className="flex-1"
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate="visible"
          >
            {/* Contador de resultados */}
            <div className="mb-4 text-gray-600">
              {artigos.length} {artigos.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            </div>

            {artigos.length === 0 ? (
              <motion.div
                className="text-center py-20 bg-white rounded-2xl shadow"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum artigo encontrado</h3>
                <p className="text-gray-500 mb-4">Tente buscar com outros termos ou limpar os filtros</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Limpar filtros
                </button>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artigos.map((artigo) => {
                  const tipoInfo = tiposArtigo.find(t => t.value === artigo.tipo);
                  const Icon = tipoInfo?.icon || FiBookOpen;
                  
                  return (
                    <motion.article
                      key={artigo.id}
                      variants={fadeInUp}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Link to={`/artigos/${artigo.id}`}>
                        {/* Imagem */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={artigo.imagem}
                            alt={artigo.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          
                          {/* Badge de categoria */}
                          <div className={`absolute top-4 left-4 ${tipoInfo?.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                            <Icon size={12} />
                            {tipoInfo?.label}
                          </div>

                          {/* Badge de tempo de leitura */}
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            <FiClock size={12} />
                            {artigo.tempoLeitura}
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {artigo.titulo}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {artigo.descricao}
                          </p>

                          {/* Metadados */}
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <FiUser size={14} />
                              <span>{artigo.autor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiCalendar size={14} />
                              <span>{new Date(artigo.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-4 pt-2 border-t">
                              <span className="flex items-center gap-1">
                                <FiEye size={14} />
                                {artigo.visualizacoes}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiBookOpen size={14} />
                                {artigo.paginas} pág
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
