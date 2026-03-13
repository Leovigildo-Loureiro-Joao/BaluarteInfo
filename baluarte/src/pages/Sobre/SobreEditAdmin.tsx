// src/pages/Admin/ConteudoSobrePage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiImage,
  FiMapPin,
  FiClock,
  FiPhone,
  FiMail,
  FiUsers,
  FiHeart,
  FiCalendar,
  FiAward,
  FiEye,
  FiEyeOff,
  FiMove
} from "react-icons/fi";
import { 
  GiPrayer, 
  GiChurch,
  GiHeartBeats,
  GiFamilyHouse,
  GiCrown,
  GiSecretBook
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";

// Tipos para cada seção
interface Historia {
  titulo: string;
  descricao: string[];
  imagens: {
    url: string;
    descricao: string;
  }[];
  dataFundacao: string;
  fundadores: string[];
}

interface Valor {
  id: string;
  icon: string;
  titulo: string;
  descricao: string;
  ordem: number;
  ativo: boolean;
}

interface Pastor {
  id: string;
  nome: string;
  cargo: string;
  foto: string;
  descricao: string;
  email?: string;
  ordem: number;
  ativo: boolean;
}

interface Estatistica {
  id: string;
  numero: string;
  label: string;
  icon: string;
  ordem: number;
  ativo: boolean;
}

interface Localizacao {
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  horarios: {
    dia: string;
    horarios: string[];
  }[];
  contato: {
    telefone: string;
    email: string;
    whatsapp?: string;
  };
  mapa: {
    latitude: number;
    longitude: number;
    embed: string;
  };
}

interface CTASobre {
  titulo: string;
  descricao: string;
  botao1: {
    texto: string;
    link: string;
  };
  botao2: {
    texto: string;
    link: string;
  };
  ativo: boolean;
}

interface ConteudoSobre {
  historia: Historia;
  valores: Valor[];
  pastores: Pastor[];
  estatisticas: Estatistica[];
  localizacao: Localizacao;
  cta: CTASobre;
}

// Dados mockados
const conteudoMock: ConteudoSobre = {
  historia: {
    titulo: "Uma caminhada de fé desde 2009",
    descricao: [
      "A Igreja Baluarte nasceu do sonho de um grupo de irmãos que desejavam ver vidas transformadas pelo poder do Evangelho. Em 15 de março de 2009, realizamos nosso primeiro culto com apenas 12 pessoas em uma sala alugada.",
      "Ao longo dos anos, Deus nos permitiu crescer e hoje somos uma comunidade de mais de 500 membros, com diversas atividades e ministérios que alcançam nossa cidade e além. Nossa sede própria foi conquistada em 2015, um marco importante na nossa jornada.",
      "Mas mais que números, celebramos vidas transformadas, famílias restauradas e o amor de Deus sendo derramado sobre todos que passam por aqui."
    ],
    imagens: [
      {
        url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
        descricao: "Primeiro culto"
      },
      {
        url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
        descricao: "Igreja hoje"
      }
    ],
    dataFundacao: "2009-03-15",
    fundadores: ["Pr. Antônio Silva", "Pra. Maria Oliveira", "Diácono João Santos"]
  },
  valores: [
    {
      id: "1",
      icon: "GiBible",
      titulo: "Fundamento na Palavra",
      descricao: "A Bíblia é nossa única regra de fé e prática. Tudo o que fazemos está baseado nas Escrituras.",
      ordem: 1,
      ativo: true
    },
    {
      id: "2",
      icon: "GiPrayer",
      titulo: "Vida de Oração",
      descricao: "Cremos no poder da oração e buscamos uma vida de intimidade com Deus através dela.",
      ordem: 2,
      ativo: true
    },
    {
      id: "3",
      icon: "GiHeartBeats",
      titulo: "Amor ao Próximo",
      descricao: "O amor é nossa marca. Amamos a Deus sobre todas as coisas e ao próximo como a nós mesmos.",
      ordem: 3,
      ativo: true
    }
  ],
  pastores: [
    {
      id: "1",
      nome: "Pr. Antônio Silva",
      cargo: "Pastor Presidente",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      descricao: "Pastor há 20 anos, formado em Teologia pelo Seminário Teológico Batista do Sul. Casado com Pra. Maria e pai de 3 filhos.",
      email: "pastor.antonio@igrejabaluarte.com",
      ordem: 1,
      ativo: true
    },
    {
      id: "2",
      nome: "Pra. Maria Oliveira",
      cargo: "Pastora Adjunta",
      foto: "https://images.unsplash.com/photo-1494790108777-9f3e9b8f0b9e?auto=format&fit=crop&w=400&q=80",
      descricao: "Especialista em Aconselhamento Bíblico e líder do ministério de oração. Casada com Pr. Antônio.",
      email: "pastora.maria@igrejabaluarte.com",
      ordem: 2,
      ativo: true
    }
  ],
  estatisticas: [
    { id: "1", numero: "15+", label: "Anos de história", icon: "FiCalendar", ordem: 1, ativo: true },
    { id: "2", numero: "500+", label: "Membros", icon: "FiUsers", ordem: 2, ativo: true },
    { id: "3", numero: "30+", label: "Ministérios", icon: "GiPrayer", ordem: 3, ativo: true },
    { id: "4", numero: "1000+", label: "Vidas alcançadas", icon: "FiHeart", ordem: 4, ativo: true }
  ],
  localizacao: {
    endereco: {
      rua: "Rua da Igreja",
      numero: "123",
      complemento: "Sala 2",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "12345-678"
    },
    horarios: [
      { dia: "Domingo", horarios: ["09:00 - Escola Bíblica", "19:00 - Culto"] },
      { dia: "Quarta-feira", horarios: ["20:00 - Culto de Oração"] }
    ],
    contato: {
      telefone: "(11) 3333-4444",
      email: "contato@igrejabaluarte.com",
      whatsapp: "(11) 99999-9999"
    },
    mapa: {
      latitude: -23.5641234,
      longitude: -46.6541234,
      embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197496135465!2d-46.6541234!3d-23.5641234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUxLjAiUyA0NsKwMzknMTUuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
    }
  },
  cta: {
    titulo: "Faça parte desta história",
    descricao: "Venha nos conhecer, crescer conosco e fazer parte da família Baluarte",
    botao1: {
      texto: "Entre em contato",
      link: "/contacto"
    },
    botao2: {
      texto: "Conheça nossas atividades",
      link: "/actividades"
    },
    ativo: true
  }
};

// Componente de Seção Editável
const SecaoEditavel = ({ 
  titulo, 
  icone: Icon, 
  children,
  onSave,
  editando,
  onToggleEdit
}: { 
  titulo: string; 
  icone: any; 
  children: React.ReactNode;
  onSave: () => void;
  editando: boolean;
  onToggleEdit: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="text-primary-500" size={20} />
          <h3 className="font-semibold text-lg">{titulo}</h3>
        </div>
        <div className="flex gap-2">
          {editando ? (
            <>
              <button
                onClick={onToggleEdit}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiX size={18} />
              </button>
              <button
                onClick={onSave}
                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
              >
                <FiSave size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={onToggleEdit}
              className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <FiEdit2 size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Componente de Input com Preview
const InputComPreview = ({ 
  label, 
  value, 
  onChange, 
  type = "text",
  multiline = false,
  rows = 3
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
}) => (
  <div className="mb-4 w-full">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
    )}
  </div>
);

// Modal de Edição de Valor
const ModalEditarValor = ({ 
  valor, 
  onClose, 
  onSave 
}: { 
  valor?: Valor; 
  onClose: () => void; 
  onSave: (valor: Valor) => void;
}) => {
  const [formData, setFormData] = useState({
    id: valor?.id || String(Date.now()),
    icon: valor?.icon || "GiBible",
    titulo: valor?.titulo || "",
    descricao: valor?.descricao || "",
    ordem: valor?.ordem || 0,
    ativo: valor?.ativo ?? true
  });

  const iconOptions = [
    { value: "GiBible", label: "Bíblia", icon: LiaBibleSolid },
    { value: "GiPrayer", label: "Oração", icon: GiPrayer },
    { value: "GiHeartBeats", label: "Coração", icon: GiHeartBeats },
    { value: "GiFamilyHouse", label: "Família", icon: GiFamilyHouse },
    { value: "GiChurch", label: "Igreja", icon: GiChurch },
    { value: "FiHeart", label: "Amor", icon: FiHeart }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Valor);
    onClose();
  };

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
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {valor ? "Editar Valor" : "Novo Valor"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {iconOptions.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <InputComPreview
              label="Título"
              value={formData.titulo}
              onChange={(value) => setFormData({...formData, titulo: value})}
            />

            <InputComPreview
              label="Descrição"
              value={formData.descricao}
              onChange={(value) => setFormData({...formData, descricao: value})}
              multiline
              rows={3}
            />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Ativo</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente Principal
export const ConteudoSobrePage = () => {
  const [conteudo, setConteudo] = useState<ConteudoSobre>(conteudoMock);
  const [secaoEditando, setSecaoEditando] = useState<string | null>(null);
  const [modalValorAberto, setModalValorAberto] = useState(false);
  const [valorEditando, setValorEditando] = useState<Valor | undefined>();

  const handleSaveSecao = (secao: string) => {
    // Aqui salvaria na API
    console.log(`Salvando seção ${secao}:`, conteudo);
    setSecaoEditando(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Conteúdo da Página Sobre
          </h1>
          <p className="text-gray-500">
            Gerencie todo o conteúdo da página "Sobre Nós" da igreja
          </p>
        </div>

        {/* História */}
        <SecaoEditavel
          titulo="História"
          icone={FiCalendar}
          editando={secaoEditando === 'historia'}
          onToggleEdit={() => setSecaoEditando(secaoEditando === 'historia' ? null : 'historia')}
          onSave={() => handleSaveSecao('historia')}
        >
          <div className="space-y-4">
            <InputComPreview
              label="Título"
              value={conteudo.historia.titulo}
              onChange={(value) => setConteudo({
                ...conteudo,
                historia: { ...conteudo.historia, titulo: value }
              })}
            />

            {conteudo.historia.descricao.map((paragrafo, index) => (
              <div key={index} className="flex gap-2">
                <InputComPreview
                  label={`Parágrafo ${index + 1}`}
                  value={paragrafo}
                  onChange={(value) => {
                    const newDescricao = [...conteudo.historia.descricao];
                    newDescricao[index] = value;
                    setConteudo({
                      ...conteudo,
                      historia: { ...conteudo.historia, descricao: newDescricao }
                    });
                  }}
                  multiline
                  rows={3}
                />
                <button
                  onClick={() => {
                    const newDescricao = conteudo.historia.descricao.filter((_, i) => i !== index);
                    setConteudo({
                      ...conteudo,
                      historia: { ...conteudo.historia, descricao: newDescricao }
                    });
                  }}
                  className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg h-10"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={() => setConteudo({
                ...conteudo,
                historia: {
                  ...conteudo.historia,
                  descricao: [...conteudo.historia.descricao, ""]
                }
              })}
              className="flex items-center gap-2 px-4 py-2 text-primary-500 hover:bg-primary-50 rounded-lg"
            >
              <FiPlus size={16} />
              Adicionar Parágrafo
            </button>

            <InputComPreview
              label="Data de Fundação"
              type="date"
              value={conteudo.historia.dataFundacao}
              onChange={(value) => setConteudo({
                ...conteudo,
                historia: { ...conteudo.historia, dataFundacao: value }
              })}
            />
          </div>
        </SecaoEditavel>

        {/* Valores */}
        <SecaoEditavel
          titulo="Valores"
          icone={FiHeart}
          editando={secaoEditando === 'valores'}
          onToggleEdit={() => setSecaoEditando(secaoEditando === 'valores' ? null : 'valores')}
          onSave={() => handleSaveSecao('valores')}
        >
          <div className="space-y-4">
            {conteudo.valores.map((valor, index) => (
              <div key={valor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMove className="text-gray-400 cursor-move" />
                <div className="flex-1">
                  <p className="font-medium">{valor.titulo}</p>
                  <p className="text-sm text-gray-500">{valor.descricao.substring(0, 60)}...</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setValorEditando(valor);
                      setModalValorAberto(true);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => setConteudo({
                      ...conteudo,
                      valores: conteudo.valores.filter(v => v.id !== valor.id)
                    })}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setValorEditando(undefined);
                setModalValorAberto(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-primary-500 hover:bg-primary-50 rounded-lg"
            >
              <FiPlus size={16} />
              Adicionar Valor
            </button>
          </div>
        </SecaoEditavel>

        {/* Pastores */}
        <SecaoEditavel
          titulo="Pastores"
          icone={GiCrown}
          editando={secaoEditando === 'pastores'}
          onToggleEdit={() => setSecaoEditando(secaoEditando === 'pastores' ? null : 'pastores')}
          onSave={() => handleSaveSecao('pastores')}
        >
          <div className="space-y-4">
            {conteudo.pastores.map((pastor) => (
              <div key={pastor.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={pastor.foto}
                  alt={pastor.nome}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{pastor.nome}</p>
                  <p className="text-sm text-gray-500">{pastor.cargo}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <FiEdit2 size={14} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <button className="flex items-center gap-2 px-4 py-2 text-primary-500 hover:bg-primary-50 rounded-lg">
              <FiPlus size={16} />
              Adicionar Pastor
            </button>
          </div>
        </SecaoEditavel>

        {/* Localização */}
        <SecaoEditavel
          titulo="Localização"
          icone={FiMapPin}
          editando={secaoEditando === 'localizacao'}
          onToggleEdit={() => setSecaoEditando(secaoEditando === 'localizacao' ? null : 'localizacao')}
          onSave={() => handleSaveSecao('localizacao')}
        >
          <div className="grid grid-cols-2 gap-4">
            <InputComPreview
              label="Rua"
              value={conteudo.localizacao.endereco.rua}
              onChange={(value) => setConteudo({
                ...conteudo,
                localizacao: {
                  ...conteudo.localizacao,
                  endereco: { ...conteudo.localizacao.endereco, rua: value }
                }
              })}
            />
            <InputComPreview
              label="Número"
              value={conteudo.localizacao.endereco.numero}
              onChange={(value) => setConteudo({
                ...conteudo,
                localizacao: {
                  ...conteudo.localizacao,
                  endereco: { ...conteudo.localizacao.endereco, numero: value }
                }
              })}
            />
            <InputComPreview
              label="Bairro"
              value={conteudo.localizacao.endereco.bairro}
              onChange={(value) => setConteudo({
                ...conteudo,
                localizacao: {
                  ...conteudo.localizacao,
                  endereco: { ...conteudo.localizacao.endereco, bairro: value }
                }
              })}
            />
            <InputComPreview
              label="Cidade"
              value={conteudo.localizacao.endereco.cidade}
              onChange={(value) => setConteudo({
                ...conteudo,
                localizacao: {
                  ...conteudo.localizacao,
                  endereco: { ...conteudo.localizacao.endereco, cidade: value }
                }
              })}
            />
          </div>
        </SecaoEditavel>

        {/* CTA */}
        <SecaoEditavel
          titulo="Chamada para Ação"
          icone={FiHeart}
          editando={secaoEditando === 'cta'}
          onToggleEdit={() => setSecaoEditando(secaoEditando === 'cta' ? null : 'cta')}
          onSave={() => handleSaveSecao('cta')}
        >
          <div className="space-y-4">
            <InputComPreview
              label="Título"
              value={conteudo.cta.titulo}
              onChange={(value) => setConteudo({
                ...conteudo,
                cta: { ...conteudo.cta, titulo: value }
              })}
            />
            <InputComPreview
              label="Descrição"
              value={conteudo.cta.descricao}
              onChange={(value) => setConteudo({
                ...conteudo,
                cta: { ...conteudo.cta, descricao: value }
              })}
              multiline
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputComPreview
                label="Texto Botão 1"
                value={conteudo.cta.botao1.texto}
                onChange={(value) => setConteudo({
                  ...conteudo,
                  cta: {
                    ...conteudo.cta,
                    botao1: { ...conteudo.cta.botao1, texto: value }
                  }
                })}
              />
              <InputComPreview
                label="Link Botão 1"
                value={conteudo.cta.botao1.link}
                onChange={(value) => setConteudo({
                  ...conteudo,
                  cta: {
                    ...conteudo.cta,
                    botao1: { ...conteudo.cta.botao1, link: value }
                  }
                })}
              />
            </div>
          </div>
        </SecaoEditavel>

        {/* Preview Button */}
        <div className="fixed bottom-8 right-8">
          <a
            href="/sobre"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg"
          >
            <FiEye size={18} />
            Visualizar Página
          </a>
        </div>
      </div>

      {/* Modal de Valor */}
      <AnimatePresence>
        {modalValorAberto && (
          <ModalEditarValor
            valor={valorEditando}
            onClose={() => {
              setModalValorAberto(false);
              setValorEditando(undefined);
            }}
            onSave={(novoValor) => {
              if (valorEditando) {
                // Editar
                setConteudo({
                  ...conteudo,
                  valores: conteudo.valores.map(v => 
                    v.id === novoValor.id ? novoValor : v
                  )
                });
              } else {
                // Adicionar
                setConteudo({
                  ...conteudo,
                  valores: [...conteudo.valores, novoValor]
                });
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};