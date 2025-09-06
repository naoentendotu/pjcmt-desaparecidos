import axios from "axios";
import { mockPessoasResponse, mockInformacoesResponse } from "./mockData";

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

/**
 * Busca o histórico de informações de uma ocorrência de desaparecimento.
 * @param {number} ocorrenciaId - ID da ocorrência.
 * @returns {Promise<object>}
 */
export const getInformacoesDesaparecido = (ocorrenciaId) => {
  return apiClient.get(`/v1/ocorrencias/informacoes-desaparecido`, {
    params: {
      ocorrenciaId,
    },
  });
};

// =================================================================
// FUNÇÕES DE MOCK
// =================================================================

/**
 * Dados mockados para getPessoas.
 */
export const getPessoasMock = (pagina = 1, filtros = {}) => {
  console.log("Mostrando dados mockados");

  const dadosFiltrados = mockPessoasResponse.content.filter((pessoa) => {
    const nomeMatch = filtros.nome
      ? pessoa.nome.toLowerCase().includes(filtros.nome.toLowerCase())
      : true;

    const statusPessoa = pessoa.ultimaOcorrencia.dataLocalizacao
      ? "LOCALIZADO"
      : "DESAPARECIDO";
    const statusMatch = filtros.status ? statusPessoa === filtros.status : true;

    const sexoMatch = filtros.sexo ? pessoa.sexo === filtros.sexo : true;

    return nomeMatch && statusMatch && sexoMatch;
  });

  const porPagina = 10;
  const totalPaginas = Math.ceil(dadosFiltrados.length / porPagina);
  const indiceInicial = (pagina - 1) * porPagina;
  const indiceFinal = pagina * porPagina;

  const itensDaPagina = dadosFiltrados.slice(indiceInicial, indiceFinal);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          content: itensDaPagina,
          totalPages: totalPaginas,
        },
      });
    }, 250);
  });
};

/**
 * DADOS MOCKADOS para getPessoaById.
 */
export const getPessoaByIdMock = (id) => {
  console.log(`Dados mockados para o ID: ${id}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pessoa = mockPessoasResponse.content.find(
        (p) => String(p.id) === id
      );
      if (pessoa) {
        resolve({
          data: pessoa,
        });
      } else {
        reject(new Error("Pessoa não encontrada nos dados mockados."));
      }
    }, 250);
  });
};

/**
 * DADOS MOCKADOS para getInformacoesDesaparecido.
 */
export const getInformacoesDesaparecidoMock = (ocoId) => {
  console.log(`Dados mockados de histórico para a ocorrência ID: ${ocoId}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      const dadosRelacionados = mockInformacoesResponse.filter(
        (info) => String(info.ocoId) === String(ocoId)
      );

      resolve({
        data: dadosRelacionados,
      });
    }, 250);
  });
};
