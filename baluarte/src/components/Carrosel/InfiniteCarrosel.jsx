import React, { useEffect, useRef, useState } from 'react';

const InfiniteCarousel = ({ images, width = 250, height = 150, autoPlayInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Começa no "meio" virtual
  const total = images.length;
  const autoPlayRef = useRef();
  const trackRef = useRef(null);

  // Duplica as imagens para criar efeito infinito
  const extendedImages = [...images, ...images, ...images];

  // Avança o slide com reset invisível quando necessário
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= total * 2 - 1) {
        // Reset suave sem animação
        setTimeout(() => {
          setCurrentIndex(total); // Volta para o "meio"
        }, 50);
        return total * 2; // Vai até o final
      }
      return prev + 1;
    });
  };

  // Ir para slide específico (ajustado para o array extendido)
  const goToSlide = (index) => {
    setCurrentIndex(index + total); // Centraliza no array extendido
  };

  // Configura autoplay
  useEffect(() => {
    autoPlayRef.current = nextSlide;
    const play = () => autoPlayRef.current();
    const interval = setInterval(play, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval]);

  // Estilo para cada slide
  const getSlideStyle = (index) => {
    const offset = index - currentIndex;
    const isCenter = offset === 0;
    
    return {
      transform: isCenter ? 'scale(1)' : 'scale(0.85)',
      opacity: isCenter ? 1 : 0.7,
      transition: 'all 0.5s ease',
      zIndex: isCenter ? 10 : 1,
    };
  };

  return (
    <div className="relative w-full max-w-[960px] mx-auto overflow-hidden pb-12">
      {/* Pista do carrossel */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(calc(50% - ${currentIndex * (width + 32)}px))`,
        }}
      >
        {extendedImages.map((img, idx) => (
          <div
            key={`${img}-${idx}`}
            className="mx-4 flex-shrink-0"
            style={{ 
              width: `${width}px`, 
              height: `${height}px`,
              ...getSlideStyle(idx)
            }}
          >
            <img
              src={img}
              alt={`slide-${idx % total}`}
              draggable={false}
              className="w-full h-full object-cover rounded-xl shadow-xl cursor-pointer"
              onClick={() => goToSlide(idx % total)}
            />
          </div>
        ))}
      </div>

      {/* Controles */}
      <button 
        onClick={() => setCurrentIndex(prev => prev - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
      >
        &lt;
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
      >
        &gt;
      </button>

      {/* Indicadores (usando apenas as imagens originais) */}
      <div className="flex justify-center mt-6 space-x-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex % total === idx ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;