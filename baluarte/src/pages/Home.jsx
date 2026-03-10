import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { artigo, music, quemsomos } from "../assets/Assets";
import { Actividade_Content } from "../components/cards/Actividade/container-active-min";
import { SlidesActiviyMin } from "../components/cards/Actividade/slides-active";
import { ContentArticle } from "../components/cards/Articles/content_articles";
import { ContentAudios } from "../components/cards/Audios/content_audios";
import { Missao } from "../components/cards/Missao/Missao";
import { ContentVideo } from "../components/cards/Videos/content_videos";
import { ListItem } from "../components/items-list/ListItem";
import { useModal } from "../components/Dialog/ModalContext";
import { Link } from "react-router-dom";

// Variants de animação
const fadeInUp = { 
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export const Home = () => {
  const [select, setSelect] = useState(0);
  const frazes = [
    "<strong>Proclamar o amor</strong> transformador de Cristo, restaurando vidas, fortalecendo famílias e formando discípulos cheios do <Forte>Espírito</Forte>, para impactar o mundo com fé, <Forte>esperança e justiça</Forte>.",
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit eligendi unde saepe voluptate corporis quibusdam optio autem cupiditate, dolore cum id maxime doloremque quos veniam culpa dicta. Mollitia, autem velit.",
    "Ola vida ipsum dolor sit amet consectetur adipisicing elit. Iste fuga corrupti, impedit ullam labore molestias cum sit vero consequatur necessitatibus atque laboriosam, eum ab commodi eligendi nam sed itaque debitis."
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Seção Quem Somos */}
      <motion.section
        id="quemsomos"
        className="flex flex-col-reverse md:flex-row px-4 sm:px-10 md:px-16 lg:px-24 py-10 sm:py-20 lg:py-32 gap-10"
        variants={fadeInUp}
      >
        <motion.div 
          className="flex flex-col w-full md:w-1/2"
          variants={fadeInUp}
        >
          <motion.div 
            className="h2-title sec"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h1>Quem somos</h1>
            <motion.span 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="h-1 bg-primary"
            />
          </motion.div>
          
          <motion.div 
            className="gap-10 flex flex-col"
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur doloribus cupiditate sit fugit facilis, incidunt possimus reiciendis laboriosam molestias et deserunt obcaecati saepe quam commodi, minus tempora id minima expedita!
              <br /> <br />Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, incidunt debitis aut quaerat ratione, et commodi pariatur repudiandae recusandae quas, animi autem explicabo veritatis ducimus atque! Magni dolore voluptatibus quaerat.
            </motion.p>
            
            <motion.div 
              className="flex justify-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={"/QuemSomos"}>
                <motion.button 
                  className="buttonRectangle min"
                  whileHover={{ 
                    boxShadow: "0 10px 25px -5px rgba(203, 32, 32, 0.5)"
                  }}
                >
                  Saber mais
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.figure 
          className="ml-0 md:ml-[10%] w-full md:w-2/5 section-img"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.img 
            src={quemsomos} 
            alt="" 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="rounded-lg shadow-xl"
          />
        </motion.figure>
      </motion.section>

      <Missao frazes={frazes} />
      
      <motion.div 
        className="mt-10 flex flex-col justify-center items-center"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <motion.div 
          className="h2-title sec flex flex-col font-extrabold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h1>Actividades</h1>
        </motion.div>
        <SlidesActiviyMin />
      </motion.div>
      
      <ContentArticle />
      
      <motion.section 
        className="pb-40 xl:px-52 lg:px-20 px-10"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <section className="flex justify-center flex-col items-center">
          <motion.nav 
            className="flex max-w-[990px] w-full justify-start pb-5 -ml-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ul className="flex w-1/2 gap-5 tema">
              <ListItem 
                text={"Audios"} 
                classe={select === 0 ? "selected" : ""} 
                setValue={setSelect} 
                value={0} 
              />
              <ListItem 
                text={"Videos"} 
                classe={select === 1 ? "selected" : ""} 
                setValue={setSelect} 
                value={1}
              />
            </ul>
          </motion.nav>
          
          <section className="w-full max-w-[990px] overflow-hidden">
            <motion.section 
              className="flex transition-transform duration-500 ease-in-out flex-shrink-0"
              animate={{ x: `-${select * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ContentAudios />
              <ContentVideo />
            </motion.section>
          </section>
        </section>
      </motion.section>
    </motion.div>
  );
};