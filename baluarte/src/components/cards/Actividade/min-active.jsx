import { motion } from "framer-motion";
import { activi } from "../../../assets/Assets";
import { MinActivyStyled } from "./Actividade.styled";
import { useModal } from "../../Dialog/ModalContext";
import { FiCalendar, FiClock, FiUsers, FiMapPin } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";

// Animações
const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

const overlayVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  hover: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  hover: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 25px -5px rgba(203, 32, 32, 0.5)"
  },
  tap: { scale: 0.95 }
};

export const MinActive = ({ 
  titulo, 
  descricao, 
  img, 
  data, 
  width = 350,
  tipo = "Evento",
  local = "Igreja Central",
  participantes = 45
}) => {
  const complete = {
    descricao: "Um encontro especial para refletirmos sobre a fé que move montanhas, com mensagens inspiradoras, louvor e oração em comunidade.",
    tema: "Fé em Tempos Difíceis",
    titulo: titulo,
    tipoEvento: tipo,
    publicoAlvo: "Famílias e jovens",
    organizador: "Norman & Equipe de Fé",
    dataEvento: "2025-11-15T19:30:00",
    contactos: "923456789",
    local: local,
    participantes: participantes,
    img: img
  };

  const relacionados = [
    { titulo: "Luz no Caminho", escritor: "Pr. João", tipo: "Devocional" },
    { titulo: "O Verbo se fez Carne", escritor: "Ir. Maria", tipo: "Comentário" },
    { titulo: "Verdade que Liberta", escritor: "Ev. Paulo", tipo: "Estudo" }
  ];

  const { openModal } = useModal();

  function OpenModal() {
    openModal("modalActividade", {
      data: complete,
      relacionados: relacionados
    });
  }

  // Formata a data
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full max-w-[350px] mx-auto"
    >
      <MinActivyStyled className="activy-min w-full h-full flex flex-col rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div 
          id="capsula" 
          className="relative h-[400px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Badge de tipo */}
          <motion.div 
            className="absolute top-4 right-4 z-10"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full shadow-lg">
              {tipo}
            </span>
          </motion.div>

          {/* Conteúdo sobreposto */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-6 text-white"
            variants={overlayVariants}
            initial="hidden"
            whileHover="hover"
          >
            {/* Título e data sempre visíveis */}
            <motion.h2 
              className="text-2xl font-bold mb-2 line-clamp-2"
              variants={textVariants}
            >
              {titulo}
            </motion.h2>
            
            <motion.div 
              className="flex items-center gap-2 mb-3 text-gray-200"
              variants={textVariants}
            >
              <FiCalendar className="text-primary" />
              <span className="text-sm">{data || formatDate(complete.dataEvento)}</span>
            </motion.div>

            {/* Informações adicionais que aparecem no hover */}
            <motion.div variants={textVariants}>
              <div className="flex items-center gap-2 mb-2 text-gray-200">
                <FiMapPin className="text-primary" />
                <span className="text-sm">{local}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-3 text-gray-200">
                <FiUsers className="text-primary" />
                <span className="text-sm">{participantes} participantes</span>
              </div>

              <motion.p 
                className="text-sm text-gray-300 mb-4 line-clamp-2"
                variants={textVariants}
              >
                {descricao}
              </motion.p>

              {/* Botão Saber Mais */}
              <motion.button
                onClick={OpenModal}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Saber mais</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Indicador de participantes (sempre visível) */}
          <motion.div 
            className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FiUsers className="text-primary text-sm" />
            <span className="text-white text-sm">{participantes}</span>
          </motion.div>
        </div>
      </MinActivyStyled>
    </motion.div>
  );
};