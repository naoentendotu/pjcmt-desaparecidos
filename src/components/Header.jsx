import { useState, useEffect } from "react";
import logoPJC from "../assets/logo-pjc.jpg";
import { Link } from "react-router-dom";
import { Phone, UserSearch, UserCheck, Info, X } from "lucide-react";
import { getEstatisticas } from "../services/api";

const Header = () => {
  const [estatisticas, setEstatisticas] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const fetchEstatisticas = () => {
      getEstatisticas()
        .then((response) => {
          setEstatisticas(response.data);
        })
        .catch((error) => {
          console.error("Falha ao buscar estatísticas:", error);
          setEstatisticas({
            quantPessoasDesaparecidas: 0,
            quantPessoasEncontradas: 0,
          });
        });
    };

    fetchEstatisticas();
  }, []);

  const InfoContent = () => (
    <>
      {estatisticas ? (
        <div className="flex w-full flex-col md:flex-row items-center gap-4 md:gap-6 text-center">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <UserSearch className="h-7 w-7 text-orange-600" />
              <span className="text-2xl font-bold text-gray-800">
                {estatisticas.quantPessoasDesaparecidas}
              </span>
              <span className="text-xs text-gray-500 uppercase font-semibold">
                Desaparecidos
              </span>
            </div>
            <div className="flex flex-col items-center">
              <UserCheck className="h-7 w-7 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">
                {estatisticas.quantPessoasEncontradas}
              </span>
              <span className="text-xs text-gray-500 uppercase font-semibold">
                Localizados
              </span>
            </div>
          </div>

          <div className="border-t md:border-l md:border-t-0 border-gray-300 h-px md:h-12 w-full md:w-px my-4 md:my-0"></div>

          <div className="flex items-center gap-2 text-left">
            <Phone className="text-yellow-600 h-10 w-10" strokeWidth={2.5} />
            <div>
              <h2 className="font-bold text-gray-800 text-base leading-tight">
                Disque Denúncia
              </h2>
              <p className="font-semibold text-yellow-600 text-lg leading-tight">
                197 / 181
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full py-4">
          <p className="text-sm text-gray-500">Carregando dados...</p>
        </div>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-8.5 py-2 md:py-4 flex items-center justify-between">
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

        <div className="hidden md:flex">
          <InfoContent />
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Mostrar mais informações"
          >
            {menuAberto ? <X size={28} /> : <Info size={28} />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="md:hidden bg-white shadow-lg w-full p-4 border-t border-gray-200">
          <InfoContent />
        </div>
      )}
    </header>
  );
};

export default Header;
