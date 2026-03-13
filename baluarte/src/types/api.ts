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
  HomeCarouselVisible = 'HomeCarouselVisible'
}

export enum DuracaoActividade {
  Curta = 'CURTA',
  Media = 'MEDIA',
  Longa = 'LONGA',
  Extendida = 'EXTENDIDA',
  MultiplosDias = 'MULTIPLOS_DIAS'
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

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
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
  capacidade: number;
  dataEvento: string;
  contactos: string;
  img: File;
}

export interface ActividadeSummary {
  id: number;
  descricao: string;
  tema: string;
  titulo: string;
  endereco: string;
  tipoEvento: ActividadeType;
  duracao: DuracaoActividade;
  publicoAlvo: PublicoAlvoType;
  organizador: string;
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
  status: ComentarioStatus;
  denuncias: number;
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
  url: string;
  videoType?: VideoType | null;
  visualizacoes?: number;
}

export interface MidiaProjection {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  tempo?: string;
  type: MidiaType;
  audioType?: AudioType | null;
  videoType?: VideoType | null;
  url: string;
  visualizacoes?: number;
}

export interface NewlesterDto {
  email: string;
  nome: string;
}

export interface ConfiguracaoDto {
  value: number;
  type: ConfigType;
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
