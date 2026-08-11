# Modelos de Dados — Product Management

## 1. Objetivo

Este documento define os modelos de dados utilizados pela aplicação Product Management.

O objetivo é estabelecer uma representação clara dos dados utilizados pelo frontend, separando:

- dados recebidos da API;
- dados enviados para a API;
- estados internos da aplicação;
- dados persistidos localmente;
- tipos utilizados pelos componentes.

Os modelos definidos neste documento deverão servir como referência para a implementação dos tipos TypeScript.

---

# 2. Princípios de Modelagem

Os modelos deverão seguir alguns princípios:

- representar claramente os dados utilizados pela aplicação;
- evitar duplicação desnecessária de tipos;
- manter os contratos externos separados dos estados internos quando necessário;
- evitar utilização de `any`;
- utilizar tipos específicos sempre que possível;
- não armazenar dados desnecessários no navegador;
- não misturar dados de apresentação com dados provenientes da API.

---

# 3. Entidades Principais

As principais entidades utilizadas pela aplicação serão:

- Produto;
- Avaliação;
- Categoria;
- Favorito.

A relação conceitual será:

    Produto
       ├── Categoria
       └── Avaliação

    Favorito
       └── referência ao Produto através do ID

---

# 4. Produto

O produto é a principal entidade da aplicação.

Ele representa um item disponibilizado pela Fake Store API.

## 4.1 — Estrutura

O modelo conceitual de produto será:

    Product
    ├── id: number
    ├── title: string
    ├── price: number
    ├── description: string
    ├── category: string
    ├── image: string
    └── rating: ProductRating

---

## 4.2 — Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `number` | Sim | Identificador único do produto |
| `title` | `string` | Sim | Nome do produto |
| `price` | `number` | Sim | Preço do produto |
| `description` | `string` | Sim | Descrição do produto |
| `category` | `string` | Sim | Categoria do produto |
| `image` | `string` | Sim | URL da imagem |
| `rating` | `ProductRating` | Sim | Informações de avaliação |

---

# 5. Identificador do Produto

O campo `id` será utilizado como identificador principal do produto dentro do frontend.

Esse identificador será utilizado para:

- acessar detalhes;
- editar;
- identificar favoritos;
- localizar produtos;
- comparar produtos;
- atualizar estados.

O ID recebido da API deverá ser tratado como único dentro do conjunto de produtos.

---

# 6. Avaliação

A avaliação representa a classificação recebida pelo produto.

## Estrutura

    ProductRating
    ├── rate: number
    └── count: number

## Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `rate` | `number` | Sim | Nota média do produto |
| `count` | `number` | Sim | Quantidade de avaliações |

A avaliação pertence ao produto e não deverá ser tratada como uma entidade independente na interface.

---

# 7. Categoria

Categoria representa a classificação de um produto.

No contrato atual da API, a categoria será representada como uma string.

Exemplo conceitual:

    category: string

Exemplos de categorias:

- `electronics`;
- `jewelery`;
- `men's clothing`;
- `women's clothing`.

---

# 8. Categoria como Tipo

Inicialmente, categoria será representada como `string`.

Não será criado um `enum` contendo categorias fixas enquanto a API continuar sendo a fonte dessas informações.

## Justificativa

As categorias são fornecidas externamente pela API.

Criar um conjunto fixo no frontend poderia gerar inconsistência caso a API disponibilize uma nova categoria.

Caso o domínio da aplicação futuramente exija categorias controladas internamente, essa decisão poderá ser revisada.

---

# 9. Favorito

Favorito não será tratado como uma entidade completa.

Ele será representado pelo ID do produto.

Estrutura conceitual:

    FavoriteProductId
        number

Exemplo:

    [
      1,
      5,
      12,
      24
    ]

---

# 10. Persistência dos Favoritos

Os favoritos serão armazenados no `localStorage`.

Somente os identificadores dos produtos deverão ser persistidos.

Não será armazenado o objeto completo do produto.

## Justificativa

O produto já possui uma fonte de dados própria.

Armazenar o objeto completo poderia gerar:

- duplicação de dados;
- dados desatualizados;
- maior utilização de armazenamento;
- necessidade de sincronização adicional.

Armazenar apenas o ID mantém o estado simples.

---

# 11. Chave de Persistência

A aplicação utiliza a chave:

    product-management:favorites

Centralizada na constante `FAVORITES_STORAGE_KEY` em `src/stores/favoritesStore.ts`.

