import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiDownload, FiEye, FiX, FiUser } from "react-icons/fi";
import type { MidiaProjection } from "../../types/api";

export const ImageViewerModal = ({
  midia,
  onClose
}: {
  midia: MidiaProjection;
  onClose: () => void;
}) => {
  const [showInfo, setShowInfo] = useState(true);

  const src = midia.url || midia.imagem;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-primary/20 pointer-events-none" />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
      >
        <FiX size={30} />
      </button>

      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="max-w-7xl max-h-[90vh] px-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={midia.titulo}
          className="max-w-full max-h-[80vh] mx-auto rounded-2xl shadow-2xl object-contain bg-black"
        />
      </motion.div>

      <button
        onClick={() => setShowInfo((prev) => !prev)}
        className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors text-sm flex items-center gap-2 z-10"
      >
        <FiEye size={16} />
        {showInfo ? "Ocultar" : "Mostrar"} informações
      </button>

      <div className="absolute bottom-6 right-6 flex gap-2 z-10">
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <FiDownload size={16} />
          Download
        </a>
        <Link
          to={`/midia/${midia.id}`}
          className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors text-sm"
          onClick={onClose}
        >
          Ver detalhes
        </Link>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="absolute bottom-24 left-6 bg-black/75 backdrop-blur-md text-white rounded-2xl p-4 max-w-md z-10 border border-white/10"
          >
            <h3 className="text-lg font-bold mb-1">{midia.titulo}</h3>
            {midia.autor && (
              <p className="text-sm text-white/80 flex items-center gap-2 mb-2">
                <FiUser size={14} />
                {midia.autor}
              </p>
            )}
            <p className="text-white/70 text-sm line-clamp-3">{midia.descricao}</p>
            <div className="mt-3 text-xs text-white/60">
              👁️ {midia.visualizacoes ?? 0} visualizações
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

