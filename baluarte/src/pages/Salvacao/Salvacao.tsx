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
        <div className="max-w-4xl mx-auto">
          {/* Cards de Decisão */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Você deseja aceitar a Jesus Cristo como seu Senhor e Salvador?
              </h2>
              <p className="text-gray-600 text-lg mb-12">
                Esta é a decisão mais importante da sua vida. Deus te ama e tem um plano perfeito para você.
              </p>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDecision('sim')}
                  className="group bg-green-500 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <FiHeart className="text-5xl mx-auto mb-4 group-hover:animate-pulse" />
                  <h3 className="text-2xl font-bold mb-2">SIM</h3>
                  <p className="text-white/80">Quero aceitar a Jesus hoje</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDecision('nao')}
                  className="group bg-gray-500 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <FiHeart className="text-5xl mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold mb-2">AINDA NÃO</h3>
                  <p className="text-white/80">Tenho dúvidas, quero saber mais</p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Passo 2 - Oração de Decisão */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GiCrossShield className="text-green-500 text-4xl" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Que alegria!</h2>
                <p className="text-gray-600">
                  Você acaba de tomar a decisão mais importante da sua vida.
                </p>
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GiPrayer className="text-primary" />
                  Faça esta oração com fé:
                </h3>
                
                <div className="space-y-4 text-gray-700">
                  <p className="italic border-l-4 border-primary pl-4">
                    "Senhor Jesus, eu reconheço que sou pecador e preciso do Teu perdão.
                  </p>
                  <p className="italic border-l-4 border-primary pl-4">
                    Creio que morreste na cruz por mim e ressuscitou ao terceiro dia.
                  </p>
                  <p className="italic border-l-4 border-primary pl-4">
                    Neste momento, eu Te recebo como meu único e suficiente Salvador.
                  </p>
                  <p className="italic border-l-4 border-primary pl-4">
                    Entrego minha vida em Tuas mãos e Te peço: escreve meu nome no Livro da Vida.
                  </p>
                  <p className="italic border-l-4 border-primary pl-4 font-bold">
                    Em nome de Jesus, amém!"
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Se você orou com fé, seja bem-vindo à família de Deus!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/artigos"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Primeiros Passos na Fé
                    <FiArrowRight />
                  </Link>
                  <button
                    onClick={() => setStep(4)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    Quero ser contactado
                    <FiMessageCircle />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Passo 3 - Conteúdo Evangelístico (Ainda com Dúvidas) */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
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

                {/* Botão para continuar */}
                <div className="text-center mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Voltar e decidir
                    <FiArrowRight />
                  </button>
                </div>
              </div>

              {/* Lista de Áudios */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
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

          {/* Passo 4 - Quero ser contactado */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-center mb-8">
                Receba acompanhamento
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FiMessageCircle className="text-primary" />
                    Deixe sua mensagem
                  </h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone/WhatsApp
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Como podemos ajudar?
                      </label>
                      <textarea
                        rows={4}
                        value={prayerRequest}
                        onChange={(e) => setPrayerRequest(e.target.value)}
                        placeholder="Compartilhe suas dúvidas, pedidos de oração..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                      Enviar mensagem
                    </button>
                  </form>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Outras formas de contato</h3>
                  
                  <div className="space-y-4">
                    <a 
                      href="https://wa.me/5511999999999" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <FiMessageCircle />
                      </div>
                      <div>
                        <p className="font-semibold">WhatsApp</p>
                        <p className="text-sm text-gray-500">(11) 99999-9999</p>
                      </div>
                    </a>

                    <a 
                      href="tel:1133334444"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <FiPhone />
                      </div>
                      <div>
                        <p className="font-semibold">Telefone</p>
                        <p className="text-sm text-gray-500">(11) 3333-4444</p>
                      </div>
                    </a>

                    <a 
                      href="mailto:contato@igrejabaluarte.com"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                        <FiMail />
                      </div>
                      <div>
                        <p className="font-semibold">E-mail</p>
                        <p className="text-sm text-gray-500">contato@igrejabaluarte.com</p>
                      </div>
                    </a>
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-xl">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <GiChurch className="text-primary" />
                      Visite nossa igreja
                    </h4>
                    <p className="text-sm text-gray-600">
                      Rua da Igreja, 123 - Centro<br />
                      Cultos: Domingo 9h e 19h | Quarta 20h
                    </p>
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