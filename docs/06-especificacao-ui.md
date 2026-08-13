# Especificação de UI — Product Management

## 1. Objetivo

Este documento define a estrutura visual, os componentes, os fluxos de interação e os estados das interfaces do projeto.

A implementação deverá seguir os requisitos definidos no desafio técnico, utilizando:

- Vue 3;
- Composition API;
- TypeScript;
- PrimeVue;
- TailwindCSS;
- Vue Router;
- Pinia;
- vee-validate;
- Yup.

A interface deverá ser responsiva, acessível e adequada para desktop e dispositivos móveis. O desafio exige **360px+**; o alvo interno do projeto inclui validação a partir de **320px**.

---

# 2. Princípios da Interface

A interface deverá priorizar:

- simplicidade;
- clareza;
- consistência visual;
- responsividade;
- acessibilidade;
- feedback para ações do usuário;
- reutilização de componentes;
- baixo acoplamento entre apresentação e regras de negócio.

PrimeVue será utilizado para componentes de interface quando houver componente adequado.

TailwindCSS será utilizado para:

- layout;
- espaçamento;
- responsividade;
- tipografia;
- ajustes visuais;
- composição dos componentes.

Não deverá ser criado CSS personalizado quando TailwindCSS ou PrimeVue atenderem à necessidade.

---

# 3. Estrutura Geral

A aplicação deverá possuir uma estrutura semelhante a:

    App
    ├── Header
    ├── Main
    │   └── View atual
    ├── Toast (feedback global)
    └── Footer

### Status do layout

- Header, Main, Footer e Toast: implementados em `DefaultLayout`.
- Footer: componente `AppFooter.vue`, integrado ao layout (não é adicionado por View).

A navegação será controlada pelo Vue Router.

---

# 4. Rotas

As principais rotas serão:

    /produtos
    /produtos/:id
    /produtos/novo
    /produtos/:id/editar
    /favoritos

A rota `/produtos` será a página principal da aplicação.

---

# 5. Layout Principal

O layout principal deverá possuir:

- cabeçalho;
- navegação;
- conteúdo principal;
- área adequada para mensagens e feedbacks.

O layout deverá ocupar corretamente a tela em desktop, tablet e mobile.

---

# 6. Cabeçalho

O cabeçalho deverá apresentar:

- identificação da aplicação;
- acesso aos produtos;
- acesso aos favoritos;
- acesso à criação de produto.

No mobile, a navegação deverá ser adaptada para o espaço disponível.

**Implementação atual (responsividade):**

- Ordem do Header: **logo + nome** à esquerda; à direita (`ml-auto` + `justify-end`): **Produtos + Favoritos + Novo Produto**.
- Em viewports ≤515px: nav em grid — Produtos/Favoritos **50%** (sem `margin-left`); Novo Produto **100%**.
- Em viewports ≥516px: espaçamento extra entre Favoritos e Novo Produto (`ml-3` / `ml-4`) para separar navegação de cadastro.
- Favoritos: coração + texto + contador em `inline-flex` no link (contador associado ao final de “Favoritos”, não ancorado no ícone); estado ativo em pill Light/Dark.
- O controle de tema (`ThemeToggle`) foi movido para o **Footer** (não compete por espaço no Header).
- Safe-area superior via `env(safe-area-inset-top)`.

---

# 6.1 — Rodapé

**Status:** **CONCLUÍDO**

O rodapé é parte estrutural do layout (`AppFooter` em `DefaultLayout`) e não deve ser incluído manualmente nas Views.

Conteúdo:

- identidade: `Product Management`;
- descrição: `Catálogo de produtos • Favoritos • Gerenciamento`;
- navegação interna via Vue Router: Produtos (`/produtos`), Favoritos (`/favoritos`), Novo produto (`/produtos/novo`);
- grupo de preferências alinhado ao fim da faixa de identidade (`justify-between`): seletor de idioma (`LocaleSelector`) + controle de tema Light/Dark (`ThemeToggle`);
- copyright: `© 2026 Product Management`.

Não inclui redes sociais, contatos, links externos ou dados fictícios.

No desktop, os links de navegação podem aparecer em linha; no mobile, empilhados. O layout principal usa `min-height: 100vh` com fallback moderno `100dvh` (classe `.app-shell`) + `flex-1` no conteúdo para manter o rodapé ao final da viewport quando a página tem pouco conteúdo. Safe-area inferior é considerada via `env(safe-area-inset-bottom)`.

