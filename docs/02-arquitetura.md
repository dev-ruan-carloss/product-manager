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

- API → services;
- estado global → stores;
- lógica reutilizável → composables;
- apresentação → components;
- páginas → views;
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
    │   ├── layouts/
    │   ├── router/
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

Exemplos:

    src/components/
    ├── AppHeader.vue
    ├── ProductCard.vue
    ├── ProductGrid.vue
    ├── ProductFilters.vue
    ├── ProductSearch.vue
    ├── ProductSort.vue
    ├── ProductPagination.vue
    ├── ProductForm.vue
    ├── FavoriteButton.vue
    ├── LoadingState.vue
    ├── ErrorState.vue
    └── EmptyState.vue

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
    ├── useProducts.ts
    ├── useProductFilters.ts
    ├── useDebounce.ts
    ├── useFavorites.ts
    └── useProductForm.ts

Nem todos esses composables precisarão necessariamente existir.

Eles deverão ser criados quando houver uma necessidade real de reutilização ou isolamento de lógica.

---

## 7.1 — useProducts

Poderá centralizar lógica relacionada ao carregamento e manipulação dos produtos.

Responsabilidades possíveis:

- carregar produtos;
- controlar estado de carregamento;
- controlar erros;
- disponibilizar produtos;
- executar operações relacionadas à listagem.

---

## 7.2 — useDebounce

Poderá encapsular a lógica de debounce utilizada na pesquisa.

O objetivo é evitar que a aplicação execute operações desnecessárias a cada alteração imediata do campo de pesquisa.

---

## 7.3 — useFavorites

Poderá encapsular comportamentos relacionados aos favoritos.

Responsabilidades possíveis:

- verificar se um produto está favoritado;
- favoritar;
- desfavoritar;
- recuperar favoritos;
- persistir favoritos.

A implementação final dependerá da estratégia de gerenciamento de estado definida nas decisões técnicas.

---

# 8. Services

A pasta `services/` será responsável pela comunicação com recursos externos, principalmente a Fake Store API.

Estrutura inicial prevista:

    src/services/
    ├── api.ts
    ├── productService.ts
    └── categoryService.ts

---

## 8.1 — api.ts

Responsável pela configuração do cliente HTTP utilizado pela aplicação.

Deverá concentrar configurações comuns como:

- URL base;
- headers;
- configurações do cliente;
- tratamento comum de requisições quando aplicável.

---

## 8.2 — productService.ts

Responsável pelas operações relacionadas a produtos.

Exemplos:

- `getProducts()`;
- `getProductById()`;
- `createProduct()`;
- `updateProduct()`.

O service deverá abstrair os detalhes da comunicação HTTP das camadas superiores.

---

## 8.3 — categoryService.ts

Responsável pelas operações relacionadas às categorias.

Exemplo:

- `getCategories()`.

Caso a API disponibilize categorias através de outro recurso, a implementação deverá respeitar o contrato real da API.

---

# 9. Stores

A pasta `stores/` será utilizada para estados que precisam ser compartilhados entre diferentes partes da aplicação.

A solução escolhida para gerenciamento de estado será definida no documento `03-decisoes-tecnicas.md`.

Estrutura prevista:

    src/stores/
    └── favoritesStore.ts

Inicialmente, o principal candidato a estado global é o gerenciamento de favoritos.

---

## 9.1 — Favorites Store

O store de favoritos poderá ser responsável por:

- armazenar identificadores de produtos favoritos;
- verificar se um produto está favoritado;
- adicionar favorito;
- remover favorito;
- sincronizar favoritos com `localStorage`.

O store não deverá ser utilizado para armazenar indiscriminadamente todos os estados da aplicação.

---

# 10. Types

A pasta `types/` concentrará os tipos TypeScript compartilhados.

Estrutura prevista:

    src/types/
    ├── product.ts
    ├── category.ts
    └── api.ts

Tipos previstos:

- `Product`;
- `ProductRating`;
- `ProductCreatePayload`;
- `ProductUpdatePayload`.

Os tipos deverão representar os contratos utilizados pela aplicação.

---

# 11. Router

A pasta `router/` será responsável pela configuração das rotas da aplicação.

Estrutura:

    src/router/
    └── index.ts

Rotas previstas:

- `/`;
- `/produtos`;
- `/produtos/:id`;
- `/favoritos`;
- `/produtos/novo`;
- `/produtos/:id/editar`.

A estrutura final das URLs deverá ser definida considerando a experiência de navegação e a organização do projeto.

---

# 12. Utils

A pasta `utils/` será utilizada para funções auxiliares puras e reutilizáveis que não pertençam especificamente a uma feature.

Exemplos possíveis:

    src/utils/
    ├── formatters.ts
    ├── validators.ts
    └── storage.ts

Esses arquivos somente deverão existir quando houver uma necessidade real.

Não deverão ser utilizados como uma pasta genérica para colocar qualquer código que não tenha um local definido.

