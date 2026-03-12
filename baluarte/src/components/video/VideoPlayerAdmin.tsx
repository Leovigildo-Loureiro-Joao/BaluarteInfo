// src/components/admin/VideoPreviewPlayer.tsx
import { useState, useRef, useEffect } from "react";
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPreviewPlayerProps {
  src: string;
  thumbnail?: string;
  titulo?: string;
  autoPlay?: boolean;
  onClose?: () => void;
}

export const VideoPreviewPlayer = ({ 
  src, 
  thumbnail, 
  titulo, 
  autoPlay = false,
  onClose 
}: VideoPreviewPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const controlsTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100 || 0;

  const playerContent = (
    <div 
      className={`relative bg-black rounded-xl overflow-hidden group ${
        isExpanded ? 'fixed inset-4 z-50' : ''
      }`}
      style={{ aspectRatio: '16/9' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="w-full h-full"
        onClick={togglePlay}
      />

      {/* Overlay de controles */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        
        {/* Título (quando expandido) */}
        {isExpanded && titulo && (
          <div className="absolute top-4 left-4 text-white font-medium bg-black/50 px-3 py-1 rounded-lg">
            {titulo}
          </div>
        )}

        {/* Botão de fechar (quando expandido) */}
        {isExpanded && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        )}

        {/* Botão de play central (só quando pausado) */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110"
          >
            <FiPlay className="text-white text-2xl ml-1" />
          </button>
        )}

        {/* Barra de controles inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Barra de progresso */}
          <div className="relative mb-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Botões de controle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary-500 transition-colors"
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary-500 transition-colors"
                >
                  {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
                </button>
                <div className="w-20">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:text-primary-500 transition-colors"
              >
                {isExpanded ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary-500 transition-colors"
              >
                <FiMaximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          {playerContent}
        </motion.div>
      </AnimatePresence>
    );
  }

  return playerContent;
};