# Arquitetura do Projeto — Product Management

## 1. Objetivo

Este documento define a arquitetura da aplicação Product Management.

A arquitetura tem como objetivo organizar o projeto de forma que:

- cada parte da aplicação possua uma responsabilidade clara;
- regras de negócio não fiquem acopladas à interface;
- a comunicação com a API seja isolada;
- componentes possam ser reutilizados;
- o gerenciamento de estado seja utilizado somente quando necessário;
- o código seja fácil de testar e manter;
- novas funcionalidades possam ser adicionadas sem exigir alterações generalizadas na aplicação.

A arquitetura será baseada em Vue 3, Composition API, TypeScript e uma organização por responsabilidades.

---

# 2. Princípios Arquiteturais

## 2.1 — Separação de responsabilidades

Cada camada deverá possuir uma responsabilidade específica.

A interface não deverá ser responsável diretamente por:

- realizar requisições HTTP;
- manipular diretamente respostas da API;
- controlar persistência de favoritos;
- concentrar regras de validação complexas;
- conter regras de negócio que possam ser reutilizadas.

---

## 2.2 — Componentização

A interface será dividida em componentes pequenos e reutilizáveis.

Um componente deverá possuir uma responsabilidade clara.

Componentes muito grandes deverão ser avaliados para possível divisão.

---

## 2.3 — Reutilização

Lógicas utilizadas em mais de uma tela deverão ser candidatas à extração para composables, services ou outras abstrações apropriadas.

A reutilização não deverá ser aplicada de maneira excessiva apenas para reduzir linhas de código.

O objetivo é reduzir duplicação mantendo a compreensão do código.

---

## 2.4 — Tipagem

O TypeScript será utilizado para representar:

- produtos;
- categorias;
- avaliações;
- payloads da API;
- estados;
- propriedades dos componentes;
- eventos;
- respostas de serviços.

O uso de `any` deverá ser evitado.

---

## 2.5 — Baixo acoplamento

As camadas da aplicação deverão depender o mínimo possível umas das outras.

Por exemplo, um componente visual não deverá conhecer detalhes de implementação do cliente HTTP utilizado pela aplicação.

---

## 2.6 — Fonte única de responsabilidade

Cada tipo de informação deverá possuir um local principal responsável por sua manipulação.

Exemplos:

- cliente HTTP → config;
- API → services;
- estado global → stores;
- lógica reutilizável → composables;
- apresentação → components;
- páginas → views;
- validação → schemas;
- tipos → types.

---

# 3. Estrutura Geral

A estrutura planejada para o projeto será:

    product-management/
    ├── .cursorignore
    ├── .gitignore
    ├── .vscode/
    │   └── settings.json
    ├── docs/
    │   ├── 01-requisitos.md
    │   ├── 02-arquitetura.md
    │   ├── 03-decisoes-tecnicas.md
    │   ├── 04-contrato-api.md
    │   ├── 05-modelos-de-dados.md
    │   ├── 06-especificacao-ui.md
    │   ├── 07-plano-de-implementacao.md
    │   └── 08-definicao-de-pronto.md
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── composables/
    │   ├── config/
    │   ├── i18n/
    │   ├── layouts/
    │   ├── router/
    │   ├── schemas/
    │   ├── services/
    │   ├── stores/
    │   ├── types/
    │   ├── utils/
    │   ├── views/
    │   ├── App.vue
    │   └── main.ts
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts

A estrutura poderá ser ajustada durante a implementação caso surja uma necessidade real.

Alterações estruturais relevantes deverão ser registradas em `03-decisoes-tecnicas.md`.

---

# 4. Camadas da Aplicação

A aplicação será organizada principalmente nas seguintes camadas:

    Views
      ↓
    Components
      ↓
    Composables
      ↓
    Stores / Services
      ↓
    API

Essa representação é conceitual.

Nem toda operação precisará passar obrigatoriamente por todas as camadas.

A regra principal será utilizar a menor quantidade de abstrações necessária para manter o código organizado.

---

# 5. Views

A pasta `views/` será responsável pelas páginas associadas às rotas da aplicação.

As views representarão páginas completas e serão responsáveis por:

- organizar os componentes da página;
- coordenar o fluxo da página;
- obter os dados necessários;
- reagir aos estados da aplicação;
- encaminhar ações do usuário para as camadas apropriadas.

As views não deverão concentrar implementações extensas de comunicação HTTP ou regras de negócio.

