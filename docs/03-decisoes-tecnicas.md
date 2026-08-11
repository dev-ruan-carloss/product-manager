# Decisões Técnicas — Product Management

## 1. Objetivo

Este documento registra as principais decisões técnicas adotadas para o desenvolvimento do projeto Product Management.

O objetivo é documentar não apenas quais tecnologias serão utilizadas, mas também o motivo de cada escolha.

As decisões registradas aqui deverão servir como referência durante a implementação e facilitar a manutenção e evolução do projeto.

Uma decisão poderá ser alterada posteriormente caso surja uma necessidade técnica real. Nesse caso, a alteração deverá ser registrada neste documento.

---

# 2. Stack Principal

A aplicação será desenvolvida utilizando:

- Vue 3;
- TypeScript;
- Vite;
- Vue Router;
- Pinia;
- Axios;
- biblioteca de componentes de interface;
- biblioteca de validação de formulários;
- Vitest e Vue Test Utils (previstos para a fase de qualidade/testes);
- ESLint;
- Prettier.

A escolha das bibliotecas deverá priorizar:

- estabilidade;
- documentação;
- integração com Vue 3;
- manutenção ativa;
- simplicidade;
- adequação ao tamanho do projeto.

---

# 3. Vue 3

## Decisão

Utilizar Vue 3 como framework principal da aplicação.

## Justificativa

Vue 3 oferece uma estrutura adequada para aplicações frontend modernas e possui recursos suficientes para atender ao escopo do projeto sem introduzir complexidade desnecessária.

A utilização do Vue 3 também permite demonstrar conhecimento de:

- componentes;
- Composition API;
- reatividade;
- props;
- emits;
- composables;
- gerenciamento de estado;
- roteamento.

---

# 4. Composition API

## Decisão

Utilizar Composition API como padrão para desenvolvimento dos componentes.

A sintaxe `<script setup>` será utilizada sempre que apropriado.

## Justificativa

A Composition API permite organizar a lógica por responsabilidade em vez de depender exclusivamente da estrutura tradicional baseada em opções.

Isso facilita:

- reutilização de lógica;
- criação de composables;
- organização de componentes;
- manutenção;
- tipagem com TypeScript.

---

# 5. TypeScript

## Decisão

Utilizar TypeScript em todo o código da aplicação.

O projeto deverá utilizar configuração strict.

## Justificativa

O TypeScript reduz erros relacionados a tipos e torna os contratos da aplicação mais explícitos.

No contexto deste projeto, ele será utilizado principalmente para representar:

- produtos;
- categorias;
- avaliações;
- payloads;
- respostas da API;
- propriedades dos componentes;
- estados;
- parâmetros de funções.

O uso de `any` deverá ser evitado.

---

# 6. Vite

## Decisão

Utilizar Vite como ferramenta de desenvolvimento e build.

## Justificativa

Vite possui integração direta com Vue e oferece um ambiente de desenvolvimento rápido, configuração relativamente simples e processo de build adequado para aplicações frontend.

A escolha também reduz a quantidade de configuração necessária para iniciar o projeto.

---

# 7. Vue Router

## Decisão

Utilizar Vue Router para gerenciamento das rotas.

## Justificativa

O projeto possui diferentes áreas que precisam ser acessíveis através de URLs específicas.

Entre elas:

- listagem de produtos;
- detalhes;
- favoritos;
- criação;
- edição.

O Vue Router fornece integração oficial com Vue e permite organizar essas rotas de forma declarativa.

---

# 8. Pinia

## Decisão

Utilizar Pinia para gerenciamento de estado global.

## Justificativa

Pinia é a solução oficial de gerenciamento de estado para aplicações Vue modernas e possui integração adequada com Vue 3 e TypeScript.

Entretanto, o projeto não deverá utilizar Pinia para todo estado da aplicação.

A regra será:

- estado local de componente → manter no componente;
- estado compartilhado entre componentes → considerar composable;
- estado global persistente ou compartilhado → utilizar Pinia.

Inicialmente, o principal estado global será o gerenciamento de favoritos.

---

# 9. Axios

## Decisão

Utilizar Axios para comunicação com a Fake Store API.

## Justificativa

Axios fornece uma interface simples para requisições HTTP e permite centralizar configurações do cliente.

A utilização de um cliente HTTP separado da interface facilita a criação de uma camada de services.

O código dos componentes não deverá realizar chamadas HTTP diretamente.

---

# 10. Camada de Services

## Decisão

