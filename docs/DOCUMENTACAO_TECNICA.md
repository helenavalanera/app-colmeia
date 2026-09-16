# Colmeia — documentação técnica da demonstração

## 1. Escopo

Esta documentação descreve a landing page e o protótipo navegável da Colmeia, desenvolvidos para o HACKTUDO 2026. A experiência demonstra a gestão de comunidades escolares conduzidas por estudantes, com missões colaborativas, favos complementares, clubes entre turmas e mediação pedagógica sob demanda.

A implementação atual é uma demonstração front-end. Os dados e a distribuição assistida são simulados localmente; não há envio de dados para uma IA ou para um banco externo durante o uso da demo.

## 2. Tecnologias

- React 18 e JSX.
- Vite 8 para desenvolvimento e build.
- React Router para as rotas `/` e `/app`.
- CSS próprio com variáveis de identidade visual.
- Framer Motion para transições de tela e movimentos reduzíveis.
- Lucide React para os ícones funcionais.
- `localStorage` para persistência da demonstração.
- PWA via `vite-plugin-pwa`.

## 3. Rotas

| Rota | Responsabilidade |
| --- | --- |
| `/` | Landing page, narrativa do produto e acesso à demonstração. |
| `/app?visao=aluno` | Protótipo mobile iniciado na visão do estudante. |
| `/app?visao=mediador` | O mesmo protótipo iniciado na visão do mediador. |

O seletor externo ao aparelho altera o parâmetro `visao`. Um gesto horizontal dentro da tela também alterna entre as duas visões.

