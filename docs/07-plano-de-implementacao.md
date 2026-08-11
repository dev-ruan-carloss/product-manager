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

**Concluída e validada.**

### Componentes previstos

- [x] Header.
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
- [ ] Implementar acesso à edição (adiado para a Fase 8 — Edição de produto).

### Arquivos da implementação

Criados:

- `src/composables/useProductDetails.ts`
- `src/utils/parseProductId.ts`
- `src/components/products/ProductDetails.vue`

Modificados:

- `src/views/ProdutoDetalhesView.vue`

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

1. **Acesso à edição:** a UI/especificação e o planejamento da fase preveem acesso à edição, porém a edição não foi implementada nesta etapa e permanece para a Fase 8.
2. **Modelo da FakeStoreAPI:** elementos da referência visual (galeria, estoque, tipo/material, reviews detalhadas e metadados adicionais) não foram implementados por não fazerem parte do modelo `Product` utilizado.
3. **Preço:** a referência visual utiliza `$`, enquanto a aplicação utiliza `formatPrice` com padrão BRL, conforme o SDD.
4. **Produto inexistente:** o contrato considera o cenário de `404`, porém a FakeStoreAPI pode retornar `200` com corpo vazio; a implementação trata ambos os cenários.

Essas divergências não foram transformadas em novos requisitos.

### Resultado esperado

Usuário consegue abrir os detalhes de um produto, visualizar suas informações, favoritar/desfavoritar e retornar ao catálogo, com estados de loading, erro e não encontrado tratados.

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
- Comportamento de `1 → 2 → 3 → 4` colunas conforme viewport.
- Container `max-w-7xl`.
- Paddings alinhados às demais views.
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

### Componente

`ProductForm`

### Tarefas do formulário

- [ ] Criar estrutura do formulário.
- [ ] Integrar vee-validate.
- [ ] Criar schema Yup.
- [ ] Validar título.
- [ ] Validar preço.
- [ ] Validar descrição.
- [ ] Validar categoria.
- [ ] Validar URL da imagem.
- [ ] Apresentar mensagens de erro.
- [ ] Implementar estado de envio.
- [ ] Evitar múltiplos envios.

### Tarefas da criação

- [ ] Integrar ProductForm em `/produtos/novo`.
- [ ] Carregar categorias.
- [ ] Validar formulário.
- [ ] Executar POST.
- [ ] Apresentar Toast de sucesso.
- [ ] Apresentar Toast de erro.
- [ ] Evitar perda dos dados em caso de erro.
- [ ] Navegar após sucesso.

---

# 10. Fase 8 — Edição de produto

### Objetivo

Implementar o fluxo de edição em `/produtos/:id/editar`.

### Tarefas

- [ ] Obter ID da rota.
- [ ] Buscar produto.
- [ ] Preencher ProductForm.
- [ ] Permitir alteração.
- [ ] Validar formulário.
- [ ] Executar PUT.
- [ ] Apresentar Toast de sucesso.
- [ ] Apresentar Toast de erro.
- [ ] Tratar produto inexistente.
- [ ] Navegar após sucesso.

---

# 11. Fase 9 — Responsividade e acessibilidade

### Objetivo

Garantir funcionamento adequado a partir de 360px e atender critérios básicos de acessibilidade.

### Responsividade

- [ ] Validar 360px.
- [ ] Validar mobile.
- [ ] Validar tablet.
- [ ] Validar desktop.
- [ ] Ajustar grid.
- [ ] Ajustar navegação.
- [ ] Ajustar filtros.
- [ ] Ajustar formulários.
- [ ] Validar áreas de toque.
- [ ] Garantir ausência de overflow horizontal.

### Acessibilidade

- [ ] Validar labels dos campos.
- [ ] Validar textos alternativos.
- [ ] Validar nomes acessíveis dos botões.
- [ ] Validar navegação por teclado.
- [ ] Validar foco.
- [ ] Validar mensagens de erro.
- [ ] Verificar uso semântico do HTML.
- [ ] Garantir que estados não dependam somente de cor.

---

# 12. Fase 10 — QA final

### Objetivo

Consolidar qualidade técnica, estados de interface, testes manuais e, quando aplicável, testes automatizados.

### Tratamento de estados

#### Loading

- [ ] Listagem.
- [ ] Detalhes.
- [ ] Edição.
- [ ] Formulário.

#### Erro

- [ ] Listagem.
- [ ] Detalhes.
- [ ] Criação.
- [ ] Edição.

#### Vazio

- [ ] Resultados sem correspondência.
- [ ] Favoritos vazios.

### Revisão técnica