Criar uma camada específica para comunicação com a API.

Os services serão responsáveis pelas operações relacionadas aos recursos externos.

Exemplo:

- `productService` (produtos e categorias).

Não foi criado um `categoryService` separado: `getCategories()` permanece em `productService`, pois o endpoint `/products/categories` pertence ao recurso de produtos da Fake Store API.

## Justificativa

A separação da comunicação HTTP da interface reduz o acoplamento entre apresentação e infraestrutura.

Isso também facilita:

- testes;
- manutenção;
- substituição da API;
- tratamento de respostas;
- reutilização das operações.

---

# 11. Biblioteca de Componentes de Interface

## Decisão

Utilizar **PrimeVue** como biblioteca de componentes de interface.

## Justificativa

PrimeVue é compatível com Vue 3 e TypeScript, oferece componentes de formulário, feedback (Toast, Skeleton) e navegação, e atende aos critérios de consistência visual e acessibilidade básica do projeto.

TailwindCSS complementa o PrimeVue na composição de layout, espaçamento e responsividade.

---

# 12. Validação de Formulários

## Decisão

Utilizar **vee-validate** com **Yup** (`@vee-validate/yup`) para validação dos formulários.

O schema Yup permanece centralizado em `src/utils/productFormSchema.ts` e é reutilizado por criação e edição.

## Justificativa

A criação de regras de validação diretamente dentro dos componentes tende a aumentar a complexidade e dificultar a reutilização.

Uma solução dedicada permite manter as regras organizadas e facilita testes.

---

# 13. Persistência de Favoritos

## Decisão

Utilizar `localStorage` para persistência dos favoritos.

## Justificativa

Os favoritos não precisam ser persistidos em um servidor para atender ao escopo do projeto.

O `localStorage` permite:

- persistência após recarregar a página;
- implementação simples;
- ausência de dependência adicional;
- funcionamento totalmente no navegador.

Somente os dados necessários para identificar os favoritos deverão ser armazenados.

A aplicação não deverá armazenar dados completos dos produtos no `localStorage` sem necessidade.

---

# 14. Gerenciamento de Estado Local

## Decisão

Priorizar estado local sempre que ele não precisar ser compartilhado.

Exemplos:

- abertura de modal;
- estado de um campo;
- loading específico de um componente;
- controle visual;
- seleção temporária.

## Justificativa

Centralizar todo o estado em uma store aumenta o acoplamento e dificulta a compreensão da aplicação.

O estado deverá permanecer o mais próximo possível de onde é utilizado.

---

# 15. Composables

## Decisão

Utilizar composables para lógica reutilizável relacionada ao comportamento da interface.

Exemplos possíveis:

- `useProductsCatalog`;
- `useProductListControls`;
- `useDebouncedRef`;
- `useProductDetails`;
- `useFavoriteProducts`.

## Justificativa

Composables permitem reutilizar lógica sem duplicá-la entre componentes.

Eles também ajudam a manter os componentes focados na apresentação e interação.

Um composable não deverá ser criado apenas para transformar poucas linhas de código em outro arquivo.

---

# 16. Debounce

## Decisão

Utilizar debounce na pesquisa de produtos.

## Justificativa

A pesquisa não deve executar uma operação imediatamente a cada caractere digitado.

O debounce reduz operações desnecessárias e melhora a experiência do usuário.

O tempo de debounce adotado é **300ms**, via `useDebouncedRef` em `useProductListControls`.

---

# 17. Paginação

## Decisão

A paginação será realizada no frontend caso a Fake Store API não disponibilize paginação adequada para o fluxo necessário.

## Justificativa

A API utilizada no projeto possui limitações em relação à paginação.

Como o volume de dados esperado para este projeto é pequeno, a aplicação poderá carregar os produtos e realizar a divisão em páginas no frontend.

A implementação deverá ser mantida simples e preparada para uma futura migração para paginação no backend caso a fonte de dados seja substituída.

---

# 18. Testes

## Decisão

Utilizar Vitest como framework de testes e Vue Test Utils para testes de componentes Vue.

Essa decisão define a **ferramenta pretendida** para testes automatizados. Ela **não exige** que Vitest e Vue Test Utils estejam instalados desde a fundação do projeto.

A configuração da infraestrutura de testes automatizados deverá ocorrer na fase própria de qualidade/QA do plano de implementação, quando houver código de negócio suficiente para justificar a cobertura.

Até lá, a validação das fases iniciais poderá ocorrer por inspeção, TypeScript, lint, build e testes manuais relevantes.

