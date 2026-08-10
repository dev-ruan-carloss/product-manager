# Requisitos do Projeto — Product Management

## 1. Objetivo

Desenvolver uma aplicação web para gerenciamento e consulta de produtos, utilizando a Fake Store API como fonte de dados.

A aplicação deverá permitir que o usuário visualize, pesquise, filtre, ordene, crie, edite e favorite produtos através de uma interface responsiva e organizada.

O projeto também deverá demonstrar boas práticas de desenvolvimento frontend, incluindo componentização, separação de responsabilidades, tipagem, gerenciamento de estado, validação de formulários, tratamento de estados da interface, acessibilidade e responsividade.

---

## 2. Escopo do Projeto

O sistema deverá contemplar as seguintes funcionalidades principais:

- Listagem de produtos.
- Pesquisa de produtos por título.
- Debounce na pesquisa.
- Filtro de produtos por categoria.
- Ordenação de produtos por preço.
- Paginação da listagem.
- Visualização dos detalhes de um produto.
- Criação de produtos.
- Edição de produtos.
- Favoritamento de produtos.
- Persistência dos favoritos utilizando `localStorage`.
- Página de produtos favoritos.
- Estados de carregamento.
- Tratamento de erros.
- Estados vazios.
- Validação dos formulários.
- Interface responsiva.
- Navegação entre as áreas da aplicação.

---

# 3. Requisitos Funcionais

## RF-001 — Listagem de produtos

O sistema deve disponibilizar uma página principal contendo a listagem dos produtos obtidos através da Fake Store API.

Cada produto apresentado na listagem deverá disponibilizar, no mínimo:

- imagem;
- título;
- preço;
- categoria;
- ação para visualizar os detalhes;
- ação para favoritar ou desfavoritar.

### Critérios de aceite

- Os produtos devem ser carregados através da API.
- Enquanto os produtos estiverem sendo carregados, a interface deve apresentar um estado de carregamento.
- Caso a API retorne produtos, eles devem ser apresentados na interface.
- Caso nenhum produto seja retornado, deve ser apresentado um estado vazio.
- Caso ocorra uma falha na requisição, deve ser apresentado um estado de erro.

---

## RF-002 — Pesquisa de produtos

O usuário deve poder pesquisar produtos através do título.

A página de produtos deve possuir um campo de pesquisa que permita informar o termo desejado.

A pesquisa deverá utilizar debounce para evitar processamento desnecessário enquanto o usuário estiver digitando.

### Critérios de aceite

- O usuário deve conseguir informar um termo de pesquisa.
- A pesquisa deve considerar o título do produto.
- A aplicação não deve executar a lógica de pesquisa a cada caractere imediatamente.
- Deve existir um pequeno intervalo entre a última alteração do campo e a execução da pesquisa.
- Caso nenhum produto corresponda ao termo pesquisado, deve ser apresentado um estado informando que nenhum resultado foi encontrado.
- Limpar a pesquisa deve permitir retornar à listagem completa.

---

## RF-003 — Filtro por categoria

O usuário deve poder filtrar os produtos por categoria.

As categorias disponíveis deverão ser obtidas através da API.

A interface deverá disponibilizar uma opção para retornar à visualização de todas as categorias.

### Critérios de aceite

- As categorias devem ser carregadas através da API.
- O usuário deve conseguir selecionar uma categoria.
- A listagem deve apresentar somente produtos correspondentes à categoria selecionada.
- Deve existir uma opção equivalente a "Todas" ou similar.
- Ao selecionar a opção de todas as categorias, a listagem deve retornar aos produtos sem o filtro de categoria.

---

## RF-004 — Ordenação por preço

O usuário deve poder ordenar os produtos com base no preço.

A aplicação deverá disponibilizar, no mínimo:

- preço crescente;
- preço decrescente.

### Critérios de aceite

