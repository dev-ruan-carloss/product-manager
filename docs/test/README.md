# Testes e auditoria de segurança

Esta pasta concentra a especificação dos testes e da auditoria de segurança do Product Management.

Ela complementa o SDD em `docs/` (requisitos, arquitetura, decisões técnicas e contrato da API). Não substitui esses documentos: registra ameaças analisadas, proteções aplicadas, cenários de teste e limitações.

## Objetivo dos testes

Reduzir a superfície de ataque da interface sem alterar regras de negócio e sem adicionar mecanismos demonstrativos (autenticação fictícia, criptografia artificial, rate limiting no frontend).

Os testes automatizados correspondentes ficam em `tests/security/`, separados da suíte funcional.

| Arquivo | Cobertura |
|---|---|
| `tests/security/xss-rendering.test.ts` | Payloads XSS na camada de renderização |
| `tests/security/urls.test.ts` | Protocolos permitidos/bloqueados e schema de imagem |
| `tests/security/api-payload.test.ts` | Validação do payload da FakeStoreAPI |
| `tests/security/headers.test.ts` | Security Headers no `vercel.json` |
| `tests/security/localStorage.test.ts` | Leitura de persistência local como fonte não confiável |

Execução: `npm test`.

## Como ler esta auditoria

Os termos abaixo não são intercambiáveis:

| Termo | Significado |
|---|---|
| **Ameaça analisada** | Cenário considerado durante a auditoria, mesmo quando não se confirmou uma falha. |
| **Vulnerabilidade encontrada** | Falha real identificada no código ou na configuração. |
| **Proteção implementada** | Controle adotado para reduzir o risco. |
| **Teste preventivo** | Caso automatizado que garante que o controle continue válido. |

A auditoria completa está em [`auditoria-seguranca.md`](./auditoria-seguranca.md).

## Princípio de confiança

O frontend valida e reduz a superfície de ataque da interface, mas não constitui uma fronteira de confiança para dados enviados ao servidor.
