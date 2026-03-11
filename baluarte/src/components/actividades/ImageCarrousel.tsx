// src/components/home/ImageThumbnails.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageThumbnailsProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export const ImageThumbnails = ({ images }: ImageThumbnailsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: springTransition,
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: springTransition,
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hidden md:block relative">
      {/* Imagem principal */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="absolute w-full h-full object-cover"
            variants={slideVariants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>

        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Navegação */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/50 hover:bg-primary text-white rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
        >
          <FiChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/50 hover:bg-primary text-white rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-primary'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`relative rounded-lg overflow-hidden transition-all ${
              index === currentIndex
                ? 'ring-2 ring-primary scale-105'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
