# Definição de Pronto — Product Management

## 1. Objetivo

Este documento define os critérios necessários para considerar uma funcionalidade ou o projeto concluído.

Uma tarefa somente será considerada pronta quando atender aos requisitos funcionais, técnicos, visuais e de qualidade definidos na documentação.

---

# 2. Código

Uma funcionalidade será considerada pronta quando:

- [ ] Código estiver implementado.
- [ ] Responsabilidade dos componentes estiver clara.
- [ ] Não existir código duplicado desnecessário.
- [ ] Não existirem imports não utilizados.
- [ ] Não existirem componentes não utilizados.
- [ ] Não existirem `any` desnecessários.
- [ ] TypeScript strict estiver sendo respeitado.
- [ ] Composition API estiver sendo utilizada.
- [ ] `script setup` estiver sendo utilizado.
- [ ] Nomes de componentes, funções e variáveis forem claros.

---

# 3. Requisitos Funcionais

Cada funcionalidade deverá:

- [ ] Atender ao requisito correspondente do desafio.
- [ ] Possuir comportamento esperado em condições normais.
- [ ] Possuir tratamento para situações de erro.
- [ ] Possuir estado de carregamento quando houver operação assíncrona.
- [ ] Possuir estado vazio quando aplicável.
- [ ] Não introduzir funcionalidades fora do escopo sem justificativa.

---

# 4. API

As integrações deverão:

- [ ] Utilizar Axios.
- [ ] Utilizar a FakeStoreAPI definida no desafio.
- [ ] Possuir services responsáveis pelas chamadas.
- [ ] Possuir tipos para requisições e respostas quando aplicável.
- [ ] Tratar erros de requisição.
- [ ] Evitar chamadas duplicadas desnecessárias.
- [ ] Utilizar os endpoints definidos no contrato da API.

Operações obrigatórias deverão estar funcionando:

- [ ] GET de produtos.
- [ ] GET de produto por ID.
- [ ] GET de categorias.
- [x] POST de produto.
- [x] PUT de produto.

---

# 5. Estado

O gerenciamento de estado deverá atender aos critérios:

- [ ] Pinia utilizada para estado global necessário.
- [ ] Favoritos gerenciados através de Pinia.
- [ ] Favoritos persistidos em localStorage.
- [ ] Estado local utilizado quando não houver necessidade de estado global.
- [ ] Não existir store global desnecessária.
- [ ] Estado permanecer consistente após navegação.

---

# 6. Favoritos

A funcionalidade de favoritos será considerada pronta quando:

- [ ] Usuário conseguir favoritar um produto.
- [ ] Usuário conseguir desfavoritar um produto.
- [ ] Estado visual refletir a alteração imediatamente.
- [ ] Favoritos forem armazenados no Pinia.
- [ ] IDs dos favoritos forem persistidos no localStorage.
- [ ] Estado for restaurado após recarregar a aplicação.
- [ ] Página `/favoritos` estiver funcionando.
- [ ] Produto removido dos favoritos desaparecer da página de favoritos.
- [ ] Estado vazio estiver implementado.

---

# 7. Listagem de Produtos

A listagem será considerada pronta quando:

- [ ] Produtos forem carregados da API.
- [ ] Loading estiver implementado.
- [ ] Erro estiver implementado.
- [ ] Estado vazio estiver implementado.
- [ ] Busca estiver funcionando.
- [ ] Debounce estiver funcionando.
- [ ] Filtro por categoria estiver funcionando.
- [ ] Ordenação por menor preço estiver funcionando.
- [ ] Ordenação por maior preço estiver funcionando.
- [ ] Paginação estiver funcionando.
- [ ] ProductCard estiver sendo reutilizado.
- [ ] Favoritos funcionarem dentro dos cards.

---

# 8. Detalhes do Produto

A página de detalhes será considerada pronta quando:

- [ ] Rota `/produtos/:id` estiver funcionando.
- [ ] ID for obtido corretamente da rota.
- [ ] Produto for carregado pela API.
- [ ] Loading estiver implementado.
- [ ] Dados completos forem apresentados.
- [ ] Favorito estiver disponível.
- [x] Acesso à edição estiver disponível.
- [ ] Produto inexistente possuir tratamento adequado.
- [ ] Erros da API forem tratados.

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

- [ ] PrimeVue estiver sendo utilizado.
- [ ] TailwindCSS estiver sendo utilizado.
- [ ] Componentes reutilizáveis estiverem implementados.
- [ ] Layout estiver consistente.
- [ ] Estados de interação estiverem definidos.
- [ ] Loading estiver visualmente adequado.
- [ ] Erros forem compreensíveis.
- [ ] Estados vazios forem compreensíveis.
- [ ] Toasts estiverem funcionando.

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
- [ ] Requisitos estiverem documentados.
- [ ] Arquitetura estiver documentada.
- [ ] Decisões técnicas estiverem documentadas.
- [ ] Contrato da API estiver documentado.
- [ ] Modelos de dados estiverem documentados.
- [ ] Especificação de UI estiver documentada.
- [ ] Plano de implementação estiver documentado.
- [ ] Definição de pronto estiver documentada.

A documentação não deverá contradizer o comportamento implementado.

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

**Status:** Em definição

**Versão:** 1.2