O controle de tema (`ThemeToggle`) deve:

- permanecer no Footer global;
- permanecer próximo ao seletor de idioma;
- possuir área de toque adequada;
- ser acessível por teclado;
- possuir `aria-label` e estado acessível (`aria-pressed`);
- indicar visualmente o tema atual.

### Internacionalização no Footer (melhoria bônus)

O seletor de idioma (`LocaleSelector`) deve:

- permanecer no Footer, no mesmo grupo do `ThemeToggle`;
- oferecer `pt-BR`, `es` e `en`;
- iniciar em `pt-BR` quando não houver preferência válida;
- persistir a escolha em `localStorage` (`product-management:locale`);
- exibir texto acessível do idioma (não apenas bandeira);
- adaptar labels em viewports estreitas (ex.: `PT` / `PT-BR`);
- funcionar em Light e Dark Mode sem overflow horizontal.

Categorias da FakeStoreAPI são exibidas traduzidas na interface; os valores originais da API continuam sendo usados em filtros, formulários e payloads.

### Conteúdo dinâmico de produtos (title / description)

- Conteúdo dinâmico de produtos **não** é traduzido automaticamente.
- Catálogo, favoritos e detalhes renderizam `product.title` e `product.description` exatamente como retornados pela FakeStoreAPI.
- A troca de idioma altera a interface e as categorias; **não** altera título nem descrição.
- Busca e ordenação por nome usam o título original da API.
- Loading da UI não aguarda tradução de conteúdo de produto.

---

# 6.2 — Tema (Light / Dark Mode)

**Status:** **CONCLUÍDO**

A aplicação possui tema global com:

- Light Mode (referência visual existente, preservada);
- Dark Mode (adaptação global de superfícies, textos, bordas e estados).

Regras:

- estado centralizado em `themeStore` (Pinia);
- persistência em `localStorage` com chave `product-management:theme`;
- resolução inicial: preferência salva → preferência do sistema → Light Mode;
- TailwindCSS utiliza a variante `dark:` com classe `.dark` no `<html>`;
- PrimeVue utiliza `darkModeSelector: '.dark'`;
- o tema se aplica a Header, Footer, layout, catálogo, detalhes, formulários, favoritos, loading, erro, vazio e Toast.

Não deve existir estado de tema independente por tela.

---

# 7. Página de Produtos

## Rota

`/produtos`

## Objetivo

Permitir que o usuário visualize e gerencie a listagem de produtos.

A página deverá disponibilizar:

- busca;
- filtro por categoria;
- ordenação por preço;
- ordenação por nome;
- ordenação por avaliação;
- paginação;
- favoritos;
- acesso aos detalhes.

---

# 8. Estrutura da Página

A estrutura deverá seguir aproximadamente:

    Página de Produtos
        ↓
    Título
        ↓
    Área de filtros
        ├── Busca
        ├── Categoria
        ├── Ordenação por preço
        ├── Ordenação por nome
        └── Ordenação por avaliação
        ↓
    Lista de produtos
        ↓
    Paginação

Os controles deverão se adaptar ao tamanho da tela.

---

# 9. Busca

A página deverá possuir campo para busca de produtos.

Placeholder sugerido:

`Buscar produto...`

A busca deverá utilizar debounce para evitar processamento excessivo durante a digitação.

O debounce deverá ser aplicado antes da atualização dos resultados.

---

# 10. Filtro por Categoria

Deverá existir filtro por categoria.

**Status:** **CONCLUÍDO**

As categorias deverão ser obtidas através da API (`GET /products/categories`).

O usuário deverá possuir uma opção equivalente a:

`Todas as categorias`

Quando uma categoria for selecionada, somente produtos daquela categoria deverão ser apresentados.

### Como o filtro é atendido

A FakeStoreAPI disponibiliza `GET /products/category/:category`, porém a aplicação não utiliza esse endpoint. O requisito de filtro por categoria é atendido através do carregamento do catálogo via `GET /products` e filtragem dos produtos no frontend (`useProductListControls`, comparando `product.category`).

Classificação de `GET /products/category/:category`: **disponível na API, porém não utilizado e não obrigatório** — não é pendência de implementação.

---

