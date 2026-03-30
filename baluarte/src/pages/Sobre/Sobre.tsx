// src/pages/Sobre/SobrePage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  FiHeart, 
  FiUsers, 
  FiCalendar, 
  FiMapPin,
  FiMail,
  FiPhone,
  FiClock
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiChurch,
  GiHeartBeats,
  GiFamilyHouse,
  GiCrown
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { apiFetch } from "../../utils/api.js";
import type { SobreDto } from "../../types/api";
import { resolveSobreIcon } from "../../utils/sobreIcons";

export const SobrePage = () => {
  const fallbackConteudo = useMemo<SobreDto>(
    () => ({
      historia: {
        titulo: "Uma caminhada de fé desde 2009",
        descricao: [
          "A Igreja Baluarte nasceu do sonho de um grupo de irmãos que desejavam ver vidas transformadas pelo poder do Evangelho. Em 15 de março de 2009, realizamos nosso primeiro culto com apenas 12 pessoas em uma sala alugada.",
          "Ao longo dos anos, Deus nos permitiu crescer e hoje somos uma comunidade de mais de 500 membros, com diversas atividades e ministérios que alcançam nossa cidade e além. Nossa sede própria foi conquistada em 2015, um marco importante na nossa jornada.",
          "Mas mais que números, celebramos vidas transformadas, famílias restauradas e o amor de Deus sendo derramado sobre todos que passam por aqui.",
        ],
        imagens: [
          {
            url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
            descricao: "Primeiro culto",
          },
          {
            url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
            descricao: "Igreja hoje",
          },
        ],
        dataFundacao: "2009-03-15",
        fundadores: ["Pr. Antônio Silva", "Pra. Maria Oliveira", "Diácono João Santos"],
      },
      valores: [
        {
          id: "1",
          icon: "GiBible",
          titulo: "Fundamento na Palavra",
          descricao: "A Bíblia é nossa única regra de fé e prática. Tudo o que fazemos está baseado nas Escrituras.",
          ordem: 1,
          ativo: true,
        },
        {
          id: "2",
          icon: "GiPrayer",
          titulo: "Vida de Oração",
          descricao: "Cremos no poder da oração e buscamos uma vida de intimidade com Deus através dela.",
          ordem: 2,
          ativo: true,
        },
        {
          id: "3",
          icon: "GiHeartBeats",
          titulo: "Amor ao Próximo",
          descricao: "O amor é nossa marca. Amamos a Deus sobre todas as coisas e ao próximo como a nós mesmos.",
          ordem: 3,
          ativo: true,
        },
        {
          id: "4",
          icon: "GiFamilyHouse",
          titulo: "Família",
          descricao: "Valorizamos a família como instituição divina e base para uma sociedade saudável.",
          ordem: 4,
          ativo: true,
        },
        {
          id: "5",
          icon: "GiChurch",
          titulo: "Comunhão",
          descricao: "Não fomos feitos para viver sozinhos. A comunhão entre os irmãos é essencial.",
          ordem: 5,
          ativo: true,
        },
        {
          id: "6",
          icon: "FiHeart",
          titulo: "Excelência",
          descricao: "Tudo o que fazemos, fazemos com excelência, como para o Senhor.",
          ordem: 6,
          ativo: true,
        },
      ],
      pastores: [
        {
          id: "1",
          nome: "Pr. Antônio Silva",
          cargo: "Pastor Presidente",
          foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
          descricao:
            "Pastor há 20 anos, formado em Teologia pelo Seminário Teológico Batista do Sul. Casado com Pra. Maria e pai de 3 filhos.",
          email: "",
          ordem: 1,
          ativo: true,
        },
        {
          id: "2",
          nome: "Pra. Maria Oliveira",
          cargo: "Pastora Adjunta",
          foto: "https://images.unsplash.com/photo-1494790108777-9f3e9b8f0b9e?auto=format&fit=crop&w=400&q=80",
          descricao:
            "Especialista em Aconselhamento Bíblico e líder do ministério de oração. Casada com Pr. Antônio.",
          email: "",
          ordem: 2,
          ativo: true,
        },
        {
          id: "3",
          nome: "Pr. João Santos",
          cargo: "Pastor de Jovens",
          foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
          descricao:
            "Líder da juventude há 8 anos, formado em Comunicação Social e apaixonado por ver jovens no centro da vontade de Deus.",
          email: "",
          ordem: 3,
          ativo: true,
        },
      ],
      estatisticas: [
        { id: "1", numero: "15+", label: "Anos de história", icon: "FiCalendar", ordem: 1, ativo: true },
        { id: "2", numero: "500+", label: "Membros", icon: "FiUsers", ordem: 2, ativo: true },
        { id: "3", numero: "30+", label: "Ministérios", icon: "GiPrayer", ordem: 3, ativo: true },
        { id: "4", numero: "1000+", label: "Vidas alcançadas", icon: "FiHeart", ordem: 4, ativo: true },
      ],
      localizacao: {
        endereco: {
          rua: "Rua da Igreja",
          numero: "123",
          complemento: "",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          cep: "12345-678",
        },
        horarios: [
          { dia: "Domingo", horarios: ["09:00 - Escola Bíblica", "19:00 - Culto"] },
          { dia: "Quarta-feira", horarios: ["20:00 - Culto de Oração"] },
        ],
        contato: {
          telefone: "(11) 3333-4444",
          email: "contato@igrejabaluarte.com",
          whatsapp: "",
        },
        mapa: {
          latitude: -23.5641234,
          longitude: -46.6541234,
          embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197496135465!2d-46.6541234!3d-23.5641234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUxLjAiUyA0NsKwMzknMTUuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890",
        },
      },
      cta: {
        titulo: "Faça parte desta história",
        descricao: "Venha nos conhecer, crescer conosco e fazer parte da família Baluarte",
        botao1: { texto: "Entre em contato", link: "/contacto" },
        botao2: { texto: "Conheça nossas atividades", link: "/actividades" },
        ativo: true,
      },
    }),
    []
  );

  const [conteudo, setConteudo] = useState<SobreDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch("/public/sobre", { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar o conteúdo do Sobre.");
        const payload = (await res.json()) as SobreDto;
        setConteudo(payload);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setConteudo(null);
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar o conteúdo do Sobre.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const data = conteudo ?? fallbackConteudo;
  const valoresAtivos = (data.valores ?? [])
    .filter((v) => v?.ativo !== false)
    .slice()
    .sort((a, b) => (a?.ordem ?? 0) - (b?.ordem ?? 0));
  const pastoresAtivos = (data.pastores ?? [])
    .filter((p) => p?.ativo !== false)
    .slice()
    .sort((a, b) => (a?.ordem ?? 0) - (b?.ordem ?? 0));
  const estatisticasAtivas = (data.estatisticas ?? [])
    .filter((s) => s?.ativo !== false)
    .slice()
    .sort((a, b) => (a?.ordem ?? 0) - (b?.ordem ?? 0));

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loadError && !conteudo && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container-custom py-3 text-sm text-yellow-900 flex items-center justify-between gap-4">
            <span>{loadError}</span>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80"
          alt="Igreja Baluarte"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-600/80" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                Sobre Nós
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                {loading ? "Carregando..." : "Conheça nossa história, valores e o propósito que Deus nos deu"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* História */}
      <motion.section 
        className="py-20 bg-white"
        {...fadeInUp}
      >
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-500 font-semibold text-sm tracking-wider uppercase">
                Nossa História
              </span>
              <h2 className="text-4xl font-bold mt-2 mb-4">
                {data.historia?.titulo || "Nossa história"}
              </h2>
              {(data.historia?.descricao ?? []).map((paragrafo, index) => (
                <p
                  key={index}
                  className={`text-gray-600 leading-relaxed ${index < (data.historia?.descricao?.length ?? 0) - 1 ? "mb-6" : ""}`}
                >
                  {paragrafo}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={data.historia?.imagens?.[0]?.url || fallbackConteudo.historia.imagens[0].url}
                alt={data.historia?.imagens?.[0]?.descricao || "Imagem 1"}
                className="rounded-2xl h-64 object-cover shadow-xl"
              />
              <img
                src={data.historia?.imagens?.[1]?.url || fallbackConteudo.historia.imagens[1].url}
                alt={data.historia?.imagens?.[1]?.descricao || "Imagem 2"}
                className="rounded-2xl h-64 object-cover mt-8 shadow-xl"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Valores */}
      <motion.section 
        className="py-20 bg-gray-50"
        {...fadeInUp}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary-500 font-semibold text-sm tracking-wider uppercase">
              Nossos Valores
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4">
              O que nos define
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Princípios que guiam nossa caminhada e nosso relacionamento com Deus e com o próximo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {valoresAtivos.map((valor) => {
              const Icon = resolveSobreIcon(valor.icon);
              return (
                <motion.div
                  key={valor.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-primary-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{valor.titulo}</h3>
                  <p className="text-gray-600">{valor.descricao}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Pastores */}
      <motion.section 
        className="py-20 bg-white"
        {...fadeInUp}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary-500 font-semibold text-sm tracking-wider uppercase">
              Nossa Liderança
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4">
              Pastores
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Homens e mulheres chamados por Deus para apascentar o rebanho
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastoresAtivos.map((pastor) => (
              <motion.div
                key={pastor.id}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <img
                  src={pastor.foto}
                  alt={pastor.nome}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{pastor.nome}</h3>
                  <p className="text-primary-500 font-medium mb-3">{pastor.cargo}</p>
                  <p className="text-gray-600 text-sm">{pastor.descricao}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Estatísticas */}
      <motion.section 
        className="py-20 bg-primary-500 text-white"
        {...fadeInUp}
      >
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estatisticasAtivas.map((stat) => {
              const Icon = resolveSobreIcon(stat.icon);
              return (
                <motion.div
                  key={stat.id}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <Icon className="text-4xl mx-auto mb-3 text-white/80" />
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.numero}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Onde estamos */}
      <motion.section 
        className="py-20 bg-white"
        {...fadeInUp}
      >
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-primary-500 font-semibold text-sm tracking-wider uppercase">
                Visite-nos
              </span>
              <h2 className="text-4xl font-bold mt-2 mb-4">
                Onde estamos
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Nossas portas estão abertas para receber você e sua família. Venha nos fazer uma visita!
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-gray-600">
                      {data.localizacao?.endereco?.rua}, {data.localizacao?.endereco?.numero}
                      {data.localizacao?.endereco?.bairro ? ` - ${data.localizacao.endereco.bairro}` : ""}
                      <br />
                      {data.localizacao?.endereco?.cidade}/{data.localizacao?.endereco?.estado} - CEP:{" "}
                      {data.localizacao?.endereco?.cep}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiClock className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Horários de Culto</h3>
                    {(data.localizacao?.horarios ?? []).map((h, idx) => (
                      <p key={`${h.dia}-${idx}`} className="text-gray-600">
                        {h.dia}: {(h.horarios ?? []).join(" • ")}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contato</h3>
                    <p className="text-gray-600">Telefone: {data.localizacao?.contato?.telefone}</p>
                    <p className="text-gray-600">Email: {data.localizacao?.contato?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src={data.localizacao?.mapa?.embed || fallbackConteudo.localizacao.mapa.embed}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                title="Mapa da Igreja"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      {data.cta?.ativo && (
        <motion.section className="py-20 bg-gray-50" {...fadeInUp}>
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.cta?.titulo}</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">{data.cta?.descricao}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={data.cta?.botao1?.link || "/contacto"}
                className="px-8 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold"
              >
                {data.cta?.botao1?.texto || "Entre em contato"}
              </a>
              <a
                href={data.cta?.botao2?.link || "/actividades"}
                className="px-8 py-4 border-2 border-primary-500 text-primary-500 rounded-xl hover:bg-primary-50 transition-colors font-semibold"
              >
                {data.cta?.botao2?.texto || "Conheça nossas atividades"}
              </a>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};
