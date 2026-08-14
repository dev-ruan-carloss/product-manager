# Plano de Implementação — Product Management

## 1. Objetivo

Este documento define a ordem de implementação do projeto, reduzindo retrabalho e garantindo que os requisitos definidos nos documentos anteriores sejam implementados de forma incremental.

A implementação deverá seguir a sequência:

    Fundação
        ↓
    API + tipos
        ↓
    Estado de favoritos
        ↓
    Catálogo de produtos
        ↓
    Detalhes do produto
        ↓
    Página de favoritos
        ↓
    Criação de produto
        ↓
    Edição de produto
        ↓
    Responsividade + acessibilidade
        ↓
    QA final
        ↓
    Documentação e entrega

---

# 2. Estratégia

A implementação será realizada em pequenas etapas funcionais.

Cada etapa deverá:

- possuir escopo definido;
- ser validada antes da próxima;
- evitar alterações desnecessárias;
- manter o projeto executável;
- resultar em um commit atômico quando fizer sentido.

A implementação não deverá tentar construir todas as funcionalidades simultaneamente.

Ao concluir cada fase, a documentação SDD deverá ser atualizada conforme o processo definido neste documento.

---

# 3. Fase 1 — Fundação do projeto

### Objetivo

Preparar a estrutura base da aplicação, dependências e infraestrutura mínima de navegação e estado.

### Status

**CONCLUÍDA**

### Tarefas

- [x] Criar projeto Vue 3 com Vite.
- [x] Configurar TypeScript.
- [x] Habilitar TypeScript strict.
- [x] Configurar Composition API.
- [x] Configurar `script setup`.
- [x] Criar organização inicial de pastas por responsabilidade.
- [x] Configurar Vue Router.
- [x] Associar rotas principais às Views iniciais.
- [x] Configurar Pinia.
- [x] Instalar PrimeVue.
- [x] Configurar TailwindCSS.
- [x] Instalar Axios.
- [x] Instalar vee-validate.
- [x] Instalar Yup.
- [x] Configurar ESLint.
- [x] Configurar Prettier quando necessário.
- [x] Validar TypeScript.
- [x] Validar lint.
- [x] Validar build inicial.

### Resultado esperado

Projeto iniciado e executando localmente, com rotas e infraestrutura configuradas, ainda sem funcionalidades de negócio completas.

---

# 4. Fase 2 — API e tipos

### Objetivo

Centralizar a comunicação com a FakeStoreAPI e garantir tipagem consistente entre API, stores e componentes.

### Status

**CONCLUÍDA**

### Tarefas

- [x] Criar instância Axios em `config/api.ts`.
- [x] Configurar URL base.
- [x] Configurar tratamento básico de erros.
- [x] Criar serviço de produtos.
- [x] Criar métodos para listar produtos.
- [x] Criar método para buscar produto por ID.
- [x] Criar método para buscar categorias.
- [x] Criar método POST.
- [x] Criar método PUT.
- [x] Criar tipo `Product`.
- [x] Criar tipo para avaliação.
- [x] Criar tipo para categoria.
- [x] Criar tipos para criação.
- [x] Criar tipos para atualização.
- [x] Criar tipos auxiliares necessários para a API.
- [x] Tipar respostas da API.
- [x] Evitar utilização de `any`.
- [x] Garantir compatibilidade com TypeScript strict.

### Resultado esperado

Camada de API e contratos TypeScript prontos para consumo pelas próximas fases.

---

# 5. Fase 3 — Estado de favoritos

### Objetivo

Implementar o gerenciamento global de favoritos com Pinia e persistência em `localStorage`.

### Status

**CONCLUÍDA**

### Store principal

`useFavoritesStore`

### Tarefas

- [x] Criar store de favoritos.
- [x] Armazenar IDs favoritos.
- [x] Implementar adicionar favorito.
- [x] Implementar remover favorito.
- [x] Implementar verificação de favorito.
- [x] Implementar contador derivado do estado.
- [x] Persistir em localStorage.
- [x] Restaurar estado ao iniciar a store.
- [x] Tratar conteúdo inválido no localStorage sem quebrar a aplicação.

A store deverá permanecer focada exclusivamente no estado de favoritos.

Esta fase **não** inclui componentes visuais nem a página `/favoritos`.

### Resultado esperado

Estado de favoritos disponível globalmente, persistente e tipado, pronto para consumo pelas telas.

---

# 6. Fase 4 — Catálogo de produtos

### Objetivo

Implementar a listagem principal de produtos e os componentes reutilizáveis necessários para o catálogo.

### Status

**CONCLUÍDA**

### Componentes previstos

- [x] Header.
- [x] Footer (estrutural via `AppFooter` + `DefaultLayout`; concluído após o fechamento inicial da fase).
- [x] ProductCard.
- [x] ProductGrid.
- [x] FavoriteButton.
- [x] LoadingState.
- [x] EmptyState.
- [x] ErrorState.
- [x] Controles de paginação.

### Tarefas da listagem

- [x] Buscar produtos através da API.
- [x] Apresentar loading.
- [x] Apresentar produtos.
- [x] Apresentar estado vazio.
- [x] Apresentar estado de erro.
- [x] Implementar busca.
- [x] Implementar debounce.
- [x] Implementar filtro por categoria.
- [x] Implementar ordenação por preço.
- [x] Implementar ordenação por nome (A–Z / Z–A).
- [x] Implementar ordenação por avaliação.
- [x] Implementar paginação.
- [x] Integrar favoritar/desfavoritar na listagem via store existente.

