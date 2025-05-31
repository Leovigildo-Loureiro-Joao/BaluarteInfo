import React, { useEffect, useRef, useState } from 'react';

const InfiniteCarousel = ({ images, width = 250, height = 150, autoPlayInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const total = images.length;
  const autoPlayRef = useRef();
  const trackRef = useRef(null);

  // Duplica as imagens apenas uma vez (original + cópia)
  const extendedImages = [...images, ...images];

  const nextSlide = () => {
    setCurrentIndex(prev => {
      if (prev >= total * 2 - 1) {
        // Desativa temporariamente a transição para o reset
        setTransitionEnabled(false);
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => {
      if (prev <= 0) {
        setTransitionEnabled(false);
        return total * 2 - 1;
      }
      return prev - 1;
    });
  };

  // Ir para slide específico
  const goToSlide = (index) => {
    setTransitionEnabled(true);
    setCurrentIndex(index);
  };

  // Reativa a transição após reset
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
        setCurrentIndex(prev => (prev >= total ? prev - total : prev + total));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled, total]);

  // Configura autoplay
  useEffect(() => {
    autoPlayRef.current = nextSlide;
    const play = () => autoPlayRef.current();
    const interval = setInterval(play, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval]);

  // Estilo para cada slide
  const getSlideStyle = (index) => {
    const offset = (index - currentIndex + total) % total;
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
          transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
        }}
      >
        {extendedImages.map((img, idx) => (
          <div
            key={`${img}-${idx % total}`}
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
        onClick={prevSlide}
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

      {/* Indicadores */}
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