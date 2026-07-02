# AI.md — Ponto de Entrada Universal para Agentes de IA

> **Leia este arquivo.** Ele é o ponto de descoberta documental. Todo agente deve ler os documentos abaixo nesta ordem antes de qualquer operação, e executar o protocolo completo de verificação após qualquer alteração.

---

## Leitura Obrigatória (nesta ordem)

| # | Documento | Propósito |
|---|---|---|
| 1 | [`docs/AI_CONSTITUTION.md`](docs/AI_CONSTITUTION.md) | Autoridade máxima — regras absolutas, stack, identidade visual |
| 2 | [`docs/PRODUCT.md`](docs/PRODUCT.md) | Produto, funcionalidades, regras de negócio |
| 3 | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arquitetura técnica, convenções, design system |
| 4 | [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) | Problemas conhecidos na área de alteração |
| 5 | [`docs/ROADMAP.md`](docs/ROADMAP.md) | Funcionalidades implementadas (não recriar) |
| 6 | [`docs/IDEAS.md`](docs/IDEAS.md) | Hipóteses e oportunidades (não implementar sem aprovação) |

---

## Protocolo Turbo (5 Etapas)

| Etapa | Ação |
|---|---|
| **1** | Leia os 6 documentos acima (nesta ordem, integralmente) |
| **2** | Execute a alteração seguindo as regras da Constituição e convenções da Arquitetura |
| **3** | Verifique pós-execução: nenhuma regra violada, build compila, testes passam |
| **4** | Atualize a documentação viva se a alteração afetou produto, arquitetura ou criou issues |
| **5** | Reporte conformidade: o que leu, o que fez, o que verificou, o que atualizou |

---

## Hierarquia de Autoridade

```
docs/AI_CONSTITUTION.md  (máxima — soberana)
docs/PRODUCT.md          (verdade do produto)
docs/ARCHITECTURE.md     (verdade técnica)
código consolidado       (fonte de verdade da implementação)
padrões predominantes    (extração dos arquivos existentes)
solicitação do usuário   (instrução pontual desta sessão)
```

**Conflito entre camadas?** A camada superior prevalece sempre.
**Após a tarefa?** Execute as etapas 3, 4 e 5 do Protocolo Turbo.
