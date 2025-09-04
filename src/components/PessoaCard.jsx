import { Link } from "react-router-dom";
import avatarPlaceholder from "../assets/avatar-placeholder.jpg";

const PessoaCard = ({ pessoa }) => {
  const status = pessoa.ultimaOcorrencia?.dataLocalizacao
    ? "Localizado"
    : "Desaparecido";

  const statusClass = status === "Desaparecido" ? "bg-red-600" : "bg-green-800";

  const fotoUrl = pessoa.urlFoto || avatarPlaceholder;
  const cidade =
    pessoa.ultimaOcorrencia?.localDesaparecimentoConcat?.split("-")[0].trim() ||
    "Local não informado";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
      <div>
        <img
          src={fotoUrl}
          alt={pessoa.nome}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {pessoa.nome}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Cidade: {cidade}</p>
          <span
            className={`mt-3 inline-block px-3 py-1 text-xs font-bold text-white rounded-full ${statusClass}`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100">
        <Link
          to={`/pessoa/${pessoa.id}`}
          className="w-full block text-center bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-800 transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default PessoaCard;
