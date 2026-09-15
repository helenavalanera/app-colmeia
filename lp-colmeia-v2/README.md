# Colmeia — Ecossistema de Comunidades Escolares

Protótipo do **HACKTUDO 2026** (equipe Entre Pretas), construído como app Base44 (React + Vite). A Colmeia propõe outro jeito de usar o celular na escola: em vez de mais uma tela sozinha, **comunidades e clubes conduzidos pelos próprios alunos**, cruzando turmas do 6º ao 9º ano em torno de missões colaborativas — com o mediador (professor, orientador, bibliotecário...) em papel de apoio, nunca de vigilância.

## O que a Colmeia faz hoje

- **Comunidades e clubes liderados por alunos** — um clube reúne estudantes de turmas diferentes em torno de um interesse comum. Um aluno atua como **embaixador**, organiza encontros e convida colegas; qualquer aluno pode propor um novo clube ou uma nova comunidade.
- **Missões com "favo"** — cada missão se divide em fragmentos (favos). Cada membro do clube só acessa o próprio fragmento; a resposta coletiva só existe quando o grupo se encontra presencialmente e reúne as partes.
- **Feed de saberes** — clubes compartilham descobertas (texto e foto) no feed da própria comunidade e no feed geral da escola; outros clubes comentam e dão continuidade à conversa.
- **Apoio do mediador, não vigilância** — o mediador acolhe pedidos do clube (pólen/orientação, mais tempo, favo coringa para quem está sem celular) e acompanha um panorama agregado das comunidades — nunca conduz nem avalia aluno por aluno.
- **Critério psicossocial da BNCC** — cada missão é vinculada a uma Competência Geral da BNCC com foco psicossocial (escuta e empatia, cooperação, autoconhecimento e cuidado, responsabilidade e autonomia), e não ao conteúdo de uma disciplina específica.
- **Visão do aluno / visão do mediador no mesmo aparelho** — um só celular, com as duas visões trocando por toque ou arrastando a tela (swipe), no layout inspirado no Circle.
- **Modo claro e modo escuro.**
- **Minha Abelha** — personalização leve do avatar do aluno (roupa, chapéu).

Tudo isso vive na rota `/app` ([ColmeiaApp.jsx](src/api/pages/ColmeiaApp.jsx) → [CommunityShell.jsx](src/components/comunidade/CommunityShell.jsx) → estado em [CommunityState.jsx](src/state/CommunityState.jsx)), com os dados salvos no `localStorage` do navegador — é uma demonstração com dados fictícios; limpar o armazenamento do site reinicia tudo.

## Estado do protótipo

`src/components/colmeia/StudentPhone.jsx`, `TeacherPhone.jsx`, `src/state/DemoState.jsx` e `BnccPicker.jsx` implementam uma versão anterior do produto (celular do aluno separado do celular do mediador, com busca no banco completo de habilidades da BNCC por disciplina) e **não estão mais ligados a nenhuma rota** — ficaram no repositório como referência histórica, mas podem ser removidos com segurança quando não forem mais necessários.

## Base44 Project

Use this repository to run and edit the app locally, then publish changes back through Base44.

Any change pushed to the repo will also be reflected in the Base44 Builder.

### Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Install the Base44 CLI: `npm install -g base44@latest`.
5. Install [Deno](https://docs.deno.com/runtime/getting_started/installation/) — the local Base44 backend runs on it.

Run `base44 --help` (or see the [CLI reference](https://docs.base44.com/developers/references/cli/commands/introduction)) for the full command surface.

### Run Locally

Three commands, from the project root:

```bash
base44 login   # one-time per machine
base44 link    # one-time per clone
base44 dev     # local backend + frontend together
```

Open the frontend URL that `base44 dev` prints (typically `http://localhost:5173`).

Notes:

- **Every fresh clone needs `base44 link`.** It writes `base44/.app.jsonc` (the app-id pointer), which is deliberately gitignored. Your app id is in the Builder URL (`app.base44.com/apps/<id>/...`); `base44 link --help` shows the non-interactive flags.
- **`base44 dev` runs the frontend for you** (via `site.serveCommand` in this repo's `base44/config.jsonc`) — never run `npm run dev` yourself: alone it serves a UI with no backend behind it (`[base44] Proxy not enabled`, every `/api` call fails), and alongside `base44 dev` the second Vite silently takes the next port and you end up looking at the wrong one.
- **The app must be published at least once for the UI to load under `base44 dev`.** The frontend boots by fetching app settings from the hosted app; before the first publish that fails and every page redirects to login. The local API works regardless.
- Entities, functions, and auth run locally — entity data is **in-memory only**, wiped when `base44 dev` restarts. Everything else (Core integrations, OAuth login) is forwarded to your deployed app. Full breakdown: [Local development overview](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview).

### Frontend Only, Hosted Backend

To work on just the frontend against your app's live hosted backend:

```bash
base44 dev --remote
```

⚠️ In this mode writes go to your app's **production data** — plain `base44 dev` keeps everything local.

### Publish Your Changes

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

This repo syncs to Base44 through git, so publish from the dashboard rather than `base44 deploy` — a CLI deploy ships your local tree directly, bypassing the sync, and the deployed state silently diverges from the repo.

### Docs & Support

GitHub integration: [https://docs.base44.com/developers/app-code/local-development/github](https://docs.base44.com/developers/app-code/local-development/github)

Local development: [https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)

Support: [https://app.base44.com/support](https://app.base44.com/support)

## Fontes de dados

- **Critérios psicossociais da BNCC** (`CRITERIOS` em [CommunityState.jsx](src/state/CommunityState.jsx)) — uma lista curada de 4 Competências Gerais da BNCC voltadas ao psicossocial (CG8, CG9, CG10), vinculada a cada missão pelo clube/mediador. É o critério usado pela experiência atual de comunidades.
- **Banco completo de habilidades da BNCC** (`src/data/bncc.json`, 730 habilidades do Ensino Fundamental, 6º ao 9º ano, com código/texto/componente curricular) e o seletor de busca (`BnccPicker.jsx`) continuam no repositório, extraídos do dataset aberto [bncc.dev](https://github.com/bncc-dev/bncc-dados) (mantido pela Profy), licenciado sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br) — hoje usados apenas pela versão anterior do protótipo (ver "Estado do protótipo" acima), não pela experiência atual de comunidades.

## Equipe

Entre Pretas — Hacktudo 2026
- Helena Valanera
- Maria Eduarda Pacheco
- Gabriela Mullet
