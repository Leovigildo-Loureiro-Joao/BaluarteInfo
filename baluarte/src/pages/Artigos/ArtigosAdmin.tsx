// src/pages/Artigos/ArtigosPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiFilter, 
  FiBookOpen, 
  FiUser, 
  FiCalendar,
  FiClock,
  FiEye,
  FiDownload,
  FiX,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiTag,
  FiFileText,
  FiImage
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiScrollQuill, 
  GiAngelWings,
  GiOpenBook 
} from "react-icons/gi";
import { LiaBibleSolid, LiaCrossSolid } from "react-icons/lia";
import  ModalArtigo  from "../../components/artigos/ModalArtigo";
import { ArtigoCard } from "../../components/artigos/CardArtigoAdmin";
import { ArtigoDetail } from "../../types/api";

// Tipos baseados no seu Enum ArtigoType
type ArtigoType = 'BIBLE_STUDY' | 'DEVOTIONAL' | 'HISTORICAL' | 'DOCTRINAL' | 
                  'TESTIMONY' | 'APOLOGETICS' | 'PROPHETIC' | 'THEOLOGICAL';

export const tiposArtigo: { value: ArtigoType; label: string; icon: any; color: string }[] = [
  { value: "BIBLE_STUDY", label: "Estudo Bíblico", icon: LiaBibleSolid, color: "bg-blue-500" },
  { value: "DEVOTIONAL", label: "Devocional", icon: GiPrayer, color: "bg-green-500" },
  { value: "HISTORICAL", label: "Histórico", icon: GiScrollQuill, color: "bg-amber-500" },
  { value: "DOCTRINAL", label: "Doutrinário", icon: LiaCrossSolid, color: "bg-purple-500" },
  { value: "TESTIMONY", label: "Testemunho", icon: GiAngelWings, color: "bg-pink-500" },
  { value: "APOLOGETICS", label: "Apologética", icon: GiOpenBook, color: "bg-indigo-500" },
  { value: "PROPHETIC", label: "Profético", icon: GiScrollQuill, color: "bg-orange-500" },
  { value: "THEOLOGICAL", label: "Teológico", icon: LiaBibleSolid, color: "bg-red-500" },
];

interface Artigo {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  tipo: ArtigoType;
  autor: string;
  data: string;
  imagem: string;
  paginas: number;
  visualizacoes: number;
  tempoLeitura: string;
  tags: string[];
}

// Dados mockados
const artigosMock: Artigo[] = [
  {
    id: '1',
    titulo: "A Soberania de Deus em Tempos de Crise",
    descricao: "Uma reflexão profunda sobre como a soberania divina se manifesta mesmo nos momentos mais difíceis de nossas vidas, trazendo conforto e esperança.",
    conteudo: "Conteúdo completo do artigo...",
    tipo: "DOCTRINAL",
    escritor: "Pr. Antônio Silva",
    dataPublicacao: "2024-01-15",
    img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80",
    paginas: 12,
    visualizacoes: 1234,
    tempoLeitura: "8 min",
    tags: ["soberania", "fé", "crise"]
  },
  {
    id: '2',
    titulo: "O Poder da Oração Intercessória",
    descricao: "Descubra o impacto transformador da oração intercessória e como ela pode mudar realidades, baseado em exemplos bíblicos e testemunhos contemporâneos.",
    conteudo: "Conteúdo completo do artigo...",
    tipo: "DEVOTIONAL",
    escritor: "Pra. Maria Oliveira",
    dataPublicacao: "2024-01-10",
    img: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80",
    paginas: 8,
    visualizacoes: 856,
    tempoLeitura: "5 min",
    tags: ["oração", "intercessão", "fé"]
  },
  {
    id: '3',
    titulo: "Os 7 Selos do Apocalipse: Uma Análise Profética",
    descricao: "Estudo detalhado sobre os sete selos mencionados no livro do Apocalipse, suas interpretações históricas e significado para os dias atuais.",
    conteudo: "Conteúdo completo do artigo...",
    tipo: "PROPHETIC",
    escritor: "Pr. João Santos",
    dataPublicacao: "2024-01-05",
    img: "https://images.unsplash.com/photo-1462556791646-c201b8241a94?auto=format&fit=crop&w=800&q=80",
    paginas: 24,
    visualizacoes: 2341,
    tempoLeitura: "15 min",
    tags: ["apocalipse", "profecia", "escatologia"]
  }
];

// Componente Principal
export const ArtigosPageAdmin = () => {
  const [artigos, setArtigos] = useState<Artigo[]>(artigosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<ArtigoType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArtigo, setEditingArtigo] = useState<Artigo | undefined>();

  // Filtrar artigos
  const filteredArtigos = artigos.filter(artigo => {
    const matchesSearch = searchTerm === "" || 
      artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artigo.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artigo.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artigo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTipo = !selectedTipo || artigo.tipo === selectedTipo;

    return matchesSearch && matchesTipo;
  });

  const handleSave = (novoArtigo: Omit<ArtigoDetail, 'id'>) => {
    if (editingArtigo) {
      // Editar
      setArtigos(artigos.map(a => 
        a.id === editingArtigo.id ? { ...novoArtigo, id: a.id } as Artigo : a
      ));
    } else {
      // Criar
      const artigo: Artigo = {
        ...novoArtigo,
        id: Math.random().toString(36).substr(2, 9),
      } as Artigo;
      setArtigos([artigo, ...artigos]);
    }
    setEditingArtigo(undefined);
  };

  const handleEdit = (artigo: ArtigoDetail) => {
    setEditingArtigo(artigo);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setArtigos(artigos.filter(a => a.id !== id));
  };

 return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Grid decorativo - EXATAMENTE como você queria */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23CB2020' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10 py-8">
        {/* Header - simplificado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Artigos
            </h1>
            <p className="text-gray-500">
              Gerencie todos os <span className="text-primary">artigos</span> e estudos da <span className="text-primary">igreja</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingArtigo(undefined);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={20} />
              Novo Artigo
            </button>
          </div>
        </div>

        {/* Filtros por tipo - simplificado */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTipo(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedTipo
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {tiposArtigo.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => setSelectedTipo(tipo.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedTipo === tipo.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tipo.icon size={14} />
                {tipo.label}
              </button>
            ))}
          </div>
          
          {/* Resultados */}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
            {filteredArtigos.length} {filteredArtigos.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
          </div>
        </div>

        {/* Grid de Artigos */}
        {filteredArtigos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTipo 
                ? 'Tente buscar com outros termos ou limpar os filtros'
                : 'Comece criando seu primeiro artigo!'}
            </p>
            {(searchTerm || selectedTipo) ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTipo(null);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingArtigo(undefined);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Criar Primeiro Artigo
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredArtigos.map((artigo) => (
                <ArtigoCard
                  key={artigo.id}
                  artigo={artigo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Artigo (manter igual) */}
      <AnimatePresence>
        {showModal && (
          <ModalArtigo
            artigo={editingArtigo}
            onClose={() => {
              setShowModal(false);
              setEditingArtigo(undefined);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};