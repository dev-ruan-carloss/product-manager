# Contrato da API — Product Management

## 1. Objetivo

Este documento define o contrato de comunicação entre a aplicação Product Management e a API externa utilizada pelo projeto.

O objetivo é registrar:

- URL base;
- endpoints utilizados;
- métodos HTTP;
- parâmetros;
- estruturas de requisição;
- estruturas de resposta;
- códigos de status esperados;
- tratamento de erros;
- limitações conhecidas da API;
- responsabilidades da camada de services.

A aplicação deverá utilizar este documento como referência para a implementação da comunicação com a API.

---

# 2. API Utilizada

## 2.1 — Serviço

A aplicação utilizará a Fake Store API como fonte de dados para produtos e categorias.

A API será consumida exclusivamente pelo frontend através da camada de services.

A interface não deverá realizar chamadas HTTP diretamente.

---

# 3. URL Base

A URL base utilizada pela aplicação deverá ser configurada de forma centralizada.

A configuração deverá ficar na camada responsável pelo cliente HTTP.

A URL não deverá ser repetida individualmente em cada service.

Exemplo conceitual:

    API_BASE_URL
        ↓
    config/api.ts
        ↓
    productService.ts

Caso a URL seja configurada através de variável de ambiente, ela deverá ser definida em arquivo apropriado para o ambiente de execução.

A variável utilizada é `VITE_API_BASE_URL` (ver `.env.example`).

---

# 4. Cliente HTTP

A comunicação será realizada utilizando Axios.

A configuração deverá ser centralizada em:

`src/config/api.ts`

O cliente HTTP deverá concentrar:

- URL base;
- configuração padrão;
- headers necessários;
- tratamento comum de respostas, quando aplicável;
- tratamento comum de erros, quando aplicável.

Os services deverão utilizar o cliente configurado em vez de criar instâncias independentes.

---

# 5. Recursos Utilizados

Os principais recursos utilizados pela aplicação serão:

- produtos;
- categorias.

Os endpoints exatos deverão seguir a documentação atual da Fake Store API utilizada pelo projeto.

---

# 6. Produtos

## 6.1 — Listar produtos

### Método

`GET`

### Endpoint

`/products`

### Objetivo

Retornar a lista de produtos disponível na API.

### Requisição

Não possui corpo.

### Resposta esperada

A API deverá retornar uma coleção de produtos.

Cada produto deverá possuir informações equivalentes a:

- identificador;
- título;
- preço;
- descrição;
- categoria;
- imagem;
- avaliação.

### Modelo conceitual

    Product
    ├── id
    ├── title
    ├── price
    ├── description
    ├── category
    ├── image
    └── rating
        ├── rate
        └── count

A estrutura final deverá ser representada através de tipos TypeScript.

A FakeStoreAPI é fonte externa. `getProducts()` valida a resposta com `toProductList` antes de expor o catálogo. Itens inválidos são excluídos; payload irrecuperável segue o pipeline `AppError`.

---

# 7. Buscar Produto por ID

## Método

`GET`

## Endpoint

`/products/:id`

## Objetivo

Retornar os dados de um produto específico.

## Parâmetro

`id`

Tipo:

`number`

Local:

`path`

Exemplo conceitual:

`/products/1`

## Resposta

Retorna um objeto `Product`.

A resposta passa por `isValidProduct` / `toProduct`. Estrutura incompatível não é tratada como 404: vira `AppError` `unexpected`.

## Comportamento esperado

Quando o produto existir:

- retornar os dados do produto;
- disponibilizar os dados para a tela de detalhes.

Quando o produto não existir:

- tratar o erro;
- apresentar estado adequado ao usuário;
- evitar quebra da aplicação.

---

# 8. Criar Produto

## Método

`POST`

## Endpoint

`/products`

## Objetivo

Criar um novo produto através da API.

## Corpo da requisição

O payload deverá conter os campos necessários para criação do produto.

Estrutura conceitual:

    {
      title,
      price,
      description,
      category,
      image
    }

A estrutura definitiva deverá seguir o contrato disponibilizado pela API.

## Resposta

A API deverá retornar o produto criado ou uma representação equivalente.

## Observação importante

A Fake Store API possui comportamento simulado para operações de escrita.

A criação de um produto não deverá ser considerada como persistência real em um banco de dados permanente.

O frontend deverá tratar a resposta da API respeitando essa característica:

1. Executar `POST /products`.
2. Validar/normalizar o produto retornado (`toProduct`).
3. Incorporar esse produto no estado do catálogo da sessão (`addCreatedProduct`).
4. Só então navegar para `/produtos`.

Um `GET /products` posterior **não** é a fonte da criação. Se a API não incluir o produto criado, o estado local da sessão continua contendo-o até o recarregamento da página.

