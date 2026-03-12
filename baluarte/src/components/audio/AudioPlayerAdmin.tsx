// src/components/admin/AudioPreviewPlayer.tsx
import { useState, useRef, useEffect } from "react";
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX,
  FiHeadphones,
  FiDownload,
  FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPreviewPlayerProps {
  src: string;
  capa?: string;
  titulo?: string;
  autor?: string;
  autoPlay?: boolean;
  onClose?: () => void;
}

export const AudioPreviewPlayer = ({ 
  src, 
  capa, 
  titulo, 
  autor,
  autoPlay = false,
  onClose 
}: AudioPreviewPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100 || 0;

  // Mini player (padrão)
  if (!isExpanded) {
    return (
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-primary-300 transition-colors group">
        <audio ref={audioRef} src={src} />
        
        <div className="flex items-center gap-3">
          {/* Capa miniatura */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            {capa ? (
              <img src={capa} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <FiHeadphones className="text-primary-500" />
              </div>
            )}
          </div>

          {/* Info e controles */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-700 truncate">
                {titulo || "Áudio"}
              </h4>
              <span className="text-xs text-gray-500">
                {formatTime(currentTime)}/{formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} className="ml-0.5" />}
              </button>

              <div className="flex-1 relative">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(true)}
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FiHeadphones size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Player expandido (modal)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <audio ref={audioRef} src={src} />

          {/* Capa grande */}
          <div className="relative aspect-square rounded-xl overflow-hidden mb-6 shadow-2xl">
            {capa ? (
              <img src={capa} alt={titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <FiHeadphones className="text-white text-6xl opacity-50" />
              </div>
            )}
            
            {/* Overlay com ondas sonoras quando tocando */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-end justify-center p-6">
                <div className="flex gap-1">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white rounded-full"
                      animate={{
                        height: [10, Math.random() * 40 + 10, 10],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-1">{titulo}</h3>
            {autor && <p className="text-gray-400 text-sm">{autor}</p>}
          </div>

          {/* Barra de progresso */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controles principais */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button className="p-3 text-gray-400 hover:text-white transition-colors">
              ⏮
            </button>
            
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110 shadow-xl"
            >
              {isPlaying ? <FiPause className="text-white text-2xl" /> : <FiPlay className="text-white text-2xl ml-1" />}
            </button>
            
            <button className="p-3 text-gray-400 hover:text-white transition-colors">
              ⏭
            </button>
          </div>

          {/* Controles secundários */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <a
                href={src}
                download
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiDownload size={18} />
              </a>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};