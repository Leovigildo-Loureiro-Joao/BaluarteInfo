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
  FiHeart,
  FiDownload,
  FiArrowLeft,
  FiThumbsUp,
  FiMessageCircle,
  FiMoreHorizontal,
  FiFlag,
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
const VideoPlayer = ({ src, thumbnail, title }: { src: string; thumbnail: string; title: string }) => {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
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
const AudioPlayer = ({ src, title, author, type, thumbnail }: any) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
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
const CommentSection = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "João Pedro",
      avatar: "https://i.pravatar.cc/150?img=1",
      time: "2 horas atrás",
      content: "Palavra poderosa! Fui muito abençoado com essa mensagem. Deus continue usando o irmão.",
      likes: 23,
      replies: [
        {
          user: "Maria Silva",
          avatar: "https://i.pravatar.cc/150?img=2",
          time: "1 hora atrás",
          content: "Amém! Também fui abençoada.",
          likes: 5
        }
      ]
    },
    {
      id: 2,
      user: "Ana Carolina",
      avatar: "https://i.pravatar.cc/150?img=3",
      time: "5 horas atrás",
      content: "Que mensagem linda! Compartilhei com minha família. Deus é fiel!",
      likes: 15,
      replies: []
    },
    {
      id: 3,
      user: "Pedro Santos",
      avatar: "https://i.pravatar.cc/150?img=4",
      time: "1 dia atrás",
      content: "Precisava muito ouvir essa palavra hoje. Deus sabe exatamente o que precisamos.",
      likes: 32,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: "Visitante",
      avatar: "https://i.pravatar.cc/150?img=5",
      time: "Agora mesmo",
      content: newComment,
      likes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiMessageCircle className="text-primary" />
        Comentários ({comments.length})
      </h3>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <img
            src="https://i.pravatar.cc/150?img=5"
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
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

      {/* Lista de comentários */}
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
                src={comment.avatar}
                alt={comment.user}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{comment.user}</h4>
                  <span className="text-xs text-gray-500">{comment.time}</span>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
                    <FiThumbsUp size={14} />
                    {comment.likes}
                  </button>
                  <button className="text-sm text-gray-500 hover:text-primary transition-colors">
                    Responder
                  </button>
                </div>

                {/* Respostas */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-4">
                    {comment.replies.map((reply, index) => (
                      <div key={index} className="flex gap-3">
                        <img
                          src={reply.avatar}
                          alt={reply.user}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-sm">{reply.user}</h5>
                            <span className="text-xs text-gray-500">{reply.time}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                            <FiThumbsUp size={12} />
                            {reply.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const MidiaDetalhe = () => {
  const { id } = useParams();
  const [midia, setMidia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Simular busca de dados
    setTimeout(() => {
      const item = {
        id: 1,
        titulo: "A Vitória é Certa - Culto de Domingo",
        descricao: "Nesta mensagem poderosa, o Pr. Antônio Silva traz uma palavra de ânimo e esperança para todos que estão enfrentando lutas e desafios. Baseado em Romanos 8:37, aprendemos que em todas as coisas somos mais que vencedores.",
        conteudo: "Em meio às tempestades da vida, é fácil perder a esperança e pensar que Deus nos abandonou. Mas a verdade é que Ele nunca nos deixa e tem um propósito em cada dificuldade. Neste culto, exploramos como a fé pode nos sustentar nos momentos mais difíceis e como podemos confiar no caráter de Deus mesmo quando não entendemos Seus planos.",
        imagem: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
        tipo: "VIDEO",
        videoUrl: "https://example.com/video.mp4",
        audioType: "SERMON",
        duracao: "45:30",
        visualizacoes: 1234,
        data: "2024-01-15",
        autor: "Pr. Antônio Silva",
        autorFoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        autorBio: "Pastor há 20 anos, formado em Teologia, especialista em Aconselhamento Bíblico e conferencista internacional.",
        likes: 89,
        shares: 34,
        downloads: 56,
        tags: ["fé", "perseverança", "vitória", "esperança"],
        capitulos: [
          { time: "00:00", titulo: "Abertura e Louvor" },
          { time: "10:30", titulo: "Leitura da Palavra" },
          { time: "15:45", titulo: "Introdução: O Contexto da Luta" },
          { time: "22:30", titulo: "Ponto 1: Deus Está no Controle" },
          { time: "30:15", titulo: "Ponto 2: O Propósito nas Provações" },
          { time: "38:00", titulo: "Ponto 3: A Vitória é Certa" },
          { time: "42:30", titulo: "Oração Final" }
        ],
        relacionados: [
          {
            id: 2,
            titulo: "Estudo Bíblico - Romanos 8",
            imagem: "https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=400&q=80",
            tipo: "VIDEO",
            duracao: "58:20",
            autor: "Pb. Marcos Oliveira"
          },
          {
            id: 3,
            titulo: "Podcast: Juventude e Fé",
            imagem: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80",
            tipo: "AUDIO",
            duracao: "32:15",
            autor: "Pr. João Santos"
          },
          {
            id: 4,
            titulo: "Série: Os Atributos de Deus",
            imagem: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=400&q=80",
            tipo: "AUDIO",
            duracao: "45:10",
            autor: "Pr. Antônio Silva"
          }
        ]
      };

      setMidia(item);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const AudioIcon = audioTypeInfo[midia.audioType]?.icon || GiMicrophone;
  const audioColor = audioTypeInfo[midia.audioType]?.color || "bg-primary";

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
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLiked 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
              <span className="hidden sm:inline">{isLiked ? 'Curtido' : 'Curtir'}</span>
              <span className="text-sm">({midia.likes})</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
              <FiShare2 />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            
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
              {midia.tipo === 'VIDEO' ? (
                <VideoPlayer
                  src={midia.videoUrl}
                  thumbnail={midia.imagem}
                  title={midia.titulo}
                />
              ) : (
                <AudioPlayer
                  src={midia.audioUrl || '#'}
                  title={midia.titulo}
                  author={midia.autor}
                  type={midia.audioType}
                  thumbnail={midia.imagem}
                />
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
                  {['sobre', 'comentários', 'transcrição'].map((tab) => (
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
                        <FiUser />
                        {midia.autor}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar />
                        {new Date(midia.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiEye />
                        {midia.visualizacoes} visualizações
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock />
                        {midia.duracao}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {midia.descricao}
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                      {midia.conteudo}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      {midia.tags.map((tag: string) => (
                        <Link
                          key={tag}
                          to={`/midia?tag=${tag}`}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'comentários' && <CommentSection />}


                {activeTab === 'transcrição' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      [Transcrição completa do áudio/vídeo seria exibida aqui...]
                    </p>
                  </div>
                )}
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
            {/* Card do autor */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiUser className="text-primary" />
                Sobre o autor
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={midia.autorFoto}
                  alt={midia.autor}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{midia.autor}</h4>
                  <p className="text-sm text-gray-500">Pastor</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {midia.autorBio}
              </p>
            </div>

            {/* Capítulos (para vídeos) */}
            {midia.capitulos && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FiClock className="text-primary" />
                  Capítulos
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {midia.capitulos.map((capitulo: any, index: number) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                    >
                      <span className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">
                        {capitulo.time}
                      </span>
                      <span className="text-gray-700 text-sm group-hover:text-primary transition-colors">
                        {capitulo.titulo}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Downloads */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiDownload className="text-primary" />
                Downloads
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FiVideo className="text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Vídeo (HD)</p>
                      <p className="text-xs text-gray-500">450 MB</p>
                    </div>
                  </div>
                  <FiDownload className="text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FiDownload className="text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Áudio (MP3)</p>
                      <p className="text-xs text-gray-500">85 MB</p>
                    </div>
                  </div>
                  <FiDownload className="text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FiBookmark className="text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Transcrição (PDF)</p>
                      <p className="text-xs text-gray-500">2.3 MB</p>
                    </div>
                  </div>
                  <FiDownload className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Mídia relacionada */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Relacionados</h3>
              <div className="space-y-4">
                {midia.relacionados.map((item: any) => (
                  <Link
                    key={item.id}
                    to={`/midia/${item.id}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imagem}
                        alt={item.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {item.duracao && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {item.duracao}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {item.tipo === 'VIDEO' ? (
                          <FiPlay className="text-white" size={20} />
                        ) : (
                          <GiMicrophone className="text-white" size={20} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {item.titulo}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.autor}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.tipo === 'VIDEO' ? 'Vídeo' : 'Áudio'} • {item.duracao}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to="/midia"
                className="flex items-center justify-center gap-2 mt-4 text-primary hover:gap-3 transition-all"
              >
                Ver mais
                <FiChevronRight />
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};