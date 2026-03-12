import React from 'react';
import { motion } from 'framer-motion';
import {
  FiHelpCircle,
  FiMail,
  FiPlay,
  FiShield,
  FiTool,
  FiBookOpen,
  FiClock,
  FiMessageCircle,
  FiChevronDown,
} from 'react-icons/fi';

const supportSteps = [
  {
    title: 'Analisar o contexto',
    description: 'Identifique qual card, atividade ou fluxo está exibindo o comportamento que precisa de ajuda.',
    icon: FiTool,
  },
  {
    title: 'Registrar no backlog',
    description: 'Abrir o ticket no canal oficial (Slack/Teams) com prints, logs e passos para reproduzir.',
    icon: FiMessageCircle,
  },
  {
    title: 'Acompanhar status',
    description: 'Verifique atualizações no painel de tickets e confirme quando o fix estiver em produção.',
    icon: FiClock,
  },
];

const actionCards = [
  {
    title: 'Guia rápido de administração',
    text: 'Documentação das rotinas do painel, fluxos de aprovação e listas de verificações.',
    icon: FiBookOpen,
    cta: 'Abrir documento',
  },
  {
    title: 'Suporte em tempo real',
    text: 'Chame o time de operações para incidentes críticos ou falhas de infraestrutura.',
    icon: FiMail,
    cta: 'Enviar e-mail',
  },
  {
    title: 'Treinamentos gravados',
    text: 'Vídeos curtos mostrando o uso dos cards chave, filtros e seções do admin.',
    icon: FiPlay,
    cta: 'Assistir gravação',
  },
];

const faqs = [
  {
    question: 'Como limpo mensagens não lidas automaticamente?',
    answer:
      'Há um parâmetro no módulo de Configurações > Mensagens que define quantos dias um item pode ficar como não lido antes de ser arquivado. Atualize esse número e salve para aplicar.',
  },
  {
    question: 'Como desabilito o QR após terminar uma atividade?',
    answer:
      'No mesmo módulo, ativar o toggle “Desativar QR ao finalizar atividade” faz com que todos os códigos daquele evento sejam invalidados assim que ele é encerrado.',
  },
  {
    question: 'O que fazer se um card do dashboard parar de mostrar dados?',
    answer:
      'Abra o card e confira o período selecionado. Se o intervalo estiver correto, valide se a origem dos dados (API em /relatorios) está respondendo e use o botão “Recarregar dados”.',
  },
  {
    question: 'Como reportar um erro de layout ou acessibilidade?',
    answer:
      'Colete o print, terminal do console e passo a passo, depois envie para o canal de suporte interno com prioridade “Alta”.',
  },
];

export const AjudaPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div className="bg-gradient-to-r from-primary/90 via-primary to-[#541010] rounded-3xl p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.25)] text-white border border-white/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white/80">
                <FiHelpCircle size={18} />
                Central de Ajuda
              </div>
              <h1 className="mt-3 text-3xl lg:text-4xl font-semibold text-white">Precisa de suporte?</h1>
              <p className="text-base text-white/80 max-w-2xl">
                Aqui estão os atalhos, treinamentos e contatos que já seguem o mesmo design do painel para você não perder o ritmo.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/30 p-6 shadow-xl">
              <p className="text-sm uppercase tracking-widest text-white/70 mb-1">Atendimento</p>
              <p className="text-3xl font-semibold">24 / 7</p>
              <p className="text-sm text-white/70">Respostas <span className="font-medium">em até 15 min</span> quando for incidente.</p>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-4"
                whileHover={{ y: -4 }}
              >
                <div className="text-xl text-primary-600 dark:text-primary-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{card.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed">{card.text}</p>
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                  {card.cta} →
                </button>
              </motion.div>
            )
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Passos recomendados</p>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Como abrir um chamado</h2>
              </div>
              <span className="badge badge-primary">Workflow</span>
            </div>
            <div className="space-y-4">
              {supportSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-start gap-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 p-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-600 dark:text-primary-300 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Passo {index + 1}</p>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Suporte rápido</p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Precisa falar com alguém?</h2>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-4 space-y-3">
              <p className="text-sm text-red-600 dark:text-red-300 font-semibold">Incidentes críticos</p>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                Use o canal de prioridades para parar um incidente de produção, interrupção do dashboard ou falha de autenticação.
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
                <span className="flex items-center gap-2">
                  <FiShield /> Canal: #incidentes-admin
                </span>
                <span className="flex items-center gap-2">
                  <FiMail /> E-mail: suporte@igrejabaluarte.com
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Tempo médio de resposta</span>
                <strong className="text-gray-900 dark:text-white">6 min</strong>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Canal aberto</span>
                <strong className="text-gray-900 dark:text-white">Slack / Teams</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Perguntas frequentes</p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dúvidas recorrentes</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-gray-900 dark:text-white font-semibold">
                    {faq.question}
                    <FiChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
