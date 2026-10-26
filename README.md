# FaunaAlerta

Plataforma web para **registrar alertas de avistamento de fauna** e **fazer denúncias de crimes ambientais** (caça ilegal, pesca ilegal, maus-tratos, tráfico de animais), conectando cidadãos, pesquisadores, ONGs e órgãos ambientais.

> Projeto integrador interdisciplinar (P.I) desenvolvido em grupo.

---

## Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do repositório](#-estrutura-do-repositório)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar localmente](#-como-rodar-localmente)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [API](#-api)
- [Modelo de dados](#-modelo-de-dados)
- [Scripts úteis](#-scripts-úteis)
- [Status do projeto](#-status-do-projeto)
- [Fluxo de trabalho com Git](#-fluxo-de-trabalho-com-git)
- [Equipe](#-equipe)

---

## Sobre o projeto

O FaunaAlerta nasce da necessidade de reunir, em um só lugar, informações sobre a fauna brasileira e canais simples para a população reportar ocorrências. A plataforma permite:

- **Alertas**: registro de avistamentos de espécies, com local, data e mídias.
- **Denúncias**: envio de ocorrências ilegais a um órgão responsável, com protocolo e acompanhamento de status.
- **Pesquisadores**: cadastro com verificação de documentos.
- **ONGs e notícias**: divulgação de organizações de proteção animal e de notícias da área.

---

## ✨ Funcionalidades

| Funcionalidade | Situação |
| --- | --- |
| Páginas institucionais (Home, Sobre, ONGs) |  Interface pronta |
| Cadastro de usuários (API) |  Implementado (senha com bcrypt) |
| Cadastro de pesquisadores (API) |  Implementado |
| Cadastro e listagem de espécies (API) |  Implementado |
| Formulários de cadastro, login, alerta e denúncia |  Interface pronta, ainda não integrada à API |
| Autenticação (login/JWT) e perfis de acesso |  Planejado |
| Alertas, denúncias, ONGs e notícias na API |  Planejado |
| Painel administrativo e página de perfil |  Planejado |

---

## Tecnologias

**Frontend**
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)
- [Bootstrap 5](https://getbootstrap.com/) e Bootstrap Icons (via CDN)
- ESLint

**Backend**
- [NestJS](https://nestjs.com/) + TypeScript
- [TypeORM](https://typeorm.io/) com **MySQL**
- class-validator / class-transformer
- bcrypt
- Vitest + Supertest (testes)
- oxlint e Prettier

**Ferramentas**
- [Bruno](https://www.usebruno.com/) para testar a API (coleção em `backend/Fauna Alerta API`)

---

## Estrutura do repositório

```
FaunaAlerta/
├── backend/
│   ├── Fauna Alerta API/   # Coleção do Bruno (requests da API)
│   ├── database/
│   │   ├── schema.sql      # Criação dos bancos e tabelas
│   │   └── views.sql       # Views (em revisão)
│   ├── src/
│   │   ├── especies/       # Módulo de espécies
│   │   ├── pesquisador/    # Módulo de pesquisadores
│   │   ├── usuario/        # Módulo de usuários
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── test/               # Testes e2e
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/         # Imagens e ícones
│       ├── components/     # NavBar, Footer, formulários
│       ├── pages/          # Home, Sobre, Login, Cadastro, Denúncia, ONGs...
│       └── main.tsx
└── README.md
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) **20.19+** (recomendado: versão LTS mais recente) e npm
- [MySQL](https://www.mysql.com/) 8+
- [Git](https://git-scm.com/)
- (Opcional) [Bruno](https://www.usebruno.com/) para testar os endpoints

---

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/MatheusLopes11/FaunaAlerta.git
cd FaunaAlerta
```

### 2. Criar o banco de dados

Com o MySQL em execução, rode o script de criação:

```bash
mysql -u root -p < backend/database/schema.sql
```

O script cria dois bancos: `FaunaAlerta` (principal) e `Orgao_mock` (simulação do órgão que recebe denúncias).

>  O arquivo `backend/database/views.sql` ainda contém erros (nomes de tabelas e colunas incorretos) e **não deve ser executado** por enquanto.

### 3. Configurar e rodar o backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env` (veja [Variáveis de ambiente](#-variáveis-de-ambiente)) e inicie o servidor:

```bash
npm run start:dev
```

A API ficará disponível em `http://localhost:3000`.

### 4. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

---

## Variáveis de ambiente

Crie o arquivo `backend/.env` com o seguinte conteúdo (ajuste os valores para o seu ambiente):

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=FaunaAlerta
```

> O arquivo `.env` está no `.gitignore`. **Nunca** envie credenciais para o repositório.

---

## API

Base URL local: `http://localhost:3000`

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/usuario` | Lista usuários |
| `POST` | `/usuario` | Cadastra um usuário |
| `GET` | `/pesquisador` | Lista pesquisadores |
| `POST` | `/pesquisador` | Cadastra um pesquisador (vinculado a um usuário existente) |
| `GET` | `/especies` | Lista espécies |
| `POST` | `/especies` | Cadastra uma espécie |

**Exemplo — cadastrar usuário**

```http
POST /usuario
Content-Type: application/json

{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "11999999999",
  "senha": "minhasenha123"
}
```

**Exemplo — cadastrar espécie**

```http
POST /especies
Content-Type: application/json

{
  "nomePopular": "Onça-pintada",
  "nomeCientifico": "Panthera onca",
  "origem": "NATIVA",
  "statusConservacao": "VU"
}
```

Mais exemplos prontos estão na coleção do Bruno em `backend/Fauna Alerta API` (abra a pasta no Bruno e selecione o ambiente `Desenvolvimento`).

---

## Modelo de dados

Principais tabelas do banco `FaunaAlerta`:

| Tabela | Descrição |
| --- | --- |
| `Usuario` | Usuários da plataforma (perfis: Usuario, Pesquisador, Orgao, Admin) |
| `Pesquisador` | Dados acadêmicos do pesquisador |
| `Documentos_verificacao` | Documentos enviados para validar cadastros |
| `Especies` | Catálogo de espécies (origem e status de conservação) |
| `Alertas` / `Alerta_midias` | Avistamentos e suas fotos/vídeos |
| `Denuncias` / `Denuncia_historico_status` | Denúncias e histórico de andamento |
| `Noticia` | Notícias de fauna e meio ambiente |
| `ONG` | Organizações de proteção animal |

O banco `Orgao_mock` simula o sistema do órgão ambiental que recebe as denúncias.

---

## Scripts úteis

**Backend** (`cd backend`)

| Comando | Descrição |
| --- | --- |
| `npm run start:dev` | Servidor em modo de desenvolvimento (watch) |
| `npm run build` | Compila o projeto |
| `npm run start:prod` | Executa a versão compilada |
| `npm run lint` | Análise estática com oxlint |
| `npm run format` | Formata o código com Prettier |
| `npm test` | Testes unitários |
| `npm run test:e2e` | Testes e2e (exigem o banco rodando) |

**Frontend** (`cd frontend`)

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Verificação com ESLint |
| `npm run preview` | Pré-visualiza o build |

---

## Status do projeto

Em desenvolvimento. Próximos passos:

- [ ] Ativar validação global dos DTOs no backend
- [ ] Autenticação (login com JWT) e controle de acesso por perfil
- [ ] Integrar os formulários do frontend à API
- [ ] Implementar endpoints de alertas, denúncias, ONGs e notícias
- [ ] Corrigir `views.sql` e versionar o banco com migrations
- [ ] Painel administrativo e página de perfil
- [ ] Ampliar a cobertura de testes

---

## Fluxo de trabalho com Git

1. Crie uma branch a partir da `main` (`git checkout -b minha-feature`).
2. Faça commits pequenos e com mensagens claras.
3. Abra um Pull Request para a `main` e aguarde a revisão de outro integrante.
4. Não faça commit de arquivos `.env` nem de `node_modules`.

---

## Equipe


| Nome | GitHub |
| --- | --- |
| Gustavo Fernández Ferreira | [@gustavo-ferndez](https://github.com/gustavo-ferndez) |
| Kevin Afonso de Jesus | [@kevingms-dev](https://github.com/Kevingms-dev) |
| Marcelo de Souza Siciliano | [@MarceloFatec2450](https://github.com/MarceloFatec2450) |
| Matheus Ferreira Lopes | [@MatheusLopes11](https://github.com/MatheusLopes11) |
| Sophia Santoro Rodrigues | [@SophiaRodrigues-S](https://github.com/SophiaRodrigues-S) |
| Wagner Acácio da Silva | [@pequetux](https://github.com/pequetux) |
---

## Licença

Projeto acadêmico.
