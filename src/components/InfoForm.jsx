import { useState } from "react";
import InputMask from "react-input-mask";
import { enviarInformacao } from "../services/api";
import toast from "react-hot-toast";

const InfoForm = ({ ocoId, closeModal }) => {
  const [observacao, setObservacao] = useState("");
  const [dataAvistamento, setDataAvistamento] = useState("");
  const [descricaoFoto, setDescricaoFoto] = useState("");
  const [foto, setFoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!observacao || !dataAvistamento) {
      toast.error("Por favor, preencha a observação e a data.");
      return;
    }
    setSubmitting(true);

    // Converte a data do formato DD/MM/AAAA para AAAA-MM-DD
    const [dia, mes, ano] = dataAvistamento.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    try {
      await enviarInformacao({
        ocoId,
        informacao: observacao,
        data: dataFormatada,
        foto,
        descricaoFoto: descricaoFoto || "Foto enviada pelo cidadão",
      });
      toast.success(
        "Informação enviada com sucesso! Obrigado por sua colaboração."
      );
      closeModal();
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
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
      >
        &times;
      </button>
      <h3 className="text-2xl font-bold mb-4">Enviar Nova Informação</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Descreva roupas, companhia, comportamento, aparência, etc."
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
          <InputMask
            mask="99/99/9999"
            value={dataAvistamento}
            onChange={(e) => setDataAvistamento(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="DD/MM/AAAA"
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
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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

        <div className="text-right">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Enviar Informação"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfoForm;
