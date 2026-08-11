# Definição de Pronto — Product Management

## 1. Objetivo

Este documento define os critérios necessários para considerar uma funcionalidade ou o projeto concluído.

Uma tarefa somente será considerada pronta quando atender aos requisitos funcionais, técnicos, visuais e de qualidade definidos na documentação.

---

# 2. Código

Uma funcionalidade será considerada pronta quando:

- [x] Código estiver implementado.
- [x] Responsabilidade dos componentes estiver clara.
- [x] Não existir código duplicado desnecessário.
- [x] Não existirem imports não utilizados.
- [x] Não existirem componentes não utilizados.
- [x] Não existirem `any` desnecessários.
- [x] TypeScript strict estiver sendo respeitado.
- [x] Composition API estiver sendo utilizada.
- [x] `script setup` estiver sendo utilizado.
- [x] Nomes de componentes, funções e variáveis forem claros.

---

# 3. Requisitos Funcionais

Cada funcionalidade deverá:

- [x] Atender ao requisito correspondente do desafio.
- [x] Possuir comportamento esperado em condições normais.
- [x] Possuir tratamento para situações de erro.
- [x] Possuir estado de carregamento quando houver operação assíncrona.
- [x] Possuir estado vazio quando aplicável.
- [x] Não introduzir funcionalidades fora do escopo sem justificativa.

---

# 4. API

As integrações deverão:

- [x] Utilizar Axios.
- [x] Utilizar a FakeStoreAPI definida no desafio.
- [x] Possuir services responsáveis pelas chamadas.
- [x] Possuir tipos para requisições e respostas quando aplicável.
- [x] Tratar erros de requisição.
- [x] Evitar chamadas duplicadas desnecessárias.
- [x] Utilizar os endpoints definidos no contrato da API.

Operações obrigatórias deverão estar funcionando:

- [x] GET de produtos.
- [x] GET de produto por ID.
- [x] GET de categorias.
- [x] POST de produto.
- [x] PUT de produto.

---

# 5. Estado

O gerenciamento de estado deverá atender aos critérios:

- [x] Pinia utilizada para estado global necessário.
- [x] Favoritos gerenciados através de Pinia.
- [x] Favoritos persistidos em localStorage.
- [x] Estado local utilizado quando não houver necessidade de estado global.
- [x] Não existir store global desnecessária.
- [x] Estado permanecer consistente após navegação.

---

# 6. Favoritos

A funcionalidade de favoritos será considerada pronta quando:

- [x] Usuário conseguir favoritar um produto.
- [x] Usuário conseguir desfavoritar um produto.
- [x] Estado visual refletir a alteração imediatamente.
- [x] Favoritos forem armazenados no Pinia.
- [x] IDs dos favoritos forem persistidos no localStorage.
- [x] Estado for restaurado após recarregar a aplicação.
- [x] Página `/favoritos` estiver funcionando.
- [x] Produto removido dos favoritos desaparecer da página de favoritos.
- [x] Estado vazio estiver implementado.

---

# 7. Listagem de Produtos

A listagem será considerada pronta quando:

- [x] Produtos forem carregados da API.
- [x] Loading estiver implementado.
- [x] Erro estiver implementado.
- [x] Estado vazio estiver implementado.
- [x] Busca estiver funcionando.
- [x] Debounce estiver funcionando.
- [x] Filtro por categoria estiver funcionando.
- [x] Ordenação por menor preço estiver funcionando.
- [x] Ordenação por maior preço estiver funcionando.
- [x] Ordenação por nome A–Z estiver funcionando.
- [x] Ordenação por nome Z–A estiver funcionando.
- [x] Ordenação por avaliação (maior → menor) estiver funcionando (`rate`, depois `count`).
- [x] Ordenação por avaliação (menor → maior) estiver funcionando (`rate`, depois `count`).
- [x] Paginação estiver funcionando.
- [x] ProductCard estiver sendo reutilizado.
- [x] Favoritos funcionarem dentro dos cards.

---

# 8. Detalhes do Produto

A página de detalhes será considerada pronta quando:

- [x] Rota `/produtos/:id` estiver funcionando.
- [x] ID for obtido corretamente da rota.
- [x] Produto for carregado pela API.
- [x] Loading estiver implementado.
- [x] Dados completos forem apresentados.
- [x] Favorito estiver disponível.
- [x] Acesso à edição estiver disponível.
- [x] Produto inexistente possuir tratamento adequado.
- [x] Erros da API forem tratados.

---

# 9. Formulários

Os formulários serão considerados prontos quando:

- [x] `vee-validate` estiver integrado.
- [x] `Yup` estiver integrado.
- [x] Campos obrigatórios estiverem validados.
- [x] Preço aceitar somente valor válido.
- [x] Preço for maior que zero.
- [x] URL da imagem possuir validação.
- [x] Mensagens de erro forem apresentadas corretamente.
- [x] Estado de envio estiver implementado.
- [x] Múltiplos envios forem evitados.
- [x] Dados preenchidos forem preservados em caso de erro.

---

# 10. Criação de Produto

A criação será considerada pronta quando:

- [x] `/produtos/novo` estiver funcionando.
- [x] Formulário estiver carregando categorias.
- [x] Validações estiverem funcionando.
- [x] POST estiver integrado.
- [x] Loading estiver apresentado durante envio.
- [x] Toast de sucesso estiver funcionando.
- [x] Toast de erro estiver funcionando.
- [x] Usuário for direcionado após sucesso.
- [x] Erro não apagar os dados preenchidos.

---

# 11. Edição de Produto

A edição será considerada pronta quando:

- [x] `/produtos/:id/editar` estiver funcionando.
- [x] Produto existente for carregado.
- [x] Formulário for preenchido com os dados atuais.
- [x] Validações estiverem funcionando.
- [x] PUT estiver integrado.
- [x] Loading estiver apresentado durante envio.
- [x] Toast de sucesso estiver funcionando.
- [x] Toast de erro estiver funcionando.
- [x] Produto inexistente possuir tratamento.
- [x] Usuário for direcionado após sucesso.

---

# 12. Interface

A interface será considerada pronta quando:

- [x] PrimeVue estiver sendo utilizado.
- [x] TailwindCSS estiver sendo utilizado.
- [x] Componentes reutilizáveis estiverem implementados.
- [x] Layout estiver consistente.
- [x] Estados de interação estiverem definidos.
- [x] Loading estiver visualmente adequado.
- [x] Erros forem compreensíveis.
- [x] Estados vazios forem compreensíveis.
- [x] Toasts estiverem funcionando.

---

# 13. Responsividade

A aplicação deverá ser validada em:

- [ ] 360px.
- [ ] Mobile.
- [ ] Tablet.
- [ ] Desktop.

Também deverá ser verificado:

- [ ] Ausência de overflow horizontal.
- [ ] Grid adaptável.
- [ ] Navegação adaptável.
- [ ] Formulários adaptáveis.
- [ ] Botões adequados para toque.
- [ ] Textos sem quebra inadequada.

---

# 14. Acessibilidade

Antes de considerar a interface pronta:

- [ ] Campos possuem labels.
- [ ] Botões possuem nomes acessíveis.
- [ ] Imagens possuem `alt`.
- [ ] Elementos podem ser acessados por teclado.
- [ ] Foco permanece visível.
- [ ] Mensagens de erro são identificáveis.
- [ ] Estados não dependem somente de cor.
- [ ] HTML semântico é utilizado quando apropriado.

---

# 15. Qualidade

Antes da conclusão:

- [ ] ESLint executado.
- [ ] Build executado.
- [ ] Nenhum erro de TypeScript.
- [ ] Nenhum erro de runtime conhecido.
- [ ] Console sem erros relacionados à aplicação.
- [ ] Imports revisados.
- [ ] Código duplicado revisado.
- [ ] Componentes revisados.
- [ ] Services revisados.
- [ ] Stores revisadas.

---

# 16. Testes Manuais

Os principais fluxos deverão ser executados manualmente.

### Produtos

- [ ] Listagem.
- [ ] Busca.
- [ ] Debounce.
- [ ] Categoria.
- [ ] Menor preço.
- [ ] Maior preço.
- [ ] Nome A–Z.
- [ ] Nome Z–A.
- [ ] Paginação.

### Favoritos

- [ ] Favoritar.
- [ ] Desfavoritar.
- [ ] Recarregar aplicação.
- [ ] Persistência.
- [ ] Página de favoritos.
- [ ] Estado vazio.

### Detalhes

- [ ] Abrir produto.
- [ ] Produto inexistente.
- [ ] Favoritar.
- [ ] Acessar edição.

### Criação

- [ ] Formulário vazio.
- [ ] Validação.
- [ ] Criação com sucesso.
- [ ] Erro da API.

### Edição

- [ ] Carregamento.
- [ ] Validação.
- [ ] Atualização com sucesso.
- [ ] Erro da API.

---

# 17. Documentação

O projeto será considerado documentado quando:

- [ ] README estiver atualizado.
- [x] Requisitos estiverem documentados.
- [x] Arquitetura estiver documentada.
- [x] Decisões técnicas estiverem documentadas.
- [x] Contrato da API estiver documentado.
- [x] Modelos de dados estiverem documentados.
- [x] Especificação de UI estiver documentada.
- [x] Plano de implementação estiver documentado.
- [x] Definição de pronto estiver documentada.

A documentação não deverá contradizer o comportamento implementado.

A atualização final do README e a verificação completa de consistência SDD × código permanecem na Fase 11.

---

# 18. Git

Os commits deverão:

- [ ] Ser pequenos e relacionados a uma responsabilidade.
- [ ] Utilizar Conventional Commits.
- [ ] Possuir mensagens claras.
- [ ] Evitar commits genéricos como `update`, `changes` ou `fix stuff`.
- [ ] Manter o histórico compreensível.

Exemplos:

    feat: implementa listagem de produtos
    feat: adiciona favoritos com Pinia
    fix: corrige paginacao de produtos
    docs: atualiza documentacao da arquitetura

---

# 19. Critério Final

O projeto somente será considerado pronto quando:

- [ ] Todos os requisitos obrigatórios do desafio estiverem implementados.
- [ ] Todas as funcionalidades estiverem funcionando.
- [ ] API estiver integrada.
- [ ] Favoritos estiverem persistidos.
- [ ] Formulários estiverem validados.
- [ ] Responsividade estiver validada.
- [ ] Acessibilidade básica estiver validada.
- [ ] Estados de loading, erro e vazio estiverem implementados.
- [ ] Lint estiver passando.
- [ ] Build estiver passando.
- [ ] README estiver atualizado.
- [ ] Documentação estiver consistente com o código.

---

# 20. Regra de Aprovação

Uma funcionalidade não deverá ser considerada pronta apenas porque o código foi escrito.

Ela deverá atender simultaneamente:

    Requisito
        +
    Implementação
        +
    Validação
        +
    Interface
        +
    Qualidade
        +
    Documentação

Somente após esses critérios serem atendidos a tarefa poderá ser considerada concluída.

---

# 21. Status do Documento

**Status:** Em andamento

**Versão:** 1.3

**Última atualização:** 2026-08-11