# 11. Ordenação

A interface deverá permitir ordenar os produtos.

### Opções obrigatórias / previstas

- menor preço;
- maior preço;
- nome A–Z;
- nome Z–A;
- avaliação (crescente / decrescente).

A ordenação deverá ocorrer no frontend quando necessário.

### Status

- Ordenação por preço: implementada via `ProductSort` em `ProductFilters`.
- Ordenação por nome: implementada.
- Ordenação por avaliação: implementada (prioridade `rating.rate`; empate por `rating.count`).
- Exibição de avaliação: uma estrela preenchida + nota numérica (ex.: `★ 4.8`).

Não deverão ser adicionados critérios de ordenação que não façam parte do escopo do desafio.

---

# 12. Combinação dos Controles

Busca, filtro e ordenação deverão funcionar simultaneamente.

Fluxo:

    Produtos da API
        ↓
    Busca
        ↓
    Filtro por categoria
        ↓
    Ordenação (preço / nome / avaliação)
        ↓
    Paginação
        ↓
    Produtos exibidos

A aplicação não deverá modificar permanentemente a coleção original recebida da API.

---

# 13. Lista de Produtos

Os produtos deverão ser apresentados em uma grade responsiva.

Cada produto deverá utilizar um componente reutilizável:

`ProductCard`

A quantidade de colunas deverá se adaptar ao espaço disponível.

**Implementação atual:** o grid utiliza `auto-fill` + `minmax(min(100%, 14rem), 1fr)`.

O `min(100%, 14rem)` garante que a trilha nunca exceda a largura útil do container (inclui padding lateral), evitando overflow em 320px/360px. Em auditoria de validação: 1 coluna em smartphones estreitos; múltiplas colunas conforme o espaço (com ou sem sidebar).

---

# 14. ProductCard

O card deverá apresentar:

- imagem;
- título;
- preço;
- categoria;
- avaliação;
- ação de favorito;
- acesso aos detalhes.

A estrutura visual deverá ser consistente entre todos os produtos.

---

# 15. Imagem

A imagem deverá:

- respeitar a área definida pelo card;
- evitar distorções;
- possuir `alt` adequado;
- possuir fallback caso não seja carregada.

O carregamento da imagem não deverá causar quebra significativa do layout.

---

# 16. Título

O título deverá possuir limite visual para evitar cards excessivamente altos.

Quando necessário, o texto poderá ser truncado visualmente.

O usuário deverá conseguir visualizar o título completo na página de detalhes.

---

# 17. Preço

O preço deverá possuir destaque visual.

A apresentação deverá utilizar formato brasileiro:

`R$ 99,90`

O valor interno continuará sendo tratado como número.

---

# 18. Avaliação

A avaliação deverá apresentar a nota do produto.

Quando houver quantidade de avaliações disponível, ela também poderá ser apresentada.

A utilização de estrelas deverá possuir informação acessível equivalente.

A interface exibe uma estrela preenchida seguida da nota numérica (ex.: `4.8`).

---

# 19. Favoritos

Cada produto deverá possuir ação para:

- adicionar aos favoritos;
- remover dos favoritos.

O estado deverá ser gerenciado pelo Pinia.

A persistência deverá ser feita utilizando `localStorage`.

Somente o ID dos produtos deverá ser persistido.

---

# 20. Botão de Favorito

O botão deverá apresentar estados visuais diferentes para:

- não favoritado;
- favoritado;
- interação;
- foco.

O botão deverá possuir nome acessível.

Exemplos:

`Adicionar aos favoritos`

`Remover dos favoritos`

A ação de favoritar não deverá abrir a página de detalhes.

---

# 21. Paginação

A listagem deverá utilizar paginação.

A interface deverá apresentar:

- página atual;
- páginas disponíveis;
- página anterior;
- próxima página.

O botão anterior deverá permanecer desabilitado na primeira página.

O botão próximo deverá permanecer desabilitado na última página.

A escolha por paginação em vez de scroll infinito mantém a navegação previsível e atende ao escopo do desafio.

### Implementação atual

`ProductPagination` concentra intervalo (“Mostrando X a Y…”), controles de página e seletor de itens por página em um único container flex (`pagination-toolbar`), com wrap quando faltar espaço.

---

# 22. Estado de Loading

Durante o carregamento dos produtos deverá existir feedback visual.

