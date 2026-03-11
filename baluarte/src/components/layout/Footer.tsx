// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { 
  FiMapPin, FiPhone, FiMail, FiClock,
  FiFacebook, FiInstagram, FiYoutube, FiTwitter,
  FiChevronRight
} from "react-icons/fi";
import { icone } from "../../assets/Assets";

export const Footer = () => {
  const anoAtual = new Date().getFullYear();

  const linksUteis = [
    { label: "Sobre nós", path: "/sobre" },
    { label: "Artigos", path: "/artigos" },
    { label: "Actividades", path: "/actividades" },
    { label: "Mídia", path: "/midia" },
    { label: "Contacto", path: "/contacto" },
  ];

  const ministerios = [
    "Escola Bíblica",
    "Ministério Infantil",
    "Juventude",
    "Casais",
    "Louvor",
    "Intercessão",
  ];

  const horarios = [
    { dia: "Domingo", horario: "09:00 - Escola Bíblica" },
    { dia: "Domingo", horario: "19:00 - Culto de Celebração" },
    { dia: "Quarta", horario: "20:00 - Culto de Oração" },
    { dia: "Sábado", horario: "19:00 - Ensaio do Louvor" },
  ];

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Wave decorativo no topo (opcional) */}
      <div className="absolute top-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
          <path 
            fill="#CB2020" 
            fillOpacity="0.1" 
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
      </div>

      {/* Conteúdo principal do footer */}
      <div className="container-custom relative pt-16 pb-8">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Coluna 1 - Sobre */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={icone} alt="Baluarte" className="w-12 h-12" />
              <h3 className="text-2xl font-bold text-white">
                Igreja <span className="text-primary">Baluarte</span>
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Uma comunidade de fé dedicada a amar a Deus, servir ao próximo e 
              fazer discípulos de todas as nações.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiFacebook />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiInstagram />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiYoutube />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Úteis */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Links Úteis</h4>
            <ul className="space-y-3">
              {linksUteis.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 hover:text-primary transition-colors group"
                  >
                    <FiChevronRight className="text-primary text-sm group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 - Ministérios */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Ministérios</h4>
            <ul className="space-y-3">
              {ministerios.map((item, index) => (
                <li key={index}>
                  <Link 
                    to="/ministerios"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <FiChevronRight className="text-primary text-sm" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 - Horários e Contato */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Horários</h4>
            <ul className="space-y-3 mb-6">
              {horarios.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <FiClock className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{item.dia}:</span>
                    <span className="block text-gray-400">{item.horario}</span>
                  </div>
                </li>
              ))}
            </ul>

            <h4 className="text-white text-lg font-semibold mb-4 mt-8">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <FiMapPin className="text-primary flex-shrink-0" />
                <span>Rua da Igreja, 123 - Centro, Cidade/UF</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <FiPhone className="text-primary flex-shrink-0" />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <FiMail className="text-primary flex-shrink-0" />
                <span>contato@igrejabaluarte.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {anoAtual} Igreja Baluarte. Todos os direitos reservados.
            </p>

            {/* Links legais */}
            <div className="flex gap-6 text-sm">
              <Link to="/privacidade" className="text-gray-500 hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="text-gray-500 hover:text-primary transition-colors">
                Termos de Uso
              </Link>
            </div>

            {/* Desenvolvido por (opcional) */}
            <p className="text-sm text-gray-600">
              Desenvolvido com ❤️ para o Reino
            </p>
          </div>
        </div>
      </div>

      {/* Efeito de gradiente no fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </footer>
  );
};