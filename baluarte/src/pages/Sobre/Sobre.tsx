// src/pages/Sobre/SobrePage.tsx
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

export const SobrePage = () => {
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
                Conheça nossa história, valores e o propósito que Deus nos deu
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
                Uma caminhada de fé desde 2009
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                A Igreja Baluarte nasceu do sonho de um grupo de irmãos que desejavam ver vidas transformadas pelo poder do Evangelho. Em 15 de março de 2009, realizamos nosso primeiro culto com apenas 12 pessoas em uma sala alugada.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ao longo dos anos, Deus nos permitiu crescer e hoje somos uma comunidade de mais de 500 membros, com diversas atividades e ministérios que alcançam nossa cidade e além. Nossa sede própria foi conquistada em 2015, um marco importante na nossa jornada.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Mas mais que números, celebramos vidas transformadas, famílias restauradas e o amor de Deus sendo derramado sobre todos que passam por aqui.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80"
                alt="Primeiro culto"
                className="rounded-2xl h-64 object-cover shadow-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80"
                alt="Igreja hoje"
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
            {[
              {
                icon: LiaBibleSolid,
                titulo: "Fundamento na Palavra",
                descricao: "A Bíblia é nossa única regra de fé e prática. Tudo o que fazemos está baseado nas Escrituras."
              },
              {
                icon: GiPrayer,
                titulo: "Vida de Oração",
                descricao: "Cremos no poder da oração e buscamos uma vida de intimidade com Deus através dela."
              },
              {
                icon: GiHeartBeats,
                titulo: "Amor ao Próximo",
                descricao: "O amor é nossa marca. Amamos a Deus sobre todas as coisas e ao próximo como a nós mesmos."
              },
              {
                icon: GiFamilyHouse,
                titulo: "Família",
                descricao: "Valorizamos a família como instituição divina e base para uma sociedade saudável."
              },
              {
                icon: GiChurch,
                titulo: "Comunhão",
                descricao: "Não fomos feitos para viver sozinhos. A comunhão entre os irmãos é essencial."
              },
              {
                icon: FiHeart,
                titulo: "Excelência",
                descricao: "Tudo o que fazemos, fazemos com excelência, como para o Senhor."
              }
            ].map((valor, index) => {
              const Icon = valor.icon;
              return (
                <motion.div
                  key={index}
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
            {[
              {
                nome: "Pr. Antônio Silva",
                cargo: "Pastor Presidente",
                foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
                descricao: "Pastor há 20 anos, formado em Teologia pelo Seminário Teológico Batista do Sul. Casado com Pra. Maria e pai de 3 filhos."
              },
              {
                nome: "Pra. Maria Oliveira",
                cargo: "Pastora Adjunta",
                foto: "https://images.unsplash.com/photo-1494790108777-9f3e9b8f0b9e?auto=format&fit=crop&w=400&q=80",
                descricao: "Especialista em Aconselhamento Bíblico e líder do ministério de oração. Casada com Pr. Antônio."
              },
              {
                nome: "Pr. João Santos",
                cargo: "Pastor de Jovens",
                foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                descricao: "Líder da juventude há 8 anos, formado em Comunicação Social e apaixonado por ver jovens no centro da vontade de Deus."
              }
            ].map((pastor, index) => (
              <motion.div
                key={index}
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
            {[
              { numero: "15+", label: "Anos de história", icon: FiCalendar },
              { numero: "500+", label: "Membros", icon: FiUsers },
              { numero: "30+", label: "Ministérios", icon: GiPrayer },
              { numero: "1000+", label: "Vidas alcançadas", icon: FiHeart }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
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
                    <p className="text-gray-600">Rua da Igreja, 123 - Centro<br />São Paulo/SP - CEP: 12345-678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiClock className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Horários de Culto</h3>
                    <p className="text-gray-600">Domingo: 9h (Escola Bíblica) e 19h (Culto)</p>
                    <p className="text-gray-600">Quarta-feira: 20h (Culto de Oração)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contato</h3>
                    <p className="text-gray-600">Telefone: (11) 3333-4444</p>
                    <p className="text-gray-600">Email: contato@igrejabaluarte.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197496135465!2d-46.6541234!3d-23.5641234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUxLjAiUyA0NsKwMzknMTUuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
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
      <motion.section 
        className="py-20 bg-gray-50"
        {...fadeInUp}
      >
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faça parte desta história
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Venha nos conhecer, crescer conosco e fazer parte da família Baluarte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="px-8 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold"
            >
              Entre em contato
            </a>
            <a
              href="/actividades"
              className="px-8 py-4 border-2 border-primary-500 text-primary-500 rounded-xl hover:bg-primary-50 transition-colors font-semibold"
            >
              Conheça nossas atividades
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};