// src/pages/Actividades/ActividadesPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiClock,
  FiEye,
  FiMessageCircle,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUsers
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
import { useNavigate } from "react-router-dom";

// Enums
export enum TipoActividade {
  Culto = 'Culto',
  Evento = 'Evento',
  Escola = 'Escola',
  Jovens = 'Jovens',
  Familia = 'Família',
  Louvor = 'Louvor',
  Oracao = 'Oração'
}

export enum PublicoActividade {
  Todos = 'Todos',
  Jovens = 'Jovens',
  Adultos = 'Adultos',
  Crianças = 'Crianças',
  Idosos = 'Idosos',
  Mulheres = 'Mulheres',
  Homens = 'Homens',
  Casais = 'Casais'
}

export enum DuracaoActividade {
  Mensal = 'Mensal',
  Anual = 'Anual',
  Projecto = 'Projecto'
}

// Interface da Actividade
interface Actividade {
  id: string;
  titulo: string;
  descricao: string;
  tema: string;
  tipo: TipoActividade;
  publico: PublicoActividade;
  duracao: DuracaoActividade;
  dataInicio: string;
  dataFim?: string;
  horario: string;
  endereco: string;
  organizador: string;
  contato: string;
  email?: string;
  imagem: string;
  visualizacoes: number;
  comentarios: number;
  inscritos: number;
  capacidade?: number;
  tags: string[];
}

// Dados mockados
const actividadesMock: Actividade[] = [
  {
    id: '1',
    titulo: "Culto de Celebração",
    descricao: "Venha adorar a Deus conosco em um culto de celebração e gratidão por todas as bênçãos recebidas.",
    tema: "Grandioso És Tu",
    tipo: TipoActividade.Culto,
    publico: PublicoActividade.Todos,
    duracao: DuracaoActividade.Mensal,
    dataInicio: "2024-03-17",
    horario: "19:00",
    endereco: "Templo Principal - Rua da Igreja, 123",
    organizador: "Pr. Antônio Silva",
    contato: "(11) 99999-9999",
    email: "secretaria@igrejabaluarte.com",
    imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    visualizacoes: 1234,
    comentarios: 45,
    inscritos: 156,
    capacidade: 200,
    tags: ["culto", "domingo", "adoração"]
  },
  {
    id: '2',
    titulo: "Conferência de Jovens",
    descricao: "Três dias de louvor, palavra e comunhão para a juventude que busca um encontro genuíno com Deus.",
    tema: "Fogo e Unção",
    tipo: TipoActividade.Jovens,
    publico: PublicoActividade.Jovens,
    duracao: DuracaoActividade.Anual,
    dataInicio: "2024-03-22",
    dataFim: "2024-03-24",
    horario: "20:00",
    endereco: "Auditório Principal",
    organizador: "Pr. João Santos",
    contato: "(11) 98888-8888",
    imagem: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
    visualizacoes: 2341,
    comentarios: 89,
    inscritos: 234,
    capacidade: 300,
    tags: ["jovens", "conferência", "avivamento"]
  },
  {
    id: '3',
    titulo: "Escola Bíblica",
    descricao: "Estudo sistemático da Bíblia, começando pelo livro de Romanos.",
    tema: "Romanos - O Evangelho da Graça",
    tipo: TipoActividade.Escola,
    publico: PublicoActividade.Adultos,
    duracao: DuracaoActividade.Projecto,
    dataInicio: "2024-03-20",
    horario: "09:00",
    endereco: "Sala 3 - Templo Central",
    organizador: "Pb. Marcos Oliveira",
    contato: "(11) 97777-7777",
    imagem: "https://images.unsplash.com/photo-1503593245033-a040be3f3c82?auto=format&fit=crop&w=800&q=80",
    visualizacoes: 856,
    comentarios: 23,
    inscritos: 45,
    capacidade: 50,
    tags: ["estudo", "bíblico", "romanosc"]
  },
  {
    id: '4',
    titulo: "Culto de Oração",
    descricao: "Momento especial de consagração e oração por todas as necessidades.",
    tema: "Intimidade com Deus",
    tipo: TipoActividade.Oracao,
    publico: PublicoActividade.Todos,
    duracao: DuracaoActividade.Mensal,
    dataInicio: "2024-03-19",
    horario: "07:00",
    endereco: "Capela - Templo Central",
    organizador: "Pra. Maria Oliveira",
    contato: "(11) 96666-6666",
    imagem: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    visualizacoes: 567,
    comentarios: 12,
    inscritos: 67,
    capacidade: 100,
    tags: ["oração", "intercessão", "jejum"]
  },
  {
    id: '5',
    titulo: "Louvorzão 2024",
    descricao: "Noite de adoração com vários ministérios da cidade.",
    tema: "Exaltamos o Teu Nome",
    tipo: TipoActividade.Louvor,
    publico: PublicoActividade.Todos,
    duracao: DuracaoActividade.Anual,
    dataInicio: "2024-03-25",
    horario: "19:30",
    endereco: "Ginásio Municipal",
    organizador: "Ministério Baluarte",
    contato: "(11) 95555-5555",
    imagem: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80",
    visualizacoes: 3456,
    comentarios: 156,
    inscritos: 456,
    capacidade: 1000,
    tags: ["louvor", "adoração", "música"]
  },
  {
    id: '6',
    titulo: "Encontro de Casais",
    descricao: "Um dia especial para casais fortalecerem seus relacionamentos à luz da Palavra de Deus.",
    tema: "Amor e Aliança",
    tipo: TipoActividade.Familia,
    publico: PublicoActividade.Casais,
    duracao: DuracaoActividade.Projecto,
    dataInicio: "2024-03-30",
    horario: "08:00",
    endereco: "Chácara Baluarte",
    organizador: "Pr. Antônio e Pra. Maria",
    contato: "(11) 94444-4444",
    imagem: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    visualizacoes: 789,
    comentarios: 34,
    inscritos: 56,
    capacidade: 80,
    tags: ["casais", "família", "relacionamento"]
  }
];

