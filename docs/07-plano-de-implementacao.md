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

### Componentes previstos

- [ ] Header.
- [ ] ProductCard.
- [ ] ProductGrid.
- [ ] FavoriteButton.
- [ ] LoadingState.
- [ ] EmptyState.
- [ ] ErrorState.
- [ ] Controles de paginação.

### Tarefas da listagem

- [ ] Buscar produtos através da API.
- [ ] Apresentar loading.
- [ ] Apresentar produtos.
- [ ] Apresentar estado vazio.
- [ ] Apresentar estado de erro.
- [ ] Implementar busca.
- [ ] Implementar debounce.
- [ ] Implementar filtro por categoria.
- [ ] Implementar ordenação por preço.
- [ ] Implementar paginação.
- [ ] Integrar favoritar/desfavoritar na listagem via store existente.

PrimeVue deverá ser utilizado sempre que houver componente adequado.

TailwindCSS deverá ser utilizado para composição e responsividade.

### Resultado esperado

Usuário consegue navegar pelo catálogo e encontrar produtos utilizando os controles definidos no desafio.

---

# 7. Fase 5 — Detalhes do produto

### Objetivo

Implementar a visualização individual de um produto.

### Tarefas

- [ ] Obter ID através da rota.
- [ ] Buscar produto pela API.
- [ ] Apresentar loading.
- [ ] Apresentar dados completos.
- [ ] Implementar favorito na página de detalhes.
- [ ] Implementar acesso à edição.
- [ ] Tratar produto inexistente.
- [ ] Tratar erro da API.

---

# 8. Fase 6 — Página de favoritos

### Objetivo

Implementar a experiência visual completa de favoritos.

### Tarefas

- [ ] Implementar a página `/favoritos`.
- [ ] Utilizar a store Pinia existente.
- [ ] Recuperar IDs persistidos.
- [ ] Obter dados necessários dos produtos.
- [ ] Reutilizar ProductCard.
- [ ] Atualizar lista ao desfavoritar.
- [ ] Implementar estado vazio.
- [ ] Implementar contador no Header.

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
- [ ] Busca estiver funcionando com debounce.
- [ ] Filtro por categoria estiver funcionando.
- [ ] Ordenação por preço estiver funcionando.
- [ ] Paginação estiver funcionando.
- [x] Favoritos estiverem gerenciados com Pinia.
- [x] Favoritos estiverem persistidos em localStorage.
- [ ] Página de favoritos estiver funcionando.
- [ ] Detalhes estiverem funcionando.
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
| Catálogo | pendente |
| Detalhes | pendente |
| Favoritos UI | pendente |
| Criação | pendente |
| Edição | pendente |
| Responsividade/acessibilidade | pendente |
| QA | pendente |
| Entrega | pendente |

### Próxima fase

**Fase 4 — Catálogo de produtos**

---

# 19. Status do Documento

**Status:** Em andamento

**Versão:** 1.1

**Última atualização:** 2026-08-10
