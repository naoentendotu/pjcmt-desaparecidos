import logoPJC from "../assets/logo-pjc.jpg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-2 md:py-4 flex items-center">
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
    </header>
  );
};

export default Header;