PrimeVue deverá ser utilizado sempre que houver componente adequado.

TailwindCSS deverá ser utilizado para composição e responsividade.

### Validações da fase

- [x] Rota `/produtos` funcional.
- [x] Listagem de produtos via `productService`.
- [x] Listagem de categorias.
- [x] Reset da paginação ao alterar controles.
- [x] Layout responsivo da listagem.
- [x] Componentização da tela.
- [x] Integração com PrimeVue.
- [x] Integração com TailwindCSS.
- [x] Validar TypeScript (type-check).
- [x] Validar lint.
- [x] Validar build.

### Resultado esperado

Usuário consegue navegar pelo catálogo e encontrar produtos utilizando os controles definidos no desafio.

### Pendência conhecida (fora do fechamento da Fase 4)

Itens de ordenação por nome, por avaliação e o componente `ProductSort` foram concluídos posteriormente (ver decisão técnica correspondente).

**Observação:** `GET /products/category/:category` **não** é pendência. O endpoint existe na FakeStoreAPI, porém **não é utilizado** e **não é obrigatório**. O filtro por categoria (RF-003) está **CONCLUÍDO** via `GET /products` + filtragem no frontend.

---

# 7. Fase 5 — Detalhes do produto

### Objetivo

Implementar a visualização individual de um produto.

### Status

**CONCLUÍDA**

### Tarefas

- [x] Obter ID através da rota.
- [x] Tratar o parâmetro `id` de forma segura antes do consumo.
- [x] Buscar produto pela API via `productService.getProductById`.
- [x] Apresentar loading.
- [x] Apresentar dados do produto (imagem, título, categoria, preço, descrição, avaliação e quantidade de avaliações).
- [x] Implementar favoritar/desfavoritar na página de detalhes via `useFavoritesStore`.
- [x] Reutilizar `FavoriteButton` e persistência existente da store.
- [x] Implementar ação de voltar para `/produtos`.
- [x] Tratar produto inexistente.
- [x] Tratar erro da API com retry.
- [x] Layout responsivo da tela de detalhes.
- [x] Acessibilidade básica da tela de detalhes.
- [x] Implementar acesso à edição (concluído na Fase 8 — link "Editar produto" em `ProductDetails`).

### Arquivos da implementação

Criados:

- `src/composables/useProductDetails.ts`
- `src/utils/parseProductId.ts`
- `src/components/products/ProductDetails.vue`

Modificados:

- `src/views/ProdutoDetalhesView.vue`
- `src/components/products/ProductDetails.vue` (ação de edição adicionada na Fase 8)

### Componentes e utilitários reutilizados

- `FavoriteButton`
- `ErrorState`
- `EmptyState`
- `AppHeader` (via `DefaultLayout`)
- `formatPrice`
- Skeleton do PrimeVue para o estado de loading

`LoadingState` do catálogo não foi reutilizado nesta fase (específico demais para o grid da listagem).

### API utilizada

`GET /products/:id` através de `productService.getProductById(id)`.

### Referência visual

A tela utilizou `public/detalhe-produtos.png` como referência visual, priorizando o SDD e o modelo `Product` quando houve conflito.

### Validações da fase

- [x] Rota `/produtos/:id` funcional.
- [x] Leitura segura do parâmetro `id`.
- [x] Busca individual via `productService`.
- [x] Estados de loading, erro e produto não encontrado.
- [x] Retry em caso de erro da API.
- [x] Favoritar/desfavoritar com persistência na store.
- [x] Formatação de preço via `formatPrice`.
- [x] Layout responsivo.
- [x] Acessibilidade básica.
- [x] Validar TypeScript (type-check).
- [x] Validar lint.
- [x] Validar build.

### Divergências registradas

1. **Acesso à edição:** adiado na Fase 4 e concluído na Fase 8 com o link "Editar produto" em `ProductDetails`.
2. **Modelo da FakeStoreAPI:** elementos da referência visual (galeria, estoque, tipo/material, reviews detalhadas e metadados adicionais) não foram implementados por não fazerem parte do modelo `Product` utilizado.
3. **Preço:** a referência visual utiliza `$`; a aplicação formata o número da API com `formatPrice` conforme o locale (`pt-BR`/`BRL`, `en`/`USD`, `es`/`EUR`).
4. **Produto inexistente:** o contrato considera o cenário de `404`, porém a FakeStoreAPI pode retornar `200` com corpo vazio; a implementação trata ambos os cenários.

Essas divergências não foram transformadas em novos requisitos.

### Resultado esperado

Usuário consegue abrir os detalhes de um produto, visualizar suas informações, favoritar/desfavoritar e retornar ao catálogo, com estados de loading, erro e não encontrado tratados. Ação de edição disponível após a Fase 8.

---

# 8. Fase 6 — Página de favoritos

### Objetivo

Implementar a experiência visual completa de favoritos.

### Status

**CONCLUÍDA**

### Tarefas