O ID utilizado é o retornado pela API. Não se gera ID aleatório no frontend. Não se assume que `GET /products/:id` recuperará o recurso criado.

---

# 9. Atualizar Produto

## Método

`PUT`

## Endpoint

`/products/:id`

## Objetivo

Atualizar os dados de um produto existente.

## Parâmetro

`id`

Tipo:

`number`

Local:

`path`

## Corpo

O payload deverá conter os campos que serão enviados para atualização.

Estrutura conceitual:

    {
      title,
      price,
      description,
      category,
      image
    }

## Resposta

A API deverá retornar uma representação do produto atualizado.

## Observação

Assim como na criação, a atualização deverá ser considerada uma operação simulada quando realizada através da Fake Store API.

Fluxo da aplicação:

1. Executar `PUT /products/:id`.
2. Validar/normalizar o produto retornado.
3. Substituir o produto correspondente no catálogo da sessão (`replaceProduct`).
4. Só então navegar.

Um `GET /products` ou `GET /products/:id` posterior pode devolver o preço/título originais. O estado da sessão permanece com os dados retornados pelo PUT.

`DELETE /products/:id` não faz parte do contrato utilizado pela aplicação.

---

# 10. Categorias

## 10.1 — Listar categorias

### Método

`GET`

### Endpoint

`/products/categories`

### Objetivo

Retornar as categorias disponíveis para utilização nos filtros e formulários.

### Resposta

A API deverá retornar uma coleção de strings representando categorias.

Exemplo conceitual:

    [
      "electronics",
      "jewelery",
      "men's clothing",
      "women's clothing"
    ]

A resposta deverá ser representada através de um tipo apropriado.

---

# 11. Filtragem por Categoria

A FakeStoreAPI disponibiliza `GET /products/category/:category`, porém a aplicação não utiliza esse endpoint. O requisito de filtro por categoria é atendido através do carregamento do catálogo via `GET /products` e filtragem dos produtos no frontend.

### Classificação deste endpoint

**Disponível na API, porém não utilizado e não obrigatório.**

Esse endpoint **não** é requisito funcional da prova e **não** constitui pendência de implementação.

### Método (disponível na FakeStoreAPI)

`GET`

### Endpoint (disponível na FakeStoreAPI)

`/products/category/:category`

### Parâmetro

`category`

Tipo:

`string`

Local:

`path`

Exemplo conceitual:

`/products/category/electronics`

### Fluxo adotado pela aplicação

    GET /products
    GET /products/categories
          ↓
    Frontend (`useProductListControls`)
          ↓
    Filtro por `product.category`
          ↓
    Produtos filtrados

O filtro por categoria (RF-003) permanece **CONCLUÍDO** com essa abordagem.

---

# 12. Pesquisa de Produtos

A Fake Store API não deverá ser considerada como responsável por fornecer uma pesquisa textual completa para o frontend.

Quando necessário, a pesquisa poderá ser realizada no frontend após o carregamento dos produtos.

Fluxo:

    API
      ↓
    Produtos
      ↓
    Estado da aplicação
      ↓
    Filtro textual
      ↓
    Resultado exibido

O debounce deverá ser aplicado à interação de pesquisa conforme definido nas decisões técnicas.

---

# 13. Paginação

A estratégia de paginação deverá considerar as limitações da API utilizada.

Caso a API não disponibilize paginação adequada para o fluxo necessário, os produtos poderão ser carregados e paginados no frontend.

Fluxo:

    GET /products
          ↓
    Lista completa
          ↓
    Filtro
          ↓
    Ordenação
          ↓
    Paginação local
          ↓
    Produtos exibidos

A solução deverá ser simples e suficiente para o volume de dados do projeto.

---

# 14. Ordenação

A ordenação poderá ser realizada no frontend.

Critérios do projeto:

| Critério | Status |
|---|---|
| menor preço | implementado |
| maior preço | implementado |
| nome crescente (A–Z) | implementado |
| nome decrescente (Z–A) | implementado |
| avaliação (crescente / decrescente) | implementado (`rate`, depois `count` no empate) |

A ordenação não deverá modificar os dados originais retornados pela API.

O ideal é trabalhar sobre uma coleção derivada dos dados originais.

---

# 15. Modelo de Produto

O modelo principal da aplicação deverá representar os dados retornados pela API.

Estrutura conceitual:

    Product
    ├── id: number
    ├── title: string
    ├── price: number
    ├── description: string
    ├── category: string
    ├── image: string
    └── rating
        ├── rate: number
        └── count: number

A definição final será implementada em:

`src/types/product.ts`

---

# 16. Modelo de Avaliação