## Justificativa

Vitest possui integração adequada com o ecossistema Vite.

Vue Test Utils fornece recursos específicos para montar e testar componentes Vue.

A estratégia deverá priorizar testes que validem comportamento e regras importantes, evitando testes excessivamente acoplados à implementação interna.

Adiar a instalação evita dependências ociosas nas fases em que ainda não há telas, formulários ou fluxos prontos para cobertura automatizada.

---

# 19. Estratégia de Testes

Os testes serão divididos principalmente em:

## Testes de unidade

Utilizados para:

- funções auxiliares;
- validações;
- composables;
- regras de negócio isoladas.

## Testes de componentes

Utilizados para:

- interações importantes;
- estados visuais relevantes;
- formulários;
- componentes com comportamento próprio.

## Testes de fluxo

Serão utilizados para validar os principais fluxos da aplicação quando houver benefício real.

Exemplos:

- pesquisar produto;
- favoritar produto;
- criar produto;
- editar produto.

A cobertura não deverá ser utilizada como único indicador de qualidade.

---

# 20. ESLint

## Decisão

Utilizar ESLint para análise estática do código.

## Justificativa

O ESLint ajuda a identificar:

- problemas de código;
- padrões inconsistentes;
- possíveis erros;
- práticas inadequadas.

A configuração deverá ser compatível com Vue 3 e TypeScript.

---

# 21. Prettier

## Decisão

Utilizar Prettier para formatação automática do código.

## Justificativa

A formatação automática reduz discussões e inconsistências relacionadas ao estilo do código.

O objetivo é manter o foco das revisões em comportamento, arquitetura e qualidade técnica.

---

# 22. Git

## Decisão

Utilizar Git para controle de versão.

Os commits deverão ser pequenos e representar mudanças coerentes.

A mensagem dos commits deverá seguir um padrão consistente.

Exemplos:

- `docs: define requisitos do projeto`;
- `docs: define arquitetura do projeto`;
- `feat: implementa listagem de produtos`;
- `fix: corrige persistência de favoritos`;
- `test: adiciona testes de favoritos`;
- `refactor: reorganiza services de produtos`.

---

# 23. Documentação como Fonte de Verdade

## Decisão

A documentação localizada em `docs/` será considerada a referência principal para implementação.

Antes de realizar alterações estruturais, o código deverá ser confrontado com:

- requisitos;
- arquitetura;
- decisões técnicas;
- contrato da API;
- especificação da interface;
- plano de implementação.

## Justificativa

O objetivo é evitar que a implementação seja conduzida exclusivamente pela geração de código.

A documentação define a intenção do sistema e o código implementa essa intenção.

---

# 24. Uso de Inteligência Artificial

## Decisão

Ferramentas de inteligência artificial poderão ser utilizadas durante o desenvolvimento.

A IA será considerada uma ferramenta de apoio e não a responsável pelas decisões arquiteturais.

## Regras

Toda implementação gerada por IA deverá:

- estar alinhada aos requisitos;
- respeitar a arquitetura;
- respeitar as decisões técnicas;
- ser revisada pelo desenvolvedor;
- ser executada e validada;
- possuir testes quando aplicável;
- não introduzir dependências sem justificativa.

A IA não deverá alterar a arquitetura ou adicionar funcionalidades fora do escopo sem uma decisão explícita.

---

# 25. Uso do Cursor Agent

## Decisão

O Cursor Agent poderá ser utilizado para auxiliar na implementação seguindo a documentação existente.

O agente deverá receber tarefas pequenas e objetivas.

Exemplos:

- implementar um componente;
- criar um service;
- implementar um composable;
- criar testes;
- corrigir um comportamento específico.

Evitar solicitações excessivamente amplas como:

"Implemente todo o projeto."

## Justificativa

Dividir o desenvolvimento em tarefas menores facilita:

- revisão;
- identificação de erros;
- controle das alterações;
- entendimento do código;
- validação dos requisitos.

---

# 26. Regras para Dependências

Uma nova dependência somente deverá ser adicionada quando houver uma justificativa clara.

Antes de adicionar uma biblioteca, deverão ser considerados:

- necessidade real;
- tamanho;
- manutenção;
- documentação;
- compatibilidade com Vue 3;
- compatibilidade com TypeScript;
- impacto no bundle;
- complexidade adicionada.

Não deverão ser adicionadas bibliotecas apenas para resolver problemas triviais que possam ser solucionados com recursos nativos.

---