### Estrutura prevista

    src/views/
    ├── ProdutosView.vue
    ├── ProdutoDetalhesView.vue
    ├── FavoritosView.vue
    ├── ProdutoCriarView.vue
    └── ProdutoEditarView.vue

Os nomes poderão ser ajustados conforme a convenção adotada no projeto.

---

# 6. Components

A pasta `components/` será responsável pelos componentes reutilizáveis da interface.

### Estrutura prevista

    src/components/
    ├── AppHeader.vue
    ├── AppFooter.vue
    ├── FavoriteButton.vue
    ├── LoadingState.vue
    ├── ErrorState.vue
    ├── EmptyState.vue
    └── products/
        ├── ProductCard.vue
        ├── ProductGrid.vue
        ├── ProductFilters.vue
        ├── ProductSearch.vue
        ├── ProductSort.vue
        ├── ProductPagination.vue
        ├── ProductDetails.vue
        └── ProductForm.vue

A ordenação da listagem (preço, nome e avaliação) é apresentada por `ProductSort`, integrado em `ProductFilters`.

A lógica de ordenação permanece em `useProductListControls`, sobre a coleção carregada via `GET /products`.

A estrutura poderá ser organizada em subpastas caso o número de componentes aumente significativamente.

---

## 6.1 — ProductCard

Responsável pela apresentação resumida de um produto.

Deverá receber os dados necessários através de props.

Não deverá realizar diretamente chamadas à API.

Responsabilidades:

- apresentar imagem;
- apresentar título;
- apresentar preço;
- apresentar categoria;
- disponibilizar acesso aos detalhes;
- apresentar estado de favorito.

---

## 6.2 — FavoriteButton

Responsável pela interação visual de favoritar e desfavoritar um produto.

O componente deverá receber as informações necessárias através de props e emitir eventos ou utilizar uma abstração apropriada para comunicar a ação.

A regra de persistência dos favoritos não deverá ficar acoplada à apresentação visual do botão.

---

## 6.3 — ProductForm

Responsável pela apresentação do formulário de criação e edição.

Deverá:

- apresentar campos;
- apresentar mensagens de validação;
- controlar estados visuais do formulário;
- emitir ou encaminhar os dados válidos.

As regras de negócio e comunicação com a API deverão permanecer fora do componente quando não forem específicas da apresentação.

---

## 6.4 — Estados de interface

Componentes reutilizáveis deverão ser criados para estados comuns quando isso melhorar a consistência.

Exemplos:

- `LoadingState`;
- `ErrorState`;
- `EmptyState`.

Esses componentes deverão possuir apresentação genérica e receber as informações necessárias através de props.

---

# 7. Composables

A pasta `composables/` será responsável por lógica reutilizável relacionada ao comportamento da interface e ao estado local.

Exemplos possíveis:

    src/composables/
    ├── useProductsCatalog.ts
    ├── useProductListControls.ts
    ├── useDebouncedRef.ts
    ├── useInitialFocus.ts
    ├── useProductDetails.ts
    └── useFavoriteProducts.ts

Nem todos esses composables precisarão necessariamente existir.

Eles deverão ser criados quando houver uma necessidade real de reutilização ou isolamento de lógica.

---

## 7.1 — useProductsCatalog

Fonte única de verdade do catálogo **na sessão da aplicação**.

Responsabilidades:

- carregar produtos e categorias via `GET /products` e `GET /products/categories` (fonte inicial);
- manter o estado compartilhado entre catálogo, detalhes, edição, criação e favoritos;
- incorporar o produto retornado por `POST /products` (`addCreatedProduct`);
- substituir o produto retornado por `PUT /products/:id` (`replaceProduct`);
- recarregar o catálogo mesclando o GET remoto com as mutações locais da sessão;
- controlar estado de carregamento e erro.

O GET continua sendo a fonte inicial. Após CREATE/UPDATE, a aplicação **não** depende de um GET posterior para refletir a operação, porque a FakeStoreAPI pode não persistir escritas.

Não é um store Pinia: o estado vive no composable (módulo compartilhado) enquanto a aplicação estiver em execução. Recarregar a página descarta as mutações locais.

---

## 7.2 — useDebouncedRef

Encapsula a lógica de debounce utilizada na pesquisa (delay padrão: 300ms).

O objetivo é evitar que a aplicação execute operações desnecessárias a cada alteração imediata do campo de pesquisa.