- [x] Implementar a página `/favoritos`.
- [x] Utilizar a store Pinia existente (`useFavoritesStore`).
- [x] Recuperar IDs persistidos via `favoriteProductIds`.
- [x] Obter dados dos produtos via `productService.getProducts()` e filtrar pelos IDs favoritos.
- [x] Reutilizar `ProductCard` (via `ProductGrid`).
- [x] Atualizar lista ao desfavoritar (remoção imediata na interface).
- [x] Implementar estado de loading com `LoadingState`.
- [x] Implementar estado de erro com `ErrorState` e retry.
- [x] Implementar estado vazio com `EmptyState` ("Você ainda não possui favoritos.") e ação para `/produtos`.
- [x] Tratar produtos indisponíveis na API sem quebrar a página.
- [x] Implementar contador no Header via `favoritesCount`.
- [x] Navegação para detalhes através de `/produtos/:id`.
- [x] Layout responsivo alinhado ao catálogo.
- [x] Acessibilidade básica da página de favoritos.
- [x] Utilizar `public/tela-favoritos.png` como referência visual.

### Arquivos da implementação

Criado:

- `src/composables/useFavoriteProducts.ts`

Modificado:

- `src/views/FavoritosView.vue`

Nenhum componente visual novo foi criado nesta fase.

### Componentes reutilizados

- `ProductGrid`
- `ProductCard`
- `FavoriteButton`
- `LoadingState`
- `EmptyState`
- `ErrorState`
- `AppHeader`
- `DefaultLayout`

### Store e persistência

- `useFavoritesStore` permanece a fonte única dos IDs favoritos.
- A persistência continua sendo feita pela store através do `localStorage`.
- Objetos completos de produtos não são armazenados na store.
- O desfavoritar atualiza a interface imediatamente.
- O contador utiliza `favoritesCount`.

Não houve nova estratégia de persistência nesta fase.

### API utilizada

`productService.getProducts()` com filtro pelos IDs em `favoriteProductIds`.

Foi adotada uma única requisição para carregar o catálogo e filtrar os favoritos, evitando múltiplas chamadas `getProductById`.

Não houve alteração no contrato da API.

### Produtos indisponíveis

Decisão adotada na implementação (sem transformar em novo requisito global):

- IDs existentes na store, mas sem correspondência na API, não quebram a página.
- IDs órfãos não são removidos automaticamente da store; permanecem até remoção explícita pelo usuário.
- Quando existem produtos disponíveis e indisponíveis, é exibido um aviso discreto.
- Quando nenhum favorito está disponível na API, é apresentado um estado adequado.

### Estados da interface

#### Loading

Utiliza `LoadingState` com skeleton seguindo o padrão do catálogo.

#### Erro

Utiliza `ErrorState` com mensagem amigável e retry.

#### Estado vazio

Utiliza `EmptyState` com:

"Você ainda não possui favoritos."

e ação para retornar para `/produtos`.

### Navegação

- A página utiliza a rota `/favoritos`.
- Os produtos utilizam `ProductCard`.
- A navegação para detalhes ocorre através de `/produtos/:id`.

### Referência visual

A tela utilizou `public/tela-favoritos.png` como referência visual.

A referência orientou principalmente:

- breadcrumb;
- título;
- subtítulo;
- contador;
- grid;
- hierarquia visual.

Elementos presentes na referência e **não** implementados por não fazerem parte do SDD:

- sidebar de Resumo/Dica;
- ordenação;
- paginação;
- botão "Remover dos favoritos" específico no card;
- avatar;
- outros elementos exclusivamente presentes no mockup.

Esses elementos não foram tratados como funcionalidades pendentes.

### Responsividade

- Utilização do mesmo grid do catálogo.
- Grid fluido com `auto-fill` + `minmax(min(100%, 16rem), 1fr)` (1 a N colunas conforme espaço útil).
- Container `max-w-7xl`.
- Paddings alinhados às demais views (`px-3` no mobile, `sm:px-6` em diante).
- Ausência de overflow horizontal.

### Acessibilidade

- Breadcrumb com `aria-label`.
- Estados com `role`/`aria-live` nos componentes reutilizados.
- Botão de favorito semântico.
- Imagens com `alt`.
- Foco visível.

Não foi realizada auditoria WCAG completa nesta fase.

### Problema corrigido durante a fase

O `watch` inicialmente recarregava a API ao desfavoritar quando existiam IDs indisponíveis.

Foi corrigido para realizar novas buscas somente quando existem IDs novos ausentes do catálogo em cache.

### Decisão técnica

A página utiliza `getProducts()` + filtro pelos IDs favoritos, realizando uma única requisição em vez de executar uma requisição `getProductById` para cada favorito.

IDs órfãos permanecem na store até que o usuário os remova explicitamente.

Essa decisão permanece registrada neste plano; `docs/03-decisoes-tecnicas.md` não foi alterado nesta sincronização.

### Validações da fase

- [x] Rota `/favoritos` funcional.
- [x] Listagem dos produtos favoritados.
- [x] Integração com `useFavoritesStore`.
- [x] Integração com `productService`.
- [x] Desfavoritar com remoção imediata da lista.
- [x] Persistência mantida pela store existente.
- [x] Contador de favoritos no Header.
- [x] Navegação para `/produtos/:id`.
- [x] Loading, erro com retry e estado vazio.
- [x] Tratamento de produtos indisponíveis.
- [x] Layout responsivo.
- [x] Acessibilidade básica.
- [x] Validar TypeScript (type-check).
- [x] Validar lint.
- [x] Validar build.

