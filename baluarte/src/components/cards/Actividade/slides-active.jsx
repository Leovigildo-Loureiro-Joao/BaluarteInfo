import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { activi, quemsomos } from "../../../assets/Assets";
import { ListItem } from "../../items-list/ListItem";
import { MinActive } from "./min-active";
import { ActiviComplete } from "./activeComplete";
import { useParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Animações
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 }
    }
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 }
    }
  })
};

export const SlidesActiviy = ({ data }) => {
  const [select, setSelect] = useState(-1);
  const [direction, setDirection] = useState(0);
  const id = useParams("id").id;
  const [selectData, setData] = useState();

  // Determina o conteúdo baseado no select
  const getContentByType = (type) => {
    const contentMap = {
      0: { title: "Anual", color: "from-red-600 to-red-400" },
      [-1]: { title: "Mensal", color: "from-blue-600 to-blue-400" },
      [-2]: { title: "Projeto", color: "from-green-600 to-green-400" }
    };
    return contentMap[type] || contentMap[-1];
  };

  const currentContent = getContentByType(select);

  const handleSelectChange = (value) => {
    setDirection(value > select ? 1 : -1);
    setSelect(value);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Navegação com indicador animado */}
      <motion.nav 
        variants={navVariants}
        className="flex w-full justify-center mb-8"
      >
        <div className="relative">
          <ul className="flex flex-wrap justify-center tema gap-2 p-1 bg-gray-100 rounded-full">
            {["Anual", "Mensal", "Projecto"].map((item, index) => {
              const value = index === 0 ? 0 : index === 1 ? -1 : -2;
              const isSelected = select === value;
              
              return (
                <motion.li
                  key={item}
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItem
                    text={location.pathname.includes("Perfil") 
                      ? item === "Anual" ? "Participadas"
                        : item === "Mensal" ? "Pendentes"
                        : "Ignoradas"
                      : item
                    }
                    classe={isSelected ? "selected" : ""}
                    setValue={handleSelectChange}
                    value={value}
                  />
                  {isSelected && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentContent.color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </motion.nav>

      {/* Conteúdo principal */}
      {id === undefined ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Controles de navegação (opcional) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const prevValue = select === 0 ? -2 : select === -1 ? 0 : -1;
                handleSelectChange(prevValue);
              }}
              className="bg-white/80 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition-all"
            >
              <FiChevronLeft className="text-2xl text-primary" />
            </motion.button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10">
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const nextValue = select === 0 ? -1 : select === -1 ? -2 : 0;
                handleSelectChange(nextValue);
              }}
              className="bg-white/80 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition-all"
            >
              <FiChevronRight className="text-2xl text-primary" />
            </motion.button>
          </div>

          <div id="total" className="w-full max-w-[1200px] mx-auto overflow-hidden relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={select}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex justify-center"
              >
                <div className={`grid-active ${select === 0 ? "selected" : ""}`}>
                  {/* Cards para cada tipo */}
                  {[1, 2, 3].map((item, index) => (
                    <motion.div
                      key={`${select}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <MinActive
                        titulo={select === 0 ? "Evangelho" : select === -1 ? "Oração" : "Louvor"}
                        data={select === 0 ? "Domingo, 19h" : select === -1 ? "Quarta, 20h" : "Sábado, 18h"}
                        dataSelect={setData}
                        img={select === 0 ? activi : quemsomos}
                        descricao={`${currentContent.title}: Lorem ipsum dolor sit amet...`}
                        tipo={currentContent.title}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicadores de página */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, -1, -2].map((value) => (
              <motion.button
                key={value}
                onClick={() => handleSelectChange(value)}
                className={`h-2 rounded-full transition-all ${
                  select === value 
                    ? `w-8 bg-gradient-to-r ${getContentByType(value).color}`
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={select === value ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <ActiviComplete data={complete} />
        </motion.div>
      )}
    </motion.div>
  );
};

export const SlidesActiviyMin = ({ data }) => {
  return (
    <motion.div 
      className="flex flex-col items-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.2 }}
    >
      <SlidesActiviy />
    </motion.div>
  );
};