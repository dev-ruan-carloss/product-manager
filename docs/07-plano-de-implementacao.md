# Plano de Implementação — Product Management

## 1. Objetivo

Este documento define a ordem de implementação do projeto, reduzindo retrabalho e garantindo que os requisitos definidos nos documentos anteriores sejam implementados de forma incremental.

A implementação deverá seguir a sequência:

    Fundação
        ↓
    Configuração
        ↓
    Infraestrutura
        ↓
    API
        ↓
    Estado
        ↓
    Componentes
        ↓
    Listagem
        ↓
    Detalhes
        ↓
    Favoritos
        ↓
    Formulários
        ↓
    Responsividade
        ↓
    Testes
        ↓
    Revisão final

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

---

# 3. Fase 1 — Inicialização do Projeto

### Objetivo

Preparar a estrutura base da aplicação.

### Tarefas

- [ ] Criar projeto Vue 3 com Vite.
- [ ] Configurar TypeScript.
- [ ] Habilitar TypeScript strict.
- [ ] Configurar Composition API.
- [ ] Configurar `script setup`.
- [ ] Configurar Vue Router.
- [ ] Configurar Pinia.
- [ ] Instalar PrimeVue.
- [ ] Configurar TailwindCSS.
- [ ] Instalar Axios.
- [ ] Instalar vee-validate.
- [ ] Instalar Yup.
- [ ] Configurar ESLint.
- [ ] Configurar Prettier quando necessário.
- [ ] Validar build inicial.

### Resultado esperado

Projeto iniciado e executando localmente sem funcionalidades de negócio.

---

# 4. Fase 2 — Estrutura de Pastas

### Objetivo

Criar uma organização baseada em domínio e responsabilidade.

Estrutura inicial esperada:

    src/
    ├── assets/
    ├── components/
    ├── layouts/
    ├── router/
    ├── services/
    ├── stores/
    ├── types/
    ├── views/
    ├── App.vue
    └── main.ts

A estrutura poderá ser refinada durante a implementação conforme a necessidade real.

---

# 5. Fase 3 — Configuração da API

### Objetivo

Centralizar a comunicação com a FakeStoreAPI.

### Tarefas

- [ ] Criar instância Axios.
- [ ] Configurar URL base.
- [ ] Configurar tratamento básico de erros.
- [ ] Criar serviço de produtos.
- [ ] Criar métodos para listar produtos.
- [ ] Criar método para buscar produto por ID.
- [ ] Criar método para buscar categorias.
- [ ] Criar método POST.
- [ ] Criar método PUT.
- [ ] Tipar respostas da API.
- [ ] Evitar utilização de `any`.

---

# 6. Fase 4 — Tipos e Modelos

### Objetivo

Garantir tipagem consistente entre API, stores e componentes.

### Tarefas

- [ ] Criar tipo `Product`.
- [ ] Criar tipo para avaliação.
- [ ] Criar tipo para categoria.
- [ ] Criar tipos para criação.
- [ ] Criar tipos para atualização.
- [ ] Criar tipos para estados necessários.
- [ ] Garantir compatibilidade com TypeScript strict.

---

# 7. Fase 5 — Pinia

### Objetivo

Implementar o gerenciamento de estado global necessário.

### Store principal

`useFavoritesStore`

### Tarefas

- [ ] Criar store de favoritos.
- [ ] Armazenar IDs favoritos.
- [ ] Implementar adicionar favorito.
- [ ] Implementar remover favorito.
- [ ] Implementar verificação de favorito.
- [ ] Implementar contador.
- [ ] Persistir em localStorage.
- [ ] Restaurar estado ao iniciar a aplicação.

A store deverá permanecer focada exclusivamente no estado de favoritos.

---

# 8. Fase 6 — Vue Router

### Objetivo

Implementar a navegação principal.

### Rotas

- [ ] `/produtos`
- [ ] `/produtos/:id`
- [ ] `/produtos/novo`
- [ ] `/produtos/:id/editar`
- [ ] `/favoritos`

### Tarefas

- [ ] Configurar rotas.
- [ ] Associar cada rota à sua View.
- [ ] Configurar navegação entre páginas.
- [ ] Validar parâmetros de rota.

