# Sistema de Pessoas Desaparecidas - PJC MT

## Dados de Inscrição

- **Nome**: Tuliana Santos Andrade
- **Email**: tulianandrade@gmail.com
- **Telefone**: (73) 9 9110-8982

## 💻 Sobre o Projeto

Sistema web desenvolvido para que possibilite os cidadãos:

- Consultar registros de pessoas desaparecidas ou já localizadas
- Enviar informações adicionais (observações, localização, fotos)
- Visualizar detalhes e histórico completos dos casos

### ⚠️ Tratamento de Falhas de Conexão

Para garantir uma melhor experiência do usuário, foi implementado um sistema de fallback com dados mockados. Caso ocorra alguma falha na conexão com a API oficial, o sistema automaticamente utiliza dados locais para:

- Manter a aplicação funcional mesmo offline
- Permitir a visualização de exemplos de registros
- Facilitar testes e desenvolvimento

Os dados mockados estão localizados em `src/services/mockData.js` e são utilizados apenas quando:

- A API oficial está indisponível
- Ocorrem erros de conexão
- Durante desenvolvimento e testes

## 🚀 Tecnologias Utilizadas

[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat-square)](https://reactjs.org/) [![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/) [![React Router](https://img.shields.io/badge/React%20Router-CA4245?logo=react-router&logoColor=white&style=flat-square)](https://reactrouter.com/) [![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white&style=flat-square)](https://axios-http.com/) [![React Hot Toast](https://img.shields.io/badge/React%20Hot%20Toast-FF3D00?style=flat-square)](https://react-hot-toast.com/) [![React Icons](https://img.shields.io/badge/React%20Icons-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react-icons.github.io/react-icons/)

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Docker (opcional)

## ⚙️ Instalação e Execução

### Instalação Local

1. Clone o repositório

```bash
git clone https://github.com/naoentendotu/pjcmt-desaparecidos.git
cd pjcmt-desaparecidos
```

2. Instale as dependências

```bash
npm install
```

3. Execute o projeto em modo desenvolvimento

```bash
npm run dev
```

4. Acesse o projeto em http://localhost:5173

### Execução com Docker

> ⚠️ Antes de executar os comandos abaixo, certifique-se de que o Docker Desktop esteja aberto e em execução no seu sistema. Verifique com:

```bash
docker info
```

Se o comando falhar, abra o Docker Desktop e aguarde até que o daemon esteja ativo.

1. Construa a imagem Docker

```bash
docker build -t pjcmt-desaparecidos .
```

2. Execute o container

```bash
docker run -d -p 8080:80 pjcmt-desaparecidos
```

3. Acesse o projeto em http://localhost:8080

### Desenvolvimento com Docker Compose

1. Inicie o ambiente de desenvolvimento

```bash
docker-compose up
```

2. Acesse o projeto em http://localhost:5173

## 🧪 Testes

Execute os testes unitários:

```bash
npm run test
```

## 🔧 Configuração

O projeto utiliza variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://abitus-api.geia.vip
```

## 📁 Estrutura do Projeto

```
src/
├── assets/         # Imagens e recursos estáticos
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas/rotas da aplicação
├── services/      # Serviços e chamadas API
├── App.jsx        # Componente principal
└── main.jsx       # Ponto de entrada
```

## 🧾 Funcionalidades

- Consome a API oficial [Swagger da Abitus](https://abitus-api.geia.vip/swagger-ui/index.html)
- Listagem de pessoas desaparecidas/localizadas
- Paginação de resultados
- Busca por múltiplos parâmetros
- Visualização detalhada de cada caso
- Envio de informações com:
  - Upload de fotos
  - Localização geográfica a partir do mapa
  - Observações
  - Data de avistamento

## 🐳 Docker

O projeto inclui:

- `Dockerfile` para build de produção
- `docker-compose.yml` para ambiente de desenvolvimento


## 📸 Screenshots

### Página Inicial (HomePage)

![Página Inicial](src/assets/screenshots/homepage.png)
_Lista de pessoas desaparecidas com filtros de busca e paginação_

### Página de Detalhes

![Detalhes do Caso](src/assets/screenshots/detalhespage.png)
_Informações detalhadas sobre o caso selecionado_

### Formulário de Informações

![Formulário](src/assets/screenshots/formulario.png)
_Formulário para envio de novas informações com todas as suas possibilidades preenchidas_

### Histórico do Caso

![Histórico](src/assets/screenshots/historico.png)
_Histórico completo de informações e atualizações do caso, com paginação_

Desenvolvido como parte do processo seletivo para Desenvolve MT

