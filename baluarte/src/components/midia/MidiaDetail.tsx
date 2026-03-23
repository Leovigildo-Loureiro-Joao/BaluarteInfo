// src/pages/Midia/MidiaDetalhe.tsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  FiUser, 
  FiCalendar, 
  FiEye, 
  FiClock,
  FiShare2,
  FiDownload,
  FiArrowLeft,
  FiThumbsUp,
  FiMessageCircle,
  FiMoreHorizontal,
  FiBookmark,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiPlay,
  FiPause,
  FiSkipForward,
  FiSkipBack,
  FiChevronLeft,
  FiChevronRight,
  FiVideo
} from "react-icons/fi";
import { 
  GiMicrophone, 
  GiMusicalNotes, 
  GiPrayer, 
  GiAngelWings,
  GiSoundWaves,
  GiMegaphone 
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { apiFetch } from "../../utils/api";
import { getStoredUser, hasRole } from "../../utils/auth";
import type { ComentarioResult, MidiaRelacionadoEdicaoItem, PageResponse } from "../../types/api";

// Tipos de áudio para badge
const audioTypeInfo: Record<string, { label: string, icon: any, color: string }> = {
  SERMON: { label: "Sermão", icon: GiMicrophone, color: "bg-purple-500" },
  DEVOTIONAL: { label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  TESTIMONY: { label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  MUSIC: { label: "Música", icon: GiMusicalNotes, color: "bg-indigo-500" },
  PRAYER: { label: "Oração", icon: GiPrayer, color: "bg-blue-500" },
  STUDY: { label: "Estudo", icon: LiaBibleSolid, color: "bg-amber-500" },
  PODCAST: { label: "Podcast", icon: GiSoundWaves, color: "bg-orange-500" },
  ANNOUNCEMENT: { label: "Aviso", icon: GiMegaphone, color: "bg-red-500" },
};

// Componente de Player de Vídeo Aprimorado
const VideoPlayer = ({
  src,
  thumbnail,
  title,
  onQualifiedView,
}: {
  src: string;
  thumbnail: string;
  title: string;
  onQualifiedView?: (watchedSeconds: number) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout>();
  const qualifiedViewSent = useRef(false);

  useEffect(() => {
    qualifiedViewSent.current = false;
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (!qualifiedViewSent.current && video.currentTime >= 30) {
        qualifiedViewSent.current = true;
        onQualifiedView?.(Math.floor(video.currentTime));
      }
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleSeeking = () => setIsBuffering(true);
    const handleSeeked = () => setIsBuffering(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
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
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
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

  return (
    <div 
      className="relative aspect-video bg-black rounded-2xl overflow-hidden group"
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

      {/* Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Play/Pause central */}
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center hover:bg-primary transition-all hover:scale-110"
        >
          {isPlaying ? <FiPause size={30} className="text-white" /> : <FiPlay size={30} className="text-white ml-1" />}
        </button>

        {/* Barra de controles inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Barra de progresso */}
          <div className="relative mb-4">
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
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Botões de controle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors"
              >
                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
              </button>
              
              <button className="text-white hover:text-primary transition-colors">
                <FiSkipBack size={20} />
              </button>
              
              <button className="text-white hover:text-primary transition-colors">
                <FiSkipForward size={20} />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors"
                >
                  {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
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

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Canto superior com título */}
      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
    </div>
  );
};

// Componente de Player de Áudio Aprimorado
const AudioPlayer = ({ src, title, author, type, thumbnail, onQualifiedView }: any) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const qualifiedViewSent = useRef(false);

  useEffect(() => {
    qualifiedViewSent.current = false;
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (!qualifiedViewSent.current && audio.currentTime >= 30) {
        qualifiedViewSent.current = true;
        onQualifiedView?.(Math.floor(audio.currentTime));
      }
    };
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

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
  const AudioIcon = audioTypeInfo[type]?.icon || GiMicrophone;
  const audioColor = audioTypeInfo[type]?.color || "bg-primary";

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
      <audio ref={audioRef} src={src} />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Capa do áudio */}
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=200&q=80'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${audioColor} opacity-20`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <AudioIcon size={40} className="text-white opacity-50" />
          </div>
        </div>

        {/* Informações e controles */}
        <div className="flex-1 w-full">
          <div className="mb-4">
            <span className={`inline-block ${audioColor} text-white text-xs px-3 py-1 rounded-full mb-2`}>
              {audioTypeInfo[type]?.label || 'Áudio'}
            </span>
            <h3 className="text-2xl font-bold mb-1">{title}</h3>
            <p className="text-gray-400">{author}</p>
          </div>

          {/* Barra de progresso */}
          <div className="relative mb-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <FiSkipBack size={20} />
              </button>
              
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors hover:scale-105"
              >
                {isBuffering ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <FiPause size={18} className="text-white" />
                ) : (
                  <FiPlay size={18} className="text-white ml-1" />
                )}
              </button>
              
              <button className="text-gray-400 hover:text-white transition-colors">
                <FiSkipForward size={20} />
              </button>

              <div className="flex items-center gap-2 ml-4">
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
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <FiDownload size={16} />
              <span className="text-sm">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Comentários
const CommentSection = ({ midiaId }: { midiaId: number }) => {
  const [comments, setComments] = useState<ComentarioResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await apiFetch(`/user/midia/${midiaId}/comentarioAll`);
        if (!response.ok) throw new Error("Falha ao carregar comentários.");
        const payload = (await response.json()) as ComentarioResult[];
        if (!active) return;
        setComments(Array.isArray(payload) ? payload : []);
        setError("");
      } catch (err) {
        if (!active) return;
        setError("Não foi possível carregar os comentários.");
        setComments([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    load();

    return () => {
      active = false;
    };
  }, [midiaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const user = getStoredUser();
    if (!user?.id) {
      setError("Faça login para comentar.");
      return;
    }

    try {
      const response = await apiFetch("/user/comentario", {
        method: "POST",
        body: {
          idUser: user.id,
          idSeccao: midiaId,
          seccao: "Midia",
          descricao: newComment.trim()
        }
      });

      if (!response.ok) {
        setError("Não foi possível enviar o comentário.");
        return;
      }

      const payload = (await response.json()) as ComentarioResult;
      setComments([payload, ...comments]);
      setNewComment("");
      setError("");
    } catch (err) {
      setError("Não foi possível enviar o comentário.");
    }
  };

  const currentUser = getStoredUser();
  const avatar = currentUser?.img || "https://i.pravatar.cc/150?img=5";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiMessageCircle className="text-primary" />
        Comentários ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Compartilhe sua opinião ou testemunho..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Comentar
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Carregando comentários...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Ainda não há comentários.</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex gap-3">
                <img
                  src={comment.imagem}
                  alt={comment.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{comment.name}</h4>
                    {comment.dataPublicacao && (
                      <span className="text-xs text-gray-500">
                        {new Date(comment.dataPublicacao).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{comment.descricao}</p>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
                    <FiThumbsUp size={14} />
                    {comment.likes ?? 0}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MidiaDetalhe = () => {
  const { id } = useParams();
  const [midia, setMidia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('sobre');
  const [isSaved, setIsSaved] = useState(false);
  const viewRequestInFlight = useRef(false);
  const viewRegistered = useRef(false);

  const [relacionadosEdicoes, setRelacionadosEdicoes] = useState<MidiaRelacionadoEdicaoItem[]>([]);
  const [relacionadosEdicoesPage, setRelacionadosEdicoesPage] = useState(0);
  const [relacionadosEdicoesTotalPages, setRelacionadosEdicoesTotalPages] = useState(0);
  const [relacionadosEdicoesLoading, setRelacionadosEdicoesLoading] = useState(false);
  const [relacionadosEdicoesError, setRelacionadosEdicoesError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!id) {
        setError("Mídia não encontrada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiFetch(`/user/midia/${id}`);
        if (!response.ok) throw new Error("Falha ao carregar mídia.");
        const payload = await response.json();
        if (!active) return;

        setMidia({
          id: payload.id,
          titulo: payload.titulo,
          autor: payload.autor,
          descricao: payload.descricao,
          imagem: payload.imagem || payload.url || "",
          type: payload.type,
          audioType: payload.audioType,
          videoType: payload.videoType,
          url: payload.url,
          tempo: payload.tempo || "--:--",
          dataPublicacao: payload.dataPublicacao,
          visualizacoes: payload.visualizacoes ?? payload.vistos?.length ?? 0
        });
        setError("");
      } catch (err) {
        if (!active) return;
        setError("Não foi possível carregar a mídia.");
        setMidia(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;

    const loadRelacionadosEdicoes = async () => {
      if (!id) return;
      setRelacionadosEdicoes([]);
      setRelacionadosEdicoesPage(0);
      setRelacionadosEdicoesTotalPages(0);
      setRelacionadosEdicoesError("");

      try {
        setRelacionadosEdicoesLoading(true);
        const response = await apiFetch(`/user/midia/${id}/relacionados-edicoes?page=0&size=6`);
        if (!response.ok) throw new Error("Falha ao carregar relacionados por edições.");
        const payload = (await response.json()) as PageResponse<MidiaRelacionadoEdicaoItem>;
        if (!active) return;
        setRelacionadosEdicoes(payload.content || []);
        setRelacionadosEdicoesPage(payload.page ?? 0);
        setRelacionadosEdicoesTotalPages(payload.totalPages ?? 0);
      } catch (err) {
        if (!active) return;
        setRelacionadosEdicoesError("Não foi possível carregar mídias de outras edições.");
      } finally {
        if (active) setRelacionadosEdicoesLoading(false);
      }
    };

    loadRelacionadosEdicoes();
    return () => {
      active = false;
    };
  }, [id]);

  const carregarMaisRelacionadosEdicoes = async () => {
    if (!id) return;
    if (relacionadosEdicoesLoading) return;
    const nextPage = relacionadosEdicoesPage + 1;
    if (relacionadosEdicoesTotalPages && nextPage >= relacionadosEdicoesTotalPages) return;

    try {
      setRelacionadosEdicoesLoading(true);
      const response = await apiFetch(`/user/midia/${id}/relacionados-edicoes?page=${nextPage}&size=6`);
      if (!response.ok) throw new Error("Falha ao carregar mais relacionados.");
      const payload = (await response.json()) as PageResponse<MidiaRelacionadoEdicaoItem>;
      setRelacionadosEdicoes((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const item of payload.content || []) {
          if (!seen.has(item.id)) merged.push(item);
        }
        return merged;
      });
      setRelacionadosEdicoesPage(payload.page ?? nextPage);
      setRelacionadosEdicoesTotalPages(payload.totalPages ?? relacionadosEdicoesTotalPages);
    } finally {
      setRelacionadosEdicoesLoading(false);
    }
  };

  const isImage = midia?.type === "IMAGE";
  const tabs = isImage ? ['sobre'] : ['sobre', 'comentários'];

  useEffect(() => {
    if (midia?.type === "IMAGE") setActiveTab("sobre");
  }, [midia?.type]);

  const registerViewIfEligible = async (watchedSeconds: number) => {
    const numericId = midia?.id ?? Number(id);
    if (!numericId || Number.isNaN(numericId)) return;
    if (viewRegistered.current || viewRequestInFlight.current) return;

    if (hasRole('ADMIN')) return;

    viewRequestInFlight.current = true;
    try {
      const response = await apiFetch(`/user/midia/${numericId}/view`, {
        method: "POST",
        body: { watchedSeconds },
      });
      if (!response.ok) return;
      const payload = await response.json().catch(() => null);
      if (payload?.counted) {
        viewRegistered.current = true;
      }
    } finally {
      viewRequestInFlight.current = false;
    }
  };

  useEffect(() => {
    viewRegistered.current = false;
    viewRequestInFlight.current = false;

    if (!midia?.id) return;
    if (midia?.type !== "IMAGE") return;
    if (hasRole('ADMIN')) return;

    const timeout = setTimeout(() => {
      registerViewIfEligible(30);
    }, 30_000);

    return () => clearTimeout(timeout);
  }, [midia?.id, midia?.type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !midia) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Erro</h2>
            <p className="text-gray-600 mb-6">{error || "Não foi possível carregar a mídia."}</p>
            <Link
              to="/midia"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiArrowLeft />
              Voltar para Mídia
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const audioKey = midia.audioType || "";
  const AudioIcon = audioTypeInfo[audioKey]?.icon || GiMicrophone;
  const audioColor = audioTypeInfo[audioKey]?.color || "bg-primary";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header com navegação e ações */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            to="/midia"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors w-fit"
          >
            <FiArrowLeft />
            <span>Voltar para Mídia</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard?.writeText(window.location.href);
                } catch (err) {
                  // ignore
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiShare2 />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>

            {isImage && midia.url && (
              <a
                href={midia.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiDownload />
                <span className="hidden sm:inline">Baixar</span>
              </a>
            )}
            
            {!isImage && (
              <>
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiBookmark className={isSaved ? 'fill-current' : ''} />
                </button>
                
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <FiMoreHorizontal />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {midia.type === "VIDEO" ? (
                <VideoPlayer
                  src={midia.url}
                  thumbnail={midia.imagem}
                  title={midia.titulo}
                  onQualifiedView={registerViewIfEligible}
                />
              ) : midia.type === "AUDIO" ? (
                <AudioPlayer
                  src={midia.url || "#"}
                  title={midia.titulo}
                  author={midia.autor || "Baluarte"}
                  type={midia.audioType}
                  thumbnail={midia.imagem}
                  onQualifiedView={registerViewIfEligible}
                />
              ) : (
                <div className="bg-black rounded-2xl overflow-hidden">
                  <img
                    src={midia.url || midia.imagem}
                    alt={midia.titulo}
                    className="w-full max-h-[520px] object-contain bg-black"
                  />
                </div>
              )}
            </motion.div>

            {/* Abas de informação */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium capitalize transition-colors relative ${
                        activeTab === tab
                          ? 'text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'sobre' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{midia.titulo}</h2>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar />
                        {midia.dataPublicacao ? new Date(midia.dataPublicacao).toLocaleDateString('pt-BR') : "--"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiEye />
                        {midia.visualizacoes ?? 0} visualizações
                      </span>
                      {midia.tempo && (
                        <span className="flex items-center gap-1">
                          <FiClock />
                          {midia.tempo}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {midia.type === "VIDEO" ? <FiVideo /> : midia.type === "AUDIO" ? <AudioIcon /> : <FiDownload />}
                        {midia.type}
                      </span>
                      {midia.audioType && (
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white ${audioColor}`}
                        >
                          <AudioIcon size={12} />
                          {audioTypeInfo[audioKey]?.label || midia.audioType}
                        </span>
                      )}
                      {midia.videoType && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                          <FiVideo size={12} />
                          {midia.videoType}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {midia.descricao}
                    </p>

                    {midia.url && (
                      <a
                        href={midia.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <FiDownload />
                        Abrir/Baixar mídia
                      </a>
                    )}
                  </div>
                )}

                {!isImage && activeTab === 'comentários' && <CommentSection midiaId={midia.id} />}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Detalhes</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tipo</span>
                  <span className="font-medium text-gray-800">{midia.type}</span>
                </div>
                {midia.audioType && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Áudio</span>
                    <span className="font-medium text-gray-800">
                      {audioTypeInfo[audioKey]?.label || midia.audioType}
                    </span>
                  </div>
                )}
                {midia.videoType && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Vídeo</span>
                    <span className="font-medium text-gray-800">{midia.videoType}</span>
                  </div>
                )}
                {midia.tempo && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Duração</span>
                    <span className="font-medium text-gray-800">{midia.tempo}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Visualizações</span>
                  <span className="font-medium text-gray-800">{midia.visualizacoes ?? 0}</span>
                </div>
              </div>

              {midia.url && (
                <a
                  href={midia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <FiDownload />
                  Abrir/Baixar
                </a>
              )}
            </div>

            {(relacionadosEdicoesLoading || relacionadosEdicoesError || relacionadosEdicoes.length > 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Outras edições</h3>
                  <span className="text-xs text-gray-500">Mais recentes</span>
                </div>

                {relacionadosEdicoesError && (
                  <p className="text-sm text-red-600">{relacionadosEdicoesError}</p>
                )}

                {!relacionadosEdicoesError && relacionadosEdicoes.length === 0 && relacionadosEdicoesLoading && (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="flex gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-4/5" />
                          <div className="h-3 bg-gray-200 rounded w-2/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!relacionadosEdicoesError && relacionadosEdicoes.length > 0 && (
                  <div className="space-y-3">
                    {relacionadosEdicoes.map((item) => (
                      <Link
                        key={item.id}
                        to={`/midia/${item.id}`}
                        className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={item.imagem || item.url}
                          alt={item.titulo}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.titulo}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {item.edicao ? `Edição ${item.edicao}` : "Edição"}
                            {item.dataEvento ? ` • ${new Date(item.dataEvento).toLocaleDateString("pt-BR")}` : ""}
                          </p>
                        </div>
                        <FiChevronRight className="text-gray-400 mt-1" />
                      </Link>
                    ))}
                  </div>
                )}

                {!relacionadosEdicoesError &&
                  relacionadosEdicoes.length > 0 &&
                  (relacionadosEdicoesTotalPages === 0 || relacionadosEdicoesPage + 1 < relacionadosEdicoesTotalPages) && (
                    <button
                      onClick={carregarMaisRelacionadosEdicoes}
                      disabled={relacionadosEdicoesLoading}
                      className="mt-4 w-full px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60"
                    >
                      {relacionadosEdicoesLoading ? "Carregando..." : "Carregar mais"}
                    </button>
                  )}
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  );
};