A chave não deve ser repetida em outras partes do código.

---

# 12. Modelo de Criação

O modelo utilizado para criação de produto será diferente do modelo completo retornado pela API quando necessário.

Estrutura conceitual:

    ProductCreatePayload
    ├── title: string
    ├── price: number
    ├── description: string
    ├── category: string
    └── image: string

O ID não deverá ser responsabilidade do formulário de criação.

---

# 13. Modelo de Atualização

O modelo de atualização representará os campos que podem ser modificados.

Estrutura conceitual:

    ProductUpdatePayload
    ├── title: string
    ├── price: number
    ├── description: string
    ├── category: string
    └── image: string

Caso a API aceite uma estrutura diferente, o service deverá realizar a adaptação necessária.

---

# 14. Modelo de Formulário

O estado do formulário possui uma representação própria, distinta do payload enviado à API.

Estrutura implementada (`src/types/productForm.ts`):

    ProductFormData
    ├── title: string
    ├── price: number | undefined
    ├── description: string
    ├── category: string | undefined
    └── image: string

Os campos `price` e `category` utilizam `undefined` enquanto estão vazios na interface, antes da validação e da montagem do `ProductCreatePayload` / `ProductUpdatePayload`.

Helper implementado:

- `toProductFormData(product)` — mapeia `Product` → `ProductFormData` para pré-preencher o formulário na edição.

A separação entre `ProductFormData` e os payloads de escrita evita acoplar o estado visual do formulário ao contrato de envio.

---

# 15. Por que separar os modelos?

O modelo recebido da API não necessariamente deve ser igual ao modelo utilizado no formulário.

Exemplo:

    API
      ↓
    Product
      ↓
    Formulário
      ↓
    ProductFormData
      ↓
    Validação
      ↓
    ProductCreatePayload | ProductUpdatePayload
      ↓
    API

Essa separação permite que alterações na API tenham menor impacto sobre a interface. O mesmo `ProductForm` atende criação e edição.

---

# 16. Estado da Listagem

A tela de produtos precisará representar mais do que apenas uma lista.

O estado conceitual será:

    ProductListState
    ├── products
    ├── loading
    ├── error
    ├── search
    ├── category
    ├── sort
    └── page

Os campos poderão ser implementados utilizando estado local, composables ou store conforme a responsabilidade de cada informação.

---

# 17. Estado de Carregamento

Operações assíncronas deverão possuir estado de carregamento.

Estrutura conceitual:

    loading: boolean

Exemplo:

    false
      ↓
    true
      ↓
    false

O estado deverá ser atualizado corretamente tanto em sucesso quanto em erro.

---

# 18. Estado de Erro

O erro da aplicação deverá ser representado de maneira controlada.

Estrutura conceitual:

    error: string | null

Quando não existir erro:

    error = null

Quando ocorrer erro:

    error = "Não foi possível carregar os produtos."

A interface não deverá depender diretamente de objetos internos do Axios para apresentar mensagens.

---

# 19. Estado de Pesquisa

A pesquisa será representada por uma string.

Estrutura:

    search: string

A pesquisa deverá ser aplicada sobre os produtos disponíveis conforme definido na arquitetura.

O valor digitado pelo usuário não deverá modificar os dados originais recebidos da API.

---

# 20. Estado de Filtro

O filtro de categoria será representado pela categoria selecionada.

Estrutura implementada (`CategoryFilter` em `src/types/catalog.ts`):

    category: string

Quando nenhum filtro estiver selecionado (todas as categorias):

    category = ''  // constante ALL_CATEGORIES

Quando houver categoria:

    category = "electronics"

### Origem dos dados e filtro

- Produtos: `GET /products` via `productService.getProducts()`.
- Categorias: `GET /products/categories` via `productService.getCategories()`.
- Filtro: aplicado no frontend em `useProductListControls` (comparação com `product.category`).

A FakeStoreAPI disponibiliza `GET /products/category/:category`, porém a aplicação não utiliza esse endpoint. Classificação: **disponível na API, porém não utilizado e não obrigatório** — não é pendência.

---

# 21. Estado de Ordenação

A ordenação deverá ser representada por uma estrutura controlada.

Modelo conceitual do projeto:

    ProductSort
    ├── field
    └── direction

Campos previstos:

- `price` — ordenação por preço;
- `title` — ordenação por nome (título);
- `rating` — ordenação por avaliação.

Direções:

- `asc`;
- `desc`.

### Estado atual da implementação

