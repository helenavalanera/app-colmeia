# Refinamento de estrutura — Colmeia V4

Referência visual inspecionada: https://colmeia-favo-vivo.base44.app/app

A referência separa comunidade, clube, missão e favo e apresenta espaços escolares e contexto coletivo de apoio. Sua condução das missões pelo mediador não foi adotada: na Colmeia V4, alunos organizam os clubes e o mediador apoia quando chamado.

## Estrutura aplicada

- Barra principal preservada: Início (feed), Comunidades, Missões e Perfil.
- Comunidade: resumo de clubes, espaços e missões; camadas Clubes, Saberes e Agenda.
- Agenda: encontros recorrentes combinados pelos clubes, com seus espaços escolares. Não representa reservas de sala nem um calendário de eventos datados.
- Clube: propósito, participação entre turmas, espaços e encontro; camadas Missões, Feed e Sobre.
- Embaixador: mantém organização dentro da visão do aluno e pode editar encontro, espaços e combinados.
- Missão: contexto do clube, intenção psicossocial e etapas Meu favo → Encontro → Resposta → Saberes. O fragmento só aparece ao abrir Meu favo. O registro coletivo permanece separado do check-in.
- Mediador: pedidos com mensagem do grupo, contexto agregado e orientação devolvida às notificações do aluno. Nenhum fragmento individual é exibido nesse contexto.
- Caminho de volta preservado ao abrir uma missão a partir de um clube e uma comunidade.

## Identidade preservada

Laranja #F86700, amarelo #FFAC00, preto #18181B, tipografia e componentes atuais, temas claro e noturno, interação dentro do celular e abelha dentro do Perfil.

## Dados e limites

Alterações locais ao protótipo React; nenhum envio ou publicação no app Base44 de referência. Campos de espaços e combinados são adicionados aos dados locais sem apagar perfis, clubes ou respostas existentes. Convites e confirmações dos outros participantes continuam simulados. A agenda reutiliza os encontros definidos pelos embaixadores. A aplicação continua sem sincronização entre dispositivos.

## Verificação manual

1. Comunidades → abrir comunidade → alternar Clubes, Saberes e Agenda.
2. Agenda → Ver clube e encontro → Sobre; conferir responsáveis e combinados.
3. No clube em que é embaixador, Organizar clube → editar espaços/combinados → salvar; conferir na comunidade.
4. Clube → Ver missão → Abrir meu favo; conferir liberação do check-in e voltar até a comunidade.
5. Sobre → Preciso de pólen → escrever pedido → alternar ao mediador → Ver contexto do grupo → Enviar orientação → voltar ao aluno.
6. Alternar os temas e recarregar; os dados locais devem permanecer.

Build e lint passaram. Navegação, edição de espaços com atualização da agenda, abertura do favo, pedido/resposta de apoio e temas foram verificados no navegador. O typecheck retorna TS18003 porque a configuração existente não inclui os arquivos JSX do projeto.