---

## 7.2.1 — useInitialFocus

Foca o campo principal de uma tela após a montagem (via `nextTick`), sem depender apenas do atributo HTML `autofocus`.

Regras:

- não rouba foco se o usuário já interagiu com outro controle;
- não foca elementos ocultos (ex.: busca mobile vs desktop);
- usado no `ProductForm` (título) e no `ProductSearch` quando `autofocus` é solicitado pelo pai.

---

## 7.3 — useProductListControls / useFavoriteProducts / useProductDetails

- `useProductListControls` — busca, filtro por categoria, ordenação e paginação locais sobre a coleção do catálogo da sessão (não utiliza `GET /products/category/:category`).
- `useProductDetails` — carrega um produto por ID; prefere o catálogo da sessão quando o produto já estiver lá (CREATE/UPDATE) e usa `GET /products/:id` quando não houver cópia local.
- `useFavoriteProducts` — resolve IDs favoritos em produtos a partir do catálogo da sessão (não faz GET independente que ignoraria mutações locais).

A store Pinia (`useFavoritesStore`) permanece a fonte de verdade dos IDs favoritos.

---

# 8. Config

A pasta `config/` será responsável por configurações de infraestrutura da aplicação.

Estrutura inicial prevista:

    src/config/
    └── api.ts

---

## 8.1 — api.ts

Responsável pela configuração do cliente HTTP utilizado pela aplicação.

Deverá concentrar configurações comuns como:

- URL base;
- headers;
- configurações do cliente;
- tratamento comum de requisições quando aplicável;
- tratamento comum de erros quando aplicável.

Os services deverão utilizar o cliente configurado em `config/api.ts` em vez de criar instâncias independentes.

---

# 9. Services

A pasta `services/` será responsável pela comunicação com recursos externos, principalmente a Fake Store API.

Estrutura implementada (com consolidação de categorias):

    src/services/
    └── productService.ts

Observação: a arquitetura inicial previa também um `categoryService.ts`. A decisão adotada foi concentrar `getCategories()` em `productService` (ver `03-decisoes-tecnicas.md` §35.5). Isso não remove o requisito de listar/filtrar categorias.

---

## 9.1 — productService.ts

Responsável pelas operações relacionadas a produtos e categorias.

Métodos:

- `getProducts()`;
- `getProductById()`;
- `getCategories()`;
- `createProduct()`;
- `updateProduct()`.

O service deverá abstrair os detalhes da comunicação HTTP das camadas superiores.

---

# 10. Stores

A pasta `stores/` será utilizada para estados que precisam ser compartilhados entre diferentes partes da aplicação.

A solução escolhida para gerenciamento de estado será definida no documento `03-decisoes-tecnicas.md`.

Estrutura prevista:

    src/stores/
    ├── favoritesStore.ts
    └── themeStore.ts

Estados globais implementados:

- favoritos (`favoritesStore`);
- tema Light/Dark (`themeStore`).

---

## 10.1 — Favorites Store

O store de favoritos poderá ser responsável por:

- armazenar identificadores de produtos favoritos;
- verificar se um produto está favoritado;
- adicionar favorito;
- remover favorito;
- sincronizar favoritos com `localStorage`.

O store não deverá ser utilizado para armazenar indiscriminadamente todos os estados da aplicação.

---

## 10.2 — Theme Store

O store de tema é responsável por:

- manter o modo atual (`light` | `dark`);
- aplicar a classe `.dark` no `<html>`;
- persistir a preferência em `localStorage` (`product-management:theme`);
- alternar o tema sob ação explícita do usuário.

A resolução inicial segue: preferência salva → preferência do sistema operacional → Light Mode.

---

# 11. Types

A pasta `types/` concentrará os tipos TypeScript compartilhados.

Estrutura implementada:

    src/types/
    ├── product.ts
    ├── category.ts
    ├── api.ts
    ├── productForm.ts
    ├── catalog.ts
    └── theme.ts

Tipos principais:

- `Product`;
- `ProductRating`;
- `ProductCreatePayload`;
- `ProductUpdatePayload`;
- `Category`;
- `AppError`;
- `ProductFormData`;
- `CatalogSortOrder` / `CategoryFilter` (catálogo: preço, nome e avaliação).

Os tipos deverão representar os contratos utilizados pela aplicação.

---

# 12. Router

A pasta `router/` será responsável pela configuração das rotas da aplicação.

