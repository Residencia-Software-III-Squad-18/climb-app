# Climb App

Aplicação web construída com React, TypeScript e Vite.

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

| Ferramenta                     | Versão mínima                    |
| ------------------------------ | -------------------------------- |
| [Node.js](https://nodejs.org/) | >= 22.x                          |
| npm                            | >= 10.x (incluído com o Node.js) |

## Dependências do projeto

### Produção

| Pacote    | Versão  | Descrição                                |
| --------- | ------- | ---------------------------------------- |
| react     | ^19.2.0 | Biblioteca para construção de interfaces |
| react-dom | ^19.2.0 | Renderização do React no DOM             |

### Desenvolvimento

| Pacote                      | Versão   | Descrição                         |
| --------------------------- | -------- | --------------------------------- |
| vite                        | ^7.3.1   | Bundler e dev server              |
| @vitejs/plugin-react        | ^5.1.1   | Plugin do Vite para React         |
| typescript                  | ~5.9.3   | Superset tipado do JavaScript     |
| @types/node                 | ^24.10.1 | Tipagens do Node.js               |
| @types/react                | ^19.2.7  | Tipagens do React                 |
| @types/react-dom            | ^19.2.3  | Tipagens do React DOM             |
| eslint                      | ^9.39.1  | Linter para JavaScript/TypeScript |
| @eslint/js                  | ^9.39.1  | Configuração base do ESLint       |
| typescript-eslint           | ^8.48.0  | Integração ESLint + TypeScript    |
| eslint-plugin-react-hooks   | ^7.0.1   | Regras de lint para React Hooks   |
| eslint-plugin-react-refresh | ^0.4.24  | Regras de lint para React Refresh |
| globals                     | ^16.5.0  | Definições de variáveis globais   |

## Instalação

```bash
git clone <url-do-repositorio>
cd climb-app
npm install
```

## Scripts disponíveis

```bash
# Inicia o servidor de desenvolvimento (porta 5173)
npm run dev

# Compila o TypeScript e gera o build de produção
npm run build

# Visualiza o build de produção localmente
npm run preview

# Executa o linter no projeto
npm run lint
```