// Mapeamento de tipos para cores e ícones
const tipoConfig: Record<TipoActividade, { icon: any; cor: string }> = {
  [TipoActividade.Culto]: { icon: GiPrayer, cor: "bg-purple-500" },
  [TipoActividade.Evento]: { icon: GiPartyPopper, cor: "bg-pink-500" },
  [TipoActividade.Escola]: { icon: LiaBibleSolid, cor: "bg-blue-500" },
  [TipoActividade.Jovens]: { icon: GiHeartBeats, cor: "bg-green-500" },
  [TipoActividade.Familia]: { icon: GiFamilyHouse, cor: "bg-amber-500" },
  [TipoActividade.Louvor]: { icon: LiaChairSolid, cor: "bg-indigo-500" },
  [TipoActividade.Oracao]: { icon: GiPrayer, cor: "bg-red-500" },
};

// Modal de Actividade
const ModalActividade = ({ 
  actividade, 
  onClose, 
  onSave 
}: { 
  actividade?: Actividade; 
  onClose: () => void; 
  onSave: (actividade: Omit<Actividade, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState({
    titulo: actividade?.titulo || '',
    descricao: actividade?.descricao || '',
    tema: actividade?.tema || '',
    tipo: actividade?.tipo || TipoActividade.Culto,
    publico: actividade?.publico || PublicoActividade.Todos,
    duracao: actividade?.duracao || DuracaoActividade.Mensal,
    dataInicio: actividade?.dataInicio || new Date().toISOString().split('T')[0],
    dataFim: actividade?.dataFim || '',
    horario: actividade?.horario || '19:00',
    endereco: actividade?.endereco || '',
    organizador: actividade?.organizador || '',
    contato: actividade?.contato || '',
    email: actividade?.email || '',
    imagem: actividade?.imagem || '',
    capacidade: actividade?.capacidade?.toString() || '',
    tags: actividade?.tags?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      capacidade: formData.capacidade ? parseInt(formData.capacidade) : undefined,
      dataFim: formData.dataFim || undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      visualizacoes: actividade?.visualizacoes || 0,
      comentarios: actividade?.comentarios || 0,
      inscritos: actividade?.inscritos || 0
    } as any);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GiCalendar className="text-primary-500" />
              {actividade ? 'Editar Actividade' : 'Nova Actividade'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto h-[70vh]">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Actividade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: Conferência de Jovens"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tema}
                    onChange={(e) => setFormData({...formData, tema: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: Fogo e Unção"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    required
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Descreva a actividade..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Actividade *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as TipoActividade})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {Object.values(TipoActividade).map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração *
                    </label>
                    <select
                      required
                      value={formData.duracao}
                      onChange={(e) => setFormData({...formData, duracao: e.target.value as DuracaoActividade})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      {Object.values(DuracaoActividade).map((dur) => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Público-alvo *
                    </label>
                    <select
                      required
                      value={formData.publico}
                      onChange={(e) => setFormData({...formData, publico: e.target.value as PublicoActividade})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      {Object.values(PublicoActividade).map((pub) => (
                        <option key={pub} value={pub}>{pub}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Início *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Fim
                    </label>
                    <input
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.horario}
                    onChange={(e) => setFormData({...formData, horario: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: 19:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço/Local *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: Templo Principal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizador/Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizador}
                    onChange={(e) => setFormData({...formData, organizador: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Ex: Pr. Antônio Silva"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contato *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contato}
                      onChange={(e) => setFormData({...formData, contato: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imagem}
                    onChange={(e) => setFormData({...formData, imagem: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  {formData.imagem && (
                    <img
                      src={formData.imagem}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Imagem+inválida')}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidade (opcional)
                    </label>
                    <input
                      type="number"
                      value={formData.capacidade}
                      onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="Ex: 200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="culto, jovem, oração"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                {actividade ? 'Salvar Alterações' : 'Criar Actividade'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Card de Actividade (simples, como pedido)
const ActividadeCard = ({ 
  actividade, 
  onEdit, 
  onDelete,
  onDetail
}: { 
  actividade: Actividade; 
  onEdit: (actividade: Actividade) => void;
  onDelete: (id: string) => void;
  onDetail: (id: string) => void;
}) => {
  const config = tipoConfig[actividade.tipo];
  const Icon = config.icon;
    
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={actividade.imagem}
          alt={actividade.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge de tipo */}
        <div className={`absolute top-4 left-4 ${config.cor} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg`}>
          <Icon size={12} />
          {actividade.tipo}
        </div>

        {/* Badge de duração */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
          <GiDuration size={12} />
          {actividade.duracao}
        </div>

        {/* Ações */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(actividade)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEdit2 size={14} />
          </button>
           <button
            onClick={() => onDetail(actividade.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-primary-500 shadow-lg"
          >
            <FiEye size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir esta actividade?')) {
                onDelete(actividade.id);
              }
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-red-500 shadow-lg"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1 group-hover:text-primary-500 transition-colors">
          {actividade.titulo}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{actividade.tema}</p>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {actividade.descricao}
        </p>

        {/* Info rápida */}
        <div className="space-y-2 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-primary-400" size={14} />
            <span>
              {new Date(actividade.dataInicio).toLocaleDateString('pt-BR')}
              {actividade.dataFim && ` - ${new Date(actividade.dataFim).toLocaleDateString('pt-BR')}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-primary-400" size={14} />
            <span>{actividade.horario}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-primary-400" size={14} />
            <span className="truncate">{actividade.endereco}</span>
          </div>
        </div>

        {/* Organizador e público */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <FiUser size={12} />
            {actividade.organizador.split(' ')[0]}
          </span>
          <span className="flex items-center gap-1">
            <FiUsers size={12} />
            {actividade.publico}
          </span>
        </div>

        {/* Estatísticas e tags */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiEye size={12} />
              {actividade.visualizacoes}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiMessageCircle size={12} />
              {actividade.comentarios}
            </span>
          </div>

          <div className="flex gap-1">
            {actividade.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Capacidade (se houver) */}
        {actividade.capacidade && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Inscritos</span>
              <span className="font-medium">{actividade.inscritos}/{actividade.capacidade}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${(actividade.inscritos / actividade.capacidade) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Componente Principal
export const ActividadesPageAdmin = () => {
  const [actividades, setActividades] = useState<Actividade[]>(actividadesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<TipoActividade | null>(null);
  const [selectedDuracao, setSelectedDuracao] = useState<DuracaoActividade | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingActividade, setEditingActividade] = useState<Actividade | undefined>();
    const navigate=useNavigate()
  // Filtrar actividades
  const filteredActividades = actividades.filter(act => {
    const matchesSearch = searchTerm === "" || 
      act.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.organizador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTipo = !selectedTipo || act.tipo === selectedTipo;
    const matchesDuracao = !selectedDuracao || act.duracao === selectedDuracao;

    return matchesSearch && matchesTipo && matchesDuracao;
  });

  const handleSave = (novaActividade: Omit<Actividade, 'id'>) => {
    if (editingActividade) {
      // Editar
      setActividades(actividades.map(a => 
        a.id === editingActividade.id ? { ...novaActividade, id: a.id } as Actividade : a
      ));
    } else {
      // Criar
      const actividade: Actividade = {
        ...novaActividade,
        id: Math.random().toString(36).substr(2, 9),
      } as Actividade;
      setActividades([actividade, ...actividades]);
    }
    setEditingActividade(undefined);
  };

  const handleEdit = (actividade: Actividade) => {
    setEditingActividade(actividade);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setActividades(actividades.filter(a => a.id !== id));
  };

  const handleDetail = (id: string) => {
    navigate("/admin/actividades/"+id)
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Grid decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Actividades
            </h1>
            <p className="text-gray-500">
              Gerencie todas as actividades e eventos da igreja
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingActividade(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Nova Actividade
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtro por tipo */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <select
                value={selectedTipo || ''}
                onChange={(e) => setSelectedTipo(e.target.value as TipoActividade || null)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">Todos os tipos</option>
                {Object.values(TipoActividade).map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Filtro por duração */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Duração</label>
              <select
                value={selectedDuracao || ''}
                onChange={(e) => setSelectedDuracao(e.target.value as DuracaoActividade || null)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">Todas as durações</option>
                {Object.values(DuracaoActividade).map((dur) => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredActividades.length} {filteredActividades.length === 1 ? 'actividade encontrada' : 'actividades encontradas'}
          </div>
        </div>

        {/* Grid de Actividades */}
        {filteredActividades.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <GiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma actividade encontrada</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo || selectedDuracao 
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Comece criando sua primeira actividade!'}
            </p>
            {(searchTerm || selectedTipo || selectedDuracao) ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTipo(null);
                  setSelectedDuracao(null);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingActividade(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Criar Primeira Actividade
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredActividades.map((actividade) => (
                <ActividadeCard
                  key={actividade.id}
                  actividade={actividade}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDetail={handleDetail}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Actividade */}
      <AnimatePresence>
        {showModal && (
          <ModalActividade
            actividade={editingActividade}
            onClose={() => {
              setShowModal(false);
              setEditingActividade(undefined);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};