---

# 9. Fase 7 — Componentes Base

### Objetivo

Criar componentes reutilizáveis antes da construção das telas.

### Componentes

- [ ] Header.
- [ ] ProductCard.
- [ ] ProductGrid.
- [ ] FavoriteButton.
- [ ] LoadingState.
- [ ] EmptyState.
- [ ] ErrorState.
- [ ] Paginação.

PrimeVue deverá ser utilizado sempre que houver componente adequado.

TailwindCSS deverá ser utilizado para composição e responsividade.

---

# 10. Fase 8 — Listagem de Produtos

### Objetivo

Implementar a funcionalidade principal da aplicação.

### Tarefas

- [ ] Buscar produtos através da API.
- [ ] Apresentar loading.
- [ ] Apresentar produtos.
- [ ] Apresentar estado vazio.
- [ ] Apresentar estado de erro.
- [ ] Implementar ProductCard.
- [ ] Implementar busca.
- [ ] Implementar debounce.
- [ ] Implementar filtro por categoria.
- [ ] Implementar ordenação por preço.
- [ ] Implementar paginação.

### Resultado esperado

Usuário consegue navegar pelo catálogo e encontrar produtos utilizando os controles definidos no desafio.

---

# 11. Fase 9 — Página de Detalhes

### Objetivo

Implementar a visualização individual de um produto.

### Tarefas

- [ ] Obter ID através da rota.
- [ ] Buscar produto pela API.
- [ ] Apresentar loading.
- [ ] Apresentar dados completos.
- [ ] Implementar favorito.
- [ ] Implementar acesso à edição.
- [ ] Tratar produto inexistente.
- [ ] Tratar erro da API.

---

# 12. Fase 10 — Favoritos

### Objetivo

Implementar a experiência completa de favoritos.

### Tarefas

- [ ] Criar página `/favoritos`.
- [ ] Utilizar Pinia.
- [ ] Recuperar IDs persistidos.
- [ ] Obter dados necessários dos produtos.
- [ ] Reutilizar ProductCard.
- [ ] Atualizar lista ao desfavoritar.
- [ ] Implementar estado vazio.
- [ ] Implementar contador no Header.

---

# 13. Fase 11 — Formulário de Produto

### Objetivo

Criar o formulário reutilizável para criação e edição.

### Componente

`ProductForm`

### Tarefas

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

---

# 14. Fase 12 — Criação de Produto

### Objetivo

Implementar:

`/produtos/novo`

### Tarefas

- [ ] Integrar ProductForm.
- [ ] Carregar categorias.
- [ ] Validar formulário.
- [ ] Executar POST.
- [ ] Apresentar Toast de sucesso.
- [ ] Apresentar Toast de erro.
- [ ] Evitar perda dos dados em caso de erro.
- [ ] Navegar após sucesso.

---

# 15. Fase 13 — Edição de Produto

### Objetivo

Implementar:

`/produtos/:id/editar`

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

# 16. Fase 14 — Responsividade

### Objetivo

Garantir funcionamento adequado a partir de 360px.

### Tarefas

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

---

# 17. Fase 15 — Acessibilidade

### Tarefas

- [ ] Validar labels dos campos.
- [ ] Validar textos alternativos.
- [ ] Validar nomes acessíveis dos botões.
- [ ] Validar navegação por teclado.
- [ ] Validar foco.
- [ ] Validar mensagens de erro.
- [ ] Verificar uso semântico do HTML.
- [ ] Garantir que estados não dependam somente de cor.

---

# 18. Fase 16 — Tratamento de Estados

Todas as telas que realizam operações assíncronas deverão possuir os estados necessários.

### Loading

- [ ] Listagem.
- [ ] Detalhes.
- [ ] Edição.
- [ ] Formulário.

### Erro

- [ ] Listagem.
- [ ] Detalhes.
- [ ] Criação.
- [ ] Edição.

### Vazio

- [ ] Resultados sem correspondência.
- [ ] Favoritos vazios.

---

# 19. Fase 17 — Revisão Técnica

### Código

