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

A interface deverá ser responsiva, acessível e adequada para desktop e dispositivos móveis a partir de 360px.

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
    └── Footer

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
        └── Ordenação por preço
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

As categorias deverão ser obtidas através da API.

O usuário deverá possuir uma opção equivalente a:

`Todas as categorias`

Quando uma categoria for selecionada, somente produtos daquela categoria deverão ser apresentados.

---

# 11. Ordenação por Preço

A interface deverá permitir ordenar os produtos por preço.

Opções obrigatórias:

- menor preço;
- maior preço.

A ordenação deverá ocorrer no frontend quando necessário.

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
    Ordenação por preço
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

---

# 34. Estado de Validação

Os campos deverão apresentar visualmente:

- estado normal;
- estado de foco;
- estado inválido;
- estado válido quando aplicável.

As mensagens de erro deverão ser claras e objetivas.

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

- apresentar Toast de erro;
- manter os dados do formulário;
- permitir nova tentativa.

Mensagem sugerida:

**Não foi possível criar o produto.**

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
- atualizar os dados exibidos;
- retornar para uma página apropriada.

Mensagem sugerida:

**Produto atualizado com sucesso.**

---

# 42. Erro na Edição

Caso a atualização falhe:

- apresentar Toast de erro;
- manter os dados preenchidos;
- permitir nova tentativa.

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

- produto criado;
- produto atualizado;
- favorito alterado;
- erro de operação.

As mensagens deverão ser curtas e compreensíveis.

---

# 45. Responsividade

A interface deverá funcionar corretamente a partir de:

`360px`

Deverá ser validada pelo menos em:

- 360px;
- 768px;
- desktop.

---

# 46. Mobile

Em telas pequenas:

- navegação deverá ser adaptada;
- filtros deverão ser empilhados quando necessário;
- cards deverão ocupar o espaço disponível;
- botões deverão possuir área adequada para toque;
- textos não deverão ultrapassar a largura da tela;
- formulários deverão utilizar a largura disponível.

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

Regras mínimas:

- HTML semântico;
- labels associados aos campos;
- botões com nomes acessíveis;
- imagens com `alt`;
- navegação por teclado;
- foco visível;
- mensagens de erro associadas aos campos;
- não utilizar somente cor para indicar estados.

---

# 49. Componentes Principais

A estrutura deverá considerar componentes reutilizáveis como:

    AppHeader
    ProductCard
    ProductGrid
    ProductSearch
    ProductFilters
    ProductSort
    ProductPagination
    FavoriteButton
    ProductForm
    LoadingState
    EmptyState
    ErrorState

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

- [ ] Produtos podem ser listados.
- [ ] Busca está disponível.
- [ ] Busca possui debounce.
- [ ] Filtro por categoria está disponível.
- [ ] Ordenação por preço está disponível.
- [ ] Paginação está disponível.
- [ ] ProductCard está implementado.
- [ ] Favoritos funcionam.
- [ ] Favoritos utilizam Pinia.
- [ ] Favoritos persistem em localStorage.
- [ ] Página de detalhes está implementada.
- [ ] Página de favoritos está implementada.
- [x] Criação de produto está implementada.
- [ ] Edição de produto está implementada.
- [x] Formulários utilizam vee-validate.
- [x] Validações utilizam Yup.
- [x] POST está integrado.
- [ ] PUT está integrado.
- [x] Toasts de sucesso e erro estão implementados.
- [ ] Estados de loading estão implementados.
- [ ] Estados de erro estão implementados.
- [ ] Estados vazios estão implementados.
- [ ] Interface é responsiva a partir de 360px.
- [ ] Componentes PrimeVue são utilizados.
- [ ] TailwindCSS é utilizado para estilização e layout.
- [ ] Interface possui navegação acessível por teclado.
- [ ] Componentes reutilizáveis foram priorizados.

---

# 57. Status do Documento

**Status:** Em definição

**Versão:** 1.1