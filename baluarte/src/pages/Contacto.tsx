// src/pages/Contacto/ContactoPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiHelpCircle
} from "react-icons/fi";
import { 
  GiPhone,
  GiPositionMarker,
  GiChurch
} from "react-icons/gi";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { LiaWhatsapp } from "react-icons/lia";
import { fadeInUp } from "../utils/animation";

export const ContactoPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simular envio
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            Fale Conosco
          </motion.h1>
          <motion.p
            className="text-xl text-white/90 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            Estamos aqui para ouvir você, orar por suas necessidades e responder suas dúvidas
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna da esquerda - Informações de Contato */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {/* Card de Informações */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiHelpCircle className="text-primary" />
                Informações de Contato
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <a href="tel:1133334444" className="font-medium hover:text-primary transition-colors">
                      (11) 3333-4444
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <LiaWhatsapp className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">
                      (11) 99999-9999
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMail className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">E-mail</p>
                    <a href="mailto:contato@igrejabaluarte.com" className="font-medium hover:text-primary transition-colors">
                      contato@igrejabaluarte.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="font-medium">
                      Rua da Igreja, 123 - Centro<br />
                      Cidade/UF - CEP: 12345-678
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Horários */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiClock className="text-primary" />
                Horários de Culto
              </h3>

              <div className="space-y-3">
                {[
                  { dia: "Domingo", horarios: ["09:00 - Escola Bíblica", "19:00 - Culto de Celebração"] },
                  { dia: "Quarta-feira", horarios: ["20:00 - Culto de Oração"] },
                  { dia: "Sábado", horarios: ["19:00 - Ensaio do Louvor"] }
                ].map((item, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <p className="font-semibold text-primary">{item.dia}</p>
                    {item.horarios.map((horario, idx) => (
                      <p key={idx} className="text-sm text-gray-600">{horario}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Card de Redes Sociais */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <GiChurch className="text-primary" />
                Redes Sociais
              </h3>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: FaFacebook, href: "https://facebook.com", color: "bg-blue-600" },
                  { icon: FaInstagram, href: "https://instagram.com", color: "bg-pink-600" },
                  { icon: FaYoutube, href: "https://youtube.com", color: "bg-red-600" },
                  { icon: FaTwitter, href: "https://twitter.com", color: "bg-blue-400" }
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} aspect-square rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform`}
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Coluna da direita - Formulário */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone/WhatsApp
                    </label>
                    <div className="relative">
                      <GiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  {/* Assunto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <div className="relative">
                      <FiHelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        required
                        value={formData.assunto}
                        onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none bg-white"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="duvida">Dúvida</option>
                        <option value="oracao">Pedido de Oração</option>
                        <option value="conselho">Aconselhamento</option>
                        <option value="visita">Quero visitar a igreja</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      required
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      rows={6}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Digite sua mensagem, pedido de oração ou dúvida..."
                    />
                  </div>
                </div>

                {/* Botão de envio */}
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <FiCheckCircle className="text-green-300" />
                      Mensagem Enviada!
                    </>
                  ) : (
                    <>
                      Enviar Mensagem
                      <FiSend className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Mensagem de sucesso/erro */}
                {formStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2"
                  >
                    <FiCheckCircle />
                    Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.
                  </motion.div>
                )}

                {formStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"
                  >
                    <FiAlertCircle />
                    Ocorreu um erro ao enviar. Por favor, tente novamente.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Mapa */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <GiPositionMarker className="text-primary" />
            Nossa Localização
          </h3>
          
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
            {/* Aqui você pode incorporar um mapa do Google Maps ou outra API */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197496135465!2d-46.6541234!3d-23.5641234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUxLjAiUyA0NsKwMzknMTUuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
              title="Mapa da Igreja"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <a
              href="https://maps.google.com/?q=Igreja+Baluarte"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              <GiPositionMarker />
              Abrir no Google Maps
            </a>
            <a
              href="https://waze.com/ul?ll=-23.5641234,-46.6541234&navigate=yes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors"
            >
              <GiPositionMarker />
              Abrir no Waze
            </a>
          </div>
        </motion.div>

        {/* FAQ Rápido */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiHelpCircle className="text-primary" />
            Perguntas Frequentes
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                pergunta: "Posso visitar a igreja?",
                resposta: "Sim! Nossas portas estão abertas para todos. Confira nossos horários de culto."
              },
              {
                pergunta: "Como faço para ser membro?",
                resposta: "Participe dos cultos e procure nossa secretaria após as celebrações."
              },
              {
                pergunta: "Aceitam crianças?",
                resposta: "Sim! Temos ministério infantil durante todos os cultos."
              }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-primary mb-2">{item.pergunta}</h4>
                <p className="text-sm text-gray-600">{item.resposta}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Precisa de oração agora?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Nossa equipe de intercessão está pronta para orar com você
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                <LiaWhatsapp size={20} />
                Pedir Oração no WhatsApp
              </a>
              <a
                href="tel:1133334444"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                <FiPhone size={20} />
                Ligar Agora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
