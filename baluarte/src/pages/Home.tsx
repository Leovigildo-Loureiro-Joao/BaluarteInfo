// src/pages/Home.tsx
import { motion } from "framer-motion";
import rectangleImage from "../assets/rectangle.jpg";
import {
  FiCalendar,
  FiVideo,
  FiBookOpen,
  FiMapPin,
  FiPhone,
  FiMail,
  FiTarget,
  FiEye,
  FiCheck,
  FiArrowRight,
  FiHelpCircle,
} from "react-icons/fi";

import { 
  GiFire, 
  GiHeartBeats, 
  GiGuitar,
  GiPrayer,
  GiBookCover 
} from "react-icons/gi";
import { FiHeart, FiMusic, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

// Componentes importados (vamos criar depois)
import { CardArtigo } from "../components/artigos/CardArtigo";
import { CardMidia } from "../components/midia/CardMidia";
import { CardActividade } from "../components/actividades/CardActividade";
import bottomSvg from "../assets/bottom.svg";
import { BsFillDiamondFill } from "react-icons/bs";
import { ImageThumbnails } from "../components/actividades/ImageCarrousel";
import { fadeInUp, staggerContainer } from "../utils/animation";

export const Home = () => {
  // Dados mockados (depois virão da API)

  const churchImages = [
  {
    src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    alt: "Fachada da Igreja Baluarte",
    caption: "Nossa sede - Um lugar de adoração"
  },
  {
    src: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
    alt: "Culto de celebração",
    caption: "Momentos de louvor e adoração"
  },
  {
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
    alt: "Comunidade reunida",
    caption: "Família Baluarte em comunhão"
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    alt: "Ministério infantil",
    caption: "Nossas crianças - O futuro da igreja"
  },
  {
    src: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1200&q=80",
    alt: "Grupo de jovens",
    caption: "Juventude que busca a Deus"
  }
];

  const destaquesArtigos = [
    {
      id: 1,
      titulo: "A Fé que Move Montanhas",
      descricao: "Uma reflexão profunda sobre o poder da fé genuína...",
      imagem: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      tipo: "DEVOTIONAL",
      data: "2024-01-15",
      autor: "Pr. Antônio Silva"
    },
    {
      id: 2,
      titulo: "Os Tempos Proféticos",
      descricao: "Entendendo os sinais dos tempos à luz da Bíblia...",
      imagem: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      tipo: "PROPHETIC",
      data: "2024-01-10",
      autor: "Pr. João Santos"
    },
    {
      id: 3,
      titulo: "Vivendo em Santidade",
      descricao: "Como manter uma vida santa no mundo atual...",
      imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      tipo: "DOCTRINAL",
      data: "2024-01-05",
      autor: "Pb. Marcos Oliveira"
    }
  ];

  const destaquesMidia = [
    {
      id: 1,
      titulo: "Culto de Domingo - A Vitória é Certa",
      descricao: "Mensagem poderosa sobre perseverança",
      imagem: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80",
      tipo: "VIDEO",
      duracao: "45:30",
      visualizacoes: 1234
    },
    {
      id: 2,
      titulo: "Podcast: Juventude e Fé",
      descricao: "Conversa sobre desafios da juventude cristã",
      imagem: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
      tipo: "AUDIO",
      duracao: "32:15",
      visualizacoes: 856
    },
    {
      id: 3,
      titulo: "Estudo Bíblico - Romanos 8",
      descricao: "Estudo aprofundado do capítulo 8",
      imagem: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=900&q=80",
      tipo: "VIDEO",
      duracao: "58:20",
      visualizacoes: 2341
    }
  ];

  const proximasActividades = [
    {
      id: 1,
      titulo: "Conferência de Oração",
      data: "2024-02-15",
      hora: "19:30",
      local: "Templo Central",
      tipo: "EVENTO",
      imagem: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 2,
      titulo: "Escola Bíblica",
      data: "2024-02-10",
      hora: "09:00",
      local: "Sala 3",
      tipo: "ESCOLA",
      imagem: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 3,
      titulo: "Culto de Jovens",
      data: "2024-02-08",
      hora: "20:00",
      local: "Auditório",
      tipo: "JOVENS",
      imagem: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Banner Principal */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        {/* Background Image com Overlay */}
        <div className="absolute inset-0">
          <img 
            src={rectangleImage}
            alt={rectangleImage}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
        </div>

        {/* Conteúdo do Hero */}
        <motion.div 
          className="relative container-custom text-white"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl">
            <span className="inline-block py-2  backdrop-blur-sm rounded-full text-md mb-6">
              Bem-vindo à
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              Igreja <span className="text-white">Baluarte</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed max-w-2xl">
              "Torre forte é o nome do Senhor; a ela correrá o justo e estará em alto refúgio." 
              <span className="block mt-2 text-sm">Provérbios 18:10</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/sobre" 
                className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Conheça nossa história
              </Link>
              <Link 
                to="/actividades" 
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Próximos eventos
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* SEÇÃO DE BOAS-VINDAS */}
     <motion.section
  className="py-20 bg-white overflow-hidden"
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <div className="container-custom">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="text-primary font-semibold text-sm tracking-wider uppercase">
          QUEM SOMOS
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
          Uma família de fé e propósito
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
          A Igreja Baluarte nasceu do desejo de ver vidas transformadas pelo poder do Evangelho. 
          Somos uma comunidade acolhedora que busca viver os valores do Reino de Deus e impactar 
          nossa geração com amor, verdade e compaixão.
        </p>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          Nossas portas estão abertas para todos que desejam conhecer mais sobre Deus, crescer 
          espiritualmente e fazer parte de uma família que caminha junto em fé.
        </p>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-3xl font-bold text-primary">15+</div>
            <div className="text-sm text-gray-500">Anos de história</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-gray-500">Membros</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-3xl font-bold text-primary">30+</div>
            <div className="text-sm text-gray-500">Ministérios</div>
          </div>
        </div>

        {/* Botão CTA */}
        <Link 
          to="/sobre" 
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all hover:gap-3"
        >
          Conheça nossa história
          <FiArrowRight />
        </Link>
      </div>

  
       <ImageThumbnails images={churchImages} /> 
      
      {/* Versão mobile (grid simples) */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        <img 
          src={churchImages[0].src}
          alt={churchImages[0].alt}
          className="rounded-lg h-48 object-cover"
        />
        <img 
          src={churchImages[1].src}
          alt={churchImages[1].alt}
          className="rounded-lg h-48 object-cover mt-4"
        />
      </div>
    </div>
  </div>
</motion.section>

            <motion.section
        className="py-20 relative overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Background com padrão sutil */}
        <div className="absolute inset-0 bg-gray-50">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Imagem decorativa (opcional) */}
        <div 
          className="absolute right-0 bottom-0 w-96 h-96 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${bottomSvg})` }}
        />

        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-wider">NOSSA IDENTIDADE</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Missão, Visão e Valores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Os fundamentos que guiam nossa caminhada e propósito
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Missão */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FiTarget className="text-3xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Proclamar o Evangelho de Jesus Cristo com amor e verdade, discipulando vidas 
                e formando discípulos que façam a diferença em sua geração, levando esperança 
                e transformação à nossa comunidade e além-fronteiras.
              </p>
            </motion.div>

            {/* Visão */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              whileHover={{ y: -5 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FiEye className="text-3xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser uma igreja relevante e acolhedora, referência em ensino bíblico, 
                adoração genuína e ação social, impactando milhares de vidas e plantando 
                igrejas que compartilhem dos mesmos valores e propósito.
              </p>
            </motion.div>

            {/* Valores */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              whileHover={{ y: -5 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BsFillDiamondFill className="text-3xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Valores</h3>
              <ul className="text-gray-600 space-y-3">
                {[
                  "Fidelidade à Palavra",
                  "Amor ao próximo",
                  "Excelência em tudo",
                  "Comunhão e família",
                  "Generosidade e missões"
                ].map((valor, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FiCheck className="text-primary" />
                    {valor}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Versículo base */}
          <motion.div 
            className="mt-12 text-center p-6 bg-primary/5 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg italic text-gray-700">
              "Portanto, ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, 
              e do Filho, e do Espírito Santo; ensinando-os a guardar todas as coisas que eu vos tenho mandado."
            </p>
            <p className="text-primary font-semibold mt-2">Mateus 28:19-20</p>
          </motion.div>
        </div>
      </motion.section>

      {/* SEÇÃO DE MÍDIA EM DESTAQUE */}
      <motion.section
        className="py-20 bg-gray-50"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-wider">MÍDIA</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Conteúdos em destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mensagens, louvores e ensinamentos para fortalecer sua fé
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {destaquesMidia.map((midia) => (
              <motion.div key={midia.id} variants={fadeInUp}>
                <CardMidia midia={midia} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link 
              to="/midia" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Ver todos os conteúdos
              <FiVideo />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* SEÇÃO DE ARTIGOS */}
      <motion.section
        className="py-20 bg-white"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-wider">ARTIGOS</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Últimos artigos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reflexões e estudos bíblicos para seu crescimento espiritual
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {destaquesArtigos.map((artigo) => (
              <motion.div key={artigo.id} variants={fadeInUp}>
                <CardArtigo artigo={artigo} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link 
              to="/artigos" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Ler todos os artigos
              <FiBookOpen />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* SEÇÃO DE ACTIVIDADES */}
      <motion.section
        className="py-20 bg-gray-50"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-wider">PROGRAME-SE</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Próximas actividades</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Participe dos nossos eventos e encontros
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {proximasActividades.map((actividade) => (
              <motion.div key={actividade.id} variants={fadeInUp}>
                <CardActividade actividade={actividade} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link 
              to="/actividades" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Ver todas as actividades
              <FiCalendar />
            </Link>
          </div>
        </div>
      </motion.section>


{/* SEÇÃO DE MINISTÉRIOS */}
<motion.section
  className="py-20 relative overflow-hidden"
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {/* Imagem de fundo com overlay gradiente */}
  <div className="absolute inset-0">
    {/* Imagem de fundo */}
    <img 
      src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80"
      alt="Ministérios"
      className="w-full h-full object-cover"
    />
    
    {/* Gradiente lateral esquerdo */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/40" />
    
    {/* Gradiente sutil adicional */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
  </div>

  <div className="container-custom relative z-10">
    <div className="text-center mb-12">
      <span className="inline-block text-white/80 text-sm tracking-wider uppercase mb-2">
        SERVIÇO E COMUNHÃO
      </span>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        Nossos Ministérios
      </h2>
      <p className="text-white/90 max-w-2xl mx-auto text-lg">
        Lugares onde você pode servir, crescer e fazer parte da família Baluarte
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { nome: "Juventude", icon: GiFire, desc: "Fogo e propósito" },
        { nome: "Casais", icon: FiHeart, desc: "Família e aliança" },
        { nome: "Louvor", icon: GiGuitar, desc: "Adoração e música" },
        { nome: "Intercessão", icon: GiPrayer, desc: "Oração e clamor" },
        { nome: "Diaconia", icon: FiHelpCircle, desc: "Serviço e amor" },
        { nome: "Evangelismo", icon: FiHeart, desc: "Missões e alcance" },
        { nome: "Escola Bíblica", icon: GiBookCover, desc: "Ensino da Palavra" }
      ].map((ministerio, index) => {
        const IconComponent = ministerio.icon;
        
        return (
          <motion.div 
            key={index}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-hidden cursor-pointer border border-white/20 hover:border-white/40 transition-all"
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3 }
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Background hover effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div 
                className="text-5xl mb-3 text-white inline-block"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <IconComponent className="mx-auto" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-1">
                {ministerio.nome}
              </h3>
              
              <p className="text-white/70 text-sm">
                {ministerio.desc}
              </p>
              
              {/* Indicador de hover */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Chamada para ação */}
    <motion.div 
      className="text-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
    >
      <Link 
        to="/ministerios" 
        className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:gap-3 group"
      >
        Conheça todos os ministérios
        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  </div>
</motion.section>
     
      {/* SEÇÃO DE CONTATO/CTA */}
      <motion.section
        className="py-20 bg-white"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Quer saber mais?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Estamos aqui para acolher, orar por você e responder suas dúvidas
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 border rounded-lg">
                <FiMapPin className="text-3xl text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Onde estamos</h3>
                <p className="text-gray-600 text-sm">
                  Rua da Igreja, 123<br />
                  Centro - Cidade/UF
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <FiPhone className="text-3xl text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Telefone</h3>
                <p className="text-gray-600 text-sm">
                  (11) 1234-5678<br />
                  (11) 98765-4321
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <FiMail className="text-3xl text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">E-mail</h3>
                <p className="text-gray-600 text-sm">
                  contato@igrejabaluarte.com<br />
                  secretaria@igrejabaluarte.com
                </p>
              </div>
            </div>

            <Link 
              to="/contacto" 
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Entre em contato
              <FiMail />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
