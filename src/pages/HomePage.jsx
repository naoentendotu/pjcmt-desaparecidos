import { useState, useEffect, useCallback, useMemo } from "react";
import { getPessoasMock, getPessoas } from "../services/api.js";
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
    faixaIdadeInicial: 0,
    faixaIdadeFinal: 0,
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
        console.error("Falha na API, ativando fallback para mock:", err);
        toast.error("A API está indisponível. Exibindo dados de exemplo.", {
          icon: "⚠️",
          duration: 4000,
        });
        return getPessoasMock(pagina, filtros).then((mockResponse) => {
          setPessoas(mockResponse.data.content || []);
          setTotalPaginas(mockResponse.data.totalPages || 1);
        });
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

  const limparFiltros = () => {
    setFiltros({
      nome: "",
      status: "",
      sexo: "",
      faixaIdadeInicial: 0,
      faixaIdadeFinal: 0,
    });
    setPagina(1);
  };

  const opcoesIdade = [
    { value: "0-0", label: "Idade" },
    { value: "0-10", label: "0 a 10 anos" },
    { value: "11-17", label: "11 a 17 anos" },
    { value: "18-30", label: "18 a 30 anos" },
    { value: "31-50", label: "31 a 50 anos" },
    { value: "51-120", label: "Mais de 50 anos" },
  ];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
    setPagina(1);
  };

  const handleIdadeChange = (e) => {
    const { value } = e.target;
    const [inicio, fim] = value.split("-").map(Number);
    setFiltros((prev) => ({
      ...prev,
      faixaIdadeInicial: inicio || 0,
      faixaIdadeFinal: fim || 0,
    }));
    setPagina(1);
  };

  const handleNomeChange = (e) => {
    setFiltros((prev) => ({ ...prev, nome: e.target.value }));
  };

  const handleSubmitBusca = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="container mx-auto px-4 md:px-8 md:pb-8 md:pt-36">
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
            className="cursor-pointer w-full md:flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700"
          />
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-800 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <select
            name="status"
            value={filtros.status}
            onChange={handleFiltroChange}
            className="cursor-pointer w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700"
          >
            <option value="">Status</option>
            <option value="DESAPARECIDO">Desaparecidos</option>
            <option value="LOCALIZADO">Localizados</option>
          </select>

          <select
            name="sexo"
            value={filtros.sexo}
            onChange={handleFiltroChange}
            className="w-full cursor-pointer p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700"
          >
            <option value="">Sexo</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>

          <select
            name="idade"
            value={`${filtros.faixaIdadeInicial}-${filtros.faixaIdadeFinal}`}
            onChange={handleIdadeChange}
            className="w-full cursor-pointer p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700"
          >
            {opcoesIdade.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={limparFiltros}
            className="cursor-pointer w-full flex items-center justify-center p-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {" "}
            Limpar filtros
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
