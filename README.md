# Climb App

Frontend do fluxo de acesso da Climb, construido com React, TypeScript, Vite e Tailwind CSS.

## Requisitos

- Node.js 22+
- npm 10+

## Como executar

```bash
npm install
cp .env.example .env
npm run dev
```

O frontend sobe em `http://localhost:5173`.

## Ambiente

Configure a URL da API do backend via Vite:

```bash
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8080
```

Se `VITE_API_BASE_URL` nao estiver definida, o frontend usa `/api`. Em desenvolvimento, o Vite encaminha `/api` para `VITE_API_PROXY_TARGET`.

## Fluxo Google OAuth

- O botao `Continuar com Google` chama `GET {VITE_API_BASE_URL}/auth/google/url`
- O frontend le o campo `authorizationUrl` retornado pelo backend
- O navegador faz redirect com `window.location.href`
- O callback OAuth continua exclusivo do backend em `http://localhost:8080/auth/google/callback`
- O frontend nao cria rota `/auth/google/callback` e nao usa Google Identity Services direto
- Quando o backend retorna para `http://localhost:5173?...` ou `http://localhost:5173#...`, a tela de login processa `google_oauth` no mount
- Em sucesso, o frontend limpa a URL com `history.replaceState`, persiste os tokens em `localStorage` na chave `climb-google-oauth` e redireciona para `/dashboard`
- Em erro, o frontend limpa a URL e mostra um toast amigavel com a mensagem recebida em `google_oauth_error`

## Desenvolvimento

- Frontend local: `http://localhost:5173`
- Backend local: `http://localhost:8080`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Estrutura

```text
src/
  components/login/   componentes visuais da marca e ilustracao lateral
  hooks/              hooks de interface, como alternancia de tema
  pages/              telas de acesso, recuperacao de senha e solicitacao
  services/           integracoes HTTP do frontend
  App.tsx             roteamento principal
```
