// src/pages/Salvacao/SalvacaoPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FiHeart, 
  FiCheckCircle, 
  FiArrowRight,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiPlay,
  FiHeadphones,
  FiBookOpen
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiAngelWings,
  GiChurch,
  GiHeartBeats,
  GiCrossShield
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";

export const SalvacaoPage = () => {
  const [step, setStep] = useState(1);
  const [prayerRequest, setPrayerRequest] = useState("");

  // Conteúdo evangelístico real
  const conteudoEvangelistico = {
    videoApresentacao: {
      titulo: "O Evangelho em 3 Minutos",
      descricao: "Uma explicação simples e clara do plano de salvação",
      url: "https://www.youtube.com/embed/VIDEO_ID", // Substituir pelo ID real do vídeo
      thumbnail: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"
    },
    audios: [
      {
        id: 1,
        titulo: "O Amor de Deus",
        descricao: "Uma mensagem sobre o amor incondicional de Deus",
        autor: "Pr. Antônio Silva",
        duracao: "25:30",
        url: "/audios/amor-de-deus.mp3",
        imagem: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: 2,
        titulo: "O Plano da Salvação",
        descricao: "Entenda como Deus preparou a salvação para você",
        autor: "Pr. João Santos",
        duracao: "32:15",
        url: "/audios/plano-salvacao.mp3",
        imagem: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: 3,
        titulo: "O Que Fazer Após Aceitar Jesus",
        descricao: "Primeiros passos na fé cristã",
        autor: "Pra. Maria Oliveira",
        duracao: "28:45",
        url: "/audios/primeiros-passos.mp3",
        imagem: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=400&q=80"
      }
    ],
    artigo: {
      titulo: "O Plano Perfeito de Deus para Sua Vida",
      resumo: "Você já parou para pensar que existe um propósito maior para sua vida? Deus criou você com um plano especial.",
      conteudo: `
        <h2>1. O Amor de Deus</h2>
        <p>"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." (João 3:16)</p>
        <p>Deus te ama incondicionalmente. Não importa o que você tenha feito, o amor dEle por você nunca muda.</p>
        
        <h2>2. O Problema do Pecado</h2>
        <p>"Pois todos pecaram e estão destituídos da glória de Deus." (Romanos 3:23)</p>
        <p>O pecado nos separa de Deus. É como um abismo que não podemos atravessar sozinhos.</p>
        
        <h2>3. A Solução de Deus</h2>
        <p>"Mas Deus demonstra seu amor por nós: Cristo morreu em nosso favor quando ainda éramos pecadores." (Romanos 5:8)</p>
        <p>Jesus Cristo morreu na cruz para pagar o preço dos nossos pecados. Ele tomou o nosso lugar.</p>
        
        <h2>4. A Resposta que Deus Espera</h2>
        <p>"Se você confessar com a sua boca que Jesus é Senhor e crer em seu coração que Deus o ressuscitou dentre os mortos, será salvo." (Romanos 10:9)</p>
        <p>Deus espera uma resposta de fé. É um convite pessoal para você.</p>
      `,
      imagem: "https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=800&q=80",
      autor: "Pr. Antônio Silva",
      data: "2024-01-15"
    }
  };

  const handleDecision = (decision: string) => {
    if (decision === 'sim') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1920&q=80"
          alt="Luz divina"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                Hoje é o dia da
                <span className="block text-white">Salvação</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                "Eis agora o tempo aceitável, eis agora o dia da salvação" 
                <span className="block text-sm mt-2">2 Coríntios 6:2</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container-custom">
        <div className="max-w-5xl mx-auto">
      
          {/* Passo 3 - Conteúdo Evangelístico (Ainda com Dúvidas) */}
          { (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8  "
            >
             <div className="flex gap-5 bg-white rounded-3xl shadow-2xl p-8 md:p-12">
               <div className="p-5">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LiaBibleSolid className="text-blue-500 text-4xl" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Entenda o Plano de Salvação</h2>
                  <p className="text-gray-600">
                    Deus preparou tudo para que você possa conhecê-Lo
                  </p>
                </div>

                {/* Vídeo de Apresentação */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FiPlay className="text-primary" />
                    {conteudoEvangelistico.videoApresentacao.titulo}
                  </h3>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={conteudoEvangelistico.videoApresentacao.url}
                      title={conteudoEvangelistico.videoApresentacao.titulo}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {conteudoEvangelistico.videoApresentacao.descricao}
                  </p>
                </div>

                
              </div>

              {/* Lista de Áudios */}
              <div className="border-separate border-gray-500 border-l p-5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiHeadphones className="text-primary" />
                  Mensagens para Ouvir
                </h3>

                <div className="space-y-4">
                  {conteudoEvangelistico.audios.map((audio) => (
                    <div key={audio.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={audio.imagem}
                        alt={audio.titulo}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{audio.titulo}</h4>
                        <p className="text-sm text-gray-500">{audio.autor} • {audio.duracao}</p>
                        <p className="text-xs text-gray-400 mt-1">{audio.descricao}</p>
                      </div>
                      <button className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
                        <FiHeadphones size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
             </div>

              {/* Artigo */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative h-64">
                  <img
                    src={conteudoEvangelistico.artigo.imagem}
                    alt={conteudoEvangelistico.artigo.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold">{conteudoEvangelistico.artigo.titulo}</h3>
                    <p className="text-white/80 text-sm">{conteudoEvangelistico.artigo.autor} • {conteudoEvangelistico.artigo.data}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: conteudoEvangelistico.artigo.conteudo }}
                  />
                  
                  <div className="mt-6 text-center">
                    <Link
                      to="/artigos"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors"
                    >
                      <FiBookOpen />
                      Ler mais artigos
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

         

          {/* Versículos e Recursos - sempre visível */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                versiculo: "João 3:16",
                texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
                icon: GiHeartBeats
              },
              {
                versiculo: "Romanos 10:9",
                texto: "Se você confessar com a sua boca que Jesus é Senhor e crer em seu coração que Deus o ressuscitou dentre os mortos, será salvo.",
                icon: LiaBibleSolid
              },
              {
                versiculo: "Efésios 2:8-9",
                texto: "Porque pela graça sois salvos, mediante a fé; e isto não vem de vós, é dom de Deus; não de obras, para que ninguém se glorie.",
                icon: GiAngelWings
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                  <Icon className="text-primary text-3xl mb-3" />
                  <h4 className="font-bold text-lg mb-2">{item.versiculo}</h4>
                  <p className="text-sm text-gray-600 italic">{item.texto}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};