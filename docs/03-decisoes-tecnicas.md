# Decisões Técnicas — Product Management

## 1. Objetivo

Este documento registra as principais decisões técnicas adotadas para o desenvolvimento do projeto Product Management.

O objetivo é documentar não apenas quais tecnologias serão utilizadas, mas também o motivo de cada escolha.

As decisões registradas aqui deverão servir como referência durante a implementação e facilitar a manutenção e evolução do projeto.

Uma decisão poderá ser alterada posteriormente caso surja uma necessidade técnica real. Nesse caso, a alteração deverá ser registrada neste documento.

---

# 2. Stack Principal

A aplicação será desenvolvida utilizando:

- Vue 3;
- TypeScript;
- Vite;
- Vue Router;
- Pinia;
- Axios;
- biblioteca de componentes de interface;
- biblioteca de validação de formulários;
- Vitest e Vue Test Utils (previstos para a fase de qualidade/testes);
- ESLint;
- Prettier.

A escolha das bibliotecas deverá priorizar:

- estabilidade;
- documentação;
- integração com Vue 3;
- manutenção ativa;
- simplicidade;
- adequação ao tamanho do projeto.

---

# 3. Vue 3

## Decisão

Utilizar Vue 3 como framework principal da aplicação.

## Justificativa

Vue 3 oferece uma estrutura adequada para aplicações frontend modernas e possui recursos suficientes para atender ao escopo do projeto sem introduzir complexidade desnecessária.

A utilização do Vue 3 também permite demonstrar conhecimento de:

- componentes;
- Composition API;
- reatividade;
- props;
- emits;
- composables;
- gerenciamento de estado;
- roteamento.

---

# 4. Composition API

## Decisão

Utilizar Composition API como padrão para desenvolvimento dos componentes.

A sintaxe `<script setup>` será utilizada sempre que apropriado.

## Justificativa

A Composition API permite organizar a lógica por responsabilidade em vez de depender exclusivamente da estrutura tradicional baseada em opções.

Isso facilita:

- reutilização de lógica;
- criação de composables;
- organização de componentes;
- manutenção;
- tipagem com TypeScript.

---

# 5. TypeScript

## Decisão

Utilizar TypeScript em todo o código da aplicação.

O projeto deverá utilizar configuração strict.

## Justificativa

O TypeScript reduz erros relacionados a tipos e torna os contratos da aplicação mais explícitos.

No contexto deste projeto, ele será utilizado principalmente para representar:

- produtos;
- categorias;
- avaliações;
- payloads;
- respostas da API;
- propriedades dos componentes;
- estados;
- parâmetros de funções.

O uso de `any` deverá ser evitado.

---

# 6. Vite

## Decisão

Utilizar Vite como ferramenta de desenvolvimento e build.

## Justificativa

Vite possui integração direta com Vue e oferece um ambiente de desenvolvimento rápido, configuração relativamente simples e processo de build adequado para aplicações frontend.

A escolha também reduz a quantidade de configuração necessária para iniciar o projeto.

---

# 7. Vue Router

## Decisão

Utilizar Vue Router para gerenciamento das rotas, em **History Mode** (`createWebHistory`), com URLs limpas (`/produtos`, `/favoritos`, etc.).

## Justificativa

O projeto possui diferentes áreas que precisam ser acessíveis através de URLs específicas.

Entre elas:

- listagem de produtos;
- detalhes;
- favoritos;
- criação;
- edição.

O Vue Router fornece integração oficial com Vue e permite organizar essas rotas de forma declarativa.

History Mode exige que o host (ex.: Vercel) sirva `index.html` para rotas do frontend quando o arquivo físico não existir — ver decisão **35.15**.

---

# 8. Pinia

## Decisão

Utilizar Pinia para gerenciamento de estado global.

## Justificativa

Pinia é a solução oficial de gerenciamento de estado para aplicações Vue modernas e possui integração adequada com Vue 3 e TypeScript.

Entretanto, o projeto não deverá utilizar Pinia para todo estado da aplicação.

A regra será:

- estado local de componente → manter no componente;
- estado compartilhado entre componentes → considerar composable;
- estado global persistente ou compartilhado → utilizar Pinia.

Inicialmente, o principal estado global será o gerenciamento de favoritos.

---

# 9. Axios

## Decisão

Utilizar Axios para comunicação com a Fake Store API.

## Justificativa

Axios fornece uma interface simples para requisições HTTP e permite centralizar configurações do cliente.

A utilização de um cliente HTTP separado da interface facilita a criação de uma camada de services.

O código dos componentes não deverá realizar chamadas HTTP diretamente.

---

# 10. Camada de Services

## Decisão

Criar uma camada específica para comunicação com a API.

Os services serão responsáveis pelas operações relacionadas aos recursos externos.

Exemplo:

- `productService` (produtos e categorias).

Não foi criado um `categoryService` separado: `getCategories()` permanece em `productService`, pois o endpoint `/products/categories` pertence ao recurso de produtos da Fake Store API.

## Justificativa

A separação da comunicação HTTP da interface reduz o acoplamento entre apresentação e infraestrutura.

Isso também facilita:

- testes;
- manutenção;
- substituição da API;
- tratamento de respostas;
- reutilização das operações.

---

# 11. Biblioteca de Componentes de Interface

## Decisão

Utilizar **PrimeVue** como biblioteca de componentes de interface.

## Justificativa

PrimeVue é compatível com Vue 3 e TypeScript, oferece componentes de formulário, feedback (Toast, Skeleton) e navegação, e atende aos critérios de consistência visual e acessibilidade básica do projeto.

TailwindCSS complementa o PrimeVue na composição de layout, espaçamento e responsividade.

---

# 12. Validação de Formulários

## Decisão

Utilizar **vee-validate** com **Yup** (`@vee-validate/yup`) para validação dos formulários.

O schema Yup permanece centralizado em `src/schemas/productFormSchema.ts` e é reutilizado por criação e edição.

## Justificativa

A criação de regras de validação diretamente dentro dos componentes tende a aumentar a complexidade e dificultar a reutilização.

Uma solução dedicada permite manter as regras organizadas e facilita testes.

---

# 13. Persistência de Favoritos

## Decisão

Utilizar `localStorage` para persistência dos favoritos.

## Justificativa

Os favoritos não precisam ser persistidos em um servidor para atender ao escopo do projeto.

O `localStorage` permite:

- persistência após recarregar a página;
- implementação simples;
- ausência de dependência adicional;
- funcionamento totalmente no navegador.

Somente os dados necessários para identificar os favoritos deverão ser armazenados.

A aplicação não deverá armazenar dados completos dos produtos no `localStorage` sem necessidade.

---

# 14. Gerenciamento de Estado Local

## Decisão

Priorizar estado local sempre que ele não precisar ser compartilhado.

Exemplos:

- abertura de modal;
- estado de um campo;
- loading específico de um componente;
- controle visual;
- seleção temporária.

## Justificativa

Centralizar todo o estado em uma store aumenta o acoplamento e dificulta a compreensão da aplicação.

O estado deverá permanecer o mais próximo possível de onde é utilizado.

---

# 15. Composables

## Decisão

Utilizar composables para lógica reutilizável relacionada ao comportamento da interface.

Exemplos possíveis:

- `useProductsCatalog`;
- `useProductListControls`;
- `useDebouncedRef`;
- `useProductDetails`;
- `useFavoriteProducts`.

## Justificativa

Composables permitem reutilizar lógica sem duplicá-la entre componentes.

Eles também ajudam a manter os componentes focados na apresentação e interação.

Um composable não deverá ser criado apenas para transformar poucas linhas de código em outro arquivo.