Estrutura:

    src/router/
    └── index.ts

Rotas implementadas:

- `/` → redireciona para `/produtos`;
- `/produtos`;
- `/produtos/novo` (declarada antes de `/produtos/:id`);
- `/produtos/:id/editar` (declarada antes de `/produtos/:id`);
- `/produtos/:id`;
- `/favoritos`.

A ordem das rotas com segmentos estáticos (`novo`, `editar`) antes do parâmetro dinâmico `:id` evita ambiguidade no matching.

---

# 13. Utils

A pasta `utils/` será utilizada para funções auxiliares puras e reutilizáveis que não pertençam especificamente a uma feature.

Exemplos implementados:

    src/utils/
    ├── formatPrice.ts
    ├── parseProductId.ts
    ├── localizeCategory.ts
    ├── logError.ts
    ├── resolveErrorCopy.ts
    └── normalizeProduct.ts

`formatPrice.ts` é o único ponto de formatação monetária. Componentes de apresentação (`ProductCard`, `ProductDetails`, prévia do `ProductForm`) chamam `formatPrice`; o input de preço usa `formatPriceInput` / `parsePriceInput` e `getCurrencyAffix`. O locale segue `vue-i18n` (`pt-BR`/`BRL`, `en`/`USD`, `es`/`EUR`).

`normalizeProduct.ts` valida e normaliza respostas de produto (POST/PUT podem omitir `rating`). Não duplicar essa transformação em views ou no service além da chamada a `toProduct`.

Esses arquivos somente deverão existir quando houver uma necessidade real.

Não deverão ser utilizados como uma pasta genérica para colocar qualquer código que não tenha um local definido.

Schemas Yup de validação não pertencem a `utils/`; concentram-se em `schemas/`.

---

# 13.1 — Schemas

A pasta `schemas/` concentra os contratos de validação Yup utilizados pelos formulários.

Estrutura implementada:

    src/schemas/
    └── productFormSchema.ts

`productFormSchema` é compartilhado entre criação e edição via `ProductForm`. As mensagens são resolvidas via i18n no momento da validação.

A pasta não deve misturar helpers de formatação ou parse — esses permanecem em `utils/`.

---

# 14. Assets

A pasta `assets/` armazenará recursos utilizados pela aplicação.

Exemplos:

    src/assets/
    ├── images/
    ├── icons/
    └── styles/

A organização poderá ser ajustada conforme os recursos visuais utilizados.

---

# 15. Fluxo de Dados

O fluxo principal de obtenção de produtos seguirá uma estrutura semelhante a:

    View
      ↓
    Composable
      ↓
    Service
      ↓
    API
      ↓
    Service
      ↓
    Composable
      ↓
    View / Component

Exemplo:

1. A `ProdutosView` precisa carregar os produtos.
2. A view utiliza o composable responsável pela listagem.
3. O composable solicita os dados ao `productService`.
4. O service realiza a requisição à API.
5. O service retorna os dados.
6. O composable atualiza seu estado.
7. A view renderiza os componentes com os dados recebidos.

---

# 16. Fluxo de Favoritos

O fluxo de favoritos será independente da API quando possível, pois a persistência deverá ocorrer localmente.

Fluxo conceitual:

    ProductCard
        ↓
    FavoriteButton
        ↓
    Favorites Store
        ↓
    localStorage

Quando o usuário favoritar um produto:

1. O componente dispara a ação.
2. O estado de favoritos é atualizado.
3. O identificador do produto é persistido localmente.
4. As partes interessadas da aplicação recebem o novo estado.
5. A interface é atualizada.

---

# 17. Fluxo de Criação e Edição

O fluxo de criação será:

    ProdutoCriarView
           ↓
    ProductForm
           ↓
    Validação
           ↓
    Product Service (POST /products)
           ↓
    API
           ↓
    Produto retornado (normalizado)
           ↓
    useProductsCatalog.addCreatedProduct
           ↓
    Feedback / Navegação para /produtos

O fluxo de edição seguirá estrutura semelhante:

    ProdutoEditarView
           ↓
    Carregamento do produto (catálogo da sessão ou GET /products/:id)
           ↓
    ProductForm
           ↓
    Validação
           ↓
    Product Service (PUT /products/:id)
           ↓
    API
           ↓
    Produto retornado (normalizado)
           ↓
    useProductsCatalog.replaceProduct
           ↓
    Feedback / Navegação para /produtos

