// src/pages/Dashboard/DashboardPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiUsers, 
  FiEye, 
  FiHeart, 
  FiCalendar,
  FiVideo,
  FiBookOpen,
  FiDownload,
  FiShare2,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreHorizontal,
  FiClock,
  FiUserPlus,
  FiMessageCircle
} from "react-icons/fi";
import { 
  GiGrowth
} from "react-icons/gi";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Sector
} from 'recharts';

// Dados mockados para os gráficos
const dadosVisitas = [
  { mes: 'Jan', visitas: 1200, usuarios: 800 },
  { mes: 'Fev', visitas: 1350, usuarios: 950 },
  { mes: 'Mar', visitas: 1500, usuarios: 1100 },
  { mes: 'Abr', visitas: 1800, usuarios: 1300 },
  { mes: 'Mai', visitas: 2200, usuarios: 1600 },
  { mes: 'Jun', visitas: 2500, usuarios: 1900 },
];

const dadosConteudo = [
  { nome: 'Artigos', valor: 45, cor: '#CB2020' },
  { nome: 'Vídeos', valor: 32, cor: '#E64D4D' },
  { nome: 'Áudios', valor: 28, cor: '#F97272' },
  { nome: 'Eventos', valor: 15, cor: '#FB9A9A' },
];

const dadosEngajamento = [
  { dia: 'Seg', comentarios: 45, curtidas: 120, compartilhamentos: 30 },
  { dia: 'Ter', comentarios: 52, curtidas: 145, compartilhamentos: 35 },
  { dia: 'Qua', comentarios: 48, curtidas: 138, compartilhamentos: 32 },
  { dia: 'Qui', comentarios: 70, curtidas: 210, compartilhamentos: 55 },
  { dia: 'Sex', comentarios: 85, curtidas: 280, compartilhamentos: 72 },
  { dia: 'Sáb', comentarios: 95, curtidas: 320, compartilhamentos: 88 },
  { dia: 'Dom', comentarios: 120, curtidas: 450, compartilhamentos: 120 },
];

const resumoEngajamento = [
  { label: 'Média de Comentários', valor: '69', tendencia: '+8% vs semana passada' },
  { label: 'Média de Curtidas', valor: '210', tendencia: '+4% vs semana passada' },
  { label: 'Compartilhamentos', valor: '59', tendencia: '+11% vs semana passada' },
];

const dadosAtividadesRecentes = [
  {
    id: 1,
    tipo: 'inscricao',
    usuario: 'João Silva',
    acao: 'inscreveu-se em',
    alvo: 'Conferência de Jovens',
    hora: '5 min atrás',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    tipo: 'comentario',
    usuario: 'Maria Oliveira',
    acao: 'comentou em',
    alvo: 'Artigo: A Soberania de Deus',
    hora: '15 min atrás',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    tipo: 'curtida',
    usuario: 'Pedro Santos',
    acao: 'curtiu',
    alvo: 'Vídeo: Culto de Domingo',
    hora: '25 min atrás',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 4,
    tipo: 'compartilhamento',
    usuario: 'Ana Carolina',
    acao: 'compartilhou',
    alvo: 'Podcast: Juventude e Fé',
    hora: '45 min atrás',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: 5,
    tipo: 'novo_membro',
    usuario: 'Lucas Mendes',
    acao: 'tornou-se membro',
    alvo: 'da igreja',
    hora: '1h atrás',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }
];

const dadosCrescimento = [
  { mes: 'Jan', membros: 320 },
  { mes: 'Fev', membros: 345 },
  { mes: 'Mar', membros: 370 },
  { mes: 'Abr', membros: 405 },
  { mes: 'Mai', membros: 458 },
  { mes: 'Jun', membros: 512 },
];

