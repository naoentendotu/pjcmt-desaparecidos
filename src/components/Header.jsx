import logoPJC from "../assets/logo-pjc.jpg";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-2 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logoPJC}
              alt="Logo da Polícia Civil MT"
              className="h-16 md:h-24 mr-3 md:mr-4"
            />
          </Link>
          <div>
            <h1 className="text-lg md:text-3xl font-bold text-gray-800">
              Pessoas Desaparecidas
            </h1>
            <p className="text-xs md:text-base text-gray-600">
              Polícia Judiciária Civil do Estado de Mato Grosso
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-right pr-6">
          <Phone className="text-yellow-600 h-10 w-10" strokeWidth={2.5} />
          <div>
            <h2 className="font-bold text-gray-800 text-base leading-tight">
              Disque Denúncia
            </h2>
            <p className="font-semibold text-yellow-600 text-lg leading-tight">
              197 / 181
            </p>
            <p className="text-sm text-gray-700 leading-tight">
              (65) 3613-6981
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