A navegação ocorre somente após sucesso da operação e da sincronização do estado. Em erro, o formulário permanece com os dados e o erro segue o tratamento global (`submitError`).

`DELETE /products/:id` não faz parte do escopo e não é implementado.

---

# 18. Responsabilidade por Camada

| Camada | Responsabilidade |
|---|---|
| `views` | Composição das páginas e coordenação dos fluxos |
| `components` | Apresentação e interação da interface |
| `composables` | Lógica reutilizável relacionada à interface |
| `stores` | Estado compartilhado entre diferentes áreas |
| `config` | Configurações de infraestrutura, incluindo o cliente HTTP |
| `services` | Comunicação com API e recursos externos |
| `types` | Contratos e tipos TypeScript |
| `schemas` | Contratos de validação Yup |
| `router` | Configuração da navegação |
| `utils` | Funções auxiliares puras |
| `assets` | Recursos estáticos da aplicação |

---

# 19. Regras de Dependência

As dependências entre camadas deverão seguir algumas regras.

## Components

Components podem:

- receber dados por props;
- emitir eventos;
- utilizar composables quando necessário.

Components não devem conhecer detalhes da implementação HTTP.

---

## Views

Views podem:

- utilizar components;
- utilizar composables;
- utilizar stores.

Views não devem concentrar diretamente detalhes de implementação de chamadas HTTP quando existir um service correspondente.

---

## Composables

Composables podem:

- utilizar services;
- utilizar stores;
- utilizar outros composables.

Devem permanecer focados em comportamentos específicos.

---

## Stores

Stores podem:

- armazenar estado compartilhado;
- utilizar persistência local;
- utilizar services quando houver necessidade.

Não devem se tornar depósitos genéricos de toda a lógica da aplicação.

---

## Services

Services podem:

- utilizar o cliente HTTP configurado em `config`;
- realizar requisições HTTP;
- transformar respostas quando necessário;
- lidar com detalhes específicos da API.

Services não devem conhecer componentes ou elementos da interface.

---

# 20. Tratamento de Estados Assíncronos

As operações assíncronas deverão possuir estados previsíveis.

Fluxo normal:

    idle
      ↓
    loading
      ↓
    success

Fluxo de erro:

    loading
      ↓
    error

Quando uma operação resultar em uma coleção vazia:

    loading
      ↓
    success
      ↓
    empty

A representação exata desses estados será definida durante a implementação.

---

# 21. Tratamento de Erros

Os erros são tratados de forma centralizada e em camadas:

```text
Erro original (Axios / runtime)
        ↓
Normalização (toAppError em config/api.ts)
        ↓
AppError (kind, status, retryable, fieldErrors)
        ↓
Resolução de mensagens (resolveErrorCopy + i18n)
        ↓
UI (ErrorState | Toast | alerta de formulário)
```

## Classificação

`AppError.kind` diferencia pelo menos:

- `network` — sem resposta / falha de conexão;
- `timeout` — ECONNABORTED / HTTP 408;
- `server` — HTTP 5xx;
- `notFound` — HTTP 404;
- `validation` — HTTP 400 / 422;
- `auth` — HTTP 401 / 403;
- `conflict` — HTTP 409;
- `rateLimit` — HTTP 429;
- `unexpected` — demais casos.

## Responsabilidades

### `config/api.ts`

Interceptor Axios normaliza qualquer falha em `AppError` e registra log seguro (sem tokens/payloads).

### Composables

Expoem `error: AppError | null` e `hasError`. Não inventam dados nem usam mock como fallback.

### Views / Components

- Erros de página/carregamento → `ErrorState` persistente + retry seguro em GET;
- Erros de ação (favorito, categorias) → Toast contextual;
- Erros de escrita em formulário → alerta inline (`submitError`), preservando os campos;
- 404 de produto → `EmptyState` de recurso inexistente (não confundir com falha de API);
- Busca sem resultados → `EmptyState` (não confundir com `ErrorState`).

### Runtime

`app.config.errorHandler`, `unhandledrejection` (log) e `ErrorBoundary` em torno do `RouterView` evitam tela em branco em falhas inesperadas de renderização.

A interface nunca apresenta stack trace, detalhes do Axios ou JSON bruto da API ao usuário final.

---

# 22. Formulários

A responsabilidade pelos formulários será dividida entre:

    View
      ↓
    ProductForm
      ↓
    Schema Yup (`src/schemas/`)
      ↓
    Service

