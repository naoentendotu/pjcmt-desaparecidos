import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PessoaCard from "./PessoaCard";

describe("Componente PessoaCard", () => {
  // caso específico para "Desaparecido"
  it('deve renderizar o nome, cidade e status "Desaparecido"', () => {
    const pessoaMock = {
      id: 1,
      nome: "João da Silva",
      urlFoto: "",
      ultimaOcorrencia: {
        dataLocalizacao: null, // null significa "Desaparecido"
        localDesaparecimentoConcat: "Cuiabá - MT",
      },
    };

    render(
      <BrowserRouter>
        <PessoaCard pessoa={pessoaMock} />
      </BrowserRouter>
    );

    // verifica os resultados
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(screen.getByText(/Cidade: Cuiabá/i)).toBeInTheDocument();
    expect(screen.getByText("Desaparecido")).toBeInTheDocument();
  });

  // caso específico para "Localizado"
  it('deve renderizar o status "Localizado" corretamente', () => {
    const pessoaMock = {
      id: 2,
      nome: "Maria Oliveira",
      urlFoto: "",
      ultimaOcorrencia: {
        dataLocalizacao: "2025-01-01", // se tem data = "Localizado"
        localDesaparecimentoConcat: "Várzea Grande - MT",
      },
    };

    render(
      <BrowserRouter>
        <PessoaCard pessoa={pessoaMock} />
      </BrowserRouter>
    );

    // verifica os resultados
    expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Localizado")).toBeInTheDocument();
  });
});
