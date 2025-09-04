import { useState, useEffect, useCallback, useMemo } from "react";
import { getPessoas } from "../services/api.js";
import PessoaCard from "../components/PessoaCard";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { Mosaic } from "react-loading-indicators";

const HomePage = () => {
  const [pessoas, setPessoas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState({
    nome: "",
    status: "",
    sexo: "",
  });
  const [loading, setLoading] = useState(true);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const fetchData = useCallback(() => {
    setLoading(true);
    getPessoas(pagina, filtros)
      .then((response) => {
        setPessoas(response.data.content || []);
        setTotalPaginas(response.data.totalPages || 1);
      })
      .catch((err) => {
        toast.error("Falha ao carregar os dados. API pode estar indisponível.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pagina, filtros]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const paginasVisiveis = useMemo(() => {
    const maximoBolinhasVisiveis = 4;
    const paginas = [];

    if (totalPaginas <= maximoBolinhasVisiveis + 2) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
      return paginas;
    }

    paginas.push(1);

    let inicioBloco = Math.max(2, pagina - 1);
    let fimBloco = Math.min(totalPaginas - 1, pagina + 2);

    if (pagina < maximoBolinhasVisiveis) {
      fimBloco = maximoBolinhasVisiveis;
    }

    if (pagina > totalPaginas - (maximoBolinhasVisiveis - 1)) {
      inicioBloco = totalPaginas - (maximoBolinhasVisiveis - 1);
    }

    if (inicioBloco > 2) {
      paginas.push("...");
      paginas.push("...");
    }

    for (let i = inicioBloco; i <= fimBloco; i++) {
      paginas.push(i);
    }

    if (fimBloco < totalPaginas - 1) {
      paginas.push("...");
      paginas.push("...");
    }

    paginas.push(totalPaginas);

    return paginas;
  }, [pagina, totalPaginas]);

  const handleFiltroChange = (filtro, valor) => {
    setFiltros((prev) => ({ ...prev, [filtro]: valor }));
    setPagina(1);
  };

  const handleNomeChange = (e) => {
    setFiltros((prev) => ({ ...prev, nome: e.target.value }));
  };

  const handleSubmitBusca = (e) => {
    e.preventDefault();
    setPagina(1);
    fetchData();
  };

  const getFiltroClass = (filtro, valor) => {
    return filtros[filtro] === valor
      ? "bg-yellow-700 text-white"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  return (
    <div className="container mx-auto px-4 md:px-8 md:pb-8 md:pt-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form
          onSubmit={handleSubmitBusca}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <input
            type="text"
            value={filtros.nome}
            onChange={handleNomeChange}
            placeholder="Buscar por nome..."
            className="w-full md:flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700"
          />
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-800 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => handleFiltroChange("status", "DESAPARECIDO")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${getFiltroClass(
              "status",
              "DESAPARECIDO"
            )}`}
          >
            Desaparecidos
          </button>
          <button
            onClick={() => handleFiltroChange("status", "LOCALIZADO")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${getFiltroClass(
              "status",
              "LOCALIZADO"
            )}`}
          >
            Localizados
          </button>
          <button
            onClick={() => handleFiltroChange("sexo", "MASCULINO")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${getFiltroClass(
              "sexo",
              "MASCULINO"
            )}`}
          >
            Masculino
          </button>
          <button
            onClick={() => handleFiltroChange("sexo", "FEMININO")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${getFiltroClass(
              "sexo",
              "FEMININO"
            )}`}
          >
            Feminino
          </button>
          <button
            onClick={() =>
              handleFiltroChange("status", "") & handleFiltroChange("sexo", "")
            }
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Mosaic color="#D69D0E" size="large" text="" />
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {pessoas.length > 0 ? (
              pessoas.map((pessoa) => (
                <PessoaCard key={pessoa.id} pessoa={pessoa} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                Nenhum resultado encontrado.
              </p>
            )}
          </div>

          {pessoas.length > 0 && totalPaginas > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              {paginasVisiveis.map((item, index) =>
                typeof item === "number" ? (
                  <button
                    key={item}
                    onClick={() => setPagina(item)}
                    className={`cursor-pointer w-10 h-10 font-semibold text-white rounded-full transition-colors flex items-center justify-center ${
                      pagina === item
                        ? "bg-yellow-800 ring-2 ring-offset-2 ring-yellow-700"
                        : "bg-yellow-700 hover:bg-yellow-800"
                    }`}
                  >
                    {item}
                  </button>
                ) : (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-3 h-3 bg-yellow-700 rounded-full"
                  ></span>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
