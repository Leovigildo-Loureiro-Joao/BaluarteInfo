export enum ActividadeType {
  Culto = 'Culto',
  Conferencia = 'Conferência',
  Evangelismo = 'Evangelismo',
  Acampamento = 'Acampamento'
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

export enum ConfigType {
  ComentarioLimiteActividade = 'ComentarioLimiteActividade',
  ActividadeLimite = 'ActividadeLimite',
  IncritosLimiteActividade = 'IncritosLimiteActividade',
  VisitasLimite = 'VisitasLimite',
  MembrosLimite = 'MembrosLimite',
  NewlesterLimite = 'NewlesterLimite'
}

export enum DuracaoActividade {
  Mensal = 'Mensal',
  Anual = 'Anual',
  Projecto = 'Projecto'
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
  Mulheres = 'Mulheres',
  Velhos = 'Velhos',
  Pais = 'Pais',
  Casais = 'Casais',
  Jovens = 'Jovens',
  Criancas = 'Criancas',
  Todos = 'Todos'
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

export interface ArtigoDto {
  id: number;
  descricao: string;
  titulo: string;
  escritor: string;
  pdf?: File | null;
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
}

export interface ArtigoDetail extends ArtigoSummary {
  comentarios?: ComentarioResult[];
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

export interface InscritosDto {
  idUser: number;
  idActividade: number;
}

export interface InscritosData {
  idUser: number;
  titulo: string;
  tema: string;
  dataMarcada: string;
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

export interface MensagemRecord {
  id: number;
  descricao: string;
  assunto: string;
  email: string;
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
}

export interface VideoProjection {
  id: number;
  descricao: string;
  titulo: string;
  url: string;
  videoType?: VideoType | null;
}

export interface NewlesterDto {
  email: string;
  nome: string;
}

export interface ConfiguracaoDto {
  value: number;
  type: ConfigType;
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
