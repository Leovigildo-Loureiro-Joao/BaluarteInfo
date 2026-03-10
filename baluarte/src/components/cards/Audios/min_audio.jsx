import { motion } from "framer-motion";
import { TfiMusic, TfiSoundcloud } from "react-icons/tfi";
import { ModalAudio } from "../../Dialog/modal_audio";
import { useOutletContext } from "react-router-dom";
import { useModal } from "../../Dialog/ModalContext";
import { FaMusic, FaPlay, FaSoundcloud } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { activi, quemsomos, salvacao } from "../../../assets/Assets";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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
    y: -10,
    scale: 1.02,
    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
    transition: { type: "spring", stiffness: 400 }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  hover: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export const MinAudio = ({ titulo, descricao, img, tipo = "Culto solene", audio }) => {
  const { openModal } = useModal();
  
  function OpenModal() {
    openModal("modalAudio", {
      titulo: titulo,
      audio: audio,
      src: img,
      descricao: descricao,
      tipo: tipo,
      relacionados: [
        { titulo: "Luz no Caminho", escritor: "Pr. João", tipo: "Devocional", "src": activi },
        { titulo: "O Verbo se fez Carne", escritor: "Ir. Maria", tipo: "Comentário", "src": quemsomos },
        { titulo: "Verdade que Liberta", escritor: "Ev. Paulo", tipo: "Estudo", "src": salvacao }
      ]
    });
  }

  return (
    <motion.article 
      className="artigo flex flex-col w-full h-[360px] shadow-black/20 rounded-xl overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
    >
      <figure className="relative">
        <motion.div 
          className="flex rounded-t-xl justify-between relative p-5 px-10 z-10 border-[1px] border-solid bg-white"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <motion.h2 
            className="text-black font-bold text-li-nav relative"
            whileHover={{ color: "#CB2020" }}
          >
            {titulo}
          </motion.h2>
          <motion.h2 
            className="text-primary text-li-nav"
            whileHover={{ scale: 1.05 }}
          >
            {tipo}
          </motion.h2>
        </motion.div>
        
        <motion.div 
          className="flex gradient black gap-10 justify-center items-center absolute h-[170px] w-full"
          variants={overlayVariants}
          initial="hidden"
          whileHover="hover"
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPlay 
              onClick={OpenModal} 
              size={30} 
              color="white"
              className="cursor-pointer"
            />
          </motion.div>
        </motion.div>
        
        <motion.figure
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img 
            src={img} 
            alt="" 
            className="cursor-pointer h-[170px] object-cover w-full"
            initial={{ filter: "brightness(1)" }}
            whileHover={{ filter: "brightness(0.8)" }}
          />
        </motion.figure>
      </figure>
      
      <motion.div 
        className="bg-secondary px-10 py-5 flex gap-2 flex-col h-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {descricao}
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="flex"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button 
          className="buttonRectangle artcle flex-1"
          onClick={OpenModal}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Escutar
        </motion.button>
        <motion.button 
          className="buttonRectangle-white artcle flex-1"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Baixar
        </motion.button>
      </motion.div>
    </motion.article>
  );
};