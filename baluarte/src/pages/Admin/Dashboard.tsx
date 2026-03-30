// src/pages/Dashboard/DashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import { apiFetch } from "../../utils/api.js";
import { getStoredUser } from "../../utils/auth.js";
import { AdminAuditLogDto, AdminAuditType, AdminDashboardCharts, AdminDashboardStats, DashboardConteudoSlice, DashboardCrescimentoPoint, DashboardEngajamentoPoint, DashboardVisitasPoint, PageResponse } from "../../types/api";

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
const GraficoVisitas = ({ data, periodoLabel }: { data: DashboardVisitasPoint[]; periodoLabel?: string }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Visitas ao Site</h3>
        {periodoLabel ? (
          <span className="text-xs font-medium px-3 py-1 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100">
            {periodoLabel}
          </span>
        ) : null}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 12, right: 18, left: 4, bottom: 8 }}
        >
          <defs>
            <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CB2020" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#CB2020" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" tickMargin={12} tick={{ fontSize: 12 }} />
          <YAxis tickMargin={12} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, padding: "10px 12px" }}
            labelStyle={{ fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
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
const GraficoConteudo = ({ data }: { data: DashboardConteudoSlice[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Distribuição de Conteúdo</h3>
      
      <ResponsiveContainer width="100%" height={250} className="transition-all duration-75">
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
                    cornerRadius={10}
                    stroke="rgba(255, 255, 255, 0.9)"
                    strokeWidth={2}
                  />
                  <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill="#333" className="text-xs font-bold">
                    {payload.nome}
                  </text>
                  <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#666" className="text-[11px]">
                    {value} itens ({(percent * 100).toFixed(0)}%)
                  </text>
                </g>
              );
            }}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="valor"
            onMouseEnter={onPieEnter}
            paddingAngle={2}
            cornerRadius={10}
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth={2}
            isAnimationActive
            animationDuration={650}
            animationEasing="ease-in-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, padding: "10px 12px" }}
            labelStyle={{ fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
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
const GraficoEngajamento = ({ data }: { data: DashboardEngajamentoPoint[] }) => {
  const resumoEngajamento = useMemo(() => {
    const total = (key: keyof DashboardEngajamentoPoint) =>
      data.reduce((acc, item) => acc + Number(item[key] ?? 0), 0);

    const avg = (n: number) => (data.length ? Math.round(n / data.length) : 0);

    const comentarios = total("comentarios");
    const curtidas = total("curtidas");
    const compartilhamentos = total("compartilhamentos");

    return [
      { label: 'Média de Comentários', valor: String(avg(comentarios)), tendencia: `${Math.round(comentarios)} total` },
      { label: 'Média de Curtidas', valor: String(avg(curtidas)), tendencia: `${Math.round(curtidas)} total` },
      { label: 'Compartilhamentos', valor: String(avg(compartilhamentos)), tendencia: `${Math.round(compartilhamentos)} total` },
    ];
  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Engajamento Diário</h3>
      
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 8, right: 18, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="dia" tickMargin={12} tick={{ fontSize: 12 }} />
          <YAxis tickMargin={12} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, padding: "10px 12px" }}
            labelStyle={{ fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
          <Bar dataKey="curtidas" fill="#CB2020" radius={[4, 4, 0, 0]} />
          <Bar dataKey="comentarios" fill="#F97272" radius={[4, 4, 0, 0]} />
          <Bar dataKey="compartilhamentos" fill="#FB9A9A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resumoEngajamento.map((stat) => (
          <div key={stat.label} className="flex flex-col bg-gray-50 rounded-xl p-4 border border-gray-100 dark:bg-gray-900/70 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">{stat.valor}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{stat.tendencia}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Crescimento de Membros
const GraficoMembros = ({ data }: { data: DashboardCrescimentoPoint[] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Crescimento de Membros</h3>
      
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 8, right: 18, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" tickMargin={12} tick={{ fontSize: 12 }} />
          <YAxis tickMargin={12} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, padding: "10px 12px" }}
            labelStyle={{ fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Line 
            type="monotone" 
            dataKey="membros" 
            stroke="#CB2020" 
            strokeWidth={3}
            dot={{ fill: '#CB2020', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de Atividades Recentes
const AtividadesRecentes = () => {
  const navigate = useNavigate();

  const [auditLogs, setAuditLogs] = useState<AdminAuditLogDto[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setAuditLoading(true);
      setAuditError("");
      try {
        const res = await apiFetch("/admin/profile/audit?page=0&size=5", { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar atividades recentes.");
        const payload = (await res.json()) as PageResponse<AdminAuditLogDto>;
        setAuditLogs(payload?.content ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAuditLogs([]);
        setAuditError(err instanceof Error ? err.message : "Não foi possível carregar atividades recentes.");
      } finally {
        setAuditLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const me = getStoredUser();
  const actorLabel = (me?.name || me?.nome || me?.email || "Você") as string;

  const timeAgo = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const diffMs = Date.now() - d.getTime();
    const minutes = Math.max(0, Math.floor(diffMs / 60000));
    if (minutes < 1) return "agora";
    if (minutes < 60) return `${minutes} min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const getIcon = (tipo: AdminAuditType) => {
    switch (tipo) {
      case AdminAuditType.SUCESSO:
        return <FiTrendingUp className="text-green-600" />;
      case AdminAuditType.ALERTA:
        return <FiClock className="text-orange-600" />;
      case AdminAuditType.ERRO:
        return <FiTrendingDown className="text-red-600" />;
      case AdminAuditType.INFO:
      default:
        return <FiEye className="text-blue-600" />;
    }
  };

  const rotaPorAcao = (acao: string) => {
    const a = (acao || "").toLowerCase();
    if (a.includes("coment")) return "/admin/comentarios";
    if (a.includes("mensag")) return "/admin/mensagens";
    if (a.includes("usuár") || a.includes("usuario") || a.includes("role")) return "/admin/usuarios";
    if (a.includes("config")) return "/admin/configuracoes";
    if (a.includes("artigo")) return "/admin/artigos";
    if (a.includes("mídia") || a.includes("midia") || a.includes("vídeo") || a.includes("video")) return "/admin/videos";
    if (a.includes("áudio") || a.includes("audio")) return "/admin/audios";
    if (a.includes("atividade") || a.includes("actividade") || a.includes("program")) return "/admin/actividades";
    return "/admin/audit";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Atividades Recentes</h3>
        <button
          className="text-primary-500 text-sm hover:underline"
          type="button"
          onClick={() => navigate("/admin/audit")}
        >
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {auditError ? (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-4">
            {auditError}
          </div>
        ) : auditLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse dark:bg-gray-800" />
              <div className="flex-1">
                <div className="h-3 w-64 bg-gray-200 rounded mb-2 animate-pulse dark:bg-gray-800" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
              </div>
            </div>
          ))
        ) : auditLogs.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Sem atividades recentes.
          </div>
        ) : (
          auditLogs.map((log) => (
            <motion.button
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              type="button"
              onClick={() => navigate(rotaPorAcao(log.acao))}
              className="w-full text-left flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                {getIcon(log.tipo)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-100 truncate">
                  <span className="font-semibold">{actorLabel}</span>{" "}
                  <span className="text-gray-700 dark:text-gray-200">{log.acao}</span>
                </p>
                {log.detalhes ? (
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400 truncate">{log.detalhes}</p>
                ) : null}
                <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                  {timeAgo(log.data)}
                </p>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

// Componente de Ações Rápidas
const AcoesRapidas = () => {
  const navigate = useNavigate();

  const acoes = [
    { icone: FiBookOpen, label: 'Novo Artigo', cor: 'primary', href: '/admin/artigos' },
    { icone: FiVideo, label: 'Novo Vídeo', cor: 'blue', href: '/admin/videos' },
    { icone: FiCalendar, label: 'Novo Evento', cor: 'green', href: '/admin/actividades' },
    { icone: FiUsers, label: 'Nova Campanha', cor: 'purple', href: '/admin/mensagens' },
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
            onClick={() => navigate(acao.href)}
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
const Metas = ({ stats, loading }: { stats: AdminDashboardStats | null; loading: boolean }) => {
  const metas = useMemo(() => {
    if (!stats) return [];
    const list = [
      { key: "membros" as const, titulo: "Membros", cor: "#CB2020" },
      { key: "actividades" as const, titulo: "Atividades", cor: "#E64D4D" },
      { key: "inscritos" as const, titulo: "Inscrições", cor: "#F97272" },
      { key: "comentarios" as const, titulo: "Comentários", cor: "#FB9A9A" },
      { key: "visitas" as const, titulo: "Visitas", cor: "#9CA3AF" },
      { key: "newlester" as const, titulo: "Newsletter", cor: "#60A5FA" },
    ];
    return list
      .map((item) => {
        const stat = stats[item.key];
        const atual = Number(stat?.value ?? 0);
        const meta = Number(stat?.tot ?? 0);
        return { ...item, atual, meta };
      })
      .filter((m) => Number.isFinite(m.meta) && m.meta > 0);
  }, [stats]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Metas do Mês</h3>
      
      <div className="space-y-4">
        {loading && metas.length === 0 ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" />
            </div>
          ))
        ) : metas.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Nenhuma meta configurada (limites = 0).</div>
        ) : (
          metas.map((meta, index) => (
            <div key={meta.key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">{meta.titulo}</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {Math.round(meta.atual)} / {Math.round(meta.meta)}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, (meta.atual / meta.meta) * 100))}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: meta.cor }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Componente Principal do Dashboard
export const DashboardPage = () => {
  const [periodo, setPeriodo] = useState('semana');
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [charts, setCharts] = useState<AdminDashboardCharts | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState("");

  const periodoLabel = useMemo(() => {
    switch (periodo) {
      case "hoje":
        return "Hoje";
      case "semana":
        return "Esta semana";
      case "mes":
        return "Este mês";
      case "ano":
        return "Este ano";
      default:
        return "Período";
    }
  }, [periodo]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setStatsLoading(true);
      setStatsError("");
      try {
        const qs = new URLSearchParams({ periodo }).toString();
        const res = await apiFetch(`/admin/dashboard/stats?${qs}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar estatísticas.");
        const payload = (await res.json()) as AdminDashboardStats;
        setStats(payload);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStats(null);
        setStatsError(err instanceof Error ? err.message : "Não foi possível carregar estatísticas.");
      } finally {
        setStatsLoading(false);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [periodo]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setChartsLoading(true);
      setChartsError("");
      try {
        const qs = new URLSearchParams({ periodo }).toString();
        const res = await apiFetch(`/admin/dashboard/charts?${qs}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar gráficos.");
        const payload = (await res.json()) as AdminDashboardCharts;
        setCharts(payload);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setCharts(null);
        setChartsError(err instanceof Error ? err.message : "Não foi possível carregar gráficos.");
      } finally {
        setChartsLoading(false);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [periodo]);

  const statCards = useMemo(() => {
    if (!stats) return [];
    const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));
    const desc = (value: number, tot: number) => {
      if (!Number.isFinite(tot) || tot <= 0) return undefined;
      const pct = Math.max(0, Math.min(100, Math.round((value / tot) * 100)));
      return `Limite: ${fmt(tot)} • ${pct}%`;
    };
    return [
      { titulo: "Membros", valor: fmt(stats.membros.value), icone: FiUsers, cor: "primary", descricao: desc(stats.membros.value, stats.membros.tot) },
      { titulo: "Visitas", valor: fmt(stats.visitas.value), icone: FiEye, cor: "blue", descricao: desc(stats.visitas.value, stats.visitas.tot) },
      { titulo: "Atividades", valor: fmt(stats.actividades.value), icone: FiCalendar, cor: "orange", descricao: desc(stats.actividades.value, stats.actividades.tot) },
      { titulo: "Inscrições", valor: fmt(stats.inscritos.value), icone: FiUserPlus, cor: "green", descricao: desc(stats.inscritos.value, stats.inscritos.tot) },
      { titulo: "Comentários", valor: fmt(stats.comentarios.value), icone: FiMessageCircle, cor: "purple", descricao: desc(stats.comentarios.value, stats.comentarios.tot) },
      { titulo: "Newsletter", valor: fmt(stats.newlester.value), icone: FiShare2, cor: "blue", descricao: desc(stats.newlester.value, stats.newlester.tot) },
    ];
  }, [stats]);

  const visitasChart = charts?.visitas?.length ? charts.visitas : dadosVisitas;
  const conteudoChart = charts?.conteudo?.length ? charts.conteudo : dadosConteudo;
  const engajamentoChart = charts?.engajamento?.length ? charts.engajamento : dadosEngajamento;
  const crescimentoChart = charts?.crescimento?.length ? charts.crescimento : dadosCrescimento;

  const resumoCrescimento = useMemo(() => {
    const periodoDesc = (() => {
      switch (periodo) {
        case "hoje":
          return "hoje";
        case "semana":
          return "nos últimos 7 dias";
        case "mes":
          return "nos últimos 30 dias";
        case "ano":
          return "nos últimos 12 meses";
        default:
          return "no período selecionado";
      }
    })();

    if (chartsLoading) {
      return { titulo: "Crescimento consistente!", texto: "Carregando dados de crescimento..." };
    }

    const points = crescimentoChart ?? [];
    if (points.length < 2) {
      return { titulo: "Crescimento consistente!", texto: `Sem dados suficientes ${periodoDesc}.` };
    }

    const start = Number(points[0]?.membros ?? 0);
    const end = Number(points[points.length - 1]?.membros ?? 0);
    const delta = end - start;
    const fmtInt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return { titulo: "Crescimento consistente!", texto: `Sem dados suficientes ${periodoDesc}.` };
    }

    if (start <= 0) {
      const deltaTxt = delta === 0 ? "0" : delta > 0 ? `+${fmtInt(delta)}` : `-${fmtInt(Math.abs(delta))}`;
      return {
        titulo: delta >= 0 ? "Crescimento consistente!" : "Atenção ao crescimento",
        texto: `Variação de membros: ${deltaTxt} ${periodoDesc}.`,
      };
    }

    const pct = (delta / start) * 100;
    const pctTxt = `${pct >= 0 ? "+" : ""}${pct.toFixed(1).replace(".", ",")}%`;

    return {
      titulo: pct >= 0 ? "Crescimento consistente!" : "Atenção ao crescimento",
      texto: `Sua igreja cresceu ${pctTxt} ${periodoDesc}. Continue o bom trabalho!`,
    };
  }, [chartsLoading, crescimentoChart, periodo]);

  const exportarRelatorio = () => {
    if (typeof window === "undefined") return;
    const payload = {
      periodo,
      geradoEm: new Date().toISOString(),
      stats,
      charts,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-${periodo}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

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
            
            <button
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
              disabled={statsLoading || chartsLoading}
              onClick={exportarRelatorio}
              title="Exporta um JSON com stats + charts do período selecionado"
            >
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        {statsError && (
          <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-4">
            {statsError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
          {statsLoading && statCards.length === 0 ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <div className="h-3 w-24 bg-gray-200 rounded mb-3 animate-pulse dark:bg-gray-800" />
                <div className="h-7 w-20 bg-gray-200 rounded mb-2 animate-pulse dark:bg-gray-800" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
              </div>
            ))
          ) : (
            statCards.map((card) => (
              <StatCard
                key={card.titulo}
                titulo={card.titulo}
                valor={card.valor}
                icone={card.icone}
                cor={card.cor}
                descricao={card.descricao}
              />
            ))
          )}
        </div>

        {chartsError && (
          <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-4">
            {chartsError}
          </div>
        )}

        {/* Gráficos Principal e Distribuição */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <GraficoVisitas data={visitasChart} periodoLabel={periodoLabel} />
          </div>
          <div>
            <GraficoConteudo data={conteudoChart} />
          </div>
        </div>

        {/* Engajamento e Crescimento */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <GraficoEngajamento data={engajamentoChart} />
          <div className="space-y-6">
            <GraficoMembros data={crescimentoChart} />
            <Metas stats={stats} loading={statsLoading || chartsLoading} />
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
                {resumoCrescimento.titulo}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {resumoCrescimento.texto}
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
