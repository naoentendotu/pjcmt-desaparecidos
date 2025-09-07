import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-yellow-800 text-gray-300 mt-2">
      <div className="container mx-auto px-4 py-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="mb-4 sm:mb-0">
            <p className="text-xs mt-1">
              Desenvolvido por{" "}
              <a href="#" className="hover:text-yellow-500 transition-colors">
                Tuliana Andrade
              </a>
            </p>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Pessoas Desaparecidas. Todos os
              direitos reservados.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/naoentendotu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/tulianandrade"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