# 27. Tratamento de Erros

## Decisão

Os erros serão tratados em diferentes níveis da aplicação.

### Service

Responsável por lidar com detalhes técnicos da comunicação.

### Composable ou Store

Responsável por disponibilizar o estado da operação para a interface.

### View ou Component

Responsável por apresentar feedback compreensível ao usuário.

Essa separação evita que componentes precisem conhecer detalhes internos da API.

---

# 28. Modelagem de Dados

## Decisão

Os modelos da API serão representados por tipos TypeScript.

Os tipos deverão ser separados de acordo com sua responsabilidade.

Exemplos:

- modelo de produto retornado pela API;
- payload de criação;
- payload de atualização;
- avaliação;
- categoria.

Quando necessário, os dados externos poderão ser transformados para um modelo interno mais adequado à aplicação.

---

# 29. Segurança

Apesar de o projeto não possuir autenticação ou dados sensíveis, algumas práticas serão mantidas.

A aplicação deverá:

- evitar inserção de HTML arbitrário;
- não armazenar informações sensíveis no `localStorage`;
- validar dados recebidos;
- não expor credenciais;
- não armazenar chaves secretas no frontend.

Como a Fake Store API não exige credenciais privadas para o escopo previsto, nenhuma chave secreta deverá ser incluída no código.

---

# 30. Performance

A aplicação deverá priorizar performance sem introduzir complexidade prematura.

Serão considerados:

- debounce na pesquisa;
- carregamento eficiente dos dados;
- componentes reutilizáveis;
- redução de renders desnecessários;
- imagens adequadamente dimensionadas;
- uso adequado de recursos do navegador.

Otimizações avançadas somente deverão ser implementadas quando houver evidência de necessidade.

---

# 31. Acessibilidade

A acessibilidade será considerada desde a construção dos componentes.

Deverão ser priorizados:

- HTML semântico;
- navegação por teclado;
- labels;
- textos alternativos;
- contraste adequado;
- foco visível;
- mensagens de erro compreensíveis;
- componentes acessíveis da biblioteca escolhida.

---

# 32. Responsividade

A interface deverá seguir uma abordagem responsiva.

A implementação deverá priorizar:

- mobile;
- tablet;
- desktop.

Os componentes deverão se adaptar ao espaço disponível sem depender de dimensões fixas desnecessárias.

---

# 33. Critérios para Revisão Técnica

Antes de considerar uma funcionalidade concluída, deverão ser avaliados:

- requisito atendido;
- arquitetura respeitada;
- tipagem adequada;
- ausência de duplicação desnecessária;
- tratamento de loading;
- tratamento de erro;
- tratamento de estado vazio;
- responsividade;
- acessibilidade;
- testes aplicáveis;
- lint;
- formatação;
- build.

---

# 34. Decisões Pendentes

As seguintes decisões ainda precisam ser refinadas durante a implementação correspondente:

- estratégia detalhada de testes automatizados (configuração do Vitest na fase de QA).

Itens já definidos e não mais pendentes:

- biblioteca de componentes visuais: PrimeVue;
- biblioteca de validação: vee-validate + Yup;
- configuração de ESLint e Prettier;
- tratamento básico de erros da API em `config/api.ts`;
- estratégia de feedback ao usuário via Toasts do PrimeVue.
As decisões restantes deverão ser tomadas considerando o escopo real do projeto e não apenas popularidade das ferramentas.

---

# 35. Registro de Alterações

Toda mudança relevante nas decisões técnicas deverá ser registrada neste documento.

Para cada alteração, deverão ser considerados:

- decisão anterior;
- nova decisão;
- motivo da alteração;
- impacto;
- data.

---

## 35.1 — Localização do cliente HTTP

**Data:** 2026-08-10

**Decisão anterior:**

O cliente Axios ficava em `src/services/api.ts`, junto dos services de domínio.

**Nova decisão:**

O cliente Axios passa a ficar em `src/config/api.ts`.

**Motivo:**

Separar configuração de infraestrutura da camada de services, que permanece responsável apenas pelas operações de domínio sobre a API.

**Impacto:**

- estrutura de pastas atualizada em `02-arquitetura.md`;
- contrato da API atualizado em `04-contrato-api.md`;
- services importam o cliente a partir de `@/config/api`.

---

## 35.2 — Momento de configuração do Vitest

**Data:** 2026-08-10

**Decisão anterior:**

A stack listava Vitest e Vue Test Utils sem delimitar quando a infraestrutura deveria ser instalada, o que poderia ser interpretado como obrigatoriedade desde a fundação.

