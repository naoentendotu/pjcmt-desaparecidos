import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://abitus-api.geia.vip",
});

/**
 * Busca uma lista de pessoas usando filtros e paginação.
 * @param {number} pagina - Número da página
 * @param {string} nome - Busca pelo nome da pessoa.
 * @returns {Promise<object>}
 */
export const getPessoas = (pagina = 1, filtros = {}) => {
  const params = {
    nome: filtros.nome || "",
    status: filtros.status || "",
    sexo: filtros.sexo || "",
    pagina: pagina - 1,
    porPagina: 10,
  };

  Object.keys(params).forEach((key) => {
    if (params[key] === "") {
      delete params[key];
    }
  });

  return apiClient.get("/v1/pessoas/aberto/filtro", { params });
};

/**
 * Busca os detalhes completos de uma pessoa pelo ID.
 * @param {string} id - ID da pessoa.
 * @returns {Promise<object>}
 */
export const getPessoaById = (id) => {
  return apiClient.get(`/v1/pessoas/${id}`);
};

/**
 * Envia novas informações sobre uma ocorrência de desaparecimento.
 * @param {object} dados - Dados da informação para ser enviada.
 * @param {number} dados.ocoId - ID da ocorrência.
 * @param {string} dados.informacao - A observação sobre a pessoa.
 * @param {string} dados.data - Data em que a pessoa foi vista (formato yyyy-MM-dd).
 * @param {File} dados.foto - A imagem.
 * @param {string} dados.descricaoFoto - Descrição para a foto.
 * @returns {Promise<object>}
 */
export const enviarInformacao = ({
  ocoId,
  informacao,
  data,
  foto,
  descricaoFoto,
}) => {
  const formData = new FormData();
  if (foto) {
    formData.append("files", foto);
  }

  return apiClient.post("/v1/ocorrencias/informacoes-desaparecido", formData, {
    params: {
      ocoId,
      informacao,
      data,
      descricao: descricaoFoto,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