Poderá ser utilizado um componente de Skeleton do PrimeVue.

A interface não deverá permanecer vazia sem indicar que os dados estão sendo carregados.

---

# 23. Estado de Erro

Caso ocorra erro ao carregar os produtos, deverá ser apresentada uma mensagem clara.

Exemplo:

**Não foi possível carregar os produtos.**

Deverá existir uma ação:

**Tentar novamente**

O erro técnico da API não deverá ser apresentado diretamente ao usuário.

---

# 24. Estado Vazio

Caso nenhum produto corresponda aos filtros ou à busca, deverá ser apresentado um estado vazio.

Exemplo:

**Nenhum produto encontrado.**

Mensagem complementar:

**Tente alterar sua busca ou os filtros.**

Quando apropriado, deverá existir uma ação para limpar os filtros.

---

# 25. Página de Detalhes

## Rota

`/produtos/:id`

## Objetivo

Apresentar as informações completas do produto selecionado.

A página deverá apresentar:

- imagem;
- título;
- preço;
- categoria;
- descrição;
- avaliação;
- favorito;
- ação de edição.

---

# 26. Carregamento dos Detalhes

Ao acessar a rota:

`/produtos/:id`

a aplicação deverá:

1. obter o ID da rota;
2. solicitar o produto à API;
3. apresentar loading;
4. apresentar os dados quando disponíveis;
5. apresentar erro caso a requisição falhe.

---

# 27. Produto Não Encontrado

Caso o produto não exista, deverá ser apresentado um estado específico.

Exemplo:

**Produto não encontrado.**

Deverá existir uma ação para retornar à lista de produtos.

---

# 28. Página de Favoritos

## Rota

`/favoritos`

A página deverá apresentar somente produtos favoritados.

Os produtos deverão utilizar o mesmo `ProductCard` da listagem principal.

---

# 29. Nenhum Favorito

Caso não existam favoritos, deverá ser apresentado:

**Você ainda não possui favoritos.**

A interface deverá disponibilizar uma ação para voltar aos produtos.

---

# 30. Sincronização dos Favoritos

Ao favoritar ou desfavoritar:

- Pinia deverá atualizar o estado;
- `localStorage` deverá ser atualizado;
- contador de favoritos deverá ser atualizado;
- componentes relacionados deverão refletir a alteração.

Na página de favoritos, um produto desfavoritado deverá desaparecer da lista.

---

# 31. Página de Criação

## Rota

`/produtos/novo`

A página deverá apresentar um formulário para criação de produto.

O formulário deverá utilizar:

- vee-validate;
- Yup;
- componentes do PrimeVue.

---

# 32. Campos do Formulário

O formulário deverá possuir:

- título;
- preço;
- descrição;
- categoria;
- imagem.

Todos os campos deverão possuir identificação clara.

---

# 33. Validação do Formulário

A validação deverá ser feita utilizando Yup integrado ao vee-validate.

Regras mínimas:

### Título

- obrigatório.

### Preço

- obrigatório;
- numérico;
- maior que zero.

### Descrição

- obrigatória quando definida pelo contrato do desafio.

### Categoria

- obrigatória.

### Imagem

- obrigatória;
- deve possuir URL válida.

As mensagens de validação deverão ser apresentadas próximas aos respectivos campos.

Quando um campo possui texto auxiliar e entra em estado inválido, a mensagem de erro **substitui** o texto auxiliar na mesma região contextual (não devem aparecer as duas ao mesmo tempo). Ver seção 48.

---

# 34. Estado de Validação

Os campos deverão apresentar visualmente:

- estado normal;
- estado de foco;
- estado inválido;
- estado válido quando aplicável.

As mensagens de erro deverão ser claras e objetivas.

No `ProductForm`, o estado inválido também atualiza `aria-invalid` e o conteúdo anunciado via `aria-describedby` (região única de mensagem).

### Hierarquia visual no estado inválido

Prioridade de destaque:

1. mensagem de erro (vermelho de erro);
2. borda/estado do campo (vermelho de erro);
3. placeholder auxiliar (neutro — mesmo tom do estado normal, sem vermelho saturado).

Regras:

- o texto digitado pelo usuário **não** fica vermelho apenas porque o campo está inválido;
- o label **não** precisa ficar vermelho (exceto o indicador `*` de obrigatório já existente);
- a acessibilidade do erro não depende só da cor (`aria-invalid`, mensagem associada, foco visível).