- O usuário deve conseguir selecionar a ordenação.
- A ordenação crescente deve apresentar o menor preço primeiro.
- A ordenação decrescente deve apresentar o maior preço primeiro.
- A ordenação deve funcionar em conjunto com a pesquisa e o filtro de categoria.

---

## RF-005 — Paginação da listagem

A listagem de produtos deverá possuir uma estratégia de paginação para facilitar a navegação.

A implementação deverá permitir que o usuário navegue entre diferentes conjuntos de produtos quando necessário.

A estratégia de paginação adotada deverá ser documentada posteriormente no documento de decisões técnicas.

### Critérios de aceite

- A listagem deve permitir navegar entre páginas quando houver produtos suficientes.
- A página atual deve ser identificável pelo usuário.
- O usuário deve conseguir avançar e retornar entre as páginas disponíveis.
- A paginação deve respeitar os filtros e a pesquisa atualmente aplicados.
- A interface deve evitar apresentar controles de paginação desnecessários quando não houver páginas adicionais.

---

## RF-006 — Visualização dos detalhes do produto

O usuário deve poder acessar uma página específica contendo os detalhes de um produto.

A página deverá apresentar as informações disponíveis para o produto selecionado.

### Informações mínimas

- imagem;
- título;
- preço;
- descrição;
- categoria;
- avaliação, quando disponível;
- quantidade de avaliações, quando disponível;
- ação para favoritar ou desfavoritar.

### Critérios de aceite

- O usuário deve conseguir acessar os detalhes a partir da listagem.
- A URL deve identificar o produto selecionado.
- Os dados devem ser carregados através da API.
- Enquanto os dados estiverem sendo carregados, deve existir um estado de carregamento.
- Caso o produto não possa ser encontrado, deve existir um estado adequado de erro ou ausência.
- O usuário deve conseguir retornar para a listagem.

---

## RF-007 — Criação de produto

O sistema deve permitir a criação de um novo produto através de um formulário.

O formulário deverá permitir informar:

- título;
- preço;
- descrição;
- categoria;
- URL da imagem.

### Critérios de aceite

- O usuário deve conseguir abrir o formulário de criação.
- Todos os campos obrigatórios devem possuir validação.
- Dados inválidos não devem ser enviados para a API.
- Dados válidos devem ser enviados através da operação correspondente da API.
- O usuário deve receber feedback sobre o resultado da operação.
- O formulário deve impedir múltiplos envios acidentais enquanto a operação estiver em andamento.

---

## RF-008 — Edição de produto

O sistema deve permitir a edição de um produto existente.

O formulário deverá apresentar os dados atuais do produto e permitir que sejam alterados.

### Critérios de aceite

- O usuário deve conseguir iniciar a edição de um produto existente.
- Os campos devem ser preenchidos com os valores atuais.
- O usuário deve conseguir alterar os dados.
- Os dados devem ser validados antes do envio.
- Dados válidos devem ser enviados através da operação correspondente da API.
- O usuário deve receber feedback sobre o resultado da operação.
- O formulário deve impedir múltiplos envios acidentais enquanto a operação estiver em andamento.

---

## RF-009 — Validação dos formulários

Os formulários de criação e edição devem possuir validação estruturada.

### Regras de validação

#### Título

- obrigatório;
- deve possuir conteúdo válido.

#### Preço

- obrigatório;
- deve ser numérico;
- deve ser maior que zero.

#### Descrição

- obrigatória.

#### Categoria

- obrigatória.

#### URL da imagem

- obrigatória;
- deve possuir formato de URL válido.

### Critérios de aceite

- O formulário não deve ser enviado quando existirem campos inválidos.
- Cada campo inválido deve apresentar uma mensagem clara.
- As mensagens devem aparecer próximas aos campos correspondentes.
- A validação deve acontecer antes da comunicação com a API.
- Os critérios de validação devem estar centralizados e não espalhados pelos componentes.

---

## RF-010 — Favoritar produto

