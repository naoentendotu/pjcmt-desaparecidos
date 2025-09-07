import { useState, useEffect } from "react";
import { enviarInformacao } from "../services/api";
import toast from "react-hot-toast";
import MapaSelect from "./MapaSelect";

const InfoForm = ({ ocoId, closeModal, show, onSuccess }) => {
  const [observacao, setObservacao] = useState("");
  const [dataAvistamento, setDataAvistamento] = useState("");
  const [descricaoFoto, setDescricaoFoto] = useState("");
  const [foto, setFoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [loadingEndereco, setLoadingEndereco] = useState(false);

  useEffect(() => {
    if (location) {
      const fetchEndereco = async () => {
        setLoadingEndereco(true);
        setEndereco("");
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data && data.address) {
            const addr = data.address;
            const rua = addr.road || "";
            const cidade = addr.city || addr.town || addr.village || "";
            const estado = addr.state || "";
            const pais = addr.country || "";

            const enderecoFormatado = [rua, cidade, estado, pais]
              .filter((part) => part)
              .join(", ");

            setEndereco(enderecoFormatado);
          } else {
            setEndereco("Endereço não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
          setEndereco("Não foi possível obter o endereço.");
        } finally {
          setLoadingEndereco(false);
        }
      };

      const handler = setTimeout(() => {
        fetchEndereco();
      }, 500);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!observacao || !dataAvistamento) {
      toast.error("Por favor, preencha a observação e a data.");
      return;
    }
    setSubmitting(true);

    let informacaoFinal = observacao;
    if (location && endereco && !endereco.includes("Não foi possível")) {
      informacaoFinal += `\n\nLocal: ${endereco}`;
    }

    try {
      await enviarInformacao({
        ocoId,
        informacao: informacaoFinal,
        data: dataAvistamento,
        foto,
        descricaoFoto: descricaoFoto || "Foto enviada pelo cidadão",
      });
      toast.success(
        "Informação enviada com sucesso! Obrigado por sua colaboração."
      );
      onSuccess();
    } catch (err) {
      toast.error(
        "Falha ao enviar a informação. Verifique os dados e tente novamente."
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`
        bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-4xl relative 
        transform transition-all duration-300 ease-in-out
        ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
      `}
    >
      <button
        onClick={closeModal}
        className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
      >
        &times;
      </button>
      <h3 className="text-2xl font-bold mb-6">Enviar Nova Informação</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 gap-y-4">
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="observacao"
                className="block text-sm font-medium text-gray-700"
              >
                Observações (obrigatório)
              </label>
              <textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Descreva roupas, companhia, comportamento, etc."
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="dataAvistamento"
                className="block text-sm font-medium text-gray-700"
              >
                Data em que foi visto(a) (obrigatório)
              </label>
              <input
                type="date"
                id="dataAvistamento"
                value={dataAvistamento}
                onChange={(e) => setDataAvistamento(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="foto"
                className="block text-sm font-medium text-gray-700"
              >
                Anexar foto (opcional)
              </label>
              <input
                type="file"
                id="foto"
                onChange={(e) => setFoto(e.target.files[0])}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
              />
            </div>
            {foto && (
              <div>
                <label
                  htmlFor="descricaoFoto"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descrição da foto
                </label>
                <input
                  type="text"
                  id="descricaoFoto"
                  value={descricaoFoto}
                  onChange={(e) => setDescricaoFoto(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Ex: Foto da pessoa na praça."
                />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <MapaSelect
              position={location}
              onPositionChange={setLocation}
              endereco={endereco}
              loadingEndereco={loadingEndereco}
            />
          </div>
        </div>

        <div className="text-right mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400"
          >
            {submitting ? "Enviando..." : "Enviar Informação"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfoForm;
