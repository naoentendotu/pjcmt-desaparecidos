import logoPJC from "../assets/logo-pjc.jpg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Link to="/">
          <img
            src={logoPJC}
            alt="Logo da Polícia Civil MT"
            className="h-28 mr-4"
          />
        </Link>
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Pessoas Desaparecidas
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Polícia Judiciária Civil do Estado de Mato Grosso
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
