export enum ActividadeType {
  Culto = 'CULTO',
  Evento = 'EVENTO',
  Escola = 'ESCOLA',
  Jovens = 'JOVENS',
  Familia = 'FAMILIA',
  Louvor = 'LOUVOR',
  Oracao = 'ORACAO',
  Evangelismo = 'EVANGELISMO',
  Acampamento = 'ACAMPAMENTO',
  Conferencia = 'CONFERENCIA'
}

export enum ArtigoType {
  BibleStudy = 'BIBLE_STUDY',
  Devotional = 'DEVOTIONAL',
  Historical = 'HISTORICAL',
  Doctrinal = 'DOCTRINAL',
  Testimony = 'TESTIMONY',
  Apologetics = 'APOLOGETICS',
  Prophetic = 'PROPHETIC',
  Theological = 'THEOLOGICAL'
}

export enum AudioType {
  Sermon = 'SERMON',
  Devotional = 'DEVOTIONAL',
  Testimony = 'TESTIMONY',
  Music = 'MUSIC',
  Prayer = 'PRAYER',
  Study = 'STUDY',
  Podcast = 'PODCAST',
  Announcement = 'ANNOUNCEMENT'
}

export enum VideoType {
  Sermon = 'SERMON',
  Devotional = 'DEVOTIONAL',
  Testimony = 'TESTIMONY',
  Study = 'STUDY',
  Documentary = 'DOCUMENTARY',
  Event = 'EVENT',
  Interview = 'INTERVIEW'
}

export enum ComentarioType {
  Actividade = 'Actividade',
  Midia = 'Midia',
  Artigo = 'Artigo'
}

export enum ComentarioStatus {
  ATIVO = 'ATIVO',
  OCULTO = 'OCULTO',
  DENUNCIADO = 'DENUNCIADO'
}

export enum ConfigType {
  ComentarioLimiteActividade = 'ComentarioLimiteActividade',
  ActividadeLimite = 'ActividadeLimite',
  IncritosLimiteActividade = 'IncritosLimiteActividade',
  VisitasLimite = 'VisitasLimite',
  MembrosLimite = 'MembrosLimite',
  NewlesterLimite = 'NewlesterLimite',
  HistoriaAnos = 'HistoriaAnos',
  MembrosTotais = 'MembrosTotais',
  MinisteriosTotais = 'MinisteriosTotais',
  HomeStatsVisible = 'HomeStatsVisible',
  HomeCarouselVisible = 'HomeCarouselVisible',
  DashboardRefreshIntervalMs = 'DashboardRefreshIntervalMs',
  MensagemUnreadDays = 'MensagemUnreadDays',
  MensagemReenviarPendentes = 'MensagemReenviarPendentes',
  InscricaoQrEnabled = 'InscricaoQrEnabled',
  InscricaoQrAutoDisable = 'InscricaoQrAutoDisable',
  InscricaoQrExpiresHours = 'InscricaoQrExpiresHours',

  ContactTelefone = 'ContactTelefone',
  ContactWhatsapp = 'ContactWhatsapp',
  ContactEmail = 'ContactEmail',
  ContactEndereco = 'ContactEndereco',
  ContactFacebookUrl = 'ContactFacebookUrl',
  ContactInstagramUrl = 'ContactInstagramUrl',
  ContactYoutubeUrl = 'ContactYoutubeUrl',
  ContactTwitterUrl = 'ContactTwitterUrl',
  ContactHorariosCulto = 'ContactHorariosCulto'
}

export enum DuracaoActividade {
  Curta = 'CURTA',
  Media = 'MEDIA',
  Longa = 'LONGA',
  Extendida = 'EXTENDIDA',
  MultiplosDias = 'MULTIPLOS_DIAS'
}

export enum ProgramacaoTipo {
  Sessao = 'SESSAO',
  Pausa = 'PAUSA'
}

export enum ProgramacaoStatus {
  Upcoming = 'UPCOMING',
  Ongoing = 'ONGOING',
  Done = 'DONE'
}

export interface ProgramacaoItemView {
  id: number;
  titulo: string;
  inicio: string;
  fim?: string | null;
  tipo: ProgramacaoTipo;
  ordem?: number | null;
  status: ProgramacaoStatus;
}

export enum FileStatus {
  ENVIADO = 'ENVIADO',
  PENDENTE = 'PENDENTE'
}

export enum FileType {
  Raw = 'raw',
  Image = 'image'
}

export enum InfoType {
  QuemSomos = 'QuemSomos',
  Salvacao = 'Salvacao',
  MissaoVisao = 'MissaoVisao',
  VersoBiblio = 'VersoBiblio'
}

export enum MensagemType {
  Send = 'SEND',
  Received = 'RECEIVED'
}