Vitest permanece na fase de QA definida no planejamento.

### Resultado esperado

Usuário consegue visualizar os produtos favoritados, desfavoritar diretamente na página, acessar os detalhes e retornar ao catálogo, com estados de loading, erro e vazio tratados, mantendo a store existente como fonte de verdade dos IDs.

---

# 9. Fase 7 — Criação de produto

### Objetivo

Implementar o formulário reutilizável e o fluxo de criação em `/produtos/novo`.

### Status

**CONCLUÍDA**

### Componente

`ProductForm` (`src/components/products/ProductForm.vue`)

### Tarefas do formulário

- [x] Criar estrutura do formulário.
- [x] Integrar vee-validate.
- [x] Criar schema Yup.
- [x] Validar título.
- [x] Validar preço.
- [x] Validar descrição.
- [x] Validar categoria.
- [x] Validar URL da imagem.
- [x] Apresentar mensagens de erro.
- [x] Implementar estado de envio.
- [x] Evitar múltiplos envios.

### Tarefas da criação

- [x] Integrar ProductForm em `/produtos/novo`.
- [x] Carregar categorias.
- [x] Validar formulário.
- [x] Executar POST.
- [x] Apresentar Toast de sucesso.
- [x] Apresentar Toast de erro.
- [x] Evitar perda dos dados em caso de erro.
- [x] Navegar após sucesso.

### Arquivos da implementação

Criados:

- `src/components/products/ProductForm.vue`
- `src/schemas/productFormSchema.ts`
- `src/types/productForm.ts`

Modificados:

- `src/views/ProdutoCriarView.vue`
- `src/main.ts` (registro do `ToastService`)
- `src/layouts/DefaultLayout.vue` (componente `Toast`)

### Componentes reutilizados

- `AppHeader`
- `DefaultLayout`
- PrimeVue: `InputText`, `InputGroup` / `InputGroupAddon`, `Select`, `Textarea`, `Button`, `Toast`
- `formatPrice` (prévia e demais telas); `formatPriceInput` / `parsePriceInput` / `getCurrencyAffix` no campo de preço

### Validação

Schema centralizado em `src/schemas/productFormSchema.ts` com Yup + `@vee-validate/yup` (`toTypedSchema`).

Regras:

| Campo | Regras |
|---|---|
| Título | obrigatório; trim; conteúdo válido; máximo 150 caracteres |
| Preço | obrigatório; numérico; maior que zero; não negativo; 2 casas decimais; máximo 999.999,99 |
| Descrição | obrigatória; trim; máximo 1000 caracteres |
| Categoria | obrigatória; valor selecionado |
| URL da imagem | obrigatória; URL válida |

Mensagens de erro apresentadas próximas aos campos. Validação ocorre antes do `POST`. Limites em `src/schemas/productFormLimits.ts`. `maxlength` e a restrição do input de preço são UX; o Yup permanece a fonte da regra.

### Endpoint utilizado

`POST /products` via `productService.createProduct`.

### Payload

`ProductCreatePayload`:

```ts
{
  title: string
  price: number
  description: string
  category: string
  image: string
}
```

### Loading

Durante o envio:

- botão "Salvar Produto" com estado `loading`;
- botões desabilitados;
- campos desabilitados;
- submissões duplicadas impedidas por `isSubmitting`.

### Tratamento de erro

- Toast de erro: **Não foi possível criar o produto.**
- Dados do formulário preservados.
- Sem redirecionamento em falha.
- Erros da API chegam como `AppError` via interceptor em `config/api.ts`.
- Mensagens técnicas não são exibidas ao usuário.

### Tratamento de sucesso

- Toast: **Produto criado com sucesso.**
- Navegação para `/produtos`.

### Cancelar

Botão "Cancelar" navega para `/produtos`, sem envio.

### Categorias

Carregadas com `productService.getCategories()` ao montar a página. Em falha, Toast de erro e ação de retry no formulário.

### Referência visual

Utilizada `public/cadastro-produtos.png` como referência de estrutura, hierarquia, espaçamento e ações.

### Divergências registradas

1. **Editor rich text:** presente no mockup; não implementado (SDD não exige; usa `Textarea`).
2. **Limite mínimo de 10 caracteres na descrição:** presente no mockup; não implementado (SDD exige obrigatoriedade, não comprimento mínimo). O máximo de 1000 caracteres foi adotado na decisão 35.20.
3. **Preço no mockup em USD:** a aplicação formata o valor numérico da API conforme o locale atual (`formatPrice`), não o símbolo do mockup.
4. **Navegação pós-sucesso:** SDD pede "página apropriada"; decisão de implementação: `/produtos`.
5. **Edição:** concluída na Fase 8 com reuso do `ProductForm`.

Essas divergências não foram transformadas em novos requisitos.

### Validações técnicas

- [x] `npm run type-check`
- [x] `npm run lint`
- [x] `npm run build`

### Resultado esperado

Usuário consegue abrir `/produtos/novo`, preencher o formulário, validar os campos, criar o produto via API com feedback de loading/sucesso/erro e retornar ao catálogo após sucesso ou cancelamento.