O `ProductForm` será responsável principalmente pela apresentação e interação.

As regras de validação deverão permanecer em `src/schemas/`, fora do componente visual.

A comunicação com a API será realizada fora do componente visual.

---

# 23. Responsividade

A arquitetura dos componentes deverá permitir adaptação para diferentes tamanhos de tela.

A responsividade deverá ser tratada principalmente na camada de apresentação.

Os componentes não deverão possuir lógica de negócio diferente apenas porque estão sendo exibidos em uma tela menor, salvo quando houver uma necessidade real de experiência de usuário.

---

# 24. Acessibilidade

A arquitetura deverá favorecer componentes semanticamente corretos.

Responsabilidades incluem:

- utilização adequada de elementos HTML;
- labels associados aos campos;
- textos alternativos;
- estados acessíveis;
- navegação por teclado;
- foco adequado em diálogos e formulários;
- mensagens de erro associadas aos campos.

---

# 25. Testabilidade

A arquitetura deverá permitir que as principais regras sejam testadas de forma isolada.

Deverão ser priorizados testes para:

- composables;
- stores;
- validações;
- componentes com comportamento relevante;
- fluxos críticos.

A estratégia completa de testes será definida posteriormente nas decisões técnicas e no plano de implementação.

---

# 26. Princípios para Uso de IA

A implementação poderá utilizar ferramentas de inteligência artificial como apoio ao desenvolvimento.

A IA não deverá substituir a compreensão da arquitetura definida neste documento.

Qualquer código gerado deverá:

- respeitar os requisitos;
- respeitar a arquitetura;
- ser revisado;
- ser executado e validado;
- possuir justificativa quando introduzir uma nova dependência ou abstração.

O agente de desenvolvimento deverá consultar a documentação do projeto antes de realizar alterações estruturais.

---

# 27. Evolução da Arquitetura

A arquitetura apresentada neste documento representa a estrutura planejada inicialmente.

Durante a implementação, mudanças poderão ser necessárias.

Alterações deverão ser realizadas somente quando houver justificativa técnica.

Mudanças significativas deverão ser registradas em:

`docs/03-decisoes-tecnicas.md`

O objetivo não é criar uma arquitetura excessivamente complexa, mas estabelecer uma estrutura suficiente para manter o projeto organizado, testável e sustentável.

---

# 28. Critérios de Aceite da Arquitetura

A arquitetura será considerada adequada quando:

- [x] Views representarem páginas e fluxos.
- [x] Components concentrarem apresentação e interação.
- [x] Composables concentrarem lógica reutilizável.
- [x] Config concentrar configurações de infraestrutura, incluindo o cliente HTTP.
- [x] Services concentrarem comunicação com a API.
- [x] Stores forem utilizados somente para estado compartilhado.
- [x] Types concentrarem contratos TypeScript compartilhados.
- [x] Schemas concentrarem contratos de validação Yup.
- [x] Router concentrar a configuração de rotas.
- [x] Utils forem utilizados somente para funções auxiliares apropriadas.
- [x] Components não realizarem diretamente chamadas HTTP.
- [x] Services não dependerem de Components.
- [x] Regras de negócio não estiverem excessivamente concentradas nas Views.
- [x] O código puder ser testado de maneira isolada.
- [x] A estrutura permitir evolução sem aumento desnecessário do acoplamento.

---

# 29. Status do Documento

**Status:** Concluído (Fase 11 — auditoria documental)

**Versão:** 1.9

**Última atualização:** 2026-08-13

### Nota — melhoria bônus i18n

Pasta `src/i18n/` e `localeStore` adicionadas para internacionalização. Fluxo de produtos: FakeStoreAPI → services → `Product` → apresentação (`title`/`description` originais; categorias localizadas na UI; preço formatado na UI via `formatPrice` conforme o locale).

### Nota — pasta `schemas/`

Contratos Yup saíram de `utils/` para `src/schemas/` (decisão 35.17). `productFormSchema` continua compartilhado entre criação e edição.

### Nota — estado do catálogo após CREATE/UPDATE

`useProductsCatalog` é a fonte única de verdade do catálogo na sessão. GET inicial carrega a FakeStoreAPI; respostas bem-sucedidas de POST/PUT atualizam o estado local. A API de demonstração não é tratada como banco persistente. Sem DELETE (fora do escopo).