O usuário deve poder favoritar e desfavoritar produtos.

A ação deve estar disponível na listagem e na página de detalhes.

### Critérios de aceite

- O usuário deve conseguir favoritar um produto.
- O usuário deve conseguir desfavoritar um produto.
- O estado visual do produto deve indicar quando ele está favoritado.
- A alteração deve ser refletida imediatamente na interface.
- O estado deve permanecer consistente entre a listagem, detalhes e página de favoritos.

---

## RF-011 — Persistência dos favoritos

Os produtos favoritados devem permanecer favoritados após o recarregamento da aplicação.

A persistência deverá utilizar o `localStorage` do navegador.

### Critérios de aceite

- Ao favoritar um produto, seu identificador deve ser persistido localmente.
- Ao recarregar a aplicação, os favoritos devem ser restaurados.
- Ao desfavoritar um produto, ele deve ser removido da persistência local.
- Dados inválidos ou inexistentes no armazenamento local não devem impedir o funcionamento da aplicação.

---

## RF-012 — Página de favoritos

O sistema deve disponibilizar uma área específica para visualização dos produtos favoritados.

### Critérios de aceite

- A página deve apresentar os produtos favoritados.
- O usuário deve conseguir acessar os detalhes de um produto favorito.
- O usuário deve conseguir desfavoritar produtos diretamente nessa página.
- As alterações devem refletir imediatamente na listagem.
- Caso não existam favoritos, deve ser apresentado um estado vazio informativo.

---

## RF-013 — Estados de carregamento

Todas as operações assíncronas relevantes devem apresentar feedback visual durante seu processamento.

### Operações consideradas

- carregamento da listagem;
- carregamento de categorias;
- carregamento de detalhes;
- criação;
- edição;
- outras operações que envolvam espera por resposta da API.

### Critérios de aceite

- O usuário deve saber quando uma operação está em andamento.
- Botões de envio devem indicar quando estão processando.
- Operações em andamento não devem permitir múltiplos envios acidentais.
- O estado de carregamento deve desaparecer quando a operação terminar.

---

## RF-014 — Tratamento de erros

O sistema deve tratar falhas de comunicação com a API de forma adequada.

### Critérios de aceite

- Erros de requisição não devem quebrar a aplicação inteira.
- O usuário deve receber uma mensagem compreensível.
- Informações técnicas desnecessárias não devem ser apresentadas diretamente ao usuário.
- Quando aplicável, deve existir uma ação para tentar novamente.
- O estado de erro deve ser diferente do estado vazio.

---

## RF-015 — Estado sem resultados

Quando uma pesquisa ou filtro não encontrar produtos correspondentes, o sistema deve apresentar um estado específico para ausência de resultados.

### Critérios de aceite

- A mensagem deve indicar que nenhum produto foi encontrado.
- O estado deve ser diferente do carregamento.
- O estado deve ser diferente de um erro de API.
- O usuário deve conseguir alterar ou limpar os filtros para tentar novamente.

---

## RF-016 — Navegação da aplicação

A aplicação deve possuir navegação entre suas principais áreas.

### Áreas mínimas

- produtos;
- detalhes do produto;
- favoritos;
- criação de produto;
- edição de produto.

### Critérios de aceite

- As áreas devem possuir rotas próprias quando aplicável.
- O usuário deve conseguir navegar entre as áreas sem perder o estado global necessário.
- A navegação deve funcionar em dispositivos móveis e desktop.
- URLs inválidas devem possuir comportamento adequado.

---

# 4. Requisitos de Interface e Experiência

## RNF-001 — Responsividade

A aplicação deve funcionar adequadamente em diferentes tamanhos de tela.

A interface deverá considerar, no mínimo:

- smartphones;
- tablets;
- desktops.

A largura mínima considerada para a interface deverá ser aproximadamente 360px.

### Critérios de aceite