---

# 35. Ações do Formulário

O formulário deverá possuir:

- salvar;
- cancelar.

Durante o envio:

- o botão de salvar deverá indicar carregamento;
- múltiplos envios deverão ser evitados;
- os dados preenchidos deverão permanecer no formulário em caso de erro.

---

# 36. Criação do Produto

Ao salvar:

    Formulário
        ↓
    Validação Yup
        ↓
    vee-validate
        ↓
    Product Service
        ↓
    POST /products
        ↓
    Feedback
        ↓
    Navegação

---

# 37. Sucesso na Criação

Após uma criação bem-sucedida:

- apresentar Toast de sucesso através do PrimeVue;
- navegar para `/produtos`.

Mensagem:

**Produto criado com sucesso.**

---

# 38. Erro na Criação

Caso a API retorne erro:

- apresentar alerta inline no formulário (`submitError`);
- manter os dados do formulário;
- permitir nova tentativa manual (sem retry automático de escrita).

Mensagem sugerida:

**Não foi possível salvar o produto. Verifique sua conexão e tente novamente.**

---

# 39. Página de Edição

## Rota

`/produtos/:id/editar`

A página deverá reutilizar o formulário utilizado na criação.

Fluxo:

    ID da rota
        ↓
    GET /products/:id
        ↓
    Preenchimento do formulário
        ↓
    Edição
        ↓
    Validação
        ↓
    PUT /products/:id

---

# 40. Carregamento da Edição

Enquanto o produto estiver sendo carregado:

- apresentar loading;
- não apresentar formulário vazio como se fosse um novo produto.

Caso o produto não seja encontrado:

- apresentar estado de produto não encontrado;
- disponibilizar retorno para os produtos.

---

# 41. Sucesso na Edição

Após atualização:

- apresentar Toast de sucesso;
- atualizar os dados exibidos quando permanecer na tela do produto;
- retornar para uma página apropriada.

**Comportamento atual implementado:** Toast de sucesso e navegação para `/produtos` (decisão registrada na Fase 8).

Mensagem sugerida:

**Produto atualizado com sucesso.**

---

# 42. Erro na Edição

Caso a atualização falhe:

- apresentar alerta inline no formulário (`submitError`);
- manter os dados preenchidos;
- permitir nova tentativa manual (sem retry automático de escrita).

---

# 43. Dialog / Sheet

Componentes de Dialog ou Sheet do PrimeVue deverão ser utilizados quando uma interação exigir contexto adicional sem navegação completa.

Exemplos possíveis:

- confirmação de ação;
- formulário contextual;
- visualização complementar.

Não deverão ser utilizados modais desnecessariamente.

---

# 44. Toasts

O sistema de Toast do PrimeVue deverá ser utilizado para feedback de operações.

Exemplos:

- produto criado (sucesso);
- produto atualizado (sucesso);
- falha contextual ao atualizar favoritos;
- falha ao carregar categorias.

Erros persistentes de carregamento de página devem usar `ErrorState`, não apenas Toast.

As mensagens deverão ser curtas e compreensíveis.

---

# 45. Responsividade

A interface deverá atender o requisito do desafio (**360px+**) e o alvo interno do projeto (**320px+**).

Deverá ser validada pelo menos em:

- 320px (alvo interno);
- 360px (mínimo do desafio);
- 768px;
- desktop.

### Status (Fase 9 — parte responsiva)

**Status:** **CONCLUÍDO**

Ajustes aplicados na camada de apresentação:

- requisito do desafio: **360px+**;
- alvo mínimo interno de usabilidade: **320px+**;
- prioridade: sem espaços em branco forçados; quando faltar largura, usar `flex-wrap`;
- Header/Footer reorganizados com wrap e hierarquia preservada (sem `justify-between` gerando vazio no mobile);
- catálogo, favoritos, detalhes e formulários com paddings compactos em telas estreitas;
- grid fluido (`auto-fill` + `minmax(min(100%, 14rem), 1fr)`), validado sem overflow de 320px a 1920px;
- cards com altura de linha alinhada (`auto-rows-fr` + `h-full`) e conteúdo empilhado no topo (sem `mt-auto`);
- paginação com wrap;
- controles PrimeVue com `max-width: 100%`;
- ausência de `overflow-x-hidden` como solução genérica;
- segunda auditoria de validação (viewports mobile/tablet/desktop + Light/Dark) concluída para a parte responsiva.