// Componente de Card Estatístico
const StatCard = ({ 
  titulo, 
  valor, 
  icone: Icon, 
  variacao, 
  cor = 'primary',
  descricao 
}: { 
  titulo: string; 
  valor: string | number; 
  icone: any; 
  variacao?: { valor: number; positiva: boolean };
  cor?: string;
  descricao?: string;
}) => {
  const cores = {
    primary: 'bg-primary-500/20 text-primary-600',
    green: 'bg-green-500/20 text-green-600',
    blue: 'bg-blue-500/20 text-blue-600',
    orange: 'bg-orange-500/20 text-orange-600',
    purple: 'bg-purple-500/20 text-purple-600',
    
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">{titulo}</p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{valor}</h3>
          {descricao && (
            <p className="text-xs text-gray-400 mt-1 dark:text-gray-400">{descricao}</p>
          )}
        </div>
        <div className={`w-10 h-10 ${cores[cor as keyof typeof cores]} rounded-xl flex items-center justify-center  `}>
          <Icon size={20} />
        </div>
      </div>
      
      {variacao && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`flex items-center gap-1 text-sm ${
            variacao.positiva ? 'text-green-600' : 'text-red-600'
          }`}>
            {variacao.positiva ? <FiTrendingUp /> : <FiTrendingDown />}
            {variacao.valor}%
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">vs mês anterior</span>
        </div>
      )}
    </motion.div>
  );
};

// Componente de Gráfico de Visitas
const GraficoVisitas = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Visitas ao Site</h3>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
          <option>Últimos 6 meses</option>
          <option>Último ano</option>
          <option>Último mês</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={dadosVisitas}>
          <defs>
            <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CB2020" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#CB2020" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="visitas" 
            stroke="#CB2020" 
            fillOpacity={1} 
            fill="url(#colorVisitas)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de Gráfico de Pizza
const GraficoConteudo = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Distribuição de Conteúdo</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={(props: any) => {
              const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
              return (
                <g>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                  />
                  <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill="#333" className="text-sm font-bold">
                    {payload.nome}
                  </text>
                  <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#666" className="text-xs">
                    {value} itens ({(percent * 100).toFixed(0)}%)
                  </text>
                </g>
              );
            }}
            data={dadosConteudo}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="valor"
            onMouseEnter={onPieEnter}
          >
            {dadosConteudo.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {dadosConteudo.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }} />
            <span className="text-gray-600 dark:text-gray-300">{item.nome}</span>
            <span className="font-semibold ml-auto text-gray-800 dark:text-gray-100">{item.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Engajamento Diário
const GraficoEngajamento = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Engajamento Diário</h3>
      
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dadosEngajamento}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="curtidas" fill="#CB2020" radius={[4, 4, 0, 0]} />
          <Bar dataKey="comentarios" fill="#F97272" radius={[4, 4, 0, 0]} />
          <Bar dataKey="compartilhamentos" fill="#FB9A9A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resumoEngajamento.map((stat) => (
          <div key={stat.label} className="flex flex-col bg-gray-50 rounded-xl p-4 border border-gray-100 dark:bg-gray-900/70 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">{stat.valor}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{stat.tendencia}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Crescimento de Membros