Hoje o catálogo utiliza em `src/types/catalog.ts`:

    PriceSortOrder = 'asc' | 'desc'

aplicado somente ao campo `price`.

Pendências (requisitos / critérios ainda não implementados na tela):

- ordenação por nome (`title` asc/desc);
- ordenação por avaliação (`rating` asc/desc).

Quando forem implementados, o modelo de ordenação deverá ser expandido (por exemplo, unindo `field` + `direction`).

---

# 22. Paginação

O estado de paginação será representado por informações mínimas.

Estrutura conceitual:

    PaginationState
    ├── currentPage: number
    └── itemsPerPage: number

O total de páginas poderá ser calculado a partir da quantidade de produtos filtrados.

Não será necessário armazenar valores derivados caso eles possam ser calculados de maneira simples.

---

# 23. Produto Selecionado

Telas que exibem ou editam um produto específico poderão possuir um estado equivalente a:

    selectedProduct: Product | null

Quando o produto ainda não tiver sido carregado:

    selectedProduct = null

Após carregamento:

    selectedProduct = Product

---

# 24. Estado do Formulário

O formulário poderá possuir estados relacionados a:

- dados;
- validação;
- envio;
- erro;
- sucesso.

Estrutura conceitual:

    ProductFormState
    ├── data
    ├── errors
    ├── submitting
    └── submitError

A implementação deverá evitar criar estruturas excessivamente complexas para formulários simples.

---

# 25. Modelo de Erro

Quando necessário, a aplicação poderá utilizar um modelo interno de erro.

Estrutura conceitual:

    AppError
    ├── message: string
    ├── code?: string
    └── status?: number

O objetivo é evitar que as camadas superiores dependam diretamente do formato de erro fornecido pela biblioteca HTTP.

---

# 26. Transformação de Dados

Os dados recebidos da API poderão ser transformados antes de chegar à interface caso seja necessário.

Fluxo:

    API Response
         ↓
    Service
         ↓
    Transformação
         ↓
    Modelo interno
         ↓
    Composable / Store
         ↓
    Component

A transformação deverá ocorrer somente quando houver uma diferença relevante entre o contrato externo e a necessidade interna da aplicação.

Não deverá ser criada uma camada de transformação apenas por formalidade.

---

# 27. Dados Derivados

Alguns dados poderão ser calculados a partir dos dados existentes.

Exemplos:

- produtos filtrados;
- quantidade de produtos;
- total de páginas;
- produtos da página atual;
- estado de favorito;
- preço formatado;
- avaliação formatada.

Esses dados não deverão ser duplicados no estado principal quando puderem ser calculados de forma simples.

---

# 28. Fonte dos Dados

A origem de cada informação deverá ser clara.

| Informação | Fonte |
|---|---|
| Produtos | API |
| Categorias | API |
| Detalhes do produto | API |
| Criação de produto | API |
| Atualização de produto | API |
| Favoritos | `localStorage` |
| Pesquisa | Estado da interface |
| Filtro | Estado da interface |
| Ordenação | Estado da interface |
| Paginação | Estado da interface |

---

# 29. Relacionamentos

O relacionamento entre os modelos será simples.

    Product
       │
       ├────────── ProductRating
       │
       └────────── Category

    Favorite
       │
       └────────── Product.id

Não haverá necessidade de implementar relacionamentos complexos no frontend.

---

# 30. Normalização

Os dados não precisarão ser normalizados inicialmente.

A API fornece uma estrutura simples e o volume de dados esperado não justifica uma estrutura de normalização mais complexa.

Caso o projeto evolua para uma fonte de dados maior ou múltiplos relacionamentos, essa decisão poderá ser revisada.

---

# 31. Dados Persistidos

Somente dados necessários para manter preferências do usuário deverão ser persistidos localmente.

Inicialmente:

    localStorage
        └── favoritos

Não deverão ser persistidos automaticamente:

- produtos completos;
- respostas completas da API;
- erros;
- estados temporários;
- dados de formulário não enviados;
- informações sensíveis.

---

# 32. Dados Temporários

Alguns estados existem somente durante a execução da aplicação.

Exemplos:

- loading;
- erro;
- produto selecionado;
- filtro atual;
- pesquisa atual;
- página atual;
- estado de modal.

Esses dados não deverão ser persistidos sem uma necessidade específica.

---

# 33. Tipos TypeScript

Os modelos principais deverão ser organizados em arquivos específicos.