- [ ] Remover `any` injustificado.
- [ ] Verificar TypeScript strict.
- [ ] Remover código duplicado.
- [ ] Verificar responsabilidades dos componentes.
- [ ] Verificar responsabilidades das stores.
- [ ] Verificar services.
- [ ] Verificar imports.
- [ ] Verificar nomes.
- [ ] Verificar componentes não utilizados.
- [ ] Executar lint.
- [ ] Executar build.
- [ ] Corrigir warnings relevantes.
- [ ] Verificar console.
- [ ] Verificar erros de runtime.

### Testes manuais

#### Produtos

- [ ] Listar produtos.
- [ ] Pesquisar produto.
- [ ] Aplicar debounce.
- [ ] Filtrar categoria.
- [ ] Ordenar menor preço.
- [ ] Ordenar maior preço.
- [ ] Navegar pela paginação.

#### Detalhes

- [ ] Abrir produto.
- [ ] Produto inexistente.
- [ ] Favoritar.
- [ ] Desfavoritar.

#### Favoritos

- [ ] Adicionar favorito.
- [ ] Remover favorito.
- [ ] Recarregar página.
- [ ] Confirmar persistência no localStorage.
- [ ] Acessar `/favoritos`.
- [ ] Validar estado vazio.

#### Criação

- [ ] Abrir formulário.
- [ ] Validar campos vazios.
- [ ] Validar preço inválido.
- [ ] Validar URL inválida.
- [ ] Criar produto.
- [ ] Validar sucesso.
- [ ] Validar erro.

#### Edição

- [ ] Abrir edição.
- [ ] Carregar dados.
- [ ] Validar campos.
- [ ] Atualizar produto.
- [ ] Validar sucesso.
- [ ] Validar erro.

### Revisão visual

- [ ] Consistência dos componentes.
- [ ] Espaçamentos.
- [ ] Tipografia.
- [ ] Cores.
- [ ] Estados de interação.
- [ ] Responsividade.
- [ ] Alinhamento.
- [ ] Overflow.
- [ ] Loading.
- [ ] Empty states.
- [ ] Mensagens de erro.
- [ ] Toasts.

### Testes automatizados

- [ ] Configurar Vitest e Vue Test Utils na fase de qualidade, quando necessário.
- [ ] Cobrir regras críticas (stores, validações e fluxos relevantes).

---

# 13. Fase 11 — Documentação e entrega

### Objetivo

Consolidar a documentação final e garantir consistência entre código e SDD.

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
- comandos disponíveis.

### Documentação SDD

- [ ] Requisitos consistentes com o código.
- [ ] Arquitetura consistente com o código.
- [ ] Decisões técnicas atualizadas.
- [ ] Contrato da API consistente.
- [ ] Modelos de dados consistentes.
- [ ] Especificação de UI consistente.
- [ ] Plano de implementação atualizado.
- [ ] Definição de pronto atendida.

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

- [ ] Todos os requisitos do desafio estiverem implementados.
- [ ] Todas as rotas estiverem funcionando com suas funcionalidades.
- [x] Camada de API estiver implementada.
- [x] Busca estiver funcionando com debounce.
- [x] Filtro por categoria estiver funcionando.
- [x] Ordenação por preço estiver funcionando.
- [x] Paginação estiver funcionando.
- [x] Favoritos estiverem gerenciados com Pinia.
- [x] Favoritos estiverem persistidos em localStorage.
- [x] Página de favoritos estiver funcionando.
- [x] Detalhes estiverem funcionando.
- [ ] Criação estiver funcionando.
- [ ] Edição estiver funcionando.
- [ ] vee-validate estiver integrado aos formulários.
- [ ] Yup estiver integrado aos formulários.
- [x] PrimeVue estiver configurado no projeto.
- [x] TailwindCSS estiver configurado no projeto.
- [ ] Estados de loading, erro e vazio estiverem implementados nas telas.
- [ ] Responsividade estiver validada a partir de 360px.
- [ ] Acessibilidade básica estiver validada.
- [x] Lint estiver passando.
- [x] Build estiver passando.
- [ ] README estiver atualizado.
- [ ] Documentação SDD estiver consistente com o código.

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
| Catálogo | concluída |
| Detalhes | concluída |
| Favoritos UI | concluída |
| Criação | pendente |
| Edição | pendente |
| Responsividade/acessibilidade | pendente |
| QA | pendente |
| Entrega | pendente |

### Próxima fase

**Fase 7 — Criação de produto**

---

# 19. Status do Documento

**Status:** Em andamento

**Versão:** 1.3

**Última atualização:** 2026-08-10
