// src/pages/Actividades/ActividadesPage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FiCalendar, 
  FiMapPin, 
  FiUser, 
  FiClock,
  FiSearch,
  FiFilter,
  FiX,
  FiUsers,
  FiPhone,
  FiMail,
  FiChevronRight
} from "react-icons/fi";
import { 
  GiCalendar, 
  GiPartyPopper, 
  GiPrayer, 
  GiHeartBeats,
  GiFamilyHouse
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";
import { fadeInUp } from "../../utils/animation";
import { FaChair } from "react-icons/fa6";

// Tipos baseados nos seus Enums
const tipoEventoMap = {
  CULTO: { label: "Culto", icon: GiPrayer, color: "bg-purple-500" },
  EVENTO: { label: "Evento Especial", icon: GiPartyPopper, color: "bg-pink-500" },
  ESCOLA: { label: "Escola Bíblica", icon: LiaBibleSolid, color: "bg-blue-500" },
  JOVENS: { label: "Juventude", icon: GiHeartBeats, color: "bg-green-500" },
  FAMILIA: { label: "Família", icon: GiFamilyHouse, color: "bg-amber-500" },
  LOUVOR: { label: "Louvor", icon: FaChair, color: "bg-indigo-500" },
  ORACAO: { label: "Oração", icon: GiPrayer, color: "bg-red-500" },
};

const publicoMap = {
  TODOS: "Todos",
  JOVENS: "Jovens",
  ADULTOS: "Adultos",
  CRIANCAS: "Crianças",
  IDOSOS: "Idosos",
  MULHERES: "Mulheres",
  HOMENS: "Homens",
  CASAIS: "Casais"
};

const duracaoMap = {
  CURTA: "Até 2h",
  MEDIA: "2-4h",
  LONGA: "4-8h",
  EXTENDIDA: "Mais de 8h",
  MULTIPLOS_DIAS: "Múltiplos dias"
};

// Dados mockados
const actividadesMock = [
  {
    id: 1,
    titulo: "Culto de Celebração",
    descricao: "Venha adorar a Deus conosco em um culto de celebração e gratidão por todas as bênçãos recebidas.",
    tema: "Grandioso És Tu",
    endereco: "Rua da Igreja, 123 - Centro",
    organizador: "Pr. Antônio Silva",
    contactos: "(11) 1234-5678",
    tipo: "CULTO",
    publico: "TODOS",
    duracao: "CURTA",
    dataPublicacao: "2024-01-01",
    dataEvento: "2024-02-18",
    horaEvento: "19:30",
    imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    inscritos: 45,
    capacidade: 200
  },
  {
    id: 2,
    titulo: "Conferência de Jovens",
    descricao: "Três dias de louvor, palavra e comunhão para a juventude que busca um encontro genuíno com Deus.",
    tema: "Fogo e Unção",
    endereco: "Igreja Baluarte - Auditório Principal",
    organizador: "Pr. João Santos",
    contactos: "(11) 98765-4321",
    tipo: "JOVENS",
    publico: "JOVENS",
    duracao: "MULTIPLOS_DIAS",
    dataPublicacao: "2024-01-05",
    dataEvento: "2024-03-01",
    dataFim: "2024-03-03",
    horaEvento: "20:00",
    imagem: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
    inscritos: 89,
    capacidade: 150
  },
  {
    id: 3,
    titulo: "Escola Bíblica - Módulo 1",
    descricao: "Estudo sistemático da Bíblia, começando pelo Pentateuco. Excelente oportunidade para aprofundar o conhecimento da Palavra.",
    tema: "Gênesis a Deuteronômio",
    endereco: "Sala 3 - Templo Central",
    organizador: "Pb. Marcos Oliveira",
    contactos: "(11) 91234-5678",
    tipo: "ESCOLA",
    publico: "ADULTOS",
    duracao: "LONGA",
    dataPublicacao: "2024-01-10",
    dataEvento: "2024-02-20",
    horaEvento: "09:00",
    imagem: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    inscritos: 32,
    capacidade: 50
  },
  {
    id: 4,
    titulo: "Culto de Oração e Jejum",
    descricao: "Momento especial de consagração, oração e busca pela direção de Deus para nossas vidas.",
    tema: "Intimidade com Deus",
    endereco: "Igreja Baluarte",
    organizador: "Pra. Maria Oliveira",
    contactos: "(11) 99876-5432",
    tipo: "ORACAO",
    publico: "TODOS",
    duracao: "MEDIA",
    dataPublicacao: "2024-01-12",
    dataEvento: "2024-02-15",
    horaEvento: "07:00",
    imagem: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    inscritos: 67,
    capacidade: 100
  },
  {
    id: 5,
    titulo: "Encontro de Casais",
    descricao: "Um dia especial para casais fortalecerem seus relacionamentos à luz da Palavra de Deus.",
    tema: "Amor e Aliança",
    endereco: "Chácara Baluarte",
    organizador: "Pr. Antônio e Pra. Maria",
    contactos: "(11) 1234-5678",
    tipo: "FAMILIA",
    publico: "CASAIS",
    duracao: "LONGA",
    dataPublicacao: "2024-01-15",
    dataEvento: "2024-03-10",
    horaEvento: "08:00",
    imagem: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    inscritos: 28,
    capacidade: 40
  },
  {
    id: 6,
    titulo: "Louvorzão 2024",
    descricao: "Noite de adoração com vários ministérios da cidade. Será uma noite inesquecível de louvor e gratidão.",
    tema: "Exaltamos o Teu Nome",
    endereco: "Ginásio Municipal",
    organizador: "Ministério Baluarte",
    contactos: "(11) 95678-1234",
    tipo: "LOUVOR",
    publico: "TODOS",
    duracao: "MEDIA",
    dataPublicacao: "2024-01-18",
    dataEvento: "2024-03-25",
    horaEvento: "19:00",
    imagem: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80",
    inscritos: 234,
    capacidade: 500
  }
];

export const ActividadesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedPublico, setSelectedPublico] = useState<string | null>(null);
  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [actividades, setActividades] = useState(actividadesMock);
  const [viewMode, setViewMode] = useState<'grid' | 'lista'>('grid');

  // Filtrar actividades
  useEffect(() => {
    let filtered = actividadesMock;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organizador.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTipo) {
      filtered = filtered.filter(item => item.tipo === selectedTipo);
    }

    if (selectedPublico) {
      filtered = filtered.filter(item => item.publico === selectedPublico);
    }

    if (selectedMes) {
      filtered = filtered.filter(item => {
        const mes = new Date(item.dataEvento).getMonth().toString();
        return mes === selectedMes;
      });
    }

    setActividades(filtered);
  }, [searchTerm, selectedTipo, selectedPublico, selectedMes]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTipo(null);
    setSelectedPublico(null);
    setSelectedMes(null);
  };

  // Agrupar por mês
  const groupedByMonth = actividades.reduce((acc: any, item) => {
    const data = new Date(item.dataEvento);
    const mesAno = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!acc[mesAno]) acc[mesAno] = [];
    acc[mesAno].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Actividades & Eventos
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Participe da comunhão e cresça conosco
            </p>

            {/* Barra de pesquisa */}
            <div className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Pesquisar actividades por título, tema ou organizador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 container-custom">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all"
            >
              <FiFilter />
              <span>Filtros</span>
            </button>

            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
                }`}
              >
                <FiCalendar size={20} />
              </button>
              <button
                onClick={() => setViewMode('lista')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'lista' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
                }`}
              >
                <FiClock size={20} />
              </button>
            </div>
          </div>

          <p className="text-gray-600">
            {actividades.length} {actividades.length === 1 ? 'atividade encontrada' : 'atividades encontradas'}
          </p>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filtros</h3>
                {(searchTerm || selectedTipo || selectedPublico || selectedMes) && (
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:text-primary-dark text-sm flex items-center gap-1"
                  >
                    <FiX size={16} />
                    Limpar todos
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {/* Tipo */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Tipo de Actividade</h4>
                  <div className="space-y-2">
                    {Object.entries(tipoEventoMap).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTipo(selectedTipo === key ? null : key)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedTipo === key
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <value.icon size={16} />
                        <span>{value.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Público-alvo */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Público-alvo</h4>
                  <div className="space-y-2">
                    {Object.entries(publicoMap).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPublico(selectedPublico === key ? null : key)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPublico === key
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mês */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Mês</h4>
                  <div className="space-y-2">
                    {['Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'].map((mes, index) => (
                      <button
                        key={mes}
                        onClick={() => setSelectedMes(selectedMes === index.toString() ? null : index.toString())}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedMes === index.toString()
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {mes}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duração */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Duração</h4>
                  <div className="space-y-2">
                    {Object.entries(duracaoMap).map(([key, value]) => (
                      <button
                        key={key}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resultados */}
        {actividades.length === 0 ? (
          <motion.div
            className="text-center py-20 bg-white rounded-2xl shadow"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <FiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma actividade encontrada</h3>
            <p className="text-gray-500 mb-4">Tente buscar com outros termos ou limpar os filtros</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Limpar filtros
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          // Visualização em grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividades.map((actividade, index) => {
              const TipoIcon = tipoEventoMap[actividade.tipo as keyof typeof tipoEventoMap]?.icon || GiCalendar;
              const tipoColor = tipoEventoMap[actividade.tipo as keyof typeof tipoEventoMap]?.color || "bg-primary";
              
              return (
                <motion.div
                  key={actividade.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/actividades/${actividade.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                      {/* Imagem */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={actividade.imagem}
                          alt={actividade.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Badge de tipo */}
                        <div className={`absolute top-4 left-4 ${tipoColor} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                          <TipoIcon size={12} />
                          {actividade.tipo}
                        </div>

                        {/* Badge de capacidade */}
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                          {actividade.inscritos}/{actividade.capacidade} inscritos
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {actividade.titulo}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {actividade.descricao}
                        </p>

                        {/* Info */}
                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-primary" size={14} />
                            <span>
                              {new Date(actividade.dataEvento).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long'
                              })} • {actividade.horaEvento}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMapPin className="text-primary" size={14} />
                            <span className="truncate">{actividade.endereco}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-primary" size={14} />
                            <span>{publicoMap[actividade.publico as keyof typeof publicoMap]}</span>
                          </div>
                        </div>

                        {/* Organizador */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <FiUser className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500">{actividade.organizador}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Visualização em lista
          <div className="space-y-6">
            {Object.entries(groupedByMonth).map(([mes, items]: [string, any]) => (
              <div key={mes}>
                <h3 className="text-lg font-semibold text-primary mb-4">{mes}</h3>
                <div className="space-y-4">
                  {items.map((actividade: any) => {
                    const TipoIcon = tipoEventoMap[actividade.tipo as keyof typeof tipoEventoMap]?.icon || GiCalendar;
                    const tipoColor = tipoEventoMap[actividade.tipo as keyof typeof tipoEventoMap]?.color || "bg-primary";
                    
                    return (
                      <motion.div
                        key={actividade.id}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link to={`/actividades/${actividade.id}`}>
                          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4">
                            {/* Data */}
                            <div className="sm:w-24 text-center">
                              <div className="bg-primary/10 rounded-lg p-2">
                                <div className="text-2xl font-bold text-primary">
                                  {new Date(actividade.dataEvento).getDate()}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {new Date(actividade.dataEvento).toLocaleDateString('pt-BR', { month: 'short' })}
                                </div>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`${tipoColor} w-2 h-2 rounded-full`} />
                                    <span className="text-xs text-gray-500">{actividade.tipo}</span>
                                  </div>
                                  <h4 className="text-lg font-bold hover:text-primary transition-colors">
                                    {actividade.titulo}
                                  </h4>
                                </div>
                                <span className="text-sm text-gray-500">{actividade.horaEvento}</span>
                              </div>

                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {actividade.descricao}
                              </p>

                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FiMapPin size={12} />
                                  {actividade.endereco}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiUsers size={12} />
                                  {publicoMap[actividade.publico as keyof typeof publicoMap]}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiUser size={12} />
                                  {actividade.organizador}
                                </span>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="sm:w-24 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                {actividade.inscritos}/{actividade.capacidade}
                              </span>
                              <FiChevronRight className="text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