---

# 10. Fase 8 — Edição de produto

### Objetivo

Implementar o fluxo de edição em `/produtos/:id/editar`.

### Status

**CONCLUÍDA**

### Tarefas

- [x] Obter ID da rota.
- [x] Buscar produto.
- [x] Preencher ProductForm.
- [x] Permitir alteração.
- [x] Validar formulário.
- [x] Executar PUT.
- [x] Apresentar Toast de sucesso.
- [x] Apresentar Toast de erro.
- [x] Tratar produto inexistente.
- [x] Navegar após sucesso.

### Arquivos da implementação

Criados / reescritos:

- `src/views/ProdutoEditarView.vue`

Modificados:

- `src/components/products/ProductForm.vue` (prop `submitLabel` para reuso criação/edição)
- `src/types/productForm.ts` (`toProductFormData`)
- `src/components/products/ProductDetails.vue` (acesso à edição)

### Componentes e utilitários reutilizados

- `ProductForm`
- `productFormSchema` (Yup + vee-validate)
- `useProductDetails`
- `parseProductId`
- `productService.getProductById` / `updateProduct` / `getCategories`
- `ErrorState` / `EmptyState`
- Toast do PrimeVue (via `DefaultLayout`)
- Skeleton do PrimeVue para loading do carregamento inicial

### Carregamento do produto

- ID obtido com `parseProductId(route.params.id)`.
- Busca via `useProductDetails` → `productService.getProductById`.
- Formulário **não** é exibido durante o loading (skeleton no lugar).
- Após sucesso do GET, `toProductFormData` preenche `initialValues` e o `ProductForm` é montado com `:key="product.id"`.

### Validação

Reutiliza `src/schemas/productFormSchema.ts` — mesmas regras da criação (RF-009). Sem schema duplicado.

### Endpoints

- `GET /products/:id` — carregamento inicial
- `PUT /products/:id` — atualização via `productService.updateProduct`

### Payload

`ProductUpdatePayload`:

```ts
{
  title: string
  price: number
  description: string
  category: string
  image: string
}
```

PUT não é enviado quando o ID da rota é inválido (`productId === null`).

### Loading

- Carregamento inicial: skeleton com `aria-busy`.
- Durante o PUT: botão "Salvar Alterações" em loading; campos e cancelar desabilitados; envio duplicado impedido por `isSubmitting`.

### Tratamento de erro

- ID inválido / produto inexistente / resposta inválida: `EmptyState` "Produto não encontrado." com retorno ao catálogo.
- Falha de GET (exceto 404): `ErrorState` com retry.
- Falha de PUT: Toast **Não foi possível atualizar o produto.**; dados preservados; sem redirecionamento.
- Mensagens técnicas da API não são exibidas.

### Tratamento de sucesso

- Toast: **Produto atualizado com sucesso.**
- Navegação para `/produtos` (mesma decisão da criação: Fake Store API simula escrita).

### Cancelar

Botão "Cancelar" navega para `/produtos`, sem envio.

### Acesso à edição

Link "Editar produto" na página de detalhes (`ProductDetails`) para `/produtos/:id/editar`.

### Compatibilidade com a criação

`/produtos/novo` permanece funcional: `ProductForm` com `submitLabel` padrão `"Salvar Produto"`, mesmo schema, mesmo POST e Toasts.

### Referência visual

Utilizada `public/editar-produto.png` como referência de hierarquia e layout. Itens só do mockup e fora do SDD **não** implementados (exclusão, rich text, painel "Detalhes atuais"). O contador de caracteres da descrição/título foi adotado com o máximo da decisão 35.20 (sem mínimo de 10).

### Divergências registradas

1. **Excluir produto:** presente no mockup; **não implementado** e permanece como item pendente de decisão de escopo (não deve ser tratado como descartado automaticamente).
2. **Editor rich text:** presente no mockup; não exigido pelo SDD. O limite máximo de caracteres da descrição (1000) foi adotado na decisão 35.20, sem mínimo de 10.
3. **Painel "Detalhes atuais" e rating na prévia:** presentes no mockup; não previstos na especificação de UI do formulário reutilizado.
4. **Navegação pós-sucesso:** SDD pede "página apropriada"; decisão: `/produtos`, alinhada à Fase 7.
5. **Label do botão:** mockup usa "Salvar Alterações"; implementado via prop `submitLabel` (criação mantém "Salvar Produto").

### Validações técnicas

- [x] `npm run type-check`
- [x] `npm run lint`
- [x] `npm run build`

### Resultado esperado

Usuário consegue abrir `/produtos/:id/editar` a partir dos detalhes, carregar o produto, editar com validação, enviar PUT com feedback de loading/sucesso/erro e retornar ao catálogo após sucesso ou cancelamento, sem quebrar a criação.

---

# 11. Fase 9 — Responsividade e acessibilidade

### Objetivo

Garantir funcionamento adequado a partir de 360px e atender critérios básicos de acessibilidade.

### Tema (concluído fora do escopo completo desta fase)

- [x] Implementar Light/Dark Mode global.
- [x] Persistência do tema em `localStorage`.
- [x] Controle de tema no Footer (`ThemeToggle`).
- [x] Compatibilidade PrimeVue + TailwindCSS com seletor `.dark`.
- [x] Adaptar páginas existentes sem alterar lógica de negócio.

