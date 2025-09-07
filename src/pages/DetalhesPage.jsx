import { useState, useEffect, useRef } from "react";
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

const DetalhesPage = () => {
  const { id } = useParams();
  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const historicoRef = useRef(null);

  useEffect(() => {
    const fetchDadosPessoa = async () => {
      setVisibleCount(4);
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

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
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
      <div className="flex justify-center items-center h-screen">
        <Mosaic color="#D69D0E" size="large" text="" />
      </div>
    );
  }

  if (!pessoa) {
    return (
      <div className="text-center px-8 pb-8 pt-48 md:pt-64">
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
    <div className="container mx-auto pt-35 px-4 md:px-8 md:pb-8 md:pt-36">
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
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start border-b border-gray-200 pb-2 mb-4">
              <h2 className="text-3xl font-bold text-gray-900 ">
                {pessoa.nome}
              </h2>
              <span
                className={`px-3 py-1 text-sm font-bold rounded-full ${statusClass}`}
              >
                {status}
              </span>
            </div>
            <p className="mt-4 text-gray-600">
              <strong>Idade:</strong> {pessoa.idade || "Não informado"}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Sexo:</strong> {pessoa.sexo || "Não informado"}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Data do desaparecimento:</strong>{" "}
              {formatarDataHora(pessoa.ultimaOcorrencia.dtDesaparecimento)}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Local do Desaparecimento:</strong>{" "}
              {pessoa.ultimaOcorrencia.localDesaparecimentoConcat ||
                "Não informado"}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Circunstâncias:</strong>{" "}
              {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao ||
                "Não informado"}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Vestimentas:</strong>{" "}
              {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                ?.vestimentasDesaparecido || "Não informado"}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
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
        className="mt-8 bg-white shadow-lg rounded-lg p-6 scroll-mt-[135px]"
      >
        <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Linha do Tempo do Caso
        </h3>
        {loadingHistorico ? (
          <div className="flex justify-center items-center h-screen">
            <Mosaic color="#D69D0E" size="large" text="" />
          </div>
        ) : historico.length > 0 ? (
          <>
            <div className="space-y-6">
              {historico.slice(0, visibleCount).map((info) => (
                <div
                  key={info.id}
                  className="border-l-4 border-yellow-500 pl-4"
                >
                  <p className="font-semibold text-gray-800">
                    {formatarData(info.data)}
                  </p>
                  <p className="text-gray-600 mt-1">{info.informacao}</p>
                  {info.anexos && info.anexos.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">
                        Anexos:
                      </p>
                      <ul className="list-disc list-inside">
                        {info.anexos.map((anexoUrl, index) => (
                          <li key={index}>
                            <a
                              href={anexoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Visualizar Anexo {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {visibleCount < historico.length && (
              <div className="mt-2 text-center">
                <button
                  onClick={handleLoadMore}
                  className="cursor-pointer bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Carregar Mais
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 pt-4">
            Nenhuma informação adicional foi registrada.
          </p>
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
  );
};

export default DetalhesPage;