- Nenhum conteúdo principal deve ficar inacessível em telas pequenas.
- Cards e componentes devem se adaptar ao espaço disponível.
- Controles de pesquisa e filtros devem continuar utilizáveis em dispositivos móveis.
- Botões e elementos interativos devem possuir tamanho adequado para interação por toque.
- Não deve existir rolagem horizontal desnecessária.

---

## RNF-002 — Componentização

A interface deve ser construída através de componentes reutilizáveis.

### Critérios

- Componentes devem possuir responsabilidades claras.
- Código duplicado deve ser evitado.
- Componentes não devem concentrar responsabilidades excessivas.
- Componentes de apresentação devem ser separados de regras de negócio quando necessário.

---

## RNF-003 — Consistência visual

A aplicação deve possuir uma identidade visual consistente.

Elementos equivalentes devem utilizar padrões semelhantes de:

- espaçamento;
- tipografia;
- botões;
- campos;
- cards;
- mensagens;
- estados;
- ícones.

---

## RNF-004 — Acessibilidade

A aplicação deverá seguir boas práticas básicas de acessibilidade.

### Critérios

- Imagens devem possuir `alt` adequado.
- Campos devem possuir identificação clara.
- Botões devem possuir textos ou identificação acessível.
- Elementos interativos devem ser utilizáveis por teclado quando aplicável.
- A hierarquia de títulos deve ser coerente.
- Mensagens de erro devem ser perceptíveis e associadas aos respectivos campos.

---

## RNF-005 — Feedback das operações

A aplicação deve fornecer feedback visual adequado após operações realizadas pelo usuário.

Exemplos:

- produto criado;
- produto atualizado;
- produto favoritado;
- produto desfavoritado;
- falha na operação.

O feedback deve ser claro e não deve depender exclusivamente de mudanças sutis na interface.

---

# 5. Requisitos Técnicos

## RT-001 — Framework

A aplicação deve ser desenvolvida utilizando Vue 3.

---

## RT-002 — Composition API

A aplicação deve utilizar Composition API e `<script setup>`.

---

## RT-003 — TypeScript

A aplicação deve utilizar TypeScript em modo `strict`.

O uso de `any` deve ser evitado.

Quando o uso de `any` for tecnicamente necessário, deverá existir uma justificativa.

---

## RT-004 — API

A aplicação deve utilizar a Fake Store API como fonte de dados.

A comunicação com a API deverá ser separada das camadas responsáveis pela apresentação da interface.

---

## RT-005 — Gerenciamento de estado

A aplicação deverá possuir uma estratégia de gerenciamento de estado global.

O estado global deve ser utilizado somente quando houver necessidade de compartilhamento entre diferentes partes da aplicação.

Estados específicos de uma página ou componente devem permanecer próximos ao contexto onde são utilizados.

---

## RT-006 — Validação

Os formulários deverão utilizar uma solução estruturada para validação.

As regras de validação devem permanecer centralizadas e reutilizáveis.

---

## RT-007 — Persistência local

Os favoritos deverão ser persistidos utilizando `localStorage`.

A aplicação deverá tratar de forma segura situações em que não existam dados armazenados ou em que os dados armazenados estejam inválidos.

---

## RT-008 — Separação de responsabilidades

A aplicação deve possuir separação clara entre:

- apresentação;
- regras de negócio;
- comunicação com API;
- gerenciamento de estado;
- validação;
- modelos e tipos.

A implementação detalhada dessa separação será definida no documento de arquitetura.

---

## RT-009 — Qualidade do código

O código deverá priorizar:

- legibilidade;
- manutenção;
- reutilização;
- baixo acoplamento;
- coesão;
- tipagem;
- separação de responsabilidades;
- nomes descritivos;
- ausência de código duplicado desnecessário.

---

# 6. Estados da Interface

Cada fluxo assíncrono deverá considerar os estados aplicáveis ao contexto.

## 6.1 — Carregando

Representa uma operação que ainda está em andamento.

