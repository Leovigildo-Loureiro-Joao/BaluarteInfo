import { motion, AnimatePresence } from "framer-motion";
import { LiaArrowAltCircleLeft, LiaArrowAltCircleRight } from "react-icons/lia";
import { SlideArticle } from "./slideArticle";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { RxArrowLeft, RxArrowRight, RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { useState } from "react";
import { Link } from "react-router-dom";

const buttonVariants = {
  hover: { 
    scale: 1.1,
    color: "#CB2020",
    transition: { type: "spring", stiffness: 400 }
  },
  tap: { scale: 0.9 }
};

export const ContentArticle = () => {
  const [pos, setPos] = useState(0);
  
  function Volta() {
    setPos((val) => Math.max(val - 1, 0));
  }

  function Proximo() {
    setPos((val) => val + 1);
  }

  return (
    <motion.section 
      className="px-10 md:px-20 lg:px-32 xl:px-40 py-10 flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div 
        className="h2-title lg:max-w-[590px] w-full my-0 flex flex-row justify-between items-center"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {"Nossos novos Artigos".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to={"/Artigos"}>
            <motion.button 
              className="buttonRectangle px-10"
              whileHover={{ 
                boxShadow: "0 10px 25px -5px rgba(203, 32, 32, 0.5)"
              }}
            >
              Ver mais artigos
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    
      <motion.div 
        className="my-10 lg:max-w-[685px] w-full flex items-center gap-5"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        viewport={{ once: true }}
      >
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="lg:block hidden"
        >
          <RxChevronLeft 
            className="text-5xl text-primary/50 cursor-pointer relative -top-20" 
            onClick={Volta}
          />
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={pos}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <SlideArticle index={pos} />
          </motion.div>
        </AnimatePresence>
        
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="lg:block hidden"
        >
          <RxChevronRight 
            className="text-5xl text-primary/50 cursor-pointer relative -top-20" 
            onClick={Proximo}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};