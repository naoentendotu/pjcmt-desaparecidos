import { useState } from "react";
import { IMaskInput } from "react-imask";
import { enviarInformacao } from "../services/api";
import toast from "react-hot-toast";

const InfoForm = ({ ocoId, closeModal, show }) => {
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
    <div
      className={`
    bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative
    transform transition-all duration-300 ease-in-out
    ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
  `}
    >
      {" "}
      <button
        onClick={closeModal}
        className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
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
          <IMaskInput
            mask="00/00/0000"
            value={dataAvistamento}
            onAccept={(value) => setDataAvistamento(value)}
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
            cursor-pointer
            onChange={(e) => setFoto(e.target.files[0])}
            accept="image/*"
            className=" mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-white hover:file:bg-yellow-700 "
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
            className=" cursor-pointer mt-6 bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {submitting ? "Enviando..." : "Enviar Informação"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfoForm;