### Responsividade

- [x] Validar 320px.
- [x] Validar 360px.
- [x] Validar mobile.
- [x] Validar tablet.
- [x] Validar desktop.
- [x] Ajustar grid.
- [x] Ajustar navegação.
- [x] Ajustar filtros.
- [x] Ajustar formulários.
- [x] Validar áreas de toque.
- [x] Garantir ausência de overflow horizontal.
- [x] Evitar espaçamento em branco excessivo (layout compacto + wrap).

### Acessibilidade

- [x] Validar labels dos campos.
- [x] Validar textos alternativos.
- [x] Validar nomes acessíveis dos botões.
- [x] Validar navegação por teclado.
- [x] Validar foco.
- [x] Validar mensagens de erro.
- [x] Verificar uso semântico do HTML.
- [x] Garantir que estados não dependam somente de cor.

### Implementação a11y (registro)

- Região contextual única por campo no `ProductForm` (texto auxiliar **ou** erro).
- `aria-invalid` / `aria-describedby` / `aria-required` alinhados ao estado real do campo.
- Foco no primeiro campo inválido após tentativa de envio.
- `FavoriteButton` com labels e `aria-pressed` coerentes.
- Foco visível em Light/Dark (`:focus-visible` + controles PrimeVue).
- Semântica de landmarks, breadcrumbs, paginação (`nav`) e estados dinâmicos sem ruído excessivo de `aria-live`.
- Correção de CTA de criação no Header: “Novo Produto” como `RouterLink` na nav (separado visualmente de Produtos/Favoritos); `ThemeToggle` no Footer.

### Validações técnicas (parte a11y)

- [x] `npm run type-check`
- [x] `npm run lint`
- [x] `npm run build`

---

# 12. Fase 10 — QA final

### Objetivo

Consolidar qualidade técnica, estados de interface, testes manuais e, quando aplicável, testes automatizados.

### Status

**CONCLUÍDA**

### Tratamento de estados

#### Loading

- [x] Listagem.
- [x] Detalhes.
- [x] Edição.
- [x] Formulário.

#### Erro

- [x] Listagem.
- [x] Detalhes.
- [x] Criação.
- [x] Edição.

#### Vazio

- [x] Resultados sem correspondência.
- [x] Favoritos vazios.

### Revisão técnica

- [x] Remover `any` injustificado.
- [x] Verificar TypeScript strict.
- [x] Remover código duplicado.
- [x] Verificar responsabilidades dos componentes.
- [x] Verificar responsabilidades das stores.
- [x] Verificar services.
- [x] Verificar imports.
- [x] Verificar nomes.
- [x] Verificar componentes não utilizados.
- [x] Executar lint.
- [x] Executar build.
- [x] Corrigir warnings relevantes.
- [x] Verificar console.
- [x] Verificar erros de runtime.

### Testes manuais

#### Produtos

- [x] Listar produtos.
- [x] Pesquisar produto.
- [x] Aplicar debounce.
- [x] Filtrar categoria.
- [x] Ordenar menor preço.
- [x] Ordenar maior preço.
- [x] Ordenar nome A–Z.
- [x] Ordenar nome Z–A.
- [x] Navegar pela paginação.

#### Detalhes

- [x] Abrir produto.
- [x] Produto inexistente.
- [x] Favoritar.
- [x] Desfavoritar.

#### Favoritos

- [x] Adicionar favorito.
- [x] Remover favorito.
- [x] Recarregar página.
- [x] Confirmar persistência no localStorage.
- [x] Acessar `/favoritos`.
- [x] Validar estado vazio.

#### Criação

- [x] Abrir formulário.
- [x] Validar campos vazios.
- [x] Validar preço inválido.
- [x] Validar URL inválida.
- [x] Criar produto.
- [x] Validar sucesso.
- [x] Validar erro.

#### Edição

- [x] Abrir edição.
- [x] Carregar dados.
- [x] Validar campos.
- [x] Atualizar produto.
- [x] Validar sucesso.
- [x] Validar erro.

### Revisão visual

- [x] Consistência dos componentes.
- [x] Espaçamentos.
- [x] Tipografia.
- [x] Cores.
- [x] Estados de interação.
- [x] Responsividade.
- [x] Alinhamento.
- [x] Overflow.
- [x] Loading.
- [x] Empty states.
- [x] Mensagens de erro.
- [x] Toasts.

### Testes automatizados

- [x] Configurar Vitest e Vue Test Utils na fase de qualidade, quando necessário.
- [x] Cobrir regras críticas (stores, validações e fluxos relevantes).

### Resultado do QA (2026-08-11)

#### API

- Catálogo alimentado exclusivamente pela FakeStoreAPI via `ProdutosView` → `useProductsCatalog` → `productService` → Axios.
- Endpoints confirmados: `GET /products`, `GET /products/categories`, `GET /products/:id`, `POST /products`, `PUT /products/:id`.
- Sem fallback silencioso para mocks/dados fictícios.
- Produto inexistente (`200` com corpo vazio) tratado como não encontrado.

#### Correção realizada no QA

