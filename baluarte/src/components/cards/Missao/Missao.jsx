import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiEye, FiX, FiSun, FiStar, FiChevronRight } from "react-icons/fi";
import { BsBook, BsPeople } from "react-icons/bs";

// Animações mais refinadas
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const Missao = ({ frazes = [] }) => {
  const [cont, setCont] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCont(prev => (prev + 1) % frazes.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [frazes.length, isHovered]);

  return (
    <motion.section 
      id="missao-visao" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background Divino com Efeito de Luz Celestial */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary">
        {/* Raios de Luz */}
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          variants={glowAnimation}
          initial="initial"
          animate="animate"
        />
        
        {/* Elementos Flutuantes */}
        <motion.div 
          className="absolute top-20 left-10 text-primary/10 text-6xl"
          variants={floatAnimation}
          initial="initial"
          animate="animate"
        >
          <FiX />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 right-10 text-primary/10 text-6xl"
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          custom={1}
        >
          <FiHeart />
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-20 text-primary/10 text-4xl"
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          custom={2}
        >
          <FiStar />
        </motion.div>
      </div>

      {/* Padrão de Fundo Sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #CB2020 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Título da Seção */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <motion.span 
            className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Nossa Identidade
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-primary">Missão</span> &{' '}
            <span className="text-primary">Visão</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-red-300 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Card Missão */}
          <motion.div
            variants={scaleIn}
            whileHover={{ 
              y: -10,
              transition: { type: "spring", stiffness: 400 }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative"
          >
            {/* Efeito de Brilho no Hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-red-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
            
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header do Card com Ícone */}
              <div className="bg-gradient-to-r from-primary to-red-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Nossa Missão</h3>
                    <p className="text-white/80 text-sm">O que nos move</p>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cont}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-[200px]"
                  >
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {frazes[cont]?.split(' ').map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="inline-block mr-1"
                          dangerouslySetInnerHTML={{ __html: word + ' ' }}
                        />
                      ))}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Indicadores de Slide */}
                <div className="flex items-center justify-between mt-8">
                  <div className="flex gap-2">
                    {frazes.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCont(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === cont 
                            ? 'w-8 bg-primary' 
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                  
                  <motion.div 
                    className="flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[FiHeart, FiX, FiSun].map((Icon, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: '#CB2020', color: 'white' }}
                      >
                        <Icon className="text-primary group-hover:text-white transition-colors" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Versículo */}
                <motion.div 
                  className="mt-6 pt-6 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-sm text-gray-500 italic">
                    "Ide por todo o mundo e pregai o evangelho a toda criatura." 
                    <span className="block font-semibold text-primary mt-1">Marcos 16:15</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Card Visão */}
          <motion.div
            variants={scaleIn}
            whileHover={{ 
              y: -10,
              transition: { type: "spring", stiffness: 400 }
            }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-red-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
            
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-primary to-red-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FiEye className="text-3xl text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Nossa Visão</h3>
                    <p className="text-white/80 text-sm">Onde queremos chegar</p>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-8">
                <div className="space-y-6">
                  <motion.p 
                    className="text-lg text-gray-700 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Ser uma igreja que reflete o amor de Cristo, impactando vidas através da Palavra, 
                    transformando comunidades e formando discípulos comprometidos com o Reino de Deus.
                  </motion.p>

                  {/* Metas da Visão */}
                  <div className="grid gap-4">
                    {[
                      { icon: BsPeople, text: "Alcançar 1000 famílias até 2025", color: "from-blue-500 to-blue-600" },
                      { icon: BsBook, text: "Formar 500 discípulos em escolas bíblicas", color: "from-green-500 to-green-600" },
                      { icon: FiHeart, text: "Plantar 5 novas igrejas", color: "from-red-500 to-red-600" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ x: 10, backgroundColor: '#FFF5F5' }}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                          <item.icon className="text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{item.text}</span>
                        <FiChevronRight className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Estatísticas */}
                  <motion.div 
                    className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {[
                      { value: "500+", label: "Membros" },
                      { value: "15", label: "Ministérios" },
                      { value: "25", label: "Anos" }
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <motion.div 
                          className="text-2xl font-bold text-primary"
                          whileHover={{ scale: 1.1 }}
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chamada para Ação */}
        <motion.div 
          className="text-center mt-16"
          variants={fadeInUp}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-full font-semibold shadow-lg inline-flex items-center gap-2 group"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(203, 32, 32, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Faça parte desta missão</span>
            <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <p className="text-gray-500 mt-4 text-sm">
            "A messe é grande, mas os trabalhadores são poucos" - Mateus 9:37
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};
