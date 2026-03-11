// src/pages/Actividades/ActividadeDetalhe.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  FiCalendar, 
  FiMapPin, 
  FiUser, 
  FiClock,
  FiShare2,
  FiHeart,
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
  FiImage
} from "react-icons/fi";
import { 
  GiCalendar, 
  GiPartyPopper, 
  GiPrayer,  
  GiHeartBeats,
  GiFamilyHouse,
  GiDuration
} from "react-icons/gi";
import { LiaBibleSolid, LiaChairSolid } from "react-icons/lia";
import { GaleriaActividade } from "../../components/actividades/GaleriaActividade";

// Componente de Inscrição
const InscricaoForm = ({ actividade, onClose }: { actividade: any, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    idade: "",
    comoConheceu: "",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Enviar inscrição
      alert("Inscrição realizada com sucesso! Entraremos em contato em breve.");
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-primary">Inscrição</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiAlertCircle size={24} />
        </button>
      </div>

      {/* Progresso */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <span className="text-sm">Dados Pessoais</span>
        </div>
        <div className="flex-1 h-0.5 mx-2 bg-gray-200">
          <div className={`h-full bg-primary transition-all`} style={{ width: step === 1 ? '0%' : '100%' }} />
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className="text-sm">Confirmação</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone/WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade
              </label>
              <input
                type="number"
                value={formData.idade}
                onChange={(e) => setFormData({...formData, idade: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Como conheceu o evento?
              </label>
              <select
                value={formData.comoConheceu}
                onChange={(e) => setFormData({...formData, comoConheceu: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Selecione...</option>
                <option value="igreja">Igreja</option>
                <option value="redes">Redes Sociais</option>
                <option value="amigo">Amigo/Conhecido</option>
                <option value="site">Site</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Alguma necessidade especial? Acompanhante?"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">Quase lá!</h4>
            <p className="text-gray-600 mb-4">
              Verifique seus dados e confirme sua inscrição para {actividade.titulo}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 text-left mb-4">
              <p><strong>Nome:</strong> {formData.nome}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Telefone:</strong> {formData.telefone}</p>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Após a confirmação, enviaremos mais informações por e-mail/WhatsApp.
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {step === 1 ? 'Continuar' : 'Confirmar Inscrição'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export const ActividadeDetalhe = () => {
  const { id } = useParams();
  const [actividade, setActividade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInscricao, setShowInscricao] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

    const [activeTab, setActiveTab] = useState<'sobre' | 'programacao' | 'galeria'>('sobre');



  useEffect(() => {
    // Simular busca de dados
    setTimeout(() => {
      const item = {
        id: 1,
        titulo: "Conferência de Jovens 2024",
        descricao: "Três dias de louvor, palavra e comunhão para a juventude que busca um encontro genuíno com Deus. Teremos preletores convidados, banda de louvor, momentos de oração e muito mais.",
        tema: "Fogo e Unção",
        endereco: "Igreja Baluarte - Auditório Principal, Rua da Igreja, 123 - Centro",
        organizador: "Pr. João Santos",
        contactos: "(11) 98765-4321",
        email: "jovens@igrejabaluarte.com",
        tipo: "JOVENS",
        publico: "JOVENS",
        duracao: "MULTIPLOS_DIAS",
        dataPublicacao: "2024-01-05",
        dataEvento: "2024-03-01",
        dataFim: "2024-03-03",
        horaEvento: "20:00",
        imagem: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
        inscritos: 89,
        capacidade: 150,
        programacao: [
          { dia: "Sexta (01/03)", horario: "20:00", atividade: "Abertura e Louvor" },
          { dia: "Sexta (01/03)", horario: "21:00", atividade: "Mensagem: Fogo do Espírito" },
          { dia: "Sábado (02/03)", horario: "09:00", atividade: "Oficina: Liderança Jovem" },
          { dia: "Sábado (02/03)", horario: "15:00", atividade: "Tarde de Integração" },
          { dia: "Sábado (02/03)", horario: "20:00", atividade: "Culto de Avivamento" },
          { dia: "Domingo (03/03)", horario: "09:00", atividade: "Encerramento e Santa Ceia" }
        ],
        pregadores: [
          { nome: "Pr. Antônio Silva", tema: "A Unção do Jovem" },
          { nome: "Pra. Maria Oliveira", tema: "Propósito e Vocação" },
          { nome: "Pr. João Santos", tema: "Fogo que não se apaga" }
        ],
        requisitos: [
          "Idade entre 15 e 30 anos",
          "Bíblia e caderno",
          "Desejo de buscar a Deus"
        ],
        valor: "R$ 50,00 (inclui alimentação)",
        vagasRestantes: 150 - 89
      };

      setActividade(item);
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

  const TipoIcon = {
    JOVENS: GiHeartBeats,
    CULTO: GiPrayer,
    EVENTO: GiPartyPopper,
    ESCOLA: LiaBibleSolid,
    FAMILIA: GiFamilyHouse,
    LOUVOR: LiaChairSolid,
    ORACAO: GiPrayer
  }[actividade.tipo] || GiCalendar;

  const tipoColor = {
    JOVENS: "bg-green-500",
    CULTO: "bg-purple-500",
    EVENTO: "bg-pink-500",
    ESCOLA: "bg-blue-500",
    FAMILIA: "bg-amber-500",
    LOUVOR: "bg-indigo-500",
    ORACAO: "bg-red-500"
  }[actividade.tipo] || "bg-primary";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header com navegação */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/actividades"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <FiArrowLeft />
            Voltar para Actividades
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-lg transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-primary'
              }`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-primary rounded-lg transition-colors">
              <FiShare2 size={20} />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[400px] rounded-3xl overflow-hidden mb-8">
          <img
            src={actividade.imagem}
            alt={actividade.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className={`${tipoColor} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
                <TipoIcon size={12} />
                {actividade.tipo}
              </span>
              <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                {actividade.inscritos} inscritos
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{actividade.titulo}</h1>
            <p className="text-xl text-white/90 max-w-3xl">{actividade.tema}</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Sobre o evento</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {actividade.descricao}
              </p>

              {/* Info cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="text-primary text-xl mx-auto mb-2" />
                  <div className="text-sm font-medium">Data</div>
                  <div className="text-xs text-gray-500">
                    {new Date(actividade.dataEvento).toLocaleDateString('pt-BR')}
                    {actividade.dataFim && ` - ${new Date(actividade.dataFim).toLocaleDateString('pt-BR')}`}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiClock className="text-primary text-xl mx-auto mb-2" />
                  <div className="text-sm font-medium">Horário</div>
                  <div className="text-xs text-gray-500">{actividade.horaEvento}</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiUsers className="text-primary text-xl mx-auto mb-2" />
                  <div className="text-sm font-medium">Público</div>
                  <div className="text-xs text-gray-500">{actividade.publico}</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <GiDuration className="text-primary text-xl mx-auto mb-2" />
                  <div className="text-sm font-medium">Duração</div>
                  <div className="text-xs text-gray-500">{actividade.duracao}</div>
                </div>
              </div>
            </motion.div>


{/* Abas de navegação */}
<div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
  <div className="border-b border-gray-200">
    <nav className="flex">
      {[
        { id: 'sobre', label: 'Sobre', icon: FiCalendar },
        { id: 'programacao', label: 'Programação', icon: FiClock },
        { id: 'galeria', label: 'Galeria', icon: FiImage }
      ].map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeActividadeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        );
      })}
    </nav>
  </div>

  <div className="p-6">
    {activeTab === 'sobre' && (
      <div>
        <h2 className="text-2xl font-bold mb-4">Sobre o evento</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {actividade.descricao}
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <FiCalendar className="text-primary text-xl mx-auto mb-2" />
            <div className="text-sm font-medium">Data</div>
            <div className="text-xs text-gray-500">
              {new Date(actividade.dataEvento).toLocaleDateString('pt-BR')}
              {actividade.dataFim && ` - ${new Date(actividade.dataFim).toLocaleDateString('pt-BR')}`}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <FiClock className="text-primary text-xl mx-auto mb-2" />
            <div className="text-sm font-medium">Horário</div>
            <div className="text-xs text-gray-500">{actividade.horaEvento}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <FiUsers className="text-primary text-xl mx-auto mb-2" />
            <div className="text-sm font-medium">Público</div>
            <div className="text-xs text-gray-500">{actividade.publico}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <GiDuration className="text-primary text-xl mx-auto mb-2" />
            <div className="text-sm font-medium">Duração</div>
            <div className="text-xs text-gray-500">{actividade.duracao}</div>
          </div>
        </div>

        {/* Pregadores/Convidados */}
        {actividade.pregadores && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Pregadores Convidados</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {actividade.pregadores.map((pregador: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FiUser className="text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{pregador.nome}</div>
                    <div className="text-sm text-gray-500">{pregador.tema}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requisitos */}
        {actividade.requisitos && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Requisitos</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {actividade.requisitos.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}

    {activeTab === 'programacao' && (
      <div>
        <h2 className="text-2xl font-bold mb-4">Programação</h2>
        <div className="space-y-3">
          {actividade.programacao.map((item: any, index: number) => (
            <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-24 text-sm font-medium text-primary">{item.horario}</div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">{item.dia}</div>
                <div className="font-medium">{item.atividade}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'galeria' && (
      <GaleriaActividade activityId={parseInt(id || '0')} />
    )}
  </div>
</div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Card de inscrição */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Participe</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Vagas disponíveis</span>
                  <span className="font-semibold">{actividade.vagasRestantes} de {actividade.capacidade}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(actividade.inscritos / actividade.capacidade) * 100}%` }}
                  />
                </div>
              </div>

              {actividade.valor && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Investimento</span>
                  <div className="text-2xl font-bold text-primary">{actividade.valor}</div>
                </div>
              )}

              <button
                onClick={() => setShowInscricao(true)}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mb-3"
              >
                Fazer Inscrição
              </button>

              <button className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                <FiDownload />
                Baixar Programação
              </button>
            </div>

            {/* Localização */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiMapPin className="text-primary" />
                Local
              </h3>
              <p className="text-gray-600 text-sm mb-2">{actividade.endereco}</p>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(actividade.endereco)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Ver no mapa
              </a>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FiUser className="text-primary" />
                Organizador
              </h3>
              <p className="font-medium mb-2">{actividade.organizador}</p>
              
              <div className="space-y-2">
                <a href={`tel:${actividade.contactos}`} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                  <FiPhone size={14} />
                  <span className="text-sm">{actividade.contactos}</span>
                </a>
                {actividade.email && (
                  <a href={`mailto:${actividade.email}`} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <FiMail size={14} />
                    <span className="text-sm">{actividade.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Compartilhar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-3">Compartilhar</h3>
              <div className="flex gap-2">
                <button className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  WhatsApp
                </button>
                <button className="flex-1 p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
                  Facebook
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Modal de inscrição */}
      <AnimatePresence>
        {showInscricao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInscricao(false)}
          >
            <InscricaoForm actividade={actividade} onClose={() => setShowInscricao(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};