---

# 13. Assets

A pasta `assets/` armazenará recursos utilizados pela aplicação.

Exemplos:

    src/assets/
    ├── images/
    ├── icons/
    └── styles/

A organização poderá ser ajustada conforme os recursos visuais utilizados.

---

# 14. Fluxo de Dados

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

# 15. Fluxo de Favoritos

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

# 16. Fluxo de Criação e Edição

O fluxo de criação será:

    ProdutoCriarView
           ↓
    ProductForm
           ↓
    Validação
           ↓
    Product Service
           ↓
    API
           ↓
    Resultado
           ↓
    Feedback / Navegação

O fluxo de edição seguirá estrutura semelhante:

    ProdutoEditarView
           ↓
    Carregamento do produto
           ↓
    ProductForm
           ↓
    Validação
           ↓
    Product Service
           ↓
    API
           ↓
    Resultado
           ↓
    Feedback / Navegação

---

# 17. Responsabilidade por Camada

| Camada | Responsabilidade |
|---|---|
| `views` | Composição das páginas e coordenação dos fluxos |
| `components` | Apresentação e interação da interface |
| `composables` | Lógica reutilizável relacionada à interface |
| `stores` | Estado compartilhado entre diferentes áreas |
| `services` | Comunicação com API e recursos externos |
| `types` | Contratos e tipos TypeScript |
| `router` | Configuração da navegação |
| `utils` | Funções auxiliares puras |
| `assets` | Recursos estáticos da aplicação |

---

# 18. Regras de Dependência

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

- realizar requisições HTTP;
- transformar respostas quando necessário;
- lidar com detalhes específicos da API.

Services não devem conhecer componentes ou elementos da interface.

---

# 19. Tratamento de Estados Assíncronos

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

# 20. Tratamento de Erros

Os erros deverão ser tratados em níveis apropriados.

## Service

Responsável por lidar com detalhes técnicos da requisição.

## Composable ou Store

Responsável por disponibilizar o estado de erro de forma adequada para a interface.

## View ou Component

Responsável por apresentar uma mensagem compreensível ao usuário.

A interface não deverá apresentar diretamente mensagens técnicas desnecessárias provenientes da biblioteca HTTP ou do navegador.

---

# 21. Formulários

A responsabilidade pelos formulários será dividida entre:

    View
      ↓
    ProductForm
      ↓
    Validação
      ↓
    Service

O `ProductForm` será responsável principalmente pela apresentação e interação.

As regras de validação deverão permanecer em uma solução estruturada de validação.

A comunicação com a API será realizada fora do componente visual.

---

# 22. Responsividade

A arquitetura dos componentes deverá permitir adaptação para diferentes tamanhos de tela.

A responsividade deverá ser tratada principalmente na camada de apresentação.

Os componentes não deverão possuir lógica de negócio diferente apenas porque estão sendo exibidos em uma tela menor, salvo quando houver uma necessidade real de experiência de usuário.

---

# 23. Acessibilidade

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

# 24. Testabilidade

A arquitetura deverá permitir que as principais regras sejam testadas de forma isolada.

Deverão ser priorizados testes para:

- composables;
- stores;
- validações;
- componentes com comportamento relevante;
- fluxos críticos.

A estratégia completa de testes será definida posteriormente nas decisões técnicas e no plano de implementação.

---

# 25. Princípios para Uso de IA

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

# 26. Evolução da Arquitetura

A arquitetura apresentada neste documento representa a estrutura planejada inicialmente.

Durante a implementação, mudanças poderão ser necessárias.

Alterações deverão ser realizadas somente quando houver justificativa técnica.

Mudanças significativas deverão ser registradas em:

`docs/03-decisoes-tecnicas.md`

O objetivo não é criar uma arquitetura excessivamente complexa, mas estabelecer uma estrutura suficiente para manter o projeto organizado, testável e sustentável.

---

# 27. Critérios de Aceite da Arquitetura

A arquitetura será considerada adequada quando:

- [ ] Views representarem páginas e fluxos.
- [ ] Components concentrarem apresentação e interação.
- [ ] Composables concentrarem lógica reutilizável.
- [ ] Services concentrarem comunicação com a API.
- [ ] Stores forem utilizados somente para estado compartilhado.
- [ ] Types concentrarem contratos TypeScript compartilhados.
- [ ] Router concentrar a configuração de rotas.
- [ ] Utils forem utilizados somente para funções auxiliares apropriadas.
- [ ] Components não realizarem diretamente chamadas HTTP.
- [ ] Services não dependerem de Components.
- [ ] Regras de negócio não estiverem excessivamente concentradas nas Views.
- [ ] O código puder ser testado de maneira isolada.
- [ ] A estrutura permitir evolução sem aumento desnecessário do acoplamento.

---

# 28. Status do Documento

**Status:** Em definição

**Versão:** 1.0