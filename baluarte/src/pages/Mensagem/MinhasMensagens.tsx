// src/pages/Mensagem/MinhasMensagens.tsx
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiXCircle } from "react-icons/fi";

interface MinhaMensagem {
  id: number;
  assunto: string;
  descricao: string;
  resposta?: string;
  dataEnvio: string;
  dataResposta?: string;
  status: "respondida" | "pendente" | "lida";
}

const minhasMensagensMock: MinhaMensagem[] = [
  {
    id: 1,
    assunto: "Dúvida sobre horários",
    descricao: "Gostaria de saber mais sobre os horários dos cultos de quarta-feira.",
    resposta: "Olá! Os cultos de quarta-feira acontecem às 20h. Esperamos você!",
    dataEnvio: "2024-03-10T14:30:00",
    dataResposta: "2024-03-11T09:15:00",
    status: "respondida",
  },
  {
    id: 2,
    assunto: "Pedido de Oração",
    descricao: "Preciso de oração pela minha saúde.",
    dataEnvio: "2024-03-12T08:20:00",
    status: "pendente",
  },
];

type MinhasMensagensDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const MinhasMensagensDrawer = ({ open, onClose }: MinhasMensagensDrawerProps) => {
  const [mensagens] = useState(minhasMensagensMock);
  const [novaMensagem, setNovaMensagem] = useState({ assunto: "", descricao: "" });
  const [showForm, setShowForm] = useState(false);

  const handleEnviarMensagem = (e: FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setShowForm(false);
    setNovaMensagem({ assunto: "", descricao: "" });
  };

  const handleClose = () => {
    setShowForm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          key="minhas-mensagens-drawer"
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="relative ml-auto h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary-500">Baluarte</p>
                <h2 className="text-2xl font-semibold text-gray-900">Minhas Mensagens</h2>
                <p className="text-sm text-gray-500">Acompanhe os pedidos enviados à igreja.</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                aria-label="Fechar painel de mensagens"
              >
                <FiXCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Histórico</h3>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600"
              >
                {showForm ? "Cancelar" : "Nova Mensagem"}
              </button>
            </div>

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-4 rounded-2xl border border-primary-100 bg-primary-50 p-4 shadow-sm"
              >
                <form onSubmit={handleEnviarMensagem} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Assunto</label>
                    <input
                      type="text"
                      value={novaMensagem.assunto}
                      onChange={(e) =>
                        setNovaMensagem({ ...novaMensagem, assunto: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Mensagem
                    </label>
                    <textarea
                      rows={3}
                      value={novaMensagem.descricao}
                      onChange={(e) =>
                        setNovaMensagem({ ...novaMensagem, descricao: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
                  >
                    Enviar
                  </button>
                </form>
              </motion.div>
            )}

            <div className="mt-5 space-y-4">
              {mensagens.map((msg) => (
                <motion.article
                  key={msg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{msg.assunto}</h4>
                      <p className="text-xs text-gray-500">
                        Enviada em {new Date(msg.dataEnvio).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                        msg.status === "respondida"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {msg.status === "respondida" ? "Respondida" : "Aguardando"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-700">📝 {msg.descricao}</p>

                  {msg.resposta && (
                    <div className="mt-3 rounded-xl border-l-4 border-primary-500 bg-primary-50 p-3 text-sm text-gray-700">
                      <p className="text-gray-500">Resposta da igreja:</p>
                      <p>💬 {msg.resposta}</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(msg.dataResposta!).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          </motion.aside>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