---

# 16. Debounce

## Decisão

Utilizar debounce na pesquisa de produtos.

## Justificativa

A pesquisa não deve executar uma operação imediatamente a cada caractere digitado.

O debounce reduz operações desnecessárias e melhora a experiência do usuário.

O tempo de debounce adotado é **300ms**, via `useDebouncedRef` em `useProductListControls`.

---

# 17. Paginação

## Decisão

A paginação será realizada no frontend caso a Fake Store API não disponibilize paginação adequada para o fluxo necessário.

## Justificativa

A API utilizada no projeto possui limitações em relação à paginação.

Como o volume de dados esperado para este projeto é pequeno, a aplicação poderá carregar os produtos e realizar a divisão em páginas no frontend.

A implementação deverá ser mantida simples e preparada para uma futura migração para paginação no backend caso a fonte de dados seja substituída.

---

# 18. Testes

## Decisão

Utilizar Vitest como framework de testes e Vue Test Utils para testes de componentes Vue.

Essa decisão define a **ferramenta pretendida** para testes automatizados. Ela **não exige** que Vitest e Vue Test Utils estejam instalados desde a fundação do projeto.

A configuração da infraestrutura de testes automatizados deverá ocorrer na fase própria de qualidade/QA do plano de implementação, quando houver código de negócio suficiente para justificar a cobertura.

Até lá, a validação das fases iniciais poderá ocorrer por inspeção, TypeScript, lint, build e testes manuais relevantes.

## Justificativa

Vitest possui integração adequada com o ecossistema Vite.

Vue Test Utils fornece recursos específicos para montar e testar componentes Vue.

A estratégia deverá priorizar testes que validem comportamento e regras importantes, evitando testes excessivamente acoplados à implementação interna.

Adiar a instalação evita dependências ociosas nas fases em que ainda não há telas, formulários ou fluxos prontos para cobertura automatizada.

---

# 19. Estratégia de Testes

Os testes serão divididos principalmente em:

## Testes de unidade

Utilizados para:

- funções auxiliares;
- validações;
- composables;
- regras de negócio isoladas.

## Testes de componentes

Utilizados para:

- interações importantes;
- estados visuais relevantes;
- formulários;
- componentes com comportamento próprio.

## Testes de fluxo

Serão utilizados para validar os principais fluxos da aplicação quando houver benefício real.

Exemplos:

- pesquisar produto;
- favoritar produto;
- criar produto;
- editar produto.

A cobertura não deverá ser utilizada como único indicador de qualidade.

---

# 20. ESLint

## Decisão

Utilizar ESLint para análise estática do código.

## Justificativa

O ESLint ajuda a identificar:

- problemas de código;
- padrões inconsistentes;
- possíveis erros;
- práticas inadequadas.

A configuração deverá ser compatível com Vue 3 e TypeScript.

---

# 21. Prettier

## Decisão

Utilizar Prettier para formatação automática do código.

## Justificativa

A formatação automática reduz discussões e inconsistências relacionadas ao estilo do código.

O objetivo é manter o foco das revisões em comportamento, arquitetura e qualidade técnica.

---

# 22. Git

## Decisão

Utilizar Git para controle de versão.

Os commits deverão ser pequenos e representar mudanças coerentes.

A mensagem dos commits deverá seguir um padrão consistente.

Exemplos:

- `docs: define requisitos do projeto`;
- `docs: define arquitetura do projeto`;
- `feat: implementa listagem de produtos`;
- `fix: corrige persistência de favoritos`;
- `test: adiciona testes de favoritos`;
- `refactor: reorganiza services de produtos`.

---

# 23. Documentação como Fonte de Verdade

## Decisão

A documentação localizada em `docs/` será considerada a referência principal para implementação.

Antes de realizar alterações estruturais, o código deverá ser confrontado com:

- requisitos;
- arquitetura;
- decisões técnicas;
- contrato da API;
- especificação da interface;
- plano de implementação.

## Justificativa

O objetivo é evitar que a implementação seja conduzida exclusivamente pela geração de código.

A documentação define a intenção do sistema e o código implementa essa intenção.

---

# 24. Uso de Inteligência Artificial

## Decisão

Ferramentas de inteligência artificial poderão ser utilizadas durante o desenvolvimento.

A IA será considerada uma ferramenta de apoio e não a responsável pelas decisões arquiteturais.

## Regras

Toda implementação gerada por IA deverá:

- estar alinhada aos requisitos;
- respeitar a arquitetura;
- respeitar as decisões técnicas;
- ser revisada pelo desenvolvedor;
- ser executada e validada;
- possuir testes quando aplicável;
- não introduzir dependências sem justificativa.

A IA não deverá alterar a arquitetura ou adicionar funcionalidades fora do escopo sem uma decisão explícita.

---

# 25. Uso do Cursor Agent

## Decisão

O Cursor Agent poderá ser utilizado para auxiliar na implementação seguindo a documentação existente.

O agente deverá receber tarefas pequenas e objetivas.

Exemplos:

- implementar um componente;
- criar um service;
- implementar um composable;
- criar testes;
- corrigir um comportamento específico.

Evitar solicitações excessivamente amplas como:

"Implemente todo o projeto."

## Justificativa

Dividir o desenvolvimento em tarefas menores facilita:

- revisão;
- identificação de erros;
- controle das alterações;
- entendimento do código;
- validação dos requisitos.

---

# 26. Regras para Dependências

Uma nova dependência somente deverá ser adicionada quando houver uma justificativa clara.

Antes de adicionar uma biblioteca, deverão ser considerados:

- necessidade real;
- tamanho;
- manutenção;
- documentação;
- compatibilidade com Vue 3;
- compatibilidade com TypeScript;
- impacto no bundle;
- complexidade adicionada.

Não deverão ser adicionadas bibliotecas apenas para resolver problemas triviais que possam ser solucionados com recursos nativos.

---

# 27. Tratamento de Erros

## Decisão

Os erros são classificados e normalizados em uma camada central (`toAppError`), depois apresentados pela UI conforme o contexto.

### Pipeline

1. Interceptor Axios → `AppError` (`kind`, `status`, `retryable`, `fieldErrors` opcional).
2. Composable/view consome `AppError` (sem reescrever mensagens técnicas).
3. `resolveErrorCopy` + vue-i18n (`errors.*`) geram título/descrição/ação.
4. Canal visual: `ErrorState` (página), Toast (ação), alerta de formulário (escrita).

### Retry

- GET / leituras: botão "Tentar novamente" reexecuta apenas a operação.
- POST/PUT: sem retry automático; o usuário reenvia manualmente com o formulário preservado.

### Empty ≠ Error

Falha de API nunca é exibida como lista vazia. Busca sem resultados usa `EmptyState`; falha de carga usa `ErrorState`.

### Produção

Logs estruturados sem dados sensíveis. Mensagens ao usuário apenas via i18n (pt-BR, es, en).

---

# 28. Modelagem de Dados

## Decisão

Os modelos da API serão representados por tipos TypeScript.

Os tipos deverão ser separados de acordo com sua responsabilidade.

Exemplos:

- modelo de produto retornado pela API;
- payload de criação;
- payload de atualização;
- avaliação;
- categoria.

Quando necessário, os dados externos poderão ser transformados para um modelo interno mais adequado à aplicação.

---

# 29. Segurança

Apesar de o projeto não possuir autenticação ou dados sensíveis, algumas práticas serão mantidas.

A aplicação deverá:

- evitar inserção de HTML arbitrário;
- não armazenar informações sensíveis no `localStorage`;
- validar dados recebidos;
- não expor credenciais;
- não armazenar chaves secretas no frontend.