Exemplos:

- carregamento de produtos;
- carregamento de detalhes;
- carregamento de categorias;
- envio de formulário.

---

## 6.2 — Sucesso

Representa uma operação concluída corretamente.

Exemplos:

- produtos carregados;
- produto criado;
- produto atualizado;
- favorito salvo.

---

## 6.3 — Erro

Representa uma operação que não pôde ser concluída.

Exemplos:

- falha na API;
- produto inexistente;
- erro ao salvar produto;
- erro ao carregar categorias.

---

## 6.4 — Vazio

Representa uma operação concluída corretamente, porém sem dados disponíveis.

Exemplos:

- nenhum produto disponível;
- nenhum favorito cadastrado.

---

## 6.5 — Sem resultados

Representa uma listagem existente que não possui correspondências para os filtros ou pesquisa atuais.

Exemplo:

- produtos existem, mas nenhum corresponde ao termo pesquisado.

---

# 7. Requisitos de API

A aplicação deverá utilizar os recursos disponibilizados pela Fake Store API.

Os recursos necessários deverão contemplar, quando suportados pela API:

- obtenção de produtos;
- obtenção de produto individual;
- obtenção de categorias;
- criação de produto;
- atualização de produto.

Os detalhes dos endpoints, métodos HTTP, payloads e respostas serão documentados posteriormente em:

`docs/04-contrato-api.md`

---

# 8. Regras de comportamento

## RB-001 — Pesquisa e filtros

A pesquisa, categoria e ordenação deverão funcionar de maneira combinada.

Exemplo:

O usuário deve poder:

1. pesquisar por um termo;
2. selecionar uma categoria;
3. ordenar os resultados por preço.

A aplicação deverá manter todos os critérios ativos simultaneamente.

---

## RB-002 — Favoritos

O estado de favorito deve ser independente do resultado atual da pesquisa ou filtro.

Um produto favoritado deve continuar favoritado mesmo que temporariamente não esteja visível na listagem atual.

---

## RB-003 — Alteração de produto

Após criar ou editar um produto, a interface deverá refletir o resultado da operação de maneira coerente.

A estratégia específica para atualização do estado da aplicação será definida posteriormente na arquitetura.

---

## RB-004 — Formulários

O envio de um formulário somente deve ocorrer quando todos os campos obrigatórios forem válidos.

Enquanto o envio estiver em andamento, o usuário não deverá conseguir disparar acidentalmente múltiplas operações simultâneas.

---

## RB-005 — Estados independentes

O estado de carregamento de uma operação não deve bloquear desnecessariamente outras áreas independentes da aplicação.

Exemplo:

O carregamento de uma ação específica não deve fazer toda a aplicação parecer indisponível quando somente uma parte está sendo processada.

---

# 9. Fora do Escopo

Os seguintes itens não fazem parte do escopo inicial:

- desenvolvimento de backend próprio;
- criação de banco de dados próprio;
- autenticação de usuários;
- cadastro de usuários;
- login;
- controle de permissões;
- sistema de pagamentos;
- integração com serviços financeiros;
- upload real de imagens para servidor;
- sistema de notificações externo;
- sistema de comentários;
- avaliações criadas pelo usuário;
- funcionalidades administrativas não especificadas;
- funcionalidades que não contribuam diretamente para os requisitos do desafio.

Novas funcionalidades poderão ser consideradas posteriormente, desde que não comprometam o escopo principal e sejam justificadas tecnicamente.

---

# 10. Critérios Gerais de Aceite

O projeto será considerado funcionalmente concluído quando atender aos seguintes critérios:

- [ ] Produtos podem ser carregados através da API.
- [ ] Produtos são apresentados em uma interface organizada.
- [ ] Usuário consegue pesquisar produtos.
- [ ] Pesquisa utiliza debounce.
- [ ] Usuário consegue filtrar produtos por categoria.
- [ ] Usuário consegue ordenar produtos por preço.
- [ ] Listagem possui paginação.
- [ ] Usuário consegue visualizar detalhes de um produto.
- [ ] Usuário consegue criar produtos.
- [ ] Usuário consegue editar produtos.
- [ ] Formulários possuem validação.
- [ ] Produtos podem ser favoritados.
- [ ] Produtos podem ser desfavoritados.
- [ ] Favoritos são persistidos no `localStorage`.
- [ ] Existe uma página de favoritos.
- [ ] Estados de carregamento são tratados.
- [ ] Estados de erro são tratados.
- [ ] Estados vazios são tratados.
- [ ] Estados sem resultados são tratados.
- [ ] Navegação entre as áreas funciona corretamente.
- [ ] Interface é responsiva.
- [ ] Requisitos básicos de acessibilidade são atendidos.
- [ ] TypeScript é utilizado de forma consistente.
- [ ] A separação de responsabilidades é respeitada.

---

# 11. Requisitos de Qualidade

Além das funcionalidades, o projeto deverá demonstrar qualidade técnica através de:

- arquitetura organizada;
- componentes reutilizáveis;
- composables quando houver lógica compartilhável;
- serviços isolados para comunicação com API;
- gerenciamento de estado adequado;
- validação centralizada;
- tipos TypeScript bem definidos;
- ausência de `any` injustificado;
- tratamento consistente de estados assíncronos;
- código legível;
- baixo acoplamento;
- baixo nível de duplicação;
- interface responsiva;
- histórico de Git organizado;
- documentação das decisões técnicas.

A arquitetura detalhada e as responsabilidades de cada camada serão definidas posteriormente em `docs/02-arquitetura.md`.

---

# 12. Priorização

Os requisitos serão implementados seguindo três níveis de prioridade.

## Prioridade 1 — Essencial

Funcionalidades necessárias para considerar o produto principal funcional:

- listagem;
- pesquisa;
- debounce;
- filtro por categoria;
- ordenação;
- paginação;
- detalhes;
- criação;
- edição;
- validação;
- favoritos;
- persistência dos favoritos;
- página de favoritos;
- responsividade;
- estados de carregamento;
- tratamento de erros;
- estados vazios.

## Prioridade 2 — Qualidade

Itens necessários para elevar a qualidade da entrega:

- acessibilidade;
- componentes reutilizáveis;
- feedback visual;
- tratamento refinado de estados;
- qualidade do TypeScript;
- arquitetura organizada;
- documentação.

## Prioridade 3 — Melhorias

Funcionalidades adicionais poderão ser implementadas após a conclusão dos requisitos essenciais, desde que estejam alinhadas aos objetivos do projeto.

Essas funcionalidades deverão ser documentadas separadamente e não devem comprometer a entrega dos requisitos prioritários.

---

# 13. Dependências e Restrições

O projeto depende da disponibilidade da Fake Store API para operações relacionadas aos produtos.

A aplicação não deverá assumir que a API estará sempre disponível.

Por esse motivo, os fluxos que dependem da API devem considerar:

- indisponibilidade;
- respostas inválidas;
- ausência de dados;
- erros de comunicação;
- demora na resposta.

As limitações específicas da API deverão ser consideradas nas decisões de arquitetura e implementação.

---

# 14. Observação sobre decisões técnicas

Este documento define **o que o sistema deve fazer**.

As decisões relacionadas a:

- arquitetura;
- estrutura de pastas;
- bibliotecas;
- gerenciamento de estado;
- componentes;
- estratégia de paginação;
- comunicação com API;
- validação;
- persistência;
- testes;
- ferramentas de desenvolvimento;

serão definidas nos documentos seguintes.

Dessa forma, os requisitos permanecem independentes das decisões de implementação.

---

## Status do Documento

**Status:** Em definição

**Versão:** 1.0

**Última atualização:** 2026-08-10

**Próximo documento:** `02-arquitetura.md`