// src/components/midia/ImageGallery.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi";

interface ImageGalleryProps {
  images: {
    id: number;
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      {/* Grid de imagens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm">Ampliar</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Botão fechar */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-10"
            >
              <FiX size={30} />
            </button>

            {/* Navegação */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors"
            >
              <FiChevronLeft size={50} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors"
            >
              <FiChevronRight size={50} />
            </button>

            {/* Imagem */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-6xl max-h-[80vh] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-full object-contain"
              />

              {/* Legenda */}
              {images[selectedImage].caption && (
                <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                  <p className="bg-black/50 inline-block px-4 py-2 rounded-lg">
                    {images[selectedImage].caption}
                  </p>
                </div>
              )}

              {/* Botão download */}
              <a
                href={images[selectedImage].src}
                download
                className="absolute bottom-6 right-6 bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FiDownload size={20} />
              </a>

              {/* Contador */}
              <div className="absolute top-6 left-6 text-white bg-black/50 px-3 py-1 rounded-lg">
                {selectedImage + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};