Como a Fake Store API não exige credenciais privadas para o escopo previsto, nenhuma chave secreta deverá ser incluída no código.

A auditoria, as proteções e os testes estão em `docs/test/` (decisão 35.23). O frontend valida a interface; não substitui validação no servidor.

---

# 30. Performance

A aplicação deverá priorizar performance sem introduzir complexidade prematura.

Serão considerados:

- debounce na pesquisa;
- carregamento eficiente dos dados;
- componentes reutilizáveis;
- redução de renders desnecessários;
- imagens adequadamente dimensionadas;
- uso adequado de recursos do navegador.

Otimizações avançadas somente deverão ser implementadas quando houver evidência de necessidade.

---

# 31. Acessibilidade

A acessibilidade será considerada desde a construção dos componentes.

Deverão ser priorizados:

- HTML semântico;
- navegação por teclado;
- labels;
- textos alternativos;
- contraste adequado;
- foco visível;
- mensagens de erro compreensíveis;
- componentes acessíveis da biblioteca escolhida.

---

# 32. Responsividade

A interface deverá seguir uma abordagem responsiva.

A implementação deverá priorizar:

- mobile;
- tablet;
- desktop.

Os componentes deverão se adaptar ao espaço disponível sem depender de dimensões fixas desnecessárias.

---

# 33. Critérios para Revisão Técnica

Antes de considerar uma funcionalidade concluída, deverão ser avaliados:

- requisito atendido;
- arquitetura respeitada;
- tipagem adequada;
- ausência de duplicação desnecessária;
- tratamento de loading;
- tratamento de erro;
- tratamento de estado vazio;
- responsividade;
- acessibilidade;
- testes aplicáveis;
- lint;
- formatação;
- build.

---

# 34. Decisões Pendentes

As seguintes decisões ainda precisam ser refinadas durante a implementação correspondente:

- estratégia detalhada de testes automatizados (configuração do Vitest na fase de QA).

Itens já definidos e não mais pendentes:

- biblioteca de componentes visuais: PrimeVue;
- biblioteca de validação: vee-validate + Yup;
- configuração de ESLint e Prettier;
- tratamento básico de erros da API em `config/api.ts`;
- estratégia de feedback ao usuário via Toasts do PrimeVue.
As decisões restantes deverão ser tomadas considerando o escopo real do projeto e não apenas popularidade das ferramentas.

---

# 35. Registro de Alterações

Toda mudança relevante nas decisões técnicas deverá ser registrada neste documento.

Para cada alteração, deverão ser considerados:

- decisão anterior;
- nova decisão;
- motivo da alteração;
- impacto;
- data.

---

## 35.1 — Localização do cliente HTTP

**Data:** 2026-08-10

**Decisão anterior:**

O cliente Axios ficava em `src/services/api.ts`, junto dos services de domínio.

**Nova decisão:**

O cliente Axios passa a ficar em `src/config/api.ts`.

**Motivo:**

Separar configuração de infraestrutura da camada de services, que permanece responsável apenas pelas operações de domínio sobre a API.

**Impacto:**

- estrutura de pastas atualizada em `02-arquitetura.md`;
- contrato da API atualizado em `04-contrato-api.md`;
- services importam o cliente a partir de `@/config/api`.

---

## 35.2 — Momento de configuração do Vitest

**Data:** 2026-08-10

**Decisão anterior:**

A stack listava Vitest e Vue Test Utils sem delimitar quando a infraestrutura deveria ser instalada, o que poderia ser interpretado como obrigatoriedade desde a fundação.

**Nova decisão:**

Vitest e Vue Test Utils permanecem como a solução de testes automatizados do projeto, porém sua instalação e configuração ocorrem na fase de qualidade/QA, e não como pré-requisito das fases iniciais.

**Motivo:**

O código atual ainda não possui infraestrutura de testes, e as fases já concluídas (fundação, API/tipos e store de favoritos) foram validadas por TypeScript, lint, build e inspeção. Exigir Vitest antes disso geraria inconsistência entre documentação e repositório sem benefício imediato.

**Impacto:**

- redação da seção de testes atualizada;
- plano de implementação (`07-plano-de-implementacao.md`) passa a prever a configuração de testes na Fase 10 — QA final.

---

## 35.3 — Feedback com Toast e navegação após criação

**Data:** 2026-08-10

**Decisão anterior:**

A estratégia de feedback ao usuário (Toasts) estava pendente de definição na implementação correspondente.

**Nova decisão:**

- Utilizar `ToastService` e o componente `Toast` do PrimeVue.
- `ToastService` é registrado em `main.ts`.
- O componente `Toast` fica em `DefaultLayout.vue`, disponível globalmente.
- Após criação bem-sucedida: Toast de sucesso e navegação para `/produtos`.
- Em erro de criação: Toast de erro, sem redirecionamento, preservando os dados do formulário.
- Cancelar no formulário de criação retorna para `/produtos`.

**Motivo:**

A especificação de UI exige Toast de sucesso/erro e navegação para uma página apropriada. O catálogo (`/produtos`) é o destino coerente, pois a Fake Store API simula a criação sem garantir persistência consultável por ID.

**Impacto:**

- Fase 7 implementada com esse fluxo;
- edição (Fase 8) reutiliza o mesmo mecanismo de Toast.

---

## 35.4 — Feedback e navegação após edição

**Data:** 2026-08-10

**Decisão:**

- Reutilizar `ToastService` / `Toast` já registrados na Fase 7.
- Após atualização bem-sucedida: Toast **Produto atualizado com sucesso.** e navegação para `/produtos`.
- Em erro de atualização: Toast **Não foi possível atualizar o produto.**, sem redirecionamento, preservando os dados.
- Cancelar na edição retorna para `/produtos/:id` (detalhes do produto em edição), usando o ID atual de forma determinística. Não utiliza `history.back()`. Cancelar não executa PUT, não altera o estado local e não dispara Toast de sucesso.
- Carregamento inicial reutiliza `useProductDetails` + `parseProductId`; formulário só monta após o produto válido.
- `ProductForm` permanece único; prop `submitLabel` diferencia o texto do botão ("Salvar Produto" / "Salvar Alterações").

**Motivo:**

Alinhar a edição ao padrão da criação e ao SDD (Toast + página apropriada), evitando formulário/schema duplicados.

**Impacto:**

- Fase 8 concluída com esse fluxo;
- criação permanece compatível.

---

## 35.5 — Categorias no productService e filtro no frontend

**Data:** 2026-08-11

**Decisão:**

- Não criar `categoryService` separado; `getCategories()` vive em `productService`.
- Filtro por categoria e pesquisa textual ocorrem no frontend após `GET /products`.
- A FakeStoreAPI disponibiliza `GET /products/category/:category`, porém a aplicação não utiliza esse endpoint. O requisito de filtro por categoria é atendido através do carregamento do catálogo via `GET /products` e filtragem dos produtos no frontend.
- Classificação de `GET /products/category/:category`: **disponível na API, porém não utilizado e não obrigatório** — não é pendência de implementação.

**Motivo:**

O volume de dados é pequeno; uma única carga de produtos permite combinar busca, categoria, ordenação e paginação localmente sem requisições adicionais por filtro. O endpoint de categorias (`/products/categories`) permanece no mesmo service de domínio. O endpoint por categoria da FakeStoreAPI não é requisito da prova.

**Impacto:**

- contrato da API e arquitetura alinhados ao código;
- listagem usa `useProductsCatalog` + `useProductListControls`;
- RF-003 (filtro por categoria) permanece **CONCLUÍDO** sem consumir `GET /products/category/:category`.

---