export enum MidiaType {
  Video = 'VIDEO',
  Audio = 'AUDIO',
  Image = 'IMAGE'
}

export enum NotificacaoType {
  Galeria = 'GALERIA',
  LimiteInscritos = 'LIMITE_INSCRITOS',
  Lembrete = 'LEMBRETE',
  Vistos = 'VISTOS'
}

export enum PublicoAlvoType {
  Todos = 'TODOS',
  Jovens = 'JOVENS',
  Adultos = 'ADULTOS',
  Criancas = 'CRIANCAS',
  Idosos = 'IDOSOS',
  Mulheres = 'MULHERES',
  Homens = 'HOMENS',
  Casais = 'CASAIS'
}

export enum StatusIncritos {
  Presente = 'PRESENTE',
  Ausente = 'AUSENTE',
  Pendente = 'PENDENTE'
}

export enum StatusMensage {
  Enviado = 'ENVIADO',
  Pendente = 'PENDENTE'
}

export enum UserContentType {
  Artigo = 'ARTIGO',
  Midia = 'MIDIA'
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ValueStat {
  value: number;
  tot: number;
}

export interface AdminDashboardStats {
  membros: ValueStat;
  actividades: ValueStat;
  inscritos: ValueStat;
  comentarios: ValueStat;
  visitas: ValueStat;
  newlester: ValueStat;
}

export interface DashboardVisitasPoint {
  mes: string;
  visitas: number;
  usuarios: number;
}

export interface DashboardConteudoSlice {
  nome: string;
  valor: number;
  cor: string;
}

export interface DashboardEngajamentoPoint {
  dia: string;
  comentarios: number;
  curtidas: number;
  compartilhamentos: number;
}

export interface DashboardCrescimentoPoint {
  mes: string;
  membros: number;
}

export interface AdminDashboardCharts {
  visitas: DashboardVisitasPoint[];
  conteudo: DashboardConteudoSlice[];
  engajamento: DashboardEngajamentoPoint[];
  crescimento: DashboardCrescimentoPoint[];
}

export enum AdminAuditType {
  INFO = 'INFO',
  SUCESSO = 'SUCESSO',
  ALERTA = 'ALERTA',
  ERRO = 'ERRO'
}

export interface AdminAuditLogDto {
  id: number;
  acao: string;
  detalhes: string | null;
  ip: string | null;
  data: string;
  tipo: AdminAuditType;
}

export interface AdminProfileDto {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  cargo: string;
  avatar: string;
  dataCadastro?: string | null;
  ultimoAcesso?: string | null;
  doisFatores: boolean;
  cidade?: string | null;
  estado?: string | null;
  dataNascimento?: string | null;
  roles?: string | null;
}

export interface ArtigoDto {
  id: number;
  descricao: string;
  titulo: string;
  escritor: string;
  pdf?: File | null;
  img?: File | null;
  tipo: ArtigoType;
}

export interface ArtigoCreateDto extends Omit<ArtigoDto, 'id'> {
  pdf: File;
}

export interface ArtigoSummary {
  id: number;
  titulo: string;
  descricao: string;
  tipo: ArtigoType;
  escritor: string;
  pdf: string;
  nPagina: number;
  dataPublicacao: string;
  img: string;
  visualizacoes?: number;
  comentarios?: number;
}

export interface ArtigoDetail extends ArtigoSummary {
  comentariosData?: ComentarioResult[];
  conteudo?: string;
}

export interface ActividadeDto {
  descricao: string;
  tema: string;
  titulo: string;
  endereco: string;
  tipoEvento: ActividadeType;
  publicoAlvo: PublicoAlvoType;
  duracao: DuracaoActividade;
  organizador: string;
  palestrantes?: string | null;
  edicao?: number | null;
  capacidade: number;
  dataEvento: string;
  contactos: string;
  img: File;
}

export interface ActividadeSummary {
  id: number|string;
  descricao: string;
  tema: string;
  titulo: string;
  endereco: string;
  tipoEvento: ActividadeType;
  duracao: DuracaoActividade;
  publicoAlvo: PublicoAlvoType;
  organizador: string;
  palestrantes?: string | null;
  edicao?: number | null;
  dataEvento: string;
  dataPublicacao: string;
  contactos: string;
  img: string;
  capacidade?: number;
  inscritos?: number;
}

export interface ComentarioDto {
  idUser: number;
  idSeccao: number;
  seccao: ComentarioType;
  descricao: string;
}

export interface ComentarioResult {
  id: number;
  imagem: string;
  name: string;
  descricao: string;
  analise: boolean;
  dataPublicacao?: string;
  likes?: number;
}

export interface ComentarioAdminData {
  id: number;
  seccao: ComentarioType;
  seccaoId: number;
  seccaoTitulo: string;
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioImagem: string;
  descricao: string;
  dataPublicacao?: string;
  likes: number;
  parentId?: number | null;
  status: ComentarioStatus;
  denuncias: number;
  respostas?: number;
}

export interface ComentarioRespostaDto {
  descricao: string;
}

export interface ComentarioStatusDto {
  status: ComentarioStatus;
  notaInterna?: string;
}

export interface AnaliseDto {
  id: number;
  analise: boolean;
}

export interface InfoDto {
  type: InfoType;
  descricao: string;
  img?: File;
}

export interface InfoItem {
  id: number;
  type: InfoType;
  descricao: string;
  img?: string;
}

export interface GaleriaAdminItem {
  id: number;
  url: string;
  titulo: string;
  descricao: string;
  dataPublicacao: string;
  actividadeId?: number;
  actividadeTitulo?: string;
  visualizacoes: number;
}

export interface SobreDto {
  historia: SobreHistoria;
  valores: SobreValor[];
  pastores: SobrePastor[];
  estatisticas: SobreEstatistica[];
  localizacao: SobreLocalizacao;
  cta: SobreCta;
}

export interface SobreHistoria {
  titulo: string;
  descricao: string[];
  imagens: SobreImagem[];
  dataFundacao: string;
  fundadores: string[];
}

export interface SobreImagem {
  url: string;
  descricao: string;
}

export interface SobreValor {
  id: string;
  icon: string;
  titulo: string;
  descricao: string;
  ordem: number;
  ativo: boolean;
}

export interface SobrePastor {
  id: string;
  nome: string;
  cargo: string;
  foto: string;
  descricao: string;
  email?: string;
  ordem: number;
  ativo: boolean;
}

export interface SobreEstatistica {
  id: string;
  numero: string;
  label: string;
  icon: string;
  ordem: number;
  ativo: boolean;
}

export interface SobreLocalizacao {
  endereco: SobreEndereco;
  horarios: SobreHorario[];
  contato: SobreContato;
  mapa: SobreMapa;
}

export interface SobreEndereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface SobreHorario {
  dia: string;
  horarios: string[];
}

export interface SobreContato {
  telefone: string;
  email: string;
  whatsapp?: string;
}

export interface SobreMapa {
  latitude: number | null;
  longitude: number | null;
  embed: string;
}

export interface SobreCta {
  titulo: string;
  descricao: string;
  botao1: SobreBotao;
  botao2: SobreBotao;
  ativo: boolean;
}

export interface SobreBotao {
  texto: string;
  link: string;
}

export interface SalvacaoDto {
  imagemCapaUrl: string;
  titulo: string;
  conteudoMarkdown: string;
  conteudoHtml: string;
  videoUrl: string;
  oracao: string;
  botao: SalvacaoBotaoDto;
  feed: SalvacaoFeedDto;
}

export interface SalvacaoBotaoDto {
  texto: string;
  link: string;
}

export interface SalvacaoFeedDto {
  artigoTipo: ArtigoType | null;
  audioTipo: AudioType | null;
  videoTipo: VideoType | null;
  limit: number;
}

export interface InscritosDto {
  idUser: number;
  idActividade: number;
}

export interface InscritosPublicDto {
  nome: string;
  email: string;
  telefone: string;
}

export interface InscritosData {
  id: number;
  actividadeId: number;
  actividadeTitulo: string;
  actividadeTema: string;
  actividadeData: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioTelefone: string;
  dataInscricao: string;
  dataCheckin?: string;
  status: StatusIncritos;
}

export interface MensagemDto {
  descricao: string;
  assunto: string;
  destino?: string;
}

export interface MensagemData {
  descricao: string;
  assunto: string;
}

export interface MensagemPublicDto {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  descricao: string;
}

export interface MensagemRecord {
  id: number;
  descricao: string;
  assunto: string;
  nome?: string;
  email: string;
  telefone?: string;
  destino: string;
  lido: boolean;
  tipo: MensagemType;
  status: StatusMensage;
  dataPublicacao?: string;
}

export interface MidiaDto {
  titulo: string;
  descricao: string;
  url: string;
  type: MidiaType;
  videoType?: VideoType | null;
}

export interface MidiaFileDto {
  titulo: string;
  descricao: string;
  url: File;
  imagem: File;
  type: MidiaType;
  audioType?: AudioType | null;
  videoType?: VideoType | null;
}

export interface MidiaSimple {
  id: number;
  titulo: string;
  url: string;
}

export interface MidiaActividadeDto {
  id: number;
  titulo: string;
  type: MidiaType;
  img: File;
}

export interface MidiaActividadeView {
  id: number;
  titulo: string;
  type: MidiaType;
  img: string;
}

export interface ConnectMidiaDto {
  actividade: number;
  midia: number;
}

export interface AudioProjection {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  tempo: string;
  audioType: AudioType;
  url: string;
  visualizacoes?: number;
}

export interface VideoProjection {
  id: number;
  descricao: string;
  titulo: string;
  autor?: string | null;
  url: string;
  videoType?: VideoType | null;
  visualizacoes?: number;
}

export interface AudioProjection {
  id: number;
  titulo: string;
  descricao: string;
  imagem?: string | null;
  tempo?: string | null;
  autor?: string | null;
  audioType?: AudioType | null;
  url: string;
  visualizacoes?: number;
}

export interface MidiaProjection {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  autor?: string;
  tempo?: string;
  type: MidiaType;
  audioType?: AudioType | null;
  videoType?: VideoType | null;
  url: string;
  visualizacoes?: number;
}

export interface MidiaRelacionadoItem {
  id: number;
  titulo: string;
  autor?: string | null;
  imagem?: string | null;
  tempo?: string | null;
  type: MidiaType;
  audioType?: AudioType | null;
  videoType?: VideoType | null;
  url: string;
}

export interface MidiaRelacionadoEdicaoItem extends MidiaRelacionadoItem {
  actividadeId?: number | null;
  edicao?: number | null;
  dataEvento?: string | null;
}

export interface MidiaRelacionadosDto {
  eventosPassados: MidiaRelacionadoItem[];
  eventosAtuais: MidiaRelacionadoItem[];
}

export interface NewlesterDto {
  email: string;
  nome: string;
}

export interface ConfiguracaoDto {
  value: unknown;
  type: ConfigType;
}

export interface AdminConfigDto {
  dashboard: {
    cards: unknown[];
    timeRanges: unknown[];
    refreshIntervalMs: number;
  };
  messages: {
    retention: { unreadDays: number };
    actions: { reenviarPendentes: boolean };
  };
  inscricoes: {
    qr: {
      enabled: boolean;
      autoDisableAfterActivity: boolean;
      expiresAfterHours: number;
    };
  };
  activities: {
    types: {
      id: string;
      label: string;
      color: string;
      icon: string;
    }[];
  };
  homeCarousel: CarouselItemDto[];
}

export interface ContactHorarioCulto {
  dia: string;
  horarios: string[];
}

export interface PublicContactConfigDto {
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
  horariosCulto: ContactHorarioCulto[];
}

export interface CarouselItemDto {
  id?: number;
  url: string;
  titulo: string;
  legenda?: string;
  ordem: number;
}

export interface StatisticCardDto {
  title: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface HomeDto {
  carousel: CarouselItemDto[];
  articles: ArtigoSummary[];
  media: MidiaProjection[];
  activities: ActividadeSummary[];
  stats: StatisticCardDto[];
  showStats: boolean;
  showCarousel: boolean;
}

export interface EstatisticaValue {
  value: number;
  tot: number;
}

export interface FileDto {
  file: File;
  model: string;
  kindFormat: string;
  format: FileType;
}

export interface FileMultiPartDto extends FileDto {}

export interface UserDto {
  nome: string;
  password: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  cidade?: string;
  estado?: string;
  igreja?: string;
  dataBatismo?: string;
  ministerio?: string;
  cargo?: string;
  observacoes?: string;
}

export interface UserLoginDto {
  password: string;
  email: string;
}

export interface UserData {
  id: number;
  nome: string;
  email: string;
  img: string;
  roles: string;
  status?: UserStatus;
  telefone?: string;
  dataNascimento?: string;
  cidade?: string;
  estado?: string;
  igreja?: string;
  dataBatismo?: string;
  ministerio?: string;
  cargo?: string;
  dataCadastro?: string;
  dataAprovacao?: string;
  aprovadoPor?: string;
  ultimoAcesso?: string;
  observacoes?: string;
  motivoBloqueio?: string;
}

export enum UserStatus {
  PENDENTE = 'PENDENTE',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO'
}

export interface UserDownloadDto {
  id: number;
  tipo: UserContentType;
  data: string;
  artigoId?: number | null;
  artigoTitulo?: string | null;
  artigoImagem?: string | null;
  artigoPdf?: string | null;
  midiaId?: number | null;
  midiaTitulo?: string | null;
  midiaImagem?: string | null;
  midiaType?: MidiaType | null;
  audioType?: AudioType | null;
  videoType?: VideoType | null;
  midiaUrl?: string | null;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details: string[];
}

export interface ViewCountResponse {
  total: number;
}

export interface NotificacaoRecord {
  id: number;
  descricao: string;
  assunto: string;
  lido: boolean;
  type: NotificacaoType;
  dataNotificacao?: string;
}

export interface ComentarioProjectionResponse {
  id: number;
  user: {
    imagem: string;
    nome: string;
    id: number;
  };
  descricao: string;
}


export enum PrioridadeNotificacao {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta',
  URGENTE = 'urgente'
}
