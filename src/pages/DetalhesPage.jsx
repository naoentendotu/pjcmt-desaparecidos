import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPessoaByIdMock, getPessoaById } from "../services/api";
import InfoForm from "../components/InfoForm";
import avatarPlaceholder from "../assets/avatar-placeholder.jpg";
import toast from "react-hot-toast";
import { Mosaic } from "react-loading-indicators";

const DetalhesPage = () => {
  const { id } = useParams();
  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    setLoading(true);

    getPessoaById(id)
      .then((response) => {
        setPessoa(response.data);
      })
      .catch((err) => {
        console.error("Falha na API de detalhes, ativando fallback:", err);

        toast.error("API indisponível. Carregando dados de exemplo.", {
          duration: 4000,
        });

        return getPessoaByIdMock(id).then((mockResponse) => {
          setPessoa(mockResponse.data);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Mosaic color="#D69D0E" size="large" text="" />
      </div>
    );
  }

  if (!pessoa) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Não foi possível carregar os dados.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="cursor-pointer mt-6 bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors mb-4"
        >
          <Link to="/" className="text-white inline-block">
            Voltar para página inicial
          </Link>
        </button>
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
    <div className="container mx-auto px-4 md:px-8 md:pb-8 md:pt-36">
      <button
        onClick={() => (window.location.href = "/")}
        className="cursor-pointer bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors mb-4"
      >
        <Link to="/" className="text-white inline-block">
          Voltar para página inicial
        </Link>
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={pessoa.urlFoto || avatarPlaceholder}
              alt={pessoa.nome}
              className="cursor-pointer w-150 h-120 object-cover"
              onClick={() => setShowImageModal(true)}
              title="Clique para ampliar a imagem"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold text-gray-900">
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
            <p className="text-gray-600">
              <strong>Sexo:</strong> {pessoa.sexo || "Não informado"}
            </p>
            <p className="text-gray-600">
              <strong>Desaparecimento:</strong>{" "}
              {new Date(
                pessoa.ultimaOcorrencia.dtDesaparecimento
              ).toLocaleDateString() || "Não informado"}
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="cursor-pointer mt-6 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Enviar Informação Adicional
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <InfoForm
            ocoId={pessoa.ultimaOcorrencia.ocoId}
            closeModal={() => setShowForm(false)}
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