const GraficoMembros = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Crescimento de Membros</h3>
      
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dadosCrescimento}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="membros" 
            stroke="#CB2020" 
            strokeWidth={3}
            dot={{ fill: '#CB2020', r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de Atividades Recentes
const AtividadesRecentes = () => {
  const getIcon = (tipo: string) => {
    switch(tipo) {
      case 'inscricao': return <FiUserPlus className="text-blue-500" />;
      case 'comentario': return <FiMessageCircle className="text-green-500" />;
      case 'curtida': return <FiHeart className="text-red-500" />;
      case 'compartilhamento': return <FiShare2 className="text-purple-500" />;
      case 'novo_membro': return <FiUsers className="text-primary-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Atividades Recentes</h3>
        <button className="text-primary-500 text-sm hover:underline">Ver todas</button>
      </div>

      <div className="space-y-4">
        {dadosAtividadesRecentes.map((atividade) => (
          <motion.div
            key={atividade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
          >
            <img
              src={atividade.avatar}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{atividade.usuario}</span>
                {' '}{atividade.acao}{' '}
                <span className="text-primary-500 font-medium">{atividade.alvo}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">{atividade.hora}</p>
            </div>
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
              {getIcon(atividade.tipo)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Componente de Ações Rápidas
const AcoesRapidas = () => {
  const acoes = [
    { icone: FiBookOpen, label: 'Novo Artigo', cor: 'primary' },
    { icone: FiVideo, label: 'Novo Vídeo', cor: 'blue' },
    { icone: FiCalendar, label: 'Novo Evento', cor: 'green' },
    { icone: FiUsers, label: 'Nova Campanha', cor: 'purple' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Ações Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {acoes.map((acao, index) => {
          const Icon = acao.icone;
          const cores = {
            primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-200 dark:hover:bg-primary-500/20',
            blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20',
            green: 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-200 dark:hover:bg-green-500/20',
            purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-200 dark:hover:bg-purple-500/20'
          };
          
          return (
          <button
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${cores[acao.cor as keyof typeof cores]}`}
            type="button"
          >
              <Icon size={24} className="mb-2" />
              <span className="text-xs font-medium">{acao.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Componente de Metas
const Metas = () => {
  const metas = [
    { titulo: 'Novos Membros', atual: 45, meta: 60, cor: '#CB2020' },
    { titulo: 'Artigos Publicados', atual: 28, meta: 40, cor: '#E64D4D' },
    { titulo: 'Eventos Realizados', atual: 12, meta: 15, cor: '#F97272' },
    { titulo: 'Taxa de Engajamento', atual: 76, meta: 85, cor: '#FB9A9A', unidade: '%' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Metas do Mês</h3>
      
      <div className="space-y-4">
        {metas.map((meta, index) => (
          <div key={index}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">{meta.titulo}</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {meta.atual}{meta.unidade || ''} / {meta.meta}{meta.unidade || ''}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(meta.atual / meta.meta) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: meta.cor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente Principal do Dashboard
export const DashboardPage = () => {
  const [periodo, setPeriodo] = useState('semana');

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Bem-vindo de volta! Aqui está o resumo da sua igreja.
            </p>
          </div>

          <div className="flex items-center gap-3">
          <select 
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
              <option value="hoje">Hoje</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mês</option>
              <option value="ano">Este ano</option>
            </select>
            
            <button className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium">
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            titulo="Total de Membros"
            valor={512}
            icone={FiUsers}
            variacao={{ valor: 12, positiva: true }}
            cor="primary"
          />
          <StatCard
            titulo="Visualizações"
            valor="2.5k"
            icone={FiEye}
            variacao={{ valor: 8, positiva: true }}
            cor="blue"
            descricao="últimos 30 dias"
          />
          <StatCard
            titulo="Engajamento"
            valor="76%"
            icone={FiHeart}
            variacao={{ valor: 3, positiva: false }}
            cor="purple"
          />
          <StatCard
            titulo="Conteúdos"
            valor={120}
            icone={FiBookOpen}
            variacao={{ valor: 15, positiva: true }}
            cor="green"
          />
        </div>

        {/* Gráficos Principal e Distribuição */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <GraficoVisitas />
          </div>
          <div>
            <GraficoConteudo />
          </div>
        </div>

        {/* Engajamento e Crescimento */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <GraficoEngajamento />
          <div className="space-y-6">
            <GraficoMembros />
            <Metas />
          </div>
        </div>

        {/* Atividades Recentes e Ações Rápidas */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AtividadesRecentes />
          </div>
          <div>
            <AcoesRapidas />
          </div>
        </div>

        {/* Rodapé com resumo */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary-500 dark:bg-gray-900 dark:border-primary-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center dark:bg-primary-500/10">
              <GiGrowth className="text-primary-500 text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">
                Crescimento consistente!
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sua igreja cresceu 15% nos últimos 30 dias. Continue o bom trabalho!
              </p>
            </div>
            <button className="ml-auto px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium dark:bg-primary-500/10 dark:text-primary-200 dark:hover:bg-primary-500/20">
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