- Contador de favoritos no Header: badge reposicionado estruturalmente — de offset absoluto relativo ao ícone (`-right-20` / `-right-2`) para fluxo `inline-flex` no link (`ícone + Favoritos + contador`).

#### Refinamento posterior (2026-08-13)

- Hierarquia visual de inputs inválidos: placeholder neutro; borda e mensagem de erro com destaque; texto digitado sem vermelho indevido (preset Aura + `main.css`).
- Testes do Header/Form atualizados para estrutura e ARIA (sem asserts de `right-*`).

#### Validações técnicas

- Type-check OK.
- Lint OK.
- Build OK.
- Console sem erros relevantes; sem aviso `Invalid PrimeUI License` (PrimeVue `4.5.5` + `@primevue/themes` `4.5.4`).
- Responsividade sem overflow horizontal nos breakpoints 320–1920px nas rotas principais.
- Light/Dark Mode, Header, Footer, formulários, favoritos e CRUD validados.

#### Testes automatizados

- Vitest configurado em `vite.config.ts`.
- Scripts: `npm test`, `npm run test:watch`.
- Testes organizados em `tests/` (separados de `src/`), por responsabilidade: `components/`, `composables/`, `services/`, `stores/`, `schemas/`, `security/`, `utils/`, `views/` (+ `helpers/`, `i18n/` e `config/`).
- Cobertura crítica de domínio: favoritos, schema do formulário, filtros/ordenação/paginação, debounce, `parseProductId`, `formatPrice` e `productService`.
- Cobertura de componentes: AppHeader, AppFooter, FavoriteButton, ProductCard, ProductDetails, ProductImageZoom, ProductForm, ProductFilters, ProductSearch, ProductSort, ProductPagination, ProductGrid, EmptyState, ErrorState, ErrorBoundary, LoadingState, ThemeToggle e LocaleSelector.
- Estratégia de componentes: comportamento e acessibilidade observáveis (roles, aria-*, labels, emits), com Pinia + vue-i18n + Vue Router + PrimeVue via `tests/helpers/mountComponent.ts`.
- Também cobertos: `tests/config/` (normalização de erros Axios) e utilitários de apresentação de erro.
- Resultado atual: **343 testes** passando em **53 arquivos**.

---

# 13. Fase 11 — Documentação e entrega

### Objetivo

Consolidar a documentação final e garantir consistência entre código e SDD.

### Status

**CONCLUÍDA**

### README

O README deverá apresentar:

- objetivo do projeto;
- tecnologias utilizadas;
- pré-requisitos;
- instalação;
- execução local;
- estrutura do projeto;
- decisões relevantes;
- funcionalidades;
- limitações da FakeStoreAPI;
- comandos disponíveis;
- demo/deploy público;
- bônus e extras;
- o que faria diferente com mais tempo.

### Documentação SDD

- [x] Requisitos consistentes com o código.
- [x] Arquitetura consistente com o código.
- [x] Decisões técnicas atualizadas.
- [x] Contrato da API consistente.
- [x] Modelos de dados consistentes.
- [x] Especificação de UI consistente.
- [x] Plano de implementação atualizado.
- [x] Definição de pronto atendida.

### Entrega / deploy

- [x] README com link de produção: https://product-manager-eta-seven.vercel.app/
- [x] Fallback SPA na Vercel (`vercel.json`) validado (deep links `/produtos`, `/favoritos`, `/produtos/:id`, `/produtos/novo` retornam HTTP 200).
- [x] Validação técnica: `npm test`, `npm run type-check`, `npm run lint`, `npm run build`.

---

# 14. Ordem dos Commits

Os commits deverão ser pequenos e relacionados a uma única responsabilidade.

Exemplos:

    feat: inicializa projeto Vue

    feat: configura infraestrutura da aplicação

    feat: implementa servico de produtos

    feat: adiciona store de favoritos

    feat: implementa listagem de produtos

    feat: implementa busca e filtros de produtos

    feat: implementa detalhes do produto

    feat: implementa pagina de favoritos

    feat: implementa formulario de produto

    feat: implementa criacao de produto

    feat: implementa edicao de produto

    fix: ajusta responsividade dos produtos

    docs: atualiza documentacao do projeto

---

# 15. Regra de Implementação

Nenhuma funcionalidade deverá ser implementada sem que exista um requisito ou decisão correspondente na documentação.

Quando surgir uma necessidade não prevista:

1. identificar o motivo;
2. avaliar se faz parte do escopo;
3. atualizar a documentação quando necessário;
4. somente depois implementar.

Isso mantém a documentação e o código sincronizados.

---

# 16. Critério de Conclusão

A implementação será considerada concluída quando:

- [x] Todos os requisitos do desafio estiverem implementados.
- [x] Todas as rotas estiverem funcionando com suas funcionalidades.
- [x] Camada de API estiver implementada.
- [x] Busca estiver funcionando com debounce.
- [x] Filtro por categoria estiver funcionando.
- [x] Ordenação por preço estiver funcionando.
- [x] Ordenação por nome (A–Z / Z–A) estiver funcionando.
- [x] Ordenação por avaliação estiver funcionando.
- [x] Paginação estiver funcionando.
- [x] Favoritos estiverem gerenciados com Pinia.
- [x] Favoritos estiverem persistidos em localStorage.
- [x] Página de favoritos estiver funcionando.
- [x] Detalhes estiverem funcionando.
- [x] Criação estiver funcionando.
- [x] Edição estiver funcionando.
- [x] vee-validate estiver integrado aos formulários.
- [x] Yup estiver integrado aos formulários.
- [x] PrimeVue estiver configurado no projeto.
- [x] TailwindCSS estiver configurado no projeto.
- [x] Estados de loading, erro e vazio estiverem implementados nas telas.
- [x] Responsividade estiver validada a partir de 360px (desafio) e 320px (alvo interno).
- [x] Acessibilidade básica estiver validada.
- [x] Lint estiver passando.
- [x] Build estiver passando.
- [x] README estiver atualizado.
- [x] Documentação SDD estiver consistente com o código.

---

# 17. Processo de atualização do SDD

A documentação em `docs/` deve refletir o **estado real do código**, e não apenas o planejamento futuro.

Ao finalizar cada fase:

1. Implementar a fase conforme o escopo definido.
2. Executar as validações aplicáveis (TypeScript, lint, build e testes manuais relevantes).
3. Confirmar que os critérios de `08-definicao-de-pronto.md` foram atendidos para o escopo da fase.
4. Atualizar os checkboxes da fase correspondente neste documento (`07-plano-de-implementacao.md`).
5. Registrar decisões arquiteturais novas em `03-decisoes-tecnicas.md`, somente quando existirem.
6. Atualizar `04-contrato-api.md` somente quando houver alteração real no contrato.
7. Atualizar `05-modelos-de-dados.md` somente quando houver alteração real nos modelos.
8. Atualizar `06-especificacao-ui.md` somente quando houver alteração real na interface planejada.
9. Não alterar documentação apenas para gerar atividade.
10. Fazer o commit da implementação junto com as alterações documentais correspondentes quando fizer sentido.

### Regras adicionais

- Não marcar como concluído aquilo que apenas estiver planejado.
- Não marcar funcionalidades visuais como concluídas sem implementação validada.
- Não alterar requisitos, arquitetura ou contrato sem inconsistência comprovada ou decisão explícita.
- Em caso de divergência entre código e SDD, priorizar alinhar a documentação ao comportamento real ou registrar a decisão técnica correspondente antes de continuar.

---

# 18. Estado atual do projeto

Resumo do acompanhamento:

| Área | Status |
|---|---|
| Fundação | concluída |
| API + tipos | concluída |
| Favoritos (estado/persistência) | concluída |
| Catálogo | concluída (filtro por categoria, ordenação por preço/nome/avaliação e `ProductSort`) |
| Detalhes | concluída |
| Favoritos UI | concluída |
| Criação | concluída |
| Edição | concluída |
| Footer estrutural (`AppFooter` + `DefaultLayout`) | concluída |
| Tema Light/Dark Mode (`themeStore` + `ThemeToggle`) | concluída |
| Responsividade (Fase 9 — parte responsiva) | concluída |
| Acessibilidade (Fase 9 — parte a11y) | concluída |
| Fase 9 (completa) | concluída |
| QA (Fase 10) | concluída |
| Entrega (Fase 11) | concluída |
| Internacionalização (melhoria bônus) | concluída (`vue-i18n`, pt-BR/es/en, seletor no Footer; categorias localizadas) |
| Localização dinâmica de title/description (bônus) | removida — conteúdo dinâmico permanece no idioma original da API |
| Deploy público (Vercel) | concluído — https://product-manager-eta-seven.vercel.app/ (SPA rewrite validado) |

### Próxima fase

Nenhuma. Fase 11 concluída — projeto pronto para entrega ao recrutador.

### Nota — melhoria bônus (i18n)

Implementação opcional concluída sem alterar o status das Fases 1–10:

- `vue-i18n` com `pt-BR` (padrão), `es` e `en`;
- persistência `product-management:locale`;
- seletor no Footer ao lado do `ThemeToggle`;
- categorias traduzidas na apresentação;
- preço formatado conforme o locale (`formatPrice`: PT-BR/`BRL`, EN/`USD`, ES/`EUR`);
- conteúdo dinâmico de produtos (`title`/`description`) **não** é traduzido automaticamente — preserva a FakeStoreAPI;
- busca e ordenação por nome usam `product.title` original.

### Nota — formatação monetária (2026-08-13)

- Única regra de apresentação em `src/utils/formatPrice.ts`.
- Input de preço: valor numérico no formulário; símbolo em addon; texto editável sem `R$`/`$`/`€`.
- Troca de locale atualiza apresentação (catálogo, detalhes, cadastro, edição, preview) sem alterar o payload.

### Nota — Fase 11 (2026-08-13)

- Auditoria README × código × desafio × SDD concluída.
- Suíte atual: **343 testes** / 53 arquivos.
- Responsividade documentada de forma coerente: desafio **360px+**, alvo interno **320px+**.
- Deep links na Vercel retornam HTTP 200.

### Nota — catálogo da sessão (CREATE/UPDATE)

- FakeStoreAPI não persiste POST/PUT; o frontend aplica a resposta no estado de `useProductsCatalog`.
- Sem DELETE. Sem mock de catálogo.

---

# 19. Status do Documento

**Status:** Concluído

**Versão:** 1.21

**Última atualização:** 2026-08-13