- [ ] Remover `any`.
- [ ] Verificar TypeScript strict.
- [ ] Remover código duplicado.
- [ ] Verificar responsabilidades dos componentes.
- [ ] Verificar responsabilidades das stores.
- [ ] Verificar services.
- [ ] Verificar imports.
- [ ] Verificar nomes.
- [ ] Verificar componentes não utilizados.

### Qualidade

- [ ] Executar lint.
- [ ] Executar build.
- [ ] Corrigir warnings relevantes.
- [ ] Verificar console.
- [ ] Verificar erros de runtime.

---

# 20. Fase 18 — Testes Manuais

### Produtos

- [ ] Listar produtos.
- [ ] Pesquisar produto.
- [ ] Aplicar debounce.
- [ ] Filtrar categoria.
- [ ] Ordenar menor preço.
- [ ] Ordenar maior preço.
- [ ] Navegar pela paginação.

### Detalhes

- [ ] Abrir produto.
- [ ] Produto inexistente.
- [ ] Favoritar.
- [ ] Desfavoritar.

### Favoritos

- [ ] Adicionar favorito.
- [ ] Remover favorito.
- [ ] Recarregar página.
- [ ] Confirmar persistência no localStorage.
- [ ] Acessar `/favoritos`.
- [ ] Validar estado vazio.

### Criação

- [ ] Abrir formulário.
- [ ] Validar campos vazios.
- [ ] Validar preço inválido.
- [ ] Validar URL inválida.
- [ ] Criar produto.
- [ ] Validar sucesso.
- [ ] Validar erro.

### Edição

- [ ] Abrir edição.
- [ ] Carregar dados.
- [ ] Validar campos.
- [ ] Atualizar produto.
- [ ] Validar sucesso.
- [ ] Validar erro.

---

# 21. Fase 19 — Revisão Visual

Verificar:

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

---

# 22. Fase 20 — Documentação Final

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

Os documentos deverão permanecer atualizados conforme decisões tomadas durante a implementação.

---

# 23. Ordem dos Commits

Os commits deverão ser pequenos e relacionados a uma única responsabilidade.

Exemplos:

    feat: inicializa projeto Vue

    feat: configura infraestrutura da aplicação

    feat: implementa servico de produtos

    feat: adiciona store de favoritos

    feat: implementa listagem de produtos

    feat: implementa busca e filtros de produtos

    feat: implementa detalhes do produto

    feat: implementa favoritos

    feat: implementa formulario de produto

    feat: implementa criacao de produto

    feat: implementa edicao de produto

    fix: ajusta responsividade dos produtos

    docs: atualiza documentacao do projeto

---

# 24. Regra de Implementação

Nenhuma funcionalidade deverá ser implementada sem que exista um requisito ou decisão correspondente na documentação.

Quando surgir uma necessidade não prevista:

1. identificar o motivo;
2. avaliar se faz parte do escopo;
3. atualizar a documentação quando necessário;
4. somente depois implementar.

Isso mantém a documentação e o código sincronizados.

---

# 25. Critério de Conclusão

A implementação será considerada concluída quando:

- [ ] Todos os requisitos do desafio estiverem implementados.
- [ ] Todas as rotas estiverem funcionando.
- [ ] API estiver integrada.
- [ ] Busca estiver funcionando com debounce.
- [ ] Filtro por categoria estiver funcionando.
- [ ] Ordenação por preço estiver funcionando.
- [ ] Paginação estiver funcionando.
- [ ] Favoritos estiverem funcionando com Pinia.
- [ ] Favoritos estiverem persistidos em localStorage.
- [ ] Detalhes estiverem funcionando.
- [ ] Criação estiver funcionando.
- [ ] Edição estiver funcionando.
- [ ] vee-validate estiver integrado.
- [ ] Yup estiver integrado.
- [ ] PrimeVue estiver integrado.
- [ ] TailwindCSS estiver integrado.
- [ ] Estados de loading, erro e vazio estiverem implementados.
- [ ] Responsividade estiver validada a partir de 360px.
- [ ] Acessibilidade básica estiver validada.
- [ ] Lint estiver passando.
- [ ] Build estiver passando.
- [ ] README estiver atualizado.
- [ ] Documentação SDD estiver consistente com o código.

---

# 26. Status do Documento

**Status:** Em definição

**Versão:** 1.0