A avaliação deverá ser representada separadamente quando isso melhorar a organização dos tipos.

Estrutura:

    ProductRating
    ├── rate: number
    └── count: number

O relacionamento será:

    Product
       ↓
    ProductRating

---

# 17. Payload de Criação

O payload utilizado para criação deverá ser separado do modelo completo retornado pela API.

Isso evita assumir que todos os campos retornados pela API precisam ser enviados durante a criação.

Exemplo conceitual:

    ProductCreatePayload
    ├── title
    ├── price
    ├── description
    ├── category
    └── image

O campo `id` não deverá ser tratado como responsabilidade do formulário de criação.

---

# 18. Payload de Atualização

O payload de atualização deverá ser representado por um tipo próprio quando houver diferença entre o modelo retornado e os campos editáveis.

Exemplo:

    ProductUpdatePayload
    ├── title
    ├── price
    ├── description
    ├── category
    └── image

A estrutura final deverá respeitar o contrato real da API.

---

# 19. Códigos HTTP

A aplicação deverá considerar pelo menos os seguintes cenários:

| Código | Significado | Comportamento |
|---|---|---|
| `200` | Sucesso | Processar resposta |
| `201` | Recurso criado | Processar resposta |
| `400` | Requisição inválida | Exibir erro adequado |
| `404` | Recurso não encontrado | Exibir estado de não encontrado |
| `500` | Erro interno | Exibir erro genérico |
| Erro de rede | API indisponível | Exibir erro de conexão |

A implementação deverá considerar que nem todas as operações necessariamente retornarão todos esses códigos.

---

# 20. Tratamento de Erros

Os services não deverão expor detalhes técnicos desnecessários diretamente para os componentes.

Fluxo esperado:

    API
      ↓
    Axios
      ↓
    Service
      ↓
    Composable / Store
      ↓
    Component / View
      ↓
    Feedback para usuário

O erro deverá ser convertido para uma estrutura que permita à interface apresentar uma mensagem apropriada.

---

# 21. Erro de Rede

Caso não seja possível estabelecer comunicação com a API, a aplicação deverá apresentar um estado de erro compreensível.

Exemplos:

- "Não foi possível carregar os produtos."
- "Não foi possível conectar ao serviço."
- "Tente novamente."

Mensagens técnicas como stack traces ou objetos completos de erro não deverão ser apresentadas ao usuário.

---

# 22. Loading

Toda operação assíncrona relevante deverá possuir um estado de carregamento.

Exemplos:

- carregamento da lista de produtos;
- carregamento de detalhes;
- criação;
- atualização;
- carregamento de categorias.

O estado visual deverá impedir interações inconsistentes quando necessário.

---

# 23. Estado Vazio

A aplicação deverá diferenciar:

- carregamento;
- erro;
- lista vazia;
- sucesso com dados.

Exemplo:

    loading
      ↓
    success
      ↓
    empty

Uma lista vazia não deverá ser tratada automaticamente como erro.

---

# 24. Responsabilidade dos Services

Os services serão responsáveis por:

- realizar requisições;
- enviar parâmetros;
- enviar payloads;
- receber respostas;
- tipar respostas;
- tratar detalhes específicos da API.

Os services não deverão:

- manipular componentes;
- controlar modais;
- alterar elementos HTML;
- exibir mensagens diretamente;
- controlar navegação.

---

# 25. Responsabilidade dos Composables

Os composables poderão utilizar os services para controlar fluxos da interface.

Exemplo:

    useProductsCatalog
        ↓
    productService
        ↓
    API

O composable poderá controlar:

- loading;
- erro;
- dados.

Filtros, ordenação e paginação locais ficam em `useProductListControls`.

---

# 26. Cache e Requisições

A aplicação não implementa uma camada de cache HTTP complexa.

O catálogo permanece em memória enquanto a aplicação estiver em execução (`useProductsCatalog`). Mutações de CREATE/UPDATE da sessão são reaplicadas se o GET for recarregado, porque a FakeStoreAPI pode não persistir escritas.

Esse overlay **não** é persistido em `localStorage` e **não** substitui a FakeStoreAPI por dados fixos.

Uma estratégia mais avançada de cache somente deverá ser adicionada caso exista uma necessidade real.

---

# 27. Autenticação

A aplicação não utilizará autenticação para o escopo atual.

A Fake Store API utilizada no projeto não exige autenticação para os recursos necessários.

Nenhum token de autenticação deverá ser criado artificialmente apenas para aumentar a complexidade do projeto.

Caso a API seja substituída futuramente por uma API autenticada, a estratégia deverá ser registrada em uma nova decisão técnica.

---

# 28. Segurança

Nenhuma credencial privada deverá ser armazenada no código-fonte.