**Nova decisão:**

Vitest e Vue Test Utils permanecem como a solução de testes automatizados do projeto, porém sua instalação e configuração ocorrem na fase de qualidade/QA, e não como pré-requisito das fases iniciais.

**Motivo:**

O código atual ainda não possui infraestrutura de testes, e as fases já concluídas (fundação, API/tipos e store de favoritos) foram validadas por TypeScript, lint, build e inspeção. Exigir Vitest antes disso geraria inconsistência entre documentação e repositório sem benefício imediato.

**Impacto:**

- redação da seção de testes atualizada;
- plano de implementação (`07-plano-de-implementacao.md`) passa a prever a configuração de testes na Fase 10 — QA final.

---

## 35.3 — Feedback com Toast e navegação após criação

**Data:** 2026-08-10

**Decisão anterior:**

A estratégia de feedback ao usuário (Toasts) estava pendente de definição na implementação correspondente.

**Nova decisão:**

- Utilizar `ToastService` e o componente `Toast` do PrimeVue.
- `ToastService` é registrado em `main.ts`.
- O componente `Toast` fica em `DefaultLayout.vue`, disponível globalmente.
- Após criação bem-sucedida: Toast de sucesso e navegação para `/produtos`.
- Em erro de criação: Toast de erro, sem redirecionamento, preservando os dados do formulário.
- Cancelar no formulário de criação retorna para `/produtos`.

**Motivo:**

A especificação de UI exige Toast de sucesso/erro e navegação para uma página apropriada. O catálogo (`/produtos`) é o destino coerente, pois a Fake Store API simula a criação sem garantir persistência consultável por ID.

**Impacto:**

- Fase 7 implementada com esse fluxo;
- edição (Fase 8) reutiliza o mesmo mecanismo de Toast.

---

## 35.4 — Feedback e navegação após edição

**Data:** 2026-08-10

**Decisão:**

- Reutilizar `ToastService` / `Toast` já registrados na Fase 7.
- Após atualização bem-sucedida: Toast **Produto atualizado com sucesso.** e navegação para `/produtos`.
- Em erro de atualização: Toast **Não foi possível atualizar o produto.**, sem redirecionamento, preservando os dados.
- Cancelar na edição retorna para `/produtos`.
- Carregamento inicial reutiliza `useProductDetails` + `parseProductId`; formulário só monta após o produto válido.
- `ProductForm` permanece único; prop `submitLabel` diferencia o texto do botão ("Salvar Produto" / "Salvar Alterações").

**Motivo:**

Alinhar a edição ao padrão da criação e ao SDD (Toast + página apropriada), evitando formulário/schema duplicados.

**Impacto:**

- Fase 8 concluída com esse fluxo;
- criação permanece compatível.

---

## 35.5 — Categorias no productService e filtro no frontend

**Data:** 2026-08-11

**Decisão:**

- Não criar `categoryService` separado; `getCategories()` vive em `productService`.
- Filtro por categoria e pesquisa textual ocorrem no frontend após `GET /products`.
- O endpoint `GET /products/category/:category` da Fake Store API **não** é utilizado pela aplicação.

**Motivo:**

O volume de dados é pequeno; uma única carga de produtos permite combinar busca, categoria, ordenação e paginação localmente sem requisições adicionais por filtro. O endpoint de categorias (`/products/categories`) permanece no mesmo service de domínio.

**Impacto:**

- contrato da API e arquitetura alinhados ao código;
- listagem usa `useProductsCatalog` + `useProductListControls`.

---

# 36. Critérios de Aceite

As decisões técnicas serão consideradas definidas quando:

- [ ] Framework definido.
- [ ] Linguagem definida.
- [ ] Ferramenta de build definida.
- [ ] Roteamento definido.
- [ ] Gerenciamento de estado definido.
- [ ] Cliente HTTP definido.
- [ ] Estratégia de services definida.
- [ ] Estratégia de composables definida.
- [ ] Estratégia de persistência definida.
- [ ] Estratégia de validação definida.
- [ ] Estratégia de testes definida.
- [ ] Lint definido.
- [ ] Formatação definida.
- [ ] Estratégia de uso de IA documentada.
- [ ] Critérios para novas dependências definidos.
- [ ] Decisões pendentes resolvidas antes da implementação correspondente.

---

# 37. Status do Documento

**Status:** Em andamento

**Versão:** 1.4

**Última atualização:** 2026-08-11