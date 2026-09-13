# Colmeia — Ecossistema de Comunidades

> Pequenas missões. Grandes conexões.

A Colmeia é uma plataforma educacional que transforma o celular pessoal em uma ponte para experiências de aprendizagem presenciais, colaborativas e mediadas por educadores.

## Problema

O desafio não é apenas o excesso de telas: estudantes frequentemente usam dispositivos digitais para interagir sempre com os mesmos grupos, o que pode fortalecer bolhas sociais, reduzir encontros presenciais e limitar a prática de colaboração, autonomia e liderança.

## Solução

A Colmeia propõe missões pedagógicas curtas, organizadas em “favos”. Cada favo convida os estudantes a realizar uma ação presencial, colaborar com colegas e construir uma descoberta coletiva.

O mediador cria as missões, vincula objetivos de aprendizagem da BNCC, acompanha indicadores agregados e oferece apoio pedagógico sem vigiar estudantes.

## Funcionalidades do MVP

### Aluno
- Acessar missões em grupo
- Explorar favos de uma missão
- Acompanhar o progresso coletivo
- Visualizar a comunidade escolar
- Compartilhar descobertas, em breve
- Personalizar preferências, em breve

### Mediador
- Criar uma missão
- Vincular objetivos da BNCC
- Definir favos e duração
- Ativar mistura de grupos para ampliar conexões
- Acompanhar progresso agregado
- Visualizar indicadores de participação e colaboração
- Acessar relatórios pedagógicos
- Moderar comunidades, em breve
- 
## Acesso ao protótipo

🔗 **Acessar protótipo navegável: ([https://SEU-USUARIO.github.io/colmeia-hacktudo-2026/](https://helenavalanera.github.io/app-colmeia/)**

O protótipo é publicado com GitHub Pages e pode ser acessado diretamente pelo navegador, sem instalação de dependências.

Para executar localmente, basta abrir o arquivo `index.html` na raiz do repositório.

## Princípios éticos

- Não monitora navegação, tempo de tela, câmera ou localização.
- Não cria ranking individual entre estudantes.
- Não expõe estudantes isolados para a turma.
- Apresenta dados agregados para apoiar a mediação pedagógica.
- Incentiva interações presenciais e colaboração entre pares.

- ## Fontes, bibliotecas e atribuições

Este projeto foi desenvolvido no contexto do HACKTUDO 2026. A Colmeia utiliza referências públicas, bibliotecas open source e dados fictícios exclusivamente para demonstração do MVP.

### Referências pedagógicas e institucionais

- [Base Nacional Comum Curricular (BNCC) — MEC](https://basenacionalcomum.mec.gov.br/a-base)  
  Referência para a vinculação de objetivos e habilidades de aprendizagem às missões criadas pelo mediador.

- [Lei nº 15.100/2025 — Presidência da República / Planalto](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15100.htm)  
  Referência para o uso pedagógico de dispositivos digitais sob orientação de educadores na educação básica.

- [MEC — Perguntas frequentes sobre uso de celulares nas escolas](https://www.gov.br/mec/pt-br/acesso-a-informacao/perguntas-frequentes/uso-de-celulares-nas-escolas)  
  Contexto institucional sobre o uso de celulares no ambiente escolar.

- [BNCC — Competências socioemocionais como fator de proteção à saúde mental e ao bullying](https://basenacionalcomum.mec.gov.br/implementacao/praticas/caderno-de-praticas/aprofundamentos/195-competencias-socioemocionais-como-fator-de-protecao-a-saude-mental-e-ao-bullying)  
  Referência para o foco da Colmeia em empatia, cooperação, pertencimento, autonomia e convivência.

- [Instituto Ayrton Senna — As 10 Competências Gerais da BNCC e as competências socioemocionais](https://institutoayrtonsenna.org.br/app/uploads/2022/12/instituto-ayrton-senna-as-10-competencias-gerais-da-bncc-e-as-competencias-socioemocionais.pdf)  
  Referência complementar para competências como empatia, cooperação, responsabilidade e cidadania.

- [RIT — Algoritmos, bolhas digitais e tolerância juvenil](https://rit.org.br/algoritmo-da-bolha-por-que-as-redes-estao-erodindo-a-tolerancia-juvenil-e-como-furar-a-bolha/)  
  Referência conceitual para a mecânica de mistura de grupos e ampliação de conexões entre estudantes.

- [Revista Interação / UFG — Plataformas de redes sociais digitais e câmaras de eco](https://revistas.ufg.br/interacao/article/view/79502)  
  Referência sobre bolhas digitais e seus reflexos no cotidiano escolar.

### Referências de aprendizagem colaborativa

- [Jigsaw Classroom — Elliot Aronson](https://www.jigsaw.org/)  
  Referência para a dinâmica de interdependência entre estudantes: cada participante contribui com uma parte da atividade, representada na Colmeia pelos “favos”.

### Bibliotecas e ferramentas utilizadas

- [React](https://react.dev/) — Biblioteca para construção da interface do protótipo.
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática para maior organização e segurança do código.
- [Vite](https://vite.dev/) — Ferramenta de build e ambiente de desenvolvimento.
- [React Router](https://reactrouter.com/) — Navegação entre as telas do aluno e do mediador.
- [Tailwind CSS](https://tailwindcss.com/) — Estilização responsiva e construção da identidade visual.
- [Lucide](https://lucide.dev/) — Ícones utilizados na interface.
- [Recharts](https://recharts.org/) — Gráficos do painel pedagógico agregado do mediador.
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) — Recursos de Progressive Web App para uso em dispositivos móveis.
- [clsx](https://github.com/lukeed/clsx) — Organização condicional de classes CSS.
- [date-fns](https://date-fns.org/) — Formatação e manipulação de datas no protótipo.

### Fontes tipográficas

Caso utilizadas no projeto, as fontes devem ser carregadas de fontes oficiais ou distribuídas sob licenças adequadas.

- [Google Fonts](https://fonts.google.com/)  
  Sugestões de fontes: **Nunito**, **Poppins** ou **DM Sans**.

Exemplo de importação:

```css
@import url('[https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap](https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap)');
```

### Ícones, imagens e ilustrações

- [Lucide Icons](https://lucide.dev/) — Ícones de interface.
- [unDraw](https://undraw.co/illustrations) — Ilustrações open source, caso utilizadas.
- [Storyset](https://storyset.com/) — Ilustrações personalizáveis, caso utilizadas, respeitando as regras de atribuição da plataforma.
- [Unsplash](https://unsplash.com/) — Fotografias ilustrativas, caso utilizadas.
- [Pexels](https://www.pexels.com/pt-br/) — Fotografias e vídeos ilustrativos, caso utilizados.
- Elementos proprietários da Colmeia — logo, favos, abelhas, telas, textos, fluxos e identidade visual produzidos pela equipe Entre Pretas.

> Importante: imagens, avatares, nomes, turmas, indicadores, missões, objetivos exibidos e dados de participação presentes no MVP são fictícios e foram criados exclusivamente para demonstração.

### Dados da BNCC

Os objetivos BNCC apresentados no dropdown de cadastro de missão são utilizados como referência pedagógica de demonstração.

No MVP:
- A busca por código, tema e componente curricular funciona sobre uma base reduzida de dados fictícios ou de exemplo.
- A vinculação de objetivos BNCC não substitui planejamento pedagógico, currículo da rede ou validação da coordenação escolar.
- Em uma versão futura, a base deverá utilizar dados oficiais, revisados e atualizados conforme as publicações do MEC.

### Privacidade e ética

A Colmeia foi concebida para apoiar a mediação pedagógica sem ampliar a vigilância dos estudantes.

O MVP não coleta:
- Histórico de navegação.
- Tempo individual de tela.
- Geolocalização.
- Áudio, câmera ou imagens obrigatórias.
- Senhas ou dados sensíveis.
- Ranking público ou comparação individual entre estudantes.

Os indicadores exibidos para o mediador são agregados e demonstrativos, como participação coletiva, progresso da missão e colaboração entre grupos.

### Licença do projeto

Este repositório utiliza a licença MIT, salvo quando indicado de outra forma em arquivos ou dependências específicas.

As bibliotecas, ícones, fontes e demais recursos de terceiros permanecem sujeitos às respectivas licenças de seus autores e mantenedores.

## Equipe

Entre Pretas - Time 60 — Hacktudo 2026
- Helena Valanera
- Maria Eduarda Pacheco
- Gabriela Mullet
