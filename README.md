# Colmeia — Ecossistema de Comunidades Escolares

Protótipo web desenvolvido para o HACKTUDO 2026 pela equipe Entre Pretas. A Colmeia organiza comunidades escolares, clubes entre turmas e missões colaborativas para estudantes do 6º ao 9º ano.

O produto usa o celular como ponto de partida para encontros presenciais. Cada estudante recebe um favo privado, percorre espaços da escola, conversa com outras pessoas e contribui para uma resposta coletiva. O mediador cria missões e oferece apoio quando solicitado; estudantes embaixadores mobilizam e organizam os clubes.

## Funcionalidades implementadas

### Experiência do estudante

- Feed personalizado por interesses e feed geral da escola.
- Clubes formados por estudantes de diferentes turmas e turnos.
- Proposta de novos clubes com biblioteca de ícones.
- Missões de turma e de clube ordenadas por prazo.
- Favo individual com pergunta, pista e espaço da escola.
- Check-in do percurso e registro de quem foi consultado.
- Resposta coletiva em texto e/ou foto.
- Pedidos de pólen, tempo adicional e favo coringa.
- Agenda com calendário e rituais recorrentes.
- Perfil com ano, turno, múltiplos interesses e avatar personalizável.
- Modo claro e modo escuro.

### Experiência do mediador

- Panorama de clubes, missões e espaços ativados.
- Criação de missões para turmas ou clubes.
- Definição de estudantes presentes e divisão em duplas, trios ou quartetos.
- Gerador local de subgrupos, objetivos, favos e pistas a partir do contexto informado.
- Seleção de soft skills para cada missão.
- Revisão do plano antes da publicação.
- Gestão de calendário, recorrência, público, horário e local dos rituais.
- Central de pedidos de apoio e notificações de evidências fotográficas.
- Visão agregada dos percursos e respostas, sem ranking individual.

### Regras de produto

- Cada participante abre somente o próprio favo.
- O aplicativo não revela quem possui o fragmento complementar.
- Os espaços da missão aparecem na pista individual, não no feed do clube.
- O último check-in libera a resposta coletiva.
- O favo coringa é destinado a grupos com participante sem telefone.
- Publicações usam moderação preventiva por regras locais.
- O estado da demonstração permanece no navegador e pode ser reiniciado pela interface.

## Arquitetura

```text
src/
├── api/pages/
│   ├── Landing.jsx
│   └── ColmeiaApp.jsx
├── components/colmeia/
│   ├── Hero.jsx
│   ├── NetworkStory.jsx
│   ├── ProductHierarchy.jsx
│   ├── HowItWorks.jsx
│   ├── AudienceSection.jsx
│   ├── ExampleSection.jsx
│   ├── IPhoneMockup.jsx
│   ├── IPhoneStatusBar.jsx
│   └── AvatarStudio.jsx
├── components/comunidade/
│   ├── CommunityShell.jsx
│   └── community.css
├── state/
│   └── CommunityState.jsx
└── index.css
```

### Camadas principais

- `Landing.jsx`: composição da página institucional.
- `ColmeiaApp.jsx`: entrada da demonstração e retorno à página inicial.
- `CommunityShell.jsx`: telas, navegação e interações das visões de estudante e mediador.
- `CommunityState.jsx`: dados iniciais, regras de negócio, ações e persistência.
- `community.css`: interface mobile, moldura do aparelho e componentes do produto.
- `index.css`: identidade visual, layout da landing e responsividade global.

## Stack

- React 18.
- Vite 8.
- React Router 6.
- Framer Motion.
- Lucide React.
- CSS próprio com variáveis de identidade visual.
- `localStorage` para persistência da demonstração.
- Service Worker e manifesto para instalação como PWA.

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `/` | Landing page e apresentação do produto. |
| `/app?visao=aluno` | Demonstração iniciada na visão do estudante. |
| `/app?visao=mediador` | Demonstração iniciada na visão do mediador. |

## Estado local

A chave atual de persistência é:

```text
colmeia.communities.student-led.v5
```

O estado inclui perfil, clubes, comunidades, missões, favos, publicações, rituais, pedidos de apoio, avisos e alertas do mediador. O botão **Reiniciar** remove a chave e restaura os dados iniciais.

## Execução local

Requisitos:

- Node.js 20 ou superior.
- npm 10 ou superior.

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev -- --host 127.0.0.1 --port 8003
```

Acesse:

```text
http://127.0.0.1:8003/
```

## Qualidade e build

Verificação estática:

```bash
npm run lint
```

Build de produção:

```bash
npm run build
```

Build com caminho-base da publicação no GitHub Pages:

```bash
GITHUB_PAGES=true npm run build
```

Os arquivos finais são gerados em `dist/`.

## Publicação

O workflow `.github/workflows/deploy-pages.yml` executa o build e publica o conteúdo de `dist/` no GitHub Pages. A configuração de `vite.config.js` define automaticamente o caminho-base `/app-colmeia/` nesse ambiente.

## Verificação manual

1. Abra a landing e confira o cabeçalho, a composição inicial e o scrollytelling.
2. Clique em **Explorar como aluno**.
3. Navegue por **Início**, **Clubes**, **Missões**, **Agenda** e **Perfil**.
4. Abra uma missão, consulte o favo, registre o percurso e conclua a resposta coletiva.
5. Troque para a visão do mediador no seletor externo ao aparelho.
6. Crie uma missão, revise a distribuição e publique.
7. Crie ou edite um ritual e confirme a marcação no calendário.
8. Teste pedidos de apoio, notificações, modo noturno e reinício da demonstração.
9. Use **Voltar à página inicial** e confirme o retorno à landing.

## Documentação técnica

Detalhes de arquitetura, estado, regras e limitações estão em [`docs/DOCUMENTACAO_TECNICA.md`](docs/DOCUMENTACAO_TECNICA.md).

## Equipe

Entre Pretas — HACKTUDO 2026

- Helena Valanera
- Maria Eduarda Pacheco
- Gabriela Mullet