## 4. Organização do código

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
│   ├── AvatarStudio.jsx
│   └── SiteHeader.jsx / SiteFooter.jsx
├── components/comunidade/
│   ├── CommunityShell.jsx
│   └── community.css
├── state/
│   └── CommunityState.jsx
└── index.css
```

`CommunityShell.jsx` concentra as telas da demonstração mobile. `CommunityState.jsx` concentra os dados fictícios, as regras de negócio e a persistência.

## 5. Landing page

A landing é composta nesta ordem:

1. Cabeçalho com Entre Pretas, marca completa da Colmeia e HACKTUDO 2026.
2. Abertura full bleed com a ilustração da colmeia encostada no limite do navegador.
3. Selos de privacidade e troca entre turmas.
4. Problema educacional.
5. Scrollytelling da turma até a rede escolar.
6. Hierarquia comunidade → turmas/clubes → missão → favo → resposta coletiva.
7. Jornada central.
8. Papéis de mediador, estudante e embaixador.
9. Princípios de mediação sem vigilância.
10. Casos de uso em sala, banda marcial e robótica.
11. Chamada final e rodapé institucional.

### Scrollytelling

`NetworkStory.jsx` usa canvas para representar a evolução das conexões. A narrativa começa nas turmas, cria pequenos grupos, revela afinidades e termina em clubes que atravessam os anos escolares.

### Ativos visuais

- `public/hero/colmeia-opening-user.png`: ilustração da abertura e detalhe opaco do palco da demo.
- `public/brand/colmeia-mark.png`: símbolo usado dentro do aplicativo.
- `public/brand/honeycomb-lines.png`: malha decorativa de favos.
- `public/hero/sticker-flor.png`: sticker original da Flor.
- `public/hero/sticker-hatch.png`: sticker original do Hatch.
- `public/hero/sticker-star.png`: sticker original de estrela.

Os três stickers foram copiados sem transformação dos arquivos fornecidos. O CSS controla somente posição, dimensão de exibição, sombra e movimento suave. A animação é desativada quando o navegador solicita redução de movimento.

## 6. Estrutura do protótipo mobile

`IPhoneMockup.jsx` constrói a moldura do aparelho com bezel, botões laterais, Dynamic Island, câmera, sensor e indicador de gesto. `IPhoneStatusBar.jsx` exibe hora local, sinal, Wi-Fi e bateria.

O conteúdo interativo permanece dentro de `co-phone`; o seletor aluno/mediador fica fora do aparelho. A decoração da colmeia é ancorada na borda direita da janela, enquanto o mockup continua centralizado.

### Navegação do estudante

- **Início:** feed priorizado pelos interesses ou feed de toda a escola.
- **Clubes:** clubes do estudante, descoberta de novos clubes e proposta de clube.
- **Missões:** missão da turma ou do clube, favo privado, pista, check-in e resposta coletiva.
- **Agenda:** calendário e rituais de turma ou clube.
- **Perfil:** dados escolares, interesses, participação e Minha Abelha.

### Navegação do mediador

- **Início:** pedidos de apoio, novas evidências e feed recente.
- **Clubes:** panorama dos clubes e embaixadores.
- **Missões:** criação assistida e panorama das missões.
- **Agenda:** criação e edição de rituais.
- **Perfil:** nome e papel exercido na escola.

## 7. Regras de produto implementadas

### Comunidades, turmas e clubes

A escola é a comunidade. A turma é o ponto de partida e os clubes conectam estudantes do 6º ao 9º ano por interesses. O perfil separa ano escolar e turno, produzindo rótulos como `6º ano | Manhã`.

O estudante pode propor um clube e torna-se seu embaixador. A criação oferece uma biblioteca de símbolos para leitura, música, robótica, artes, jogos, cinema, teatro, natureza, acolhimento, esportes e descobertas.

### Missões e favos

O mediador informa escopo, contexto, objetivo, quantidade de estudantes e tamanho dos grupos. A função `createMissionPlan` escolhe um tema coerente com o texto e sugere:

- subgrupos;
- objetivos complementares;
- favos individuais;
- perguntas;
- pistas e espaços da escola.

Cada estudante acessa somente seu próprio favo. O local permanece na pista individual e não é divulgado antecipadamente no clube. O último check-in libera o registro da resposta coletiva.

### Soft skills

As missões usam dez soft skills selecionáveis: autoconhecimento, autocuidado, empatia, cooperação, comunicação, escuta ativa, responsabilidade, autonomia, criatividade e resolução de conflitos.

### Evidências e feed

Uma descoberta pode conter texto, foto ou ambos. As publicações têm aparência de feed social, com curtidas e comentários funcionando como conversa contextual. Não existe chat privado.

Ao publicar uma foto, o estado cria um alerta para o mediador associado à missão ativa daquele clube. Evidências fotográficas compartilhadas ao concluir uma missão também geram alerta.

### Apoio do mediador

O estudante pode pedir pólen, solicitar mais cinco minutos ou solicitar um favo coringa. O favo coringa informa explicitamente que deve ser usado quando alguém do grupo está sem telefone.

Quando o mediador concede tempo adicional, o prazo da missão aumenta e o estudante recebe uma notificação suspensa.

### Agenda e rituais

O calendário diferencia rituais de turma em verde e de clube em lilás. O mediador define data, horário, local, recorrência e público. A publicação aparece imediatamente na agenda do estudante correspondente.

### Perfil e avatar

O perfil contém:

- nome;
- ano escolar;
- turno;
- múltiplos interesses selecionados em uma lista suspensa;
- clubes e missões concluídas;
- acesso à Minha Abelha.

`AvatarStudio.jsx` oferece Flor e Hatch, interação por toque, troca lateral e opções de acessórios. O avatar salvo continua ligado ao perfil.

## 8. Estado e persistência

O provider `CommunityProvider` expõe o estado e as ações da demo. A chave atual é:

```text
colmeia.communities.student-led.v5
```

Principais coleções:

| Campo | Conteúdo |
| --- | --- |
| `profile` | Nome, ano, turno, interesses e itens do avatar. |
| `mediatorProfile` | Nome e cargo do mediador. |
| `comunidades` | Ecossistemas temáticos da escola. |
| `clubes` | Membros, turmas, embaixador, símbolo, encontro e combinados. |
| `missoes` | Escopo, favos, prazos, trajetos, soft skills e resposta. |
| `posts` | Conteúdo, audiência, foto, curtidas e comentários. |
| `rituais` | Escopo, recorrência, data, horário e local. |
| `pedidos` | Pedidos de pólen, tempo e favo coringa. |
| `avisos` | Retornos mostrados ao estudante. |
| `alertasMediador` | Evidências fotográficas e contexto da missão. |

O botão **Reiniciar** remove essa chave e repõe o estado inicial. Uma migração aditiva normaliza dados de versões anteriores quando possível.

## 9. Assistência e moderação simuladas

A demonstração representa duas aplicações futuras de IA:

1. distribuição contextual de grupos, favos, perguntas e espaços;
2. moderação preventiva das publicações.

Nesta versão, ambas rodam como regras JavaScript locais e determinísticas. `themeFor` e `createMissionPlan` relacionam palavras do contexto com modelos predefinidos. `moderationMessage` bloqueia uma lista curta de termos ofensivos ou ameaçadores e pede uma reformulação respeitosa.

Em produção, essas regras devem ser substituídas por um serviço autenticado, com política de privacidade, registro de decisões, revisão humana, tratamento de falsos positivos e limites de retenção.

## 10. Identidade visual e responsividade

Paleta principal:

- laranja: `#F86700`;
- amarelo: `#FFAC00`;
- preto: `#18181B`.

A landing usa áreas largas, contornos fortes, sombras sólidas, stickers e imagens 3D/ilustradas. A interação do produto permanece delimitada ao aparelho. O app oferece modo claro e escuro, cards translúcidos e detalhes visuais de baixa opacidade.

O mockup usa proporção `390 / 844` e limita o tamanho pela altura disponível da janela. Em telas pequenas, a landing reorganiza grids e remove stickers decorativos que poderiam encobrir conteúdo.

## 11. Acessibilidade

- Ícones funcionais recebem texto ou `aria-label`.
- Abas usam `aria-pressed` e a navegação usa `aria-current`.
- Avisos assíncronos usam `role="status"` ou `role="alert"`.
- Estados de foco usam contorno visível.
- Animações decorativas respeitam `prefers-reduced-motion`.
- Contraste dos botões principais preserva texto preto sobre amarelo ou laranja.

## 12. Execução e verificação

Dependências já instaladas:

```bash
npm run dev -- --host 127.0.0.1 --port 8003
```

Verificações usadas:

```bash
npm run lint
npm run build
```

O script `npm run typecheck` não encontra entradas porque o `jsconfig.json` atual inclui arquivos `.js` em `src/components`, enquanto os componentes principais usam `.jsx`. Essa limitação de configuração não impede o build.

### Roteiro de teste manual

1. Abra `/` e confirme a marca completa, a imagem da colmeia na borda e os stickers na seção de papéis.
2. Clique em **Explorar como aluno**.
3. Abra **Perfil → Editar perfil**, altere ano, turno e selecione vários interesses.
4. Abra **Clubes → Propor um clube** e selecione um símbolo da biblioteca.
5. No feed, crie uma publicação em texto e confirme a ordenação por interesses.
6. Tente publicar um termo bloqueado e confirme a mensagem da moderação.
7. Publique uma foto e troque para a visão do mediador.
8. Abra o sino e confirme a notificação da evidência fotográfica.
9. Em **Missões**, crie uma missão para uma turma, informe presentes, escolha duplas/trios/quartetos e gere a distribuição.
10. Em **Agenda**, crie ou edite um ritual e confirme sua marcação no calendário.
11. Volte à visão do aluno, abra uma missão, registre o local visitado, conecte o último favo e envie a resposta coletiva.
12. Teste **Preciso de pólen**, **Mais 5 minutos**, **Favo coringa**, modo noturno e **Reiniciar**.

## 13. Limitações atuais

- Não há autenticação real por papel.
- Não há sincronização entre dispositivos ou usuários distintos.
- Fotos ficam no `localStorage` em formato data URL e têm limite de 1 MB.
- IA e moderação são simulações locais.
- Horários e participantes são dados fictícios.
- A versão antiga em `StudentPhone.jsx`, `TeacherPhone.jsx` e `DemoState.jsx` está mantida apenas como referência e não é usada pelas rotas atuais.

