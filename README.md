# F1 Grand Insight

Dashboard de Fórmula 1 construído com React, TypeScript, Vite e Tailwind CSS.

## Objetivo

Explorar e visualizar dados da Fórmula 1 em uma interface web. As fontes de dados, indicadores disponíveis e política de atualização devem ser confirmados no código antes de serem documentados como funcionalidades concluídas.

## Tecnologias identificadas

- React 18 e TypeScript
- Vite 5
- React Router 6
- TanStack Query
- Recharts
- Vitest e Testing Library
- Tailwind CSS

## Desenvolvimento local

Requisitos: Node.js compatível com as dependências do projeto e npm.

```bash
npm install
npm run dev
```

## Verificações

```bash
npm run lint
npm run test
npm run build
```

## Publicação

O projeto contém o comando `npm run deploy`, que usa Cloudflare Pages via Wrangler. Antes de publicar, valide o projeto de destino e a variável `base` do Vite: atualmente a produção utiliza `/f1-grand-insight/`, o que pode não ser apropriado para um domínio na raiz.

## Pontos pendentes de auditoria

- Confirmar endpoints, limites e tratamento de erros das APIs.
- Validar estados de carregamento, dados ausentes e falhas de rede.
- Revisar cobertura dos testes e segurança de variáveis de ambiente.
- Validar o build e o roteamento no ambiente de publicação.
- Revisar responsividade e acessibilidade.

Este documento descreve somente aspectos confirmados nos arquivos de configuração consultados. Não afirma que os testes ou o deploy foram executados.