Acessibilidade (seção 48 / Fase 9 — parte a11y) foi implementada em paralelo à responsividade já validada.

---

# 46. Mobile

Em telas pequenas:

- navegação deverá ser adaptada;
- filtros deverão ser empilhados quando necessário;
- cards deverão ocupar o espaço disponível;
- botões deverão possuir área adequada para toque;
- textos não deverão ultrapassar a largura da tela;
- formulários deverão utilizar a largura disponível.

**Implementação atual:** filtros/ordenação empilham abaixo de `md`; formulário em coluna única abaixo de `md`; ações de detalhes/formulário em coluna no mobile; textos longos usam quebra natural (`break-words`) em vez de truncamento indiscriminado.

---

# 47. Desktop

Em desktop:

- navegação completa poderá ser apresentada;
- filtros poderão ficar lado a lado;
- produtos deverão utilizar grade com múltiplas colunas;
- formulários poderão possuir largura máxima para melhorar a leitura.

---

# 48. Acessibilidade

A interface deverá seguir boas práticas de acessibilidade.

### Status (Fase 9 — parte a11y)

**Status:** **CONCLUÍDO**

Regras mínimas atendidas:

- HTML semântico (`header`, `nav`, `main`, `footer`, `section`, `article`, `form`, headings);
- labels associados aos campos (`for` / `input-id`);
- botões e links com nomes acessíveis;
- imagens com `alt` descritivo (ou `alt=""` quando decorativas no mesmo link do título);
- navegação por teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`; overlays PrimeVue com `Esc`);
- foco visível (`:focus-visible` global + anéis nos controles e estilos PrimeVue em Light/Dark);
- mensagens de erro associadas aos campos;
- estados não dependem somente de cor (texto + ícones + `aria-*` quando necessário).

### Formulários — texto auxiliar OU erro

Cada campo do `ProductForm` possui **uma única região contextual** abaixo do input (`id` estável, ex.: `product-price-message`):

- estado normal: texto auxiliar;
- estado inválido: mensagem de erro **substitui** o texto auxiliar (não há duas mensagens simultâneas).

Associações acessíveis:

- `aria-invalid="true"` somente enquanto houver erro no campo;
- `aria-describedby` aponta sempre para a região contextual atualmente apresentada;
- `aria-required` nos campos obrigatórios;
- após envio inválido, o foco é movido para o primeiro campo inválido (ordem visual do formulário).

### Foco inicial em telas com input principal

Ao entrar em telas com campo principal de digitação, o foco é aplicado automaticamente quando apropriado:

- criação/edição (`ProductForm`): campo título;
- catálogo (`ProductSearch`): campo de busca visível (mobile ou desktop), via prop `autofocus`.

Implementação: composable `useInitialFocus` (`ref`/`id` + `onMounted`/`nextTick`), preservando foco já escolhido pelo usuário e ignorando elementos ocultos.

### Favoritos e controles

- `FavoriteButton`: teclado, `aria-pressed` coerente com a store e `aria-label` (“Adicionar/Remover produto dos favoritos”);
- Header: Favoritos na nav (coração + texto + contador em fluxo flexível no botão, badge após “Favoritos”), com estado ativo em pill (Light/Dark); Novo Produto como CTA separado na mesma nav;
- `ThemeToggle` no Footer (não no Header);
- ícones decorativos com `aria-hidden="true"`;
- breadcrumbs com `aria-label="Trilha de navegação"`;
- estados `LoadingState` / `EmptyState` / `ErrorState` com `role` adequado e ações focáveis.

---

# 49. Componentes Principais

A estrutura deverá considerar componentes reutilizáveis como:

    AppHeader
    ThemeToggle
    AppFooter
    ProductCard
    ProductGrid
    ProductSearch
    ProductFilters
    ProductSort
    ProductPagination
    ProductDetails
    FavoriteButton
    ProductForm
    LoadingState
    EmptyState
    ErrorState

### Status

- Ordenação por preço, nome e avaliação: apresentada por `ProductSort`, integrado em `ProductFilters`.
- `ProductSort` existe em `src/components/products/ProductSort.vue` (variantes `select` e `radiogroup`).
- A lógica de ordenação permanece em `useProductListControls`.
- Tema Light/Dark: `ThemeToggle` no Footer; estado em `themeStore`.

A criação de novos componentes deverá ocorrer conforme necessidade real.

---

# 50. Componentização

A aplicação deverá seguir uma organização por domínio ou funcionalidade.

Exemplo conceitual:

    products/
        components/
        views/
        services/
        types/

    favorites/
        components/
        stores/

Os componentes deverão possuir responsabilidades claras.

---

# 51. Reutilização do Formulário

O mesmo componente `ProductForm` deverá ser utilizado para:

- criação;
- edição.

A diferença entre os fluxos deverá ser controlada através das propriedades e do contexto da página, evitando duplicação.

---

# 52. Estados da Interface

Cada tela deverá considerar pelo menos:

- loading;
- sucesso;
- erro;
- vazio;
- interação;
- disabled quando aplicável.

Não deverá existir uma única representação para todos esses estados.

---

# 53. Navegação

A navegação deverá ser realizada utilizando Vue Router.

Os componentes não deverão manipular URLs manualmente.

As rotas deverão ser centralizadas e organizadas.

---

# 54. Estado Global

O Pinia deverá ser utilizado para estados que precisam ser compartilhados entre diferentes partes da aplicação.

O estado de favoritos será global.

Estados temporários específicos de uma tela deverão permanecer locais sempre que possível.

Não deverá existir uma store global para todo estado da aplicação sem necessidade.

---

# 55. Performance

A interface deverá evitar:

- requisições desnecessárias;
- processamento a cada caractere sem debounce;
- renderização de componentes desnecessariamente complexos;
- armazenamento duplicado de produtos.

A busca deverá utilizar debounce.

A lista deverá utilizar paginação.

---

# 56. Critérios de Aceite da UI

A interface será considerada adequada quando:

- [x] Produtos podem ser listados.
- [x] Busca está disponível.
- [x] Busca possui debounce.
- [x] Filtro por categoria está disponível.
- [x] Ordenação por preço está disponível.
- [x] Ordenação por nome (A–Z / Z–A) está disponível.
- [x] Ordenação por avaliação está disponível.
- [x] Footer do layout está implementado.
- [x] Tema Light/Dark Mode está implementado e persistido.
- [x] Paginação está disponível.
- [x] ProductCard está implementado.
- [x] Favoritos funcionam.
- [x] Favoritos utilizam Pinia.
- [x] Favoritos persistem em localStorage.
- [x] Página de detalhes está implementada.
- [x] Página de favoritos está implementada.
- [x] Criação de produto está implementada.
- [x] Edição de produto está implementada.
- [x] Formulários utilizam vee-validate.
- [x] Validações utilizam Yup.
- [x] POST está integrado.
- [x] PUT está integrado.
- [x] Toasts de sucesso e erro estão implementados.
- [x] Estados de loading estão implementados.
- [x] Estados de erro estão implementados.
- [x] Estados vazios estão implementados.
- [x] Interface é responsiva a partir de 360px (desafio) e validada também a partir de 320px (alvo interno).
- [x] Componentes PrimeVue são utilizados.
- [x] TailwindCSS é utilizado para estilização e layout.
- [x] Interface possui navegação acessível por teclado.
- [x] Componentes reutilizáveis foram priorizados.

---

# 57. Status do Documento

**Status:** Concluído (Fase 11 — auditoria documental)

**Versão:** 1.15

**Última atualização:** 2026-08-13

### Nota — melhoria bônus i18n

Seletor de idioma no Footer (pt-BR / es / en), textos de UI via `vue-i18n`, categorias localizadas na apresentação. Título e descrição dos produtos permanecem no idioma original da FakeStoreAPI. ThemeToggle permanece no Footer.

### Nota — refinamentos de feedback e Favoritos (2026-08-13)

- Estado inválido: placeholder neutro; destaque na borda e na mensagem de erro; texto digitado sem vermelho indevido.
- Contador de Favoritos no Header: associado ao texto via `inline-flex` (não ancorado no ícone com `absolute`).

### Nota — Fase 11

Auditoria final de documentação concluída: README e SDD alinhados ao código, ao desafio (360px+) e ao alvo interno (320px+).