## 35.6 — Ordenação unificada do catálogo (`CatalogSortOrder` + `ProductSort`)

**Data:** 2026-08-11

**Decisão:**

- Expandir o modelo de ordenação de `PriceSortOrder` (`'asc' | 'desc'`) para `CatalogSortOrder` com valores explícitos: `price-asc`, `price-desc`, `name-asc`, `name-desc`, `rating-asc`, `rating-desc`.
- Extrair a UI de seleção para `ProductSort.vue` (variantes `select` no mobile e `radiogroup` no desktop), mantendo a lógica em `useProductListControls`.
- Ordenação por nome com `Intl.Collator('pt', { sensitivity: 'base' })` sobre `product.title`.
- Ordenação por avaliação em dois níveis: prioridade `rating.rate` (nota real); em empate, `rating.count` (pessoas que avaliaram).
- Exibição de avaliação: uma estrela preenchida (PrimeVue `StarFillIcon`) + nota numérica (ex.: `★ 4.8`), sem escala de 5 estrelas parciais.
- Continuar ordenando localmente sobre cópia da coleção filtrada, sem novas chamadas à API e sem mutar os dados originais.

**Motivo:**

Alinhar tipagem e UI ao SDD (preço, nome e avaliação), evitar strings soltas e separar apresentação (`ProductSort`) da regra de ordenação (composable). A nota decimal fica explícita ao lado de uma única estrela, evitando ambiguidade visual da escala de 5 estrelas.

**Impacto:**

- RF-004 concluído para preço e nome; ordenação por avaliação também entregue conforme UI/API docs;
- `ProductFilters` passa a compor `ProductSort`;
- padrão de reset de página ao mudar ordenação permanece;
- “Maior avaliação”: maior `rate` primeiro; no empate de nota, mais pessoas que avaliaram.

---

## 35.7 — Footer estrutural no DefaultLayout

**Data:** 2026-08-11

**Decisão:**

- Criar `AppFooter.vue` somente para apresentação do rodapé (sem lógica de negócio).
- Integrar o Footer em `DefaultLayout.vue`, no mesmo padrão do `AppHeader`, para que todas as Views o recebam automaticamente.
- Estrutura do layout: container `.app-shell` (`min-height: 100vh` + fallback `100dvh`), `<main class="flex-1 min-w-0">` com `RouterView`, Footer ao final — evita Footer no meio da tela em páginas com pouco conteúdo.
- Navegação do Footer via `RouterLink` para `/produtos`, `/favoritos` e `/produtos/novo` (sem novas rotas e sem links externos).
- Conteúdo limitado a identidade, descrição, navegação interna e copyright; sem redes sociais, contatos ou dados fictícios.
- Classes de cor alinhadas ao Header (`slate` / `violet`) para futura adaptação a Dark Mode, sem implementar Dark Mode nesta entrega.

**Motivo:**

A especificação de UI prevê Footer na estrutura geral da aplicação. Centralizar no layout evita duplicação nas Views e mantém o rodapé como parte estrutural, coerente com o Header.

**Impacto:**

- Footer disponível em todas as rotas que usam `DefaultLayout`;
- Responsividade e acessibilidade da Fase 9 foram tratadas na camada de apresentação (ver decisões posteriores).

---

## 35.8 — Tema global Light/Dark Mode

**Data:** 2026-08-11

**Decisão:**

- Centralizar o tema em `themeStore` (Pinia), no mesmo padrão de persistência dos favoritos.
- Tipar o modo com `ThemeMode = 'light' | 'dark'` em `src/types/theme.ts`.
- Persistir em `localStorage` com a chave `product-management:theme` (separada dos favoritos).
- Resolução inicial: preferência salva → `prefers-color-scheme` do SO → Light Mode como fallback.
- Não gravar no `localStorage` apenas por detectar o tema do sistema; gravar somente após ação explícita do usuário (`setTheme` / `toggleTheme`).
- Integrar TailwindCSS v4 com `@custom-variant dark (&:where(.dark, .dark *));` e classe `.dark` no `<html>`.
- Configurar PrimeVue (`darkModeSelector: '.dark'`) para respeitar o mesmo seletor global.
- Controle de alternância em `ThemeToggle.vue`, reutilizado pelo `AppFooter`.
- Script inline em `index.html` para aplicar o tema antes do bundle Vue (evitar flash).
- Preservar o Light Mode atual como referência visual; Dark Mode adapta superfícies, textos, bordas e estados sem alterar lógica de negócio.

**Motivo:**

O tema é estado global persistente compartilhado por Header, Footer, layout, páginas e componentes PrimeVue. Uma store Pinia + classe CSS global evita estados locais duplicados e mantém Tailwind e PrimeVue alinhados.

**Impacto:**

- Light Mode permanece visualmente consistente com o layout existente;
- Dark Mode disponível em todas as rotas do `DefaultLayout`;
- A parte de responsividade da Fase 9 foi concluída; acessibilidade completa tratada na decisão 35.9.

---

## 35.9 — Acessibilidade de formulários e UX de mensagens

**Data:** 2026-08-11

**Decisão:**

- Priorizar semântica HTML nativa; ARIA somente quando necessário.
- No `ProductForm`, cada campo possui **uma única região contextual** abaixo do input: texto auxiliar **ou** mensagem de erro (nunca as duas ao mesmo tempo).
- `aria-describedby` aponta sempre para essa região; `aria-invalid` só quando há erro; campos obrigatórios usam `aria-required`.
- Após submit inválido, focar o primeiro campo inválido na ordem visual do formulário.
- Manter foco visível em Light/Dark (`:focus-visible` global + reforço em controles PrimeVue).
- `FavoriteButton` com `aria-pressed` alinhado à store e labels “Adicionar/Remover produto dos favoritos”.
- Evitar elementos interativos aninhados; “Novo Produto” no Header como `RouterLink` na nav; `ThemeToggle` no Footer.

**Motivo:**

Evitar anúncios duplicados (ajuda + erro) em leitores de tela e garantir uso completo por teclado sem alterar o design já validado na parte responsiva.

**Impacto:**

- Fase 9 (responsividade + acessibilidade) concluída;
- QA final (Fase 10) concluído na sequência.

---

## 35.9.1 — Hierarquia visual do estado inválido e contador de Favoritos

**Data:** 2026-08-13

**Decisão:**

- No estado inválido dos campos PrimeVue, o destaque visual fica na **borda** e na **mensagem de erro**; o placeholder permanece neutro (mesmo tom do estado normal) e o texto digitado **não** herda vermelho saturado.
- Implementação: token `formField.invalidPlaceholderColor` alinhado ao placeholder normal no preset Aura (`main.ts`) + reforço em `main.css`.
- Contador de Favoritos no Header: layout em `inline-flex` no contexto do link (`ícone + texto + badge`), associado ao final de “Favoritos”; **não** usar o ícone de coração como referência de `position: absolute`.

**Motivo:**

Reduzir excesso de vermelho dentro do campo (hierarquia mensagem > borda > placeholder) e corrigir estruturalmente o badge que dependia de offset absoluto relativo ao ícone (`-right-20`), frágil a tipografia e viewport.

**Impacto:**

- Feedback de validação mais legível sem perder ARIA existente;
- Contador estável em mobile/tablet/desktop, dentro da área clicável;
- Testes do Header passam a validar associação estrutural (texto ↔ contador), não classes `right-*`.

---

## 35.9.2 — Foco inicial em telas com input principal

**Data:** 2026-08-13

**Decisão:**