Como o projeto utiliza uma API pública para demonstração, não deverão existir:

- senhas;
- tokens privados;
- chaves secretas;
- credenciais reais.

Variáveis de ambiente deverão ser utilizadas quando uma configuração depender do ambiente.

---

# 29. Limitações Conhecidas

A API utilizada possui limitações que deverão ser consideradas durante a implementação.

Entre elas:

- operações de escrita podem ser simuladas;
- a persistência dos dados criados ou alterados não deve ser considerada permanente;
- recursos de pesquisa podem ser limitados;
- paginação poderá precisar ser realizada no frontend;
- disponibilidade e comportamento dependem de um serviço externo.

Essas limitações não deverão ser mascaradas na documentação ou na apresentação do projeto.

---

# 30. Estratégia para Substituição da API

A arquitetura deverá permitir que a API seja substituída futuramente com impacto limitado.

Para isso:

- componentes não deverão conhecer URLs;
- views não deverão realizar HTTP diretamente;
- services deverão concentrar a integração;
- tipos deverão representar os contratos;
- transformação de dados deverá ocorrer na camada apropriada.

Fluxo esperado:

    Component
        ↓
    Composable
        ↓
    Service
        ↓
    API externa

Se a API mudar:

    Component
        ↓
    Composable
        ↓
    Service atualizado
        ↓
    Nova API

A camada de apresentação deverá permanecer o mais independente possível da fonte dos dados.

---

# 31. Contrato de Favoritos

Favoritos não fazem parte do contrato da API.

Eles serão tratados exclusivamente pelo frontend.

O fluxo será:

    Product
       ↓
    FavoriteButton
       ↓
    Favorites Store
       ↓
    localStorage

Somente o identificador do produto deverá ser persistido.

A API não será chamada para favoritar ou desfavoritar produtos.

---

# 31.1 — Contrato de Avaliações do Usuário

Avaliações feitas pelo usuário **não** fazem parte do contrato da FakeStoreAPI.

Não existe `POST /products/:id/reviews` nem qualquer outro endpoint de review. O `productService` não envia avaliações.

O fluxo é exclusivamente local:

    Product
       ↓
    ProductRatingDialog
       ↓
    Ratings Store
       ↓
    localStorage (`product-management:product-ratings`)

O `rating` retornado pela API permanece a fonte original. A UI combina esse valor com a avaliação local para exibir média e quantidade.

---

# 32. Regras de Integração

A implementação deverá seguir as seguintes regras:

- [x] Nenhum componente realiza requisição HTTP diretamente.
- [x] Toda comunicação passa por um service.
- [x] O cliente Axios é centralizado.
- [x] Respostas da API possuem tipos TypeScript.
- [x] Payloads possuem tipos apropriados.
- [x] Erros são tratados antes de chegar à interface.
- [x] Estados de loading são controlados.
- [x] Estados vazios são diferenciados de erros.
- [x] URLs não são duplicadas nos componentes.
- [x] Credenciais não são armazenadas no código.
- [x] Favoritos permanecem como responsabilidade exclusiva do frontend.
- [x] Avaliações do usuário permanecem como responsabilidade exclusiva do frontend (sem endpoint na API).

---

# 33. Endpoints Resumidos

| Recurso | Método | Endpoint | Uso |
|---|---|---|---|
| Produtos | `GET` | `/products` | Listar produtos (base para filtro/pesquisa/paginação locais) |
| Produto | `GET` | `/products/:id` | Buscar produto |
| Produtos por categoria | `GET` | `/products/category/:category` | Disponível na API, porém **não utilizado** e **não obrigatório** (filtro no frontend) |
| Categorias | `GET` | `/products/categories` | Listar categorias |
| Produto | `POST` | `/products` | Criar produto |
| Produto | `PUT` | `/products/:id` | Atualizar produto |

---

# 34. Critérios de Aceite

O contrato da API será considerado documentado quando:

- [x] URL base estiver centralizada.
- [x] Cliente HTTP estiver definido.
- [x] Endpoints principais estiverem documentados.
- [x] Métodos HTTP estiverem documentados.
- [x] Parâmetros estiverem documentados.
- [x] Payloads estiverem documentados.
- [x] Respostas estiverem tipadas.
- [x] Códigos de erro estiverem considerados.
- [x] Loading estiver definido.
- [x] Estado vazio estiver definido.
- [x] Tratamento de erros estiver definido.
- [x] Limitações da API estiverem documentadas.
- [x] Responsabilidade dos services estiver definida.
- [x] Favoritos estiverem separados do contrato da API.

---

# 35. Status do Documento

**Status:** Concluído (Fase 11 — auditoria documental)

**Versão:** 1.4

**Última atualização:** 2026-08-13