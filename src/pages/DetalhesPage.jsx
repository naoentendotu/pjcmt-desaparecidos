import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPessoaByIdMock,
  getPessoaById,
  getInformacoesDesaparecido,
  getInformacoesDesaparecidoMock,
} from "../services/api";
import InfoForm from "../components/InfoForm";
import avatarPlaceholder from "../assets/avatar-placeholder.jpg";
import toast from "react-hot-toast";
import { Mosaic } from "react-loading-indicators";
import { FileText } from "lucide-react";
import Footer from "../components/Footer";

const formatarData = (dataString) => {
  if (!dataString) return "Não informado";
  return new Date(dataString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

const formatarDataHora = (dataString) => {
  if (!dataString) return "Não informado";
  return new Date(dataString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Paginacao = ({ paginaAtual, totalPaginas, onPageChange }) => {
  const paginasVisiveis = useMemo(() => {
    const maximoBolinhasVisiveis = 4;
    const paginas = [];
    if (totalPaginas <= 1) return [];

    if (totalPaginas <= maximoBolinhasVisiveis + 2) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
      return paginas;
    }

    paginas.push(1);
    let inicioBloco = Math.max(2, paginaAtual - 1);
    let fimBloco = Math.min(totalPaginas - 1, paginaAtual + 2);
    if (paginaAtual < maximoBolinhasVisiveis) fimBloco = maximoBolinhasVisiveis;
    if (paginaAtual > totalPaginas - (maximoBolinhasVisiveis - 1))
      inicioBloco = totalPaginas - (maximoBolinhasVisiveis - 1);
    if (inicioBloco > 2) paginas.push("...");
    for (let i = inicioBloco; i <= fimBloco; i++) paginas.push(i);
    if (fimBloco < totalPaginas - 1) paginas.push("...");
    paginas.push(totalPaginas);

    return paginas.filter(
      (item, index) => item !== "..." || paginas[index - 1] !== "..."
    );
  }, [paginaAtual, totalPaginas]);

  return (
    <div className="flex justify-center items-center mt-8 space-x-1 sm:space-x-2">
      {paginasVisiveis.map((item, index) =>
        typeof item === "number" ? (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`cursor-pointer w-8 h-8 md:w-10 md:h-10 text-sm md:text-base font-semibold text-white rounded-full transition-colors flex items-center justify-center ${
              paginaAtual === item
                ? "bg-yellow-800 ring-2 ring-offset-2 ring-yellow-700"
                : "bg-yellow-700 hover:bg-yellow-800"
            }`}
          >
            {item}
          </button>
        ) : (
          <span
            key={`ellipsis-${index}`}
            className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-700 rounded-full"
          ></span>
        )
      )}
    </div>
  );
};

const TimelineItem = ({ info }) => {
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const hasAnexos = info.anexos && info.anexos.length > 0;
  const hasMultiplosAnexos = hasAnexos && info.anexos.length > 1;

  return (
    <div key={info.id} className="relative">
      <div className="absolute left-[-26px] top-1 h-4 w-4 rounded-full bg-yellow-600 ring-4 ring-white"></div>
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 ml-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-gray-800 text-base md:text-lg">
            {formatarData(info.data)}
          </p>
          {hasAnexos && (
            <div className="relative">
              {hasMultiplosAnexos ? (
                <button
                  onClick={() => setDropdownAberto(!dropdownAberto)}
                  className="cursor-pointer inline-flex items-center bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Anexos ({info.anexos.length})
                </button>
              ) : (
                <a
                  href={info.anexos[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Anexo
                </a>
              )}

              {hasMultiplosAnexos && dropdownAberto && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-amber-700">
                  <ul className="py-1">
                    {info.anexos.map((anexoUrl, index) => (
                      <li key={index}>
                        <a
                          href={anexoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100"
                          onClick={() => setDropdownAberto(false)}
                        >
                          Anexo {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm md:text-base mt-1 whitespace-pre-wrap">
          {info.informacao}
        </p>
      </div>
    </div>
  );
};

const Timeline = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-500 pt-4 text-center">
        Nenhum registro encontrado para os filtros selecionados.
      </p>
    );
  }

  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200"></div>
      <div className="space-y-8">
        {items.map((info) => (
          <TimelineItem key={info.id} info={info} />
        ))}
      </div>
    </div>
  );
};

const DetalhesPage = () => {
  const { id } = useParams();
  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const historicoRef = useRef(null);

  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  useEffect(() => {
    const fetchDadosPessoa = async () => {
      setLoading(true);
      let pessoaData;

      try {
        const response = await getPessoaById(id);
        pessoaData = response.data;
        setPessoa(pessoaData);
        fetchHistorico(pessoaData.ultimaOcorrencia.ocoId, false);
      } catch (err) {
        console.error("Falha na API de detalhes, ativando fallback:", err);
        toast.error("API indisponível. Carregando dados de exemplo.", {
          duration: 4000,
        });

        try {
          const mockResponse = await getPessoaByIdMock(id);
          pessoaData = mockResponse.data;
          setPessoa(pessoaData);
          fetchHistorico(pessoaData.ultimaOcorrencia.ocoId, true);
        } catch (mockErr) {
          console.error("Falha ao carregar dados mockados:", mockErr);
          setPessoa(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDadosPessoa();
  }, [id]);

  const fetchHistorico = async (ocoId, useMock = false) => {
    setLoadingHistorico(true);
    try {
      if (!ocoId) return;

      const response = useMock
        ? await getInformacoesDesaparecidoMock(ocoId)
        : await getInformacoesDesaparecido(ocoId);

      const sortedHistorico = response.data.sort(
        (a, b) => new Date(b.data) - new Date(a.data)
      );
      setHistorico(sortedHistorico);
    } catch (error) {
      console.error("Falha ao buscar histórico:", error);
      toast.error("Não foi possível carregar o histórico de informações.");
      setHistorico([]);
    } finally {
      setLoadingHistorico(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchHistorico(pessoa.ultimaOcorrencia.ocoId);
    scrollToHistorico();
  };

  const historicoFiltrado = useMemo(() => {
    setPaginaAtual(1);
    return historico.filter((item) => {
      const [ano, mes, dia] = item.data.split("T")[0].split("-").map(Number);
      const dataItem = new Date(Date.UTC(ano, mes - 1, dia));

      const dataInicio = filtroDataInicio
        ? new Date(
            Date.UTC(
              ...filtroDataInicio
                .split("-")
                .map((n, i) => (i === 1 ? n - 1 : n))
            )
          )
        : null;

      const dataFim = filtroDataFim
        ? new Date(
            Date.UTC(
              ...filtroDataFim.split("-").map((n, i) => (i === 1 ? n - 1 : n))
            )
          )
        : null;

      if (dataInicio && dataItem < dataInicio) return false;
      if (dataFim && dataItem > dataFim) return false;
      return true;
    });
  }, [historico, filtroDataInicio, filtroDataFim]);

  const totalPaginas = Math.ceil(historicoFiltrado.length / itensPorPagina);

  const itensPaginaAtual = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return historicoFiltrado.slice(inicio, fim);
  }, [historicoFiltrado, paginaAtual, itensPorPagina]);

  const limparFiltros = () => {
    setFiltroDataInicio("");
    setFiltroDataFim("");
  };

  const handleShare = () => {
    const shareData = {
      title: `Ajude a encontrar ${pessoa.nome}`,
      text: `Você viu ${pessoa.nome}? Acesse o link para mais detalhes e ajude a compartilhar.`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Compartilhado com sucesso"))
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const scrollToHistorico = () => {
    if (historicoRef.current) {
      historicoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-28 md:pt-40">
        <Mosaic color="#D69D0E" size="large" text="" />
      </div>
    );
  }

  if (!pessoa) {
    return (
      <div className="container mx-auto pt-28 px-4 md:px-8 md:pb-8 md:pt-40">
        <p className="text-gray-600">Não foi possível carregar os dados.</p>
        <Link
          to="/"
          className="cursor-pointer mt-6 inline-block bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors mb-4"
        >
          Voltar para página inicial
        </Link>
      </div>
    );
  }

  const status = pessoa.ultimaOcorrencia.dataLocalizacao
    ? "Localizada"
    : "Desaparecida";
  const statusClass =
    status === "Desaparecida"
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100";

  return (
    <>
      <div className="container mx-auto pt-28 px-4 md:px-8 md:pb-8 md:pt-38">
        <Link
          to="/"
          className="cursor-pointer inline-block bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors mb-4"
        >
          Voltar para página inicial
        </Link>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 ">
              <img
                src={pessoa.urlFoto || avatarPlaceholder}
                alt={pessoa.nome}
                className="cursor-pointer w-150 h-130 object-cover"
                onClick={() => setShowImageModal(true)}
                title="Clique para ampliar a imagem"
                onError={(e) => {
                  e.target.src = avatarPlaceholder;
                }}
              />
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start border-b border-gray-200 pb-2 mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {pessoa.nome}
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-full ${statusClass}`}
                >
                  {status}
                </span>
              </div>
              <div className="text-sm md:text-base space-y-1 text-gray-600">
                <p className="mt-4 text-gray-600">
                  <strong>Idade:</strong> {pessoa.idade || "Não informado"}
                </p>
                <p className="mt-1 text-gray-600">
                  <strong>Sexo:</strong> {pessoa.sexo || "Não informado"}
                </p>
                <p className="mt-1 text-gray-600">
                  <strong>Data do desaparecimento:</strong>
                  {formatarDataHora(pessoa.ultimaOcorrencia.dtDesaparecimento)}
                </p>
                <p className="mt-1 text-gray-600">
                  <strong>Local do Desaparecimento:</strong>
                  {pessoa.ultimaOcorrencia.localDesaparecimentoConcat ||
                    "Não informado"}
                </p>
                <p className="mt-1 text-gray-600">
                  <strong>Circunstâncias:</strong>
                  {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                    ?.informacao || "Não informado"}
                </p>
                <p className="mt-1 text-gray-600">
                  <strong>Vestimentas:</strong>
                  {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                    ?.vestimentasDesaparecido || "Não informado"}
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tenho informações
                </button>
                <button
                  onClick={handleShare}
                  className="cursor-pointer bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Compartilhar caso
                </button>
                <button
                  onClick={scrollToHistorico}
                  className="cursor-pointer bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Ver histórico
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={historicoRef}
          className="mt-8 bg-white shadow-lg rounded-lg p-4 sm:p-6 scroll-mt-24 md:scroll-mt-36"
        >
          <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
            Linha do Tempo do Caso
          </h3>

          <div className="border border-gray-200 p-4 rounded-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <label
                htmlFor="dataInicio"
                className="text-sm font-medium text-gray-600"
              >
                De:
              </label>
              <input
                type="date"
                id="dataInicio"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div className="relative w-full sm:w-auto flex-1">
              <label
                htmlFor="dataFim"
                className="text-sm font-medium text-gray-600"
              >
                Até:
              </label>
              <input
                type="date"
                id="dataFim"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <button
              onClick={limparFiltros}
              className="w-full sm:w-auto bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors self-end"
            >
              Limpar
            </button>
          </div>

          {loadingHistorico ? (
            <div className="flex justify-center items-center py-20">
              <Mosaic color="#D69D0E" size="large" text="" />
            </div>
          ) : (
            <>
              <Timeline items={itensPaginaAtual} />
              <Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                onPageChange={setPaginaAtual}
              />
            </>
          )}
        </div>
        {showForm && (
          <div
            className={`
            fixed inset-0 z-50 flex items-center justify-center p-4
            bg-black/30 backdrop-blur-sm
            transition-opacity duration-300 ease-in-out
            ${showForm ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
          >
            <InfoForm
              ocoId={pessoa.ultimaOcorrencia.ocoId}
              closeModal={() => setShowForm(false)}
              show={showForm}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}
        {showImageModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <button
              className="absolute top-4 right-8 text-white text-4xl font-bold hover:text-gray-300"
              onClick={() => setShowImageModal(false)}
            >
              &times;
            </button>
            <img
              src={pessoa.urlFoto || avatarPlaceholder}
              alt="Visualização em tela cheia"
              className=" max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DetalhesPage;