- Telas com campo principal de digitação recebem foco automático após a montagem (`ProductForm` → título; catálogo → busca visível).
- Implementação via composable `useInitialFocus` (`onMounted` + `nextTick`), sem depender só do atributo HTML `autofocus`.
- Não roubar foco já escolhido pelo usuário; não focar elementos ocultos (busca mobile vs desktop).
- Em componentes reutilizáveis (`ProductSearch`), o autofocus é opt-in por prop.

**Motivo:**

Permitir digitação imediata ao entrar na tela, mantendo teclado/leitores de tela e o indicador de foco já existente.

**Impacto:**

- Melhora UX de criação/edição e busca;
- Sem mudança de regras de negócio, API ou rotas.

---

## 35.10 — Configuração do Vitest na Fase 10

**Data:** 2026-08-11

**Decisão anterior:**

Vitest e Vue Test Utils estavam previstos, porém ainda não instalados/configurados (decisão 35.2).

**Nova decisão:**

- Instalar e configurar Vitest + Vue Test Utils + jsdom na Fase 10.
- Integrar a configuração de testes em `vite.config.ts` (`environment: 'jsdom'`, `pool: 'threads'`).
- Scripts: `npm test` e `npm run test:watch`.
- Priorizar testes de comportamento crítico: store de favoritos, schema Yup, filtros/ordenação/paginação, debounce, utilitários e `productService`.
- Manter os testes automatizados em `tests/`, separados do código de produção em `src/`, organizados por responsabilidade (`composables/`, `services/`, `stores/`, `utils/`; `components/` quando houver testes de componentes).
- O Vitest inclui `tests/**/*.{test,spec}.{ts,tsx}` e os imports de produção usam o alias `@/`.

**Motivo:**

A Fase 10 é o momento definido no plano para infraestrutura de testes automatizados, com código de negócio suficiente para cobertura útil. Separar `tests/` de `src/` evita misturar código de produção com arquivos de teste.

**Impacto:**

- infraestrutura de testes pronta para evolução da suíte (stores, utils, services, composables e componentes);
- validação contínua das regras críticas sem substituir os testes manuais do QA.

---

## 35.14 — Suíte de testes de componentes

**Data:** 2026-08-12

**Decisão anterior:**

A decisão 35.10 previa testes de componentes em `tests/components/` quando houvesse cobertura útil, mantendo a suíte inicial focada em stores/utils/composables/services.

**Nova decisão:**

- Implementar suíte de testes de componentes exclusivamente em `tests/components/` (sem `*.test.ts` em `src/`).
- Usar Vitest + Vue Test Utils + jsdom, com helper compartilhado (`tests/helpers/mountComponent.ts`) que monta Pinia, vue-i18n, Vue Router e PrimeVue de forma alinhada à aplicação.
- Priorizar comportamento observável e contratos de acessibilidade já presentes no código (`aria-*`, `role`, labels, emits), sem asserts de CSS/Tailwind pixel a pixel.
- Cobrir componentes reutilizáveis e de maior relevância: navegação (AppHeader/AppFooter), catálogo (ProductCard/Grid/Filters/Search/Sort/Pagination), detalhes, formulário, favoritos e estados (Empty/Error/Loading/ErrorBoundary), além de ThemeToggle e LocaleSelector.
- Não alterar regras de negócio apenas para facilitar testes; asserts de posicionamento CSS frágil (ex.: valores `right-*`) devem ser evitados — preferir estrutura e comportamento observáveis.

**Motivo:**

Complementar os testes unitários existentes com uma estratégia real de frontend, elevando confiança em interações, acessibilidade e integração com plugins sem acoplar a suíte a detalhes visuais frágeis.

**Impacto:**

- **164 testes** automatizados passando na suíte completa;
- organização documentada em `tests/components/` + helpers;
- README, plano de implementação e DoD atualizados com a cobertura de componentes.

---

## 35.11 — Internacionalização (melhoria bônus)

**Data:** 2026-08-11

**Decisão anterior:**

A interface estava escrita em português de forma hardcoded, sem seletor de idioma. Categorias da FakeStoreAPI eram exibidas com os valores originais em inglês.

**Nova decisão (melhoria bônus):**

- Adotar `vue-i18n` (Composition API, `legacy: false`) para internacionalização.
- Idiomas suportados: `pt-BR` (padrão), `es` e `en`.
- Persistência em `localStorage` com chave `product-management:locale`.
- Preferência inválida ou ausente → fallback para `pt-BR`.
- Seletor de idioma no Footer, próximo ao `ThemeToggle` (sem mover o tema para o Header).
- Categorias conhecidas da FakeStoreAPI traduzidas apenas na apresentação via `getLocalizedCategory`.
- Valores originais da API preservados para filtros, payloads, comparação e regras de negócio.
- Fallback de categoria desconhecida: exibir o valor original.
- Títulos e descrições dos produtos permanecem como conteúdo externo da FakeStoreAPI (sem tradução automática externa e sem catálogo fictício).
- Ordenação por nome (na primeira versão do bônus) usava o título original da API.

**Motivo:**

Melhorar a UX multilíngue sem alterar contratos da FakeStoreAPI nem invalidar as Fases 1–10.

**Impacto:**

- estrutura `src/i18n/` e `localeStore`;
- textos de interface migrados para chaves i18n;
- testes em `tests/i18n/`, `tests/utils/localizeCategory.test.ts` e `tests/stores/localeStore.test.ts`;
- documentação de UI e plano atualizada.

---

## 35.12 — Localização dinâmica de produtos (melhoria bônus)

**Data:** 2026-08-11

**Decisão anterior:**

Títulos e descrições da FakeStoreAPI eram exibidos no idioma original da API. Apenas categorias e UI usavam i18n.

**Nova decisão (melhoria bônus):**

- Separar claramente: `vue-i18n` = interface estática; `ProductLocalizationService` = conteúdo dinâmico (`title`/`description`).
- Tipo `LocalizedProduct` preserva `original: Product` e expõe campos de apresentação.
- Tradução dinâmica via abstração `ProductTextTranslator` (implementação padrão MyMemory, **sem API key no frontend**).
- `en` = pass-through do conteúdo original (idioma da FakeStoreAPI).
- Cache em memória + `localStorage` (`product-management:localization-cache`).
- Chave: `product:{id}:{locale}:{contentHash}` — invalida quando title/description da API mudam.
- Deduplicação in-flight por chave+campos.
- Catálogo localiza `title` de forma lazy; detalhes localizam `title` + `description`.
- Loading da UI sincronizado: skeleton permanece até API + localização estarem prontos (sem flicker inglês → traduzido).
- Cache HIT atualiza de forma síncrona; cache MISS aguarda o lote completo.
- Fallback: conteúdo original da API (nunca `undefined`/`null`, nunca loading infinito).
- Busca: título/descrição **original e localizado**.
- Ordenação por nome: título **apresentado** (localizado), com `Intl.Collator` do idioma atual.
- Preço/rating/favoritos/payloads de criação-edição permanecem nos valores originais.
- Produtos novos da API passam pelo mesmo pipeline sem cadastro manual por ID.

**Motivo:**

Permitir apresentação multilíngue de conteúdo dinâmico sem mocks, sem lista fixa de IDs e sem expor secrets.

**Impacto:**

- `src/services/localization/*`, `useLocalizedProducts`, tipos em `productLocalization.ts`;
- catálogo/detalhes/favoritos consomem `LocalizedProduct`;
- testes em `tests/services/productLocalizationService.test.ts`;
- **posteriormente removida** pela decisão 35.13.

**Limitações:**

- MyMemory é free-tier e pode rate-limitar; o fallback preserva a UI.
- Substituição futura por proxy/backend não exige mudança nos componentes.

---

## 35.13 — Conteúdo dinâmico de produtos permanece no idioma original

**Data:** 2026-08-11

**Decisão anterior:**

A melhoria bônus 35.12 traduzia dinamicamente `title` e `description` via `ProductLocalizationService` (cache, loading sincronizado e fallback).

**Nova decisão:**

- **Não** traduzir automaticamente `title` nem `description` vindos da FakeStoreAPI.
- Exibir esses campos exatamente como retornados pela API.
- Manter `vue-i18n` para conteúdo controlado pela aplicação (interface, labels, mensagens, estados).
- Manter localização apenas de **categorias** conhecidas via `getLocalizedCategory`.
- Remover a camada de Product Localization (serviços, cache, composable, tipo `LocalizedProduct`, loading de tradução).
- Busca e ordenação por nome usam `product.title` original.
- Loading da UI representa apenas operações reais (API, formulários etc.), sem ciclo de tradução.

**Motivo:**

Produtos são conteúdo externo dinâmico. Nomes podem conter marcas, modelos, nomes próprios e termos técnicos. Tradução automática gera resultados inconsistentes ou artificiais (ex.: *"Opna Women's Short Sleeve Moisture"* → *"Umidade de Manga Curta Feminina Opna"*), prejudicando a experiência. Preservar o original é mais confiável.

**Impacto:**

- Fluxo: FakeStoreAPI → `productService` → catálogo/detalhes → UI com `product.title` / `product.description`.
- i18n continua para interface e categorias.

---

## 35.16 — Formatação monetária conforme o locale

**Data:** 2026-08-13

**Decisão anterior:**

`formatPrice` usava `Intl.NumberFormat` fixo em `pt-BR` / `BRL`. O `ProductForm` usava `InputNumber` em `mode="currency"`, com o símbolo de moeda dentro do `value` do input.

**Nova decisão:**

- Centralizar apresentação de preço em `src/utils/formatPrice.ts` (`Intl.NumberFormat`).
- Mapear locale da aplicação → moeda: `pt-BR`/`BRL`, `en`/`USD`, `es`/`EUR` (`useGrouping: true`).
- Catálogo, favoritos, detalhes e prévia do formulário usam a mesma `formatPrice`.
- O valor do produto permanece `number`; POST/PUT enviam número.
- No `ProductForm`, não usar `InputNumber` em modo currency: o símbolo (`R$`, `$`, `€`) fica em `InputGroupAddon`; o campo editável é `InputText` com texto decimal do locale (`formatPriceInput` / `parsePriceInput`).
- Ao focar o preço, selecionar o valor numérico para substituição imediata; ao blur, reformatar. Troca de locale atualiza só a apresentação.

**Motivo:**

`mode="currency"` do PrimeVue coloca o símbolo no texto do input e, com `maxFractionDigits: 2`, o caret no fim das casas decimais impede digitação. ES (`7,95 €`) piora o problema. Separar símbolo da edição e reutilizar um único formatter alinha i18n sem alterar API nem o modelo `Product`.

**Impacto:**

- `ProductForm`, `ProductCard`, `ProductDetails` e testes de `formatPrice` / formulário / card / detalhes;
- documentação de UI, modelos, arquitetura e README.

---

## 35.14 — Tratamento global de erros (`AppError` + ErrorBoundary)

**Data:** 2026-08-13

**Decisão:**

- Expandir `AppError` com `kind`, `retryable` e `fieldErrors` opcional.
- Centralizar normalização em `toAppError` (interceptor Axios em `config/api.ts`), com timeout de 15s.
- Resolver mensagens via `resolveErrorCopy` + chaves i18n `errors.*` (pt-BR, es, en).
- Logging seguro em `logError.ts` (dev mostra mensagem técnica; produção não expõe stack/payload).
- Evoluir `ErrorState` com ação secundária e `showAction`.
- Envolver `RouterView` com `ErrorBoundary`; registrar `app.config.errorHandler` e `unhandledrejection`.
- Catálogo/detalhes/favoritos expõem `error: AppError | null`; 404 de produto permanece `notFound` + `EmptyState`.
- Formulários usam `submitError` inline (sem apagar campos); favoritos falhos revertem estado e usam Toast.
- Retry manual apenas em leituras GET; escritas nunca são repetidas automaticamente.

**Motivo:**

Garantir classificação consistente, Empty ≠ Error, recuperação segura e acessível, sem duplicar mensagens em service/composable/view e sem expor detalhes técnicos ao usuário.

**Impacto:**

- Documentação de arquitetura (§21) e modelos alinhados ao código;
- Novos testes em `tests/config`, `tests/utils`, composables e `ErrorBoundary`.

---

## 35.15 — Fallback SPA na Vercel (History Mode)

**Data:** 2026-08-13

**Problema:**

Em produção (`product-manager-eta-seven.vercel.app`), navegação interna via Vue Router funcionava, mas F5 / acesso direto / nova aba em rotas como `/produtos`, `/favoritos`, `/produtos/novo` e `/produtos/:id` retornavam `404 NOT_FOUND`.

**Causa:**

- Vue Router em `createWebHistory` (client-side routing).
- Build Vite na raiz (`base` padrão `/`, `outDir` `dist`).
- Ausência de `vercel.json` com rewrite/fallback para SPA.
- Na navegação interna, o browser não pede a rota ao servidor; no F5/acesso direto, o browser faz `GET /produtos` e a Vercel procura um arquivo físico inexistente → 404, antes do Vue Router rodar.

**Decisão:**

- Manter History Mode (não migrar para Hash Mode).
- Adicionar `vercel.json` com rewrite catch-all para `/index.html`.
- Na Vercel, arquivos estáticos existentes em `dist/` têm precedência sobre rewrites; assets, favicon e imagens de `public/` continuam sendo servidos normalmente.
- Não alterar `base` do Vite (app publicada na raiz do domínio).
- API permanece externa (`fakestoreapi.com`); nenhum rewrite `/api` no projeto.

**Motivo da escolha (vs Hash Mode):**

- URLs limpas e profissionais (`/produtos` em vez de `/#/produtos`).
- Comportamento padrão de SPA moderna; Vercel documenta fallback via `rewrites`.
- Hash Mode só mascara a falta de configuração do host.

**Impacto no deploy:**

- Qualquer rota sem arquivo físico correspondente passa a servir `index.html`.
- Arquivos reais em `dist/` (favicon, imagens em `public/`, assets hashed) continuam sendo servidos normalmente pela filesystem da Vercel.
- Após o próximo deploy, F5 e deep links devem retornar 200 com o shell da SPA; o Vue Router resolve a view.

**Sinais de alerta (outros hosts):**

SPA ok na navegação interna + 404 no F5/deep link + History Mode + host sem fallback → mesmo problema. Equivalentes típicos: Netlify `_redirects`, Nginx `try_files`, Apache `FallbackResource`/`mod_rewrite`, Cloudflare Pages `_redirects`, S3/CloudFront error document, Firebase `rewrites`.

---

## 35.17 — Pasta `src/schemas/` para contratos Yup

**Data:** 2026-08-13

**Decisão anterior:**

O schema Yup de produto ficava em `src/utils/productFormSchema.ts`, junto de helpers puros (`formatPrice`, `parseProductId`, etc.).

**Nova decisão:**

Schemas de validação Yup passam a viver em `src/schemas/`. O schema de produto foi movido para `src/schemas/productFormSchema.ts`; os testes correspondentes ficam em `tests/schemas/`.

**Motivo:**

`utils/` é para funções auxiliares puras. Schemas Yup são contratos de validação (análogos a `types/` para TypeScript e `services/` para a API), não utilitários genéricos. Isolá-los deixa a responsabilidade explícita na estrutura de pastas.

**Impacto:**

- `ProductForm` importa de `@/schemas/productFormSchema`;
- documentação de arquitetura, decisões técnicas e plano de implementação.

---

## 35.18 — Estado local do catálogo para CREATE/UPDATE (FakeStoreAPI)

**Data:** 2026-08-13

**Decisão anterior:**

Após POST/PUT bem-sucedido, a aplicação navegava para `/produtos` e `useProductsCatalog` refazia `GET /products` a cada montagem. A resposta da escrita era descartada. A FakeStoreAPI simula CREATE/UPDATE sem persistir as alterações nos GETs posteriores, então o catálogo voltava aos dados originais.

**Nova decisão:**

- `useProductsCatalog` passa a ser a **fonte única de verdade do catálogo na sessão** (estado compartilhado no módulo do composable; sem novo store Pinia).
- `GET /products` permanece a fonte **inicial** do catálogo. Não há lista mockada nem dados hardcoded no lugar da API.
- `createProduct` / `updateProduct` no service apenas comunicam com a API e devolvem `Product` tipado (normalização via `toProduct` quando a escrita omite `rating`).
- Após POST bem-sucedido, a view chama `addCreatedProduct` com o produto retornado **antes** de navegar.
- Após PUT bem-sucedido, a view chama `replaceProduct` com o produto retornado (preservando `rating` já conhecido, pois o formulário não edita avaliação).
- Um GET posterior que não contenha a criação/alteração **não** descarta as mutações da sessão: o recarregamento mescla o remoto com o overlay local.
- Detalhes (`useProductDetails`) e favoritos (`useFavoriteProducts`) consomem esse catálogo. Favoritos continuam persistindo **somente IDs**.
- Produto criado existe na sessão com o ID retornado pela API. `GET /products/:id` desse ID pode falhar; a aplicação não finge persistência no backend. Recarregar a página descarta mutações locais.
- `DELETE /products/:id` **não** é implementado (fora do escopo do desafio).

**Motivo:**

A UX de CREATE/UPDATE precisa ser funcional. Tratar a FakeStoreAPI como banco real e refazer GET após escrita mascara o comportamento da API de demonstração e perde as alterações do usuário.

**Impacto:**

- Catálogo, detalhes e favoritos refletem CREATE/UPDATE imediatamente na sessão;
- testes cobrem o cenário “POST/PUT sucesso + GET posterior sem a alteração”;
- documentação de arquitetura, contrato da API e modelos alinhados.

---

# 35.19 — Avaliação local do usuário (sem endpoint na FakeStoreAPI)

## Decisão

A FakeStoreAPI **não** possui endpoint para avaliações feitas pelo usuário. A avaliação de 1 a 5 estrelas é uma extensão **local** da aplicação:

- persistência em `localStorage` com a chave `product-management:product-ratings` (`RATINGS_STORAGE_KEY`);
- mapa `productId → rating` (somente o ID e a quantidade de estrelas; nunca o produto completo);
- estado reativo em `ratingsStore` (Pinia); cálculo reutilizável em `resolveDisplayedRating`; apresentação via `useDisplayedRating`;
- CREATE/UPDATE da avaliação **não** utiliza a API (`productService` permanece inalterado; não existe `POST /products/:id/reviews`);
- o `rating.rate` / `rating.count` originais da FakeStoreAPI **não** são sobrescritos no objeto `Product`;
- a média e a quantidade **exibidas** combinam o rating da API com a avaliação local:
  - primeira avaliação: `count + 1` e média ponderada;
  - alteração: substitui a estrela anterior **sem** incrementar `count` de novo;
- funciona para produtos da API e para produtos criados na sessão (a chave é o ID);
- F5 recupera a avaliação do `localStorage`.

**Motivo:** o contrato da API de demonstração não persiste reviews do usuário. Misturar isso com favoritos, locale, tema ou com o overlay de CREATE/UPDATE do catálogo geraria acoplamento e perda do rating original.

**Impacto:**

- catálogo (`ProductCard`) e detalhes (`ProductDetails`) compartilham a mesma camada de resolução;
- Toast de sucesso/erro segue o padrão existente;
- o modal (`ProductRatingDialog`) usa Dialog do PrimeVue: somente estrelas, sempre em uma linha; em 320–450px há respiro lateral; as ações do detalhe (Favoritar / Avaliar / Editar) ficam na mesma linha e quebram com largura total quando necessário;
- DELETE de avaliação fica fora do escopo.

---

## 35.20 — Limites de validação do formulário de produto

**Data:** 2026-08-13

**Decisão anterior:**

O `productFormSchema` exigia campos obrigatórios, trim, preço > 0 e URL válida, sem máximos de caracteres/dígitos. O mockup sugeria 10–1000 na descrição; isso não havia sido adotado porque o SDD pedia apenas obrigatoriedade.

**Nova decisão:**

Limites de domínio centralizados em `src/schemas/productFormLimits.ts` e aplicados pelo Yup (fonte da regra) e pela UX de entrada:

| Campo | Obrigatório | Máximo | Observação |
|---|---|---|---|
| Título | sim | 150 caracteres | trim; `"   "` inválido; espaços internos preservados |
| Descrição | sim | 1000 caracteres | trim; sem mínimo extra além de não vazio |
| Preço | sim | 999.999,99 | `number`; > 0; 2 casas decimais; limite no valor, não na máscara |
| Categoria | sim | 50 caracteres | valor selecionado ou criado pelo usuário; trim; sem categorias fictícias |
| Imagem | sim | — | URL válida; sem upload |

Diferença entre camadas:

- **Restrição de entrada:** `maxlength` no título/descrição; `isAllowedPriceInput` impede dígitos/decimais/sinal extras no preço. Não trunca silenciosamente um valor já carregado na edição.
- **Validação Yup:** continua validando o payload final, inclusive se o formulário for manipulado externamente.

Não há mínimo de 10 caracteres na descrição: o SDD exige obrigatoriedade, não comprimento mínimo. O máximo de 1000 alinha o mockup ao catálogo real da FakeStoreAPI (descrição mais longa ≈ 772). O título 150 cobre o maior título da API (97) com folga. O preço máximo cobre 999.99 da API sem restringir um catálogo de varejo a valores baixos.

**Motivo:**

Evitar payloads excessivos ou inválidos antes de POST/PUT, com UX previsível e a mesma regra em criação e edição, sem depender da FakeStoreAPI para descobrir erros locais.

**Impacto:**

- `productFormSchema`, `ProductForm`, mensagens i18n (pt-BR, en, es);
- testes em `tests/schemas/` e no formulário;
- documentação de requisitos, UI, modelos e arquitetura.

---

## 35.21 — Categorias customizadas na sessão (localStorage)

**Data:** 2026-08-13

**Decisão anterior:**

As categorias vinham exclusivamente de `GET /products/categories`. O formulário só permitia selecionar valores da API. A FakeStoreAPI não persiste categorias novas.

**Nova decisão:**

- O usuário pode criar uma categoria **dentro** do fluxo de cadastro/edição (`ProductForm`), sem sair da tela.
- Categorias oficiais da API (`API categories`) permanecem intactas e continuam vindo de `productService.getCategories()`.
- Categorias criadas pelo usuário (`custom categories`) ficam em `useCustomCategories`, persistidas em `localStorage` (`product-management:custom-categories` / `CUSTOM_CATEGORIES_STORAGE_KEY`).
- O catálogo (`useProductsCatalog.categories`) expõe a **união** das duas fontes, sem duplicar. Filtro, contadores, busca, ordenação, paginação, card, detalhes e edição usam o mesmo valor persistido da categoria.
- Validação da nova categoria: obrigatória, trim, rejeita vazio/somente espaços, máximo 50 caracteres, duplicata por caixa/espaços e por rótulo localizado das categorias da API (`Eletrônicos` ≡ `electronics`). O nome informado pelo usuário é dado, não chave i18n.
- Não há criação automática de categorias fictícias. Não há endpoint de categorias na FakeStoreAPI; a persistência é só local/sessão (F5 recupera custom categories; o overlay de produtos CREATE/UPDATE continua só na sessão, decisão 35.18).
- Cancelar na edição permanece a decisão 35.4 atualizada: retorno determinístico para `/produtos/:id`.

**Motivo:**

Permitir cadastro realista sem tratar a FakeStoreAPI como banco. Separar API × local evita misturar fontes e duplicar estado.

**Impacto:**

- `useCustomCategories`, `customCategory.ts`, `CreateCategoryDialog`, `ProductForm`, catálogo/filtros;
- i18n pt-BR/en/es; testes de validação, formulário, catálogo, detalhes e persistência.

---

## 35.22 — Zoom interativo da imagem nos detalhes

**Data:** 2026-08-13

**Decisão:**

- Implementar zoom **in-place** na imagem principal de `/produtos/:id`, sem página extra e **sem dependência externa**.
- Estratégia: posição relativa do ponteiro via `getBoundingClientRect()`, clamp entre 0% e 100%, CSS variables (`--zoom-x` / `--zoom-y`) + `transform-origin` + `scale`, com `overflow: hidden` no frame da imagem.
- Desktop (ponteiro `mouse`): `pointerenter` ativa; `pointermove` atualiza a origem (com `requestAnimationFrame`); `pointerleave` / `pointercancel` restauram o estado normal.
- Touch / ponteiro grosso: a imagem permanece no comportamento normal. Não há zoom por hover nem gesto complexo de pinça na aplicação (evita conflito com scroll, swipe e navegação).
- O zoom **não** altera o tamanho estrutural do card/detalhe, não desloca o layout e não esconde título, preço, descrição ou ações.
- Acessibilidade: `alt` do produto permanece na imagem; o zoom é enhancement visual — nenhuma informação essencial depende de hover; teclado e foco não são interceptados.
- Camadas: `ProductImageZoom` (apresentação), `useImageZoom` (ponteiro + rAF + limpeza no dispose), `getRelativePointerPercent` (cálculo puro).

**Motivo:**

Reproduzir a experiência conceitual de marketplaces (região sob o cursor ↔ área ampliada) com CSS/eventos nativos, sem layout shift e sem biblioteca de zoom.

**Impacto:**

- `ProductDetails` passa a compor `ProductImageZoom`;
- testes em `tests/utils/imageZoom.test.ts`, `tests/composables/useImageZoom.test.ts` e `tests/components/products/ProductImageZoom.test.ts`;
- especificação de UI, arquitetura e README.

---

## 35.23 — Hardening de segurança (XSS, URLs, payload, headers)

**Data:** 2026-08-13

**Decisão:**

- Tratar a FakeStoreAPI como fonte externa. Validar GET/POST/PUT em `normalizeProduct` (`toProduct`, `toProductList`, `toCategoryList`) antes do estado da UI.
- Centralizar URLs externas em `httpUrl.ts`: somente `http:` e `https:`; rejeitar `javascript:`, `data:`, `vbscript:` e equivalentes.
- Não instalar sanitizador HTML: não há `v-html` nem renderização de HTML dinâmico. Escaping nativo do Vue para texto.
- Security Headers na Vercel (`vercel.json`): CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'` + `X-Frame-Options: DENY`.
- CSP sem `unsafe-eval` e sem `script-src *`. Exceção documentada: `style-src 'unsafe-inline'` (PrimeVue + CSSOM). Boot de tema em `public/theme-init.js` para evitar script inline.
- `localStorage` continua só com preferências/IDs; leitura sempre validada.
- Testes em `tests/security/` e especificação em `docs/test/`.
- O frontend reduz a superfície da interface; não é fronteira de confiança para o servidor. Sem auth/criptografia/rate-limit fictícios.

**Motivo:**

Reduzir XSS via imagem/URL e quebra de UI por JSON inesperado, alinhado ao tamanho do projeto e ao deploy real.

**Impacto:**

- `productService` deixa de devolver JSON cru de GET;
- imagem inválida não recebe `:src`;
- documentação de segurança em `docs/test/`.

---

# 36. Critérios de Aceite

As decisões técnicas serão consideradas definidas quando:

- [x] Framework definido.
- [x] Linguagem definida.
- [x] Ferramenta de build definida.
- [x] Roteamento definido.
- [x] Gerenciamento de estado definido.
- [x] Cliente HTTP definido.
- [x] Estratégia de services definida.
- [x] Estratégia de composables definida.
- [x] Estratégia de persistência definida.
- [x] Estratégia de validação definida.
- [x] Estratégia de testes definida.
- [x] Lint definido.
- [x] Formatação definida.
- [x] Estratégia de uso de IA documentada.
- [x] Critérios para novas dependências definidos.
- [x] Decisões pendentes resolvidas antes da implementação correspondente.

---

# 37. Status do Documento

**Status:** Concluído (Fase 11 — auditoria documental)

**Versão:** 1.35

**Última atualização:** 2026-08-13

### Nota — zoom da imagem nos detalhes

A decisão 35.22 define zoom in-place na imagem de `/produtos/:id` (CSS `transform-origin` + escala, apenas ponteiro mouse). Touch permanece no estado normal. Sem dependência externa.

### Nota — conteúdo dinâmico de produtos

Conteúdo dinâmico de produtos não é traduzido automaticamente. i18n cobre interface e localização de categorias. A decisão 35.12 foi substituída pela 35.13.

### Nota — tratamento global de erros

Erros HTTP/runtime passam por AppError + i18n errors.*, com ErrorState/Toast/submitError conforme o contexto. Empty ≠ Error. Retry seguro apenas em leituras.

### Nota — testes automatizados

Suíte em `tests/` (components, composables, services, stores, schemas, utils, config, i18n, views, security): **343 testes** passando.

### Nota — limites do formulário de produto

A decisão 35.20 define máximos de título (150), descrição (1000), preço (999.999,99 / 2 casas) e categoria (50). Yup é a fonte da regra; `maxlength` e a restrição do input de preço são UX.

### Nota — categorias customizadas

A decisão 35.21 define categorias criadas pelo usuário em `localStorage` (`product-management:custom-categories`), unidas às categorias da FakeStoreAPI no catálogo. O valor persistido é dado; i18n localiza só categorias conhecidas da API.

### Nota — formatação monetária por locale

Preço permanece `number` no modelo e na API. A apresentação usa `formatPrice` conforme o locale (`pt-BR`/`BRL`, `en`/`USD`, `es`/`EUR`). No formulário, o símbolo fica fora do input editável.

### Nota — deploy SPA na Vercel

History Mode + `vercel.json` rewrite para `index.html`. Deep links e F5 em rotas internas retornam 200 com o shell da SPA.

### Nota — estado do catálogo (CREATE/UPDATE)

A decisão 35.18 define o catálogo da sessão: GET inicial da FakeStoreAPI + overlay das respostas de POST/PUT. Sem DELETE. Sem mock de catálogo.

### Nota — avaliação local do usuário

A decisão 35.19 define avaliações de 1 a 5 estrelas persistidas em `localStorage` (`product-management:product-ratings`), vinculadas ao ID, sem alterar o contrato da FakeStoreAPI nem o `rating` original do produto. O modal de avaliação mantém as estrelas em uma linha e respiro lateral em viewports estreitas (320–450px).