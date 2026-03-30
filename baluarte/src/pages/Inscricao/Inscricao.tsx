// src/pages/Admin/InscricoesPage.tsx
import { useState, useRef, useEffect, useMemo } from "react";
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
import { apiFetch } from "../../utils/api.js";
import { StatusIncritos } from "../../types/api";
import type { ActividadeSummary, InscritosData, PageResponse } from "../../types/api";

type Inscricao = InscritosData;
type Actividade = Pick<ActividadeSummary, "id" | "titulo" | "capacidade" | "inscritos" | "dataEvento">;

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
      Id: inscricao.id,
      eventoId: inscricao.actividadeId,
      dataEvento: inscricao.actividadeData
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
  onCheckin
}: { 
  inscricao: Inscricao; 
  onClose: () => void; 
  onGerarQR: (inscricao: Inscricao) => void;
  onCheckin: (inscricao: Inscricao) => void;
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
              inscricao.status === StatusIncritos.Presente ? 'bg-green-100 text-green-600' :
              inscricao.status === StatusIncritos.Pendente ? 'bg-yellow-100 text-yellow-600' :
              'bg-gray-100 text-gray-600'
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
            {inscricao.dataCheckin && (
              <div className="flex items-center gap-3 text-green-600">
                <FiCheckCircle size={16} />
                <span>Check-in: {new Date(inscricao.dataCheckin).toLocaleString('pt-BR')}</span>
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

            {inscricao.status !== StatusIncritos.Presente && !inscricao.dataCheckin && (
              <button
                onClick={() => {
                  onCheckin(inscricao);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <FiCheck size={18} />
                Fazer Check-in
              </button>
            )}
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
              inscricao.status === StatusIncritos.Presente ? 'bg-green-100 text-green-600' :
              inscricao.status === StatusIncritos.Pendente ? 'bg-yellow-100 text-yellow-600' :
              'bg-gray-100 text-gray-600'
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
          </div>

          {inscricao.dataCheckin && (
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
  const [inscricoes, setInscricoes] = useState<InscritosData[]>([]);
  const [actividades, setActividades] = useState<Actividade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActividade, setSelectedActividade] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | StatusIncritos>('todos');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [selectedInscricao, setSelectedInscricao] = useState<Inscricao | null>(null);
  const [showDetalheModal, setShowDetalheModal] = useState(false);
  const [actionError, setActionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);

  const apiParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    params.set(
      "actividadeId",
      selectedActividade === "todas" ? "0" : String(Number(selectedActividade))
    );
    return params.toString();
  }, [page, selectedActividade, size]);

  useEffect(() => {
    setPage(0);
  }, [selectedActividade]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "200");
        const res = await apiFetch(`/admin/actividade?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar actividades.");
        const payload = (await res.json()) as PageResponse<ActividadeSummary>;
        const next = (payload.content ?? []).map((act) => ({
          id: act.id,
          titulo: act.titulo,
          capacidade: act.capacidade,
          inscritos: act.inscritos,
          dataEvento: act.dataEvento,
        }));
        setActividades(next);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setActividades([]);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await apiFetch(`/admin/inscritos?${apiParams}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar inscritos.");
        const payload = (await res.json()) as PageResponse<Inscricao>;
        setInscricoes(payload.content ?? []);
        setTotalPages(payload.totalPages ?? 0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setInscricoes([]);
        setTotalPages(0);
        setLoadError(err instanceof Error ? err.message : "Não foi possível carregar inscritos.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [apiParams, reloadToken]);

  // Estatísticas
  const stats = {
    total: inscricoes.length,
    presentes: inscricoes.filter(i => i.status === StatusIncritos.Presente || Boolean(i.dataCheckin)).length,
    pendentes: inscricoes.filter(i => i.status === StatusIncritos.Pendente && !i.dataCheckin).length,
    ausentes: inscricoes.filter(i => i.status === StatusIncritos.Ausente).length
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

    if (selectedStatus !== 'todos' && i.status !== selectedStatus) return false;

    return true;
  });

  const marcarPresenca = async (payload: unknown) => {
    setActionError("");
    try {
      const res = await apiFetch("/user/inscritos/auntenticar", { method: "POST", body: payload });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Falha ao marcar presença.");
      }
      setReloadToken((t) => t + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Falha ao marcar presença.");
    }
  };

  const handleScanQR = async (data: string) => {
    setShowQRScanner(false);
    let qrPayload: any;
    try {
      qrPayload = JSON.parse(data);
    } catch {
      setActionError("QR Code inválido.");
      return;
    }
    if (!qrPayload || typeof qrPayload !== "object" || typeof qrPayload.Id === "undefined") {
      setActionError("QR Code inválido.");
      return;
    }
    await marcarPresenca(qrPayload);
  };

  const handleCheckin = async (inscricao: Inscricao) => {
    await marcarPresenca({
      Id: inscricao.id,
      dataEvento: inscricao.actividadeData,
      eventoId: inscricao.actividadeId,
    });
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

        {(loadError || actionError || loading) && (
          <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="text-sm">
              {loading && <span className="text-gray-500">Carregando...</span>}
              {!loading && loadError && <span className="text-red-600">{loadError}</span>}
              {!loading && !loadError && actionError && <span className="text-red-600">{actionError}</span>}
            </div>
            <button
              onClick={() => setReloadToken((t) => t + 1)}
              disabled={loading}
              className={`px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Atualizar
            </button>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-primary-500">
            <p className="text-sm text-gray-500">Total Inscrições</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-green-500">
            <p className="text-sm text-gray-500">Presentes</p>
            <p className="text-2xl font-bold text-green-600">{stats.presentes}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-yellow-500">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-gray-400">
            <p className="text-sm text-gray-500">Ausentes</p>
            <p className="text-2xl font-bold text-gray-700">{stats.ausentes}</p>
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
                  {act.titulo} ({act.inscritos ?? 0}/{act.capacidade ?? "-"})
                </option>
              ))}
            </select>

            {/* Filtro por status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'todos' | StatusIncritos)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[150px]"
            >
              <option value="todos">Todos status</option>
              <option value={StatusIncritos.Pendente}>Pendentes</option>
              <option value={StatusIncritos.Presente}>Presentes</option>
              <option value={StatusIncritos.Ausente}>Ausentes</option>
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

        {totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={loading || page <= 0}
              className={`px-4 py-2 rounded-lg border border-gray-200 ${
                loading || page <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              Anterior
            </button>
            <div className="text-sm text-gray-600">
              Página <span className="font-semibold">{page + 1}</span> de{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={loading || page >= totalPages - 1}
              className={`px-4 py-2 rounded-lg border border-gray-200 ${
                loading || page >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              Próxima
            </button>
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
            onCheckin={handleCheckin}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
