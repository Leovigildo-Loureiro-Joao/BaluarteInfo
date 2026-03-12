// src/pages/Admin/InscricoesPage.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDownload,
  FiPrinter,
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  
  FiCamera,
  FiCheck,
  FiX
} from "react-icons/fi";
import { 
  
  GiPartyPopper, 
  GiPrayer, 
  
} from "react-icons/gi";
import QRCode from 'qrcode';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { LiaQrcodeSolid } from "react-icons/lia";

// Tipos
enum TipoActividade {
  Culto = 'Culto',
  Evento = 'Evento',
  Escola = 'Escola',
  Jovens = 'Jovens',
  Familia = 'Família',
  Louvor = 'Louvor',
  Oracao = 'Oração'
}

enum StatusInscricao {
  CONFIRMADA = 'CONFIRMADA',
  PENDENTE = 'PENDENTE',
  CANCELADA = 'CANCELADA',
  COMPARECEU = 'COMPARECEU'
}

interface Inscricao {
  id: string;
  actividadeId: string;
  actividadeTitulo: string;
  actividadeTipo: TipoActividade;
  actividadeData: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioTelefone: string;
  dataInscricao: string;
  status: StatusInscricao;
  qrCode?: string;
  checkin?: string;
  acompanhantes?: number;
}

interface Actividade {
  id: string;
  titulo: string;
  tipo: TipoActividade;
  data: string;
  capacidade: number;
  inscritos: number;
}

// Dados mockados
const actividadesMock: Actividade[] = [
  {
    id: '1',
    titulo: 'Conferência de Jovens',
    tipo: TipoActividade.Jovens,
    data: '2024-03-22',
    capacidade: 300,
    inscritos: 156
  },
  {
    id: '2',
    titulo: 'Culto de Celebração',
    tipo: TipoActividade.Culto,
    data: '2024-03-17',
    capacidade: 200,
    inscritos: 189
  },
  {
    id: '3',
    titulo: 'Escola Bíblica',
    tipo: TipoActividade.Escola,
    data: '2024-03-20',
    capacidade: 50,
    inscritos: 42
  }
];

const inscricoesMock: Inscricao[] = [
  {
    id: 'i1',
    actividadeId: '1',
    actividadeTitulo: 'Conferência de Jovens',
    actividadeTipo: TipoActividade.Jovens,
    actividadeData: '2024-03-22',
    usuarioId: 'u1',
    usuarioNome: 'João Silva',
    usuarioEmail: 'joao@email.com',
    usuarioTelefone: '(11) 99999-9999',
    dataInscricao: '2024-03-10T14:30:00',
    status: StatusInscricao.CONFIRMADA,
    acompanhantes: 2
  },
  {
    id: 'i2',
    actividadeId: '1',
    actividadeTitulo: 'Conferência de Jovens',
    actividadeTipo: TipoActividade.Jovens,
    actividadeData: '2024-03-22',
    usuarioId: 'u2',
    usuarioNome: 'Maria Oliveira',
    usuarioEmail: 'maria@email.com',
    usuarioTelefone: '(11) 98888-8888',
    dataInscricao: '2024-03-11T09:15:00',
    status: StatusInscricao.PENDENTE
  },
  {
    id: 'i3',
    actividadeId: '2',
    actividadeTitulo: 'Culto de Celebração',
    actividadeTipo: TipoActividade.Culto,
    actividadeData: '2024-03-17',
    usuarioId: 'u3',
    usuarioNome: 'Pedro Santos',
    usuarioEmail: 'pedro@email.com',
    usuarioTelefone: '(11) 97777-7777',
    dataInscricao: '2024-03-09T20:10:00',
    status: StatusInscricao.CONFIRMADA,
    checkin: '2024-03-17T18:45:00'
  }
];

// Componente de Leitor QR Code
const LeitorQRCode = ({ onScan, onClose }: { onScan: (data: string) => void; onClose: () => void }) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    // Iniciar scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        setScanning(false);
        onScan(decodedText);
      },
      (errorMessage) => {
        setError('Erro ao acessar câmera. Certifique-se de permitir acesso.');
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FiCamera className="text-primary-500" />
            Escanear QR Code
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <FiXCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg"
            >
              Fechar
            </button>
          </div>
        ) : (
          <div id="qr-reader" className="w-full" />
        )}
      </motion.div>
    </motion.div>
  );
};

// Componente de Gerador QR Code
const GerarQRCode = ({ inscricao, onClose }: { inscricao: Inscricao; onClose: () => void }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    // Dados a serem codificados no QR
    const qrData = JSON.stringify({
      id: inscricao.id,
      usuario: inscricao.usuarioNome,
      actividade: inscricao.actividadeTitulo,
      data: inscricao.actividadeData
    });

    QRCode.toDataURL(qrData, { width: 300 }, (err, url) => {
      if (!err) setQrDataUrl(url);
    });
  }, [inscricao]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <LiaQrcodeSolid className="text-primary-500" />
            QR Code da Inscrição
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="font-semibold">{inscricao.usuarioNome}</p>
          <p className="text-sm text-gray-500">{inscricao.actividadeTitulo}</p>
          <p className="text-xs text-gray-400">
            {new Date(inscricao.actividadeData).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {qrDataUrl && (
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <img src={qrDataUrl} alt="QR Code" className="w-full max-w-[200px] mx-auto" />
          </div>
        )}

        <div className="flex gap-3">
          <a
            href={qrDataUrl}
            download={`inscricao-${inscricao.id}.png`}
            className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 flex items-center justify-center gap-2"
          >
            <FiDownload size={18} />
            Download
          </a>
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <FiPrinter size={18} />
            Imprimir
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modal de Detalhes da Inscrição
const ModalInscricaoDetalhe = ({ 
  inscricao, 
  onClose, 
  onGerarQR,
  onConfirmar,
  onCancelar,
  onCheckin
}: { 
  inscricao: Inscricao; 
  onClose: () => void; 
  onGerarQR: (inscricao: Inscricao) => void;
  onConfirmar: (id: string) => void;
  onCancelar: (id: string) => void;
  onCheckin: (id: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Detalhes da Inscrição</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          {/* Status */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              inscricao.status === StatusInscricao.CONFIRMADA ? 'bg-green-100 text-green-600' :
              inscricao.status === StatusInscricao.PENDENTE ? 'bg-yellow-100 text-yellow-600' :
              inscricao.status === StatusInscricao.CANCELADA ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {inscricao.status}
            </span>
          </div>

          {/* Info Actividade */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Actividade</p>
            <p className="font-semibold">{inscricao.actividadeTitulo}</p>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(inscricao.actividadeData).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Info Usuário */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <FiUser size={16} className="text-primary-500" />
              <span>{inscricao.usuarioNome}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiMail size={16} className="text-primary-500" />
              <span>{inscricao.usuarioEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiPhone size={16} className="text-primary-500" />
              <span>{inscricao.usuarioTelefone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiCalendar size={16} className="text-primary-500" />
              <span>Inscrito em: {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')}</span>
            </div>
            {inscricao.acompanhantes && (
              <div className="flex items-center gap-3 text-gray-600">
                <FiUser size={16} className="text-primary-500" />
                <span>Acompanhantes: {inscricao.acompanhantes}</span>
              </div>
            )}
            {inscricao.checkin && (
              <div className="flex items-center gap-3 text-green-600">
                <FiCheckCircle size={16} />
                <span>Check-in: {new Date(inscricao.checkin).toLocaleString('pt-BR')}</span>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <button
              onClick={() => {
                onGerarQR(inscricao);
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center justify-center gap-2"
            >
              <LiaQrcodeSolid size={18} />
              Gerar QR Code
            </button>

            {inscricao.status === StatusInscricao.PENDENTE && (
              <button
                onClick={() => {
                  onConfirmar(inscricao.id);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <FiCheckCircle size={18} />
                Confirmar
              </button>
            )}

            {inscricao.status === StatusInscricao.CONFIRMADA && !inscricao.checkin && (
              <button
                onClick={() => {
                  onCheckin(inscricao.id);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <FiCheck size={18} />
                Fazer Check-in
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('Cancelar esta inscrição?')) {
                  onCancelar(inscricao.id);
                  onClose();
                }
              }}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <FiXCircle size={18} />
              Cancelar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Card de Inscrição
const InscricaoCard = ({ 
  inscricao, 
  onVerDetalhe,
  onGerarQR
}: { 
  inscricao: Inscricao; 
  onVerDetalhe: (inscricao: Inscricao) => void;
  onGerarQR: (inscricao: Inscricao) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary-500"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{inscricao.usuarioNome}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              inscricao.status === StatusInscricao.CONFIRMADA ? 'bg-green-100 text-green-600' :
              inscricao.status === StatusInscricao.PENDENTE ? 'bg-yellow-100 text-yellow-600' :
              inscricao.status === StatusInscricao.CANCELADA ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {inscricao.status}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2">{inscricao.actividadeTitulo}</p>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FiCalendar size={12} />
              {new Date(inscricao.actividadeData).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <FiMail size={12} />
              {inscricao.usuarioEmail}
            </span>
            {inscricao.acompanhantes && (
              <span className="flex items-center gap-1">
                <FiUser size={12} />
                +{inscricao.acompanhantes}
              </span>
            )}
          </div>

          {inscricao.checkin && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <FiCheckCircle size={12} />
              Check-in realizado
            </p>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onGerarQR(inscricao)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Gerar QR Code"
          >
            <LiaQrcodeSolid size={18} className="text-purple-500" />
          </button>
          <button
            onClick={() => onVerDetalhe(inscricao)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Ver detalhes"
          >
            <FiEye size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal
export const InscricoesPage = () => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>(inscricoesMock);
  const [actividades] = useState<Actividade[]>(actividadesMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActividade, setSelectedActividade] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [selectedInscricao, setSelectedInscricao] = useState<Inscricao | null>(null);
  const [showDetalheModal, setShowDetalheModal] = useState(false);

  // Estatísticas
  const stats = {
    total: inscricoes.length,
    confirmadas: inscricoes.filter(i => i.status === StatusInscricao.CONFIRMADA).length,
    pendentes: inscricoes.filter(i => i.status === StatusInscricao.PENDENTE).length,
    compareceram: inscricoes.filter(i => i.checkin).length
  };

  // Filtrar inscrições
  const filteredInscricoes = inscricoes.filter(i => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        i.usuarioNome.toLowerCase().includes(term) ||
        i.usuarioEmail.toLowerCase().includes(term) ||
        i.actividadeTitulo.toLowerCase().includes(term);
      if (!matches) return false;
    }

    if (selectedActividade !== 'todas' && i.actividadeId !== selectedActividade) return false;
    if (selectedStatus !== 'todos' && i.status !== selectedStatus) return false;

    return true;
  });

  const handleScanQR = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      const inscricao = inscricoes.find(i => i.id === qrData.id);
      
      if (inscricao) {
        setSelectedInscricao(inscricao);
        setShowDetalheModal(true);
      } else {
        alert('Inscrição não encontrada!');
      }
    } catch {
      alert('QR Code inválido!');
    }
    setShowQRScanner(false);
  };

  const handleConfirmar = (id: string) => {
    setInscricoes(inscricoes.map(i => 
      i.id === id ? { ...i, status: StatusInscricao.CONFIRMADA } : i
    ));
  };

  const handleCancelar = (id: string) => {
    setInscricoes(inscricoes.map(i => 
      i.id === id ? { ...i, status: StatusInscricao.CANCELADA } : i
    ));
  };

  const handleCheckin = (id: string) => {
    setInscricoes(inscricoes.map(i => 
      i.id === id ? { ...i, status: StatusInscricao.COMPARECEU, checkin: new Date().toISOString() } : i
    ));
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
              Gestão de Inscrições
            </h1>
            <p className="text-gray-500">
              Gerencie inscrições, faça check-in e valide QR Codes
            </p>
          </div>

          <button
            onClick={() => setShowQRScanner(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
          >
            <FiCamera size={20} />
            Escanear QR Code
          </button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-primary-500">
            <p className="text-sm text-gray-500">Total Inscrições</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-green-500">
            <p className="text-sm text-gray-500">Confirmadas</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmadas}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-yellow-500">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-500">Check-ins</p>
            <p className="text-2xl font-bold text-blue-600">{stats.compareceram}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou atividade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            {/* Filtro por atividade */}
            <select
              value={selectedActividade}
              onChange={(e) => setSelectedActividade(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[200px]"
            >
              <option value="todas">Todas atividades</option>
              {actividades.map(act => (
                <option key={act.id} value={act.id}>
                  {act.titulo} ({act.inscritos}/{act.capacidade})
                </option>
              ))}
            </select>

            {/* Filtro por status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todos">Todos status</option>
              <option value={StatusInscricao.CONFIRMADA}>Confirmadas</option>
              <option value={StatusInscricao.PENDENTE}>Pendentes</option>
              <option value={StatusInscricao.CANCELADA}>Canceladas</option>
              <option value={StatusInscricao.COMPARECEU}>Compareceram</option>
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredInscricoes.length} {filteredInscricoes.length === 1 ? 'inscrição encontrada' : 'inscrições encontradas'}
          </div>
        </div>

        {/* Lista de Inscrições */}
        {filteredInscricoes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <FiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || selectedActividade !== 'todas' || selectedStatus !== 'todos'
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Nenhuma inscrição realizada'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {filteredInscricoes.map((inscricao) => (
                <InscricaoCard
                  key={inscricao.id}
                  inscricao={inscricao}
                  onVerDetalhe={(i) => {
                    setSelectedInscricao(i);
                    setShowDetalheModal(true);
                  }}
                  onGerarQR={(i) => {
                    setSelectedInscricao(i);
                    setShowQRGenerator(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modais */}
      <AnimatePresence>
        {showQRScanner && (
          <LeitorQRCode
            onScan={handleScanQR}
            onClose={() => setShowQRScanner(false)}
          />
        )}

        {showQRGenerator && selectedInscricao && (
          <GerarQRCode
            inscricao={selectedInscricao}
            onClose={() => {
              setShowQRGenerator(false);
              setSelectedInscricao(null);
            }}
          />
        )}

        {showDetalheModal && selectedInscricao && (
          <ModalInscricaoDetalhe
            inscricao={selectedInscricao}
            onClose={() => {
              setShowDetalheModal(false);
              setSelectedInscricao(null);
            }}
            onGerarQR={(i) => {
              setSelectedInscricao(i);
              setShowQRGenerator(true);
            }}
            onConfirmar={handleConfirmar}
            onCancelar={handleCancelar}
            onCheckin={handleCheckin}
          />
        )}
      </AnimatePresence>
    </div>
  );
};