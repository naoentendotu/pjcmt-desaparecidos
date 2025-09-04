import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPessoaById } from "../services/api";
import InfoForm from "../components/InfoForm";
import avatarPlaceholder from "../assets/avatar-placeholder.jpg";

const DetalhesPage = () => {
  const { id } = useParams();
  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getPessoaById(id);
        setPessoa(response.data);
      } catch (err) {
        setError("Não foi possível carregar os detalhes desta pessoa.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <p className="text-center p-8">Carregando detalhes...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;
  if (!pessoa) return null;

  const status = pessoa.ultimaOcorrencia.dataLocalizacao
    ? "Localizada"
    : "Desaparecida";
  const statusClass =
    status === "Desaparecida"
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100";

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Voltar para a lista
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={pessoa.urlFoto || avatarPlaceholder}
              alt={pessoa.nome}
              className="w-full h-full object-cover"
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
              <strong>Idade:</strong> {pessoa.idade} anos
            </p>
            <p className="text-gray-600">
              <strong>Sexo:</strong> {pessoa.sexo}
            </p>
            <p className="text-gray-600">
              <strong>Desaparecimento:</strong>{" "}
              {new Date(
                pessoa.ultimaOcorrencia.dtDesaparecimento
              ).toLocaleDateString()}
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
    </div>
  );
};

export default DetalhesPage;