Estrutura implementada:

    src/types/
    ├── product.ts
    ├── category.ts
    ├── api.ts
    ├── productForm.ts
    └── catalog.ts

- `product.ts` — `Product`, `ProductRating`, payloads de criação/atualização.
- `category.ts` — tipo `Category` (`string`).
- `api.ts` — `AppError`.
- `productForm.ts` — `ProductFormData`, `EMPTY_PRODUCT_FORM`, `toProductFormData`.
- `catalog.ts` — `PriceSortOrder`, `CategoryFilter`, constantes de paginação (ordenação por nome ainda pendente no modelo).

---

# 34. Regras de Tipagem

Os tipos deverão seguir as seguintes regras:

- evitar `any`;
- utilizar `unknown` quando o tipo realmente não puder ser conhecido;
- utilizar tipos opcionais somente quando o campo puder realmente não existir;
- utilizar `null` quando a ausência de valor fizer parte do estado;
- evitar casts desnecessários;
- evitar duplicação de interfaces equivalentes.

---

# 35. Tipos Derivados

Quando possível, tipos derivados deverão ser criados a partir de tipos existentes.

Exemplo conceitual:

    ProductCreatePayload
    ProductUpdatePayload

podem compartilhar estruturas comuns do modelo de produto quando isso melhorar a manutenção.

Entretanto, a reutilização de tipos não deverá comprometer a clareza.

---

# 36. Validação dos Dados Externos

Os dados provenientes da API são considerados externos à aplicação.

Quando houver necessidade de validação estrutural mais rigorosa, poderá ser utilizada uma biblioteca de validação ou uma camada de transformação.

A implementação deverá avaliar essa necessidade antes de introduzir uma dependência adicional.

Para o escopo inicial, a tipagem TypeScript será utilizada como contrato de desenvolvimento, sem assumir que ela valida os dados em tempo de execução.

---

# 37. Valores Monetários

O campo `price` será tratado como número conforme o contrato da API.

A formatação visual do preço não deverá modificar o valor original.

Exemplo conceitual:

    API
    price: 109.99

    Interface
    R$ 109,99

A conversão será responsabilidade da camada de apresentação ou de uma função utilitária específica.

---

# 38. URLs de Imagem

O campo `image` será tratado como uma URL.

A interface deverá utilizar esse valor para apresentação da imagem.

Caso a imagem não possa ser carregada, a interface deverá possuir um comportamento de fallback adequado.

---

# 39. Categorias e Valores Externos

Como categorias são fornecidas pela API, a aplicação não deverá assumir que o conjunto atual é permanente.

O frontend deverá ser capaz de trabalhar com novas categorias sem exigir necessariamente uma alteração de código.

---

# 40. Dados de Apresentação

Informações específicas da interface não deverão ser adicionadas ao modelo original do produto sem necessidade.

Exemplos de informações que podem ser derivadas:

- produto está favoritado;
- preço formatado;
- avaliação formatada;
- imagem carregando;
- imagem com erro.

Essas informações deverão permanecer como estado ou dados derivados da interface.

---

# 41. Separação entre Domínio e API

Quando houver necessidade de representar uma diferença importante entre o formato da API e o formato interno, os dois modelos deverão ser separados.

Exemplo conceitual:

    API Product
          ↓
    transformação
          ↓
    Application Product

Essa separação será adotada somente quando trouxer benefício real.

Para estruturas simples e equivalentes, não será criada duplicação artificial de modelos.

---

# 42. Critérios de Aceite

Os modelos de dados serão considerados definidos quando:

- [ ] Produto estiver documentado.
- [ ] Avaliação estiver documentada.
- [ ] Categoria estiver documentada.
- [ ] Favoritos estiverem documentados.
- [ ] Payload de criação estiver definido.
- [ ] Payload de atualização estiver definido.
- [ ] Estado da listagem estiver definido.
- [ ] Estado de erro estiver definido.
- [ ] Estado de loading estiver definido.
- [ ] Estado de pesquisa estiver definido.
- [ ] Estado de filtro estiver definido.
- [ ] Estado de ordenação estiver definido.
- [ ] Paginação estiver definida.
- [ ] Persistência local estiver definida.
- [ ] Fonte de cada dado estiver documentada.
- [ ] Regras de tipagem estiverem definidas.
- [ ] Estrutura de tipos TypeScript estiver definida.

---

# 43. Status do Documento

**Status:** Em andamento

**Versão:** 1.4

**Última atualização:** 2026-08-11