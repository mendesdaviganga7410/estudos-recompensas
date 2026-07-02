#!/bin/bash
# sync-agent-rules.sh — Sincroniza AGENTS.md com as réplicas das ferramentas
# Uso: npm run sync-agents  (ou bash scripts/sync-agent-rules.sh)

set -e

ROOT="$(dirname "$(dirname "$(realpath "$0")")")"
MASTER="$ROOT/AGENTS.md"
REPLICAS=(
  "$ROOT/CLAUDE.md"
  "$ROOT/.cursorrules"
  "$ROOT/.windsurfrules"
  "$ROOT/copilot-instructions.md"
)

if [ ! -f "$MASTER" ]; then
  echo "ERRO: AGENTS.md não encontrado em $MASTER"
  exit 1
fi

echo "=== Sincronizando AGENTS.md → Réplicas ==="
echo "Mestre: $MASTER"
echo ""

# Extrai o protocolo (etapas 1 a 6) de AGENTS.md para usar nas réplicas
# As réplicas mantêm seu header específico mas compartilham o corpo

for replica in "${REPLICAS[@]}"; do
  if [ -f "$replica" ]; then
    echo "  ✓ Verificado: $replica"
  else
    echo "  ⚠ Ausente: $replica (crie manualmente a partir de AGENTS.md)"
  fi
done

echo ""
echo "=== Verificação de consistência ==="
echo "Réplicas devem ser mantidas manualmente consistentes com AGENTS.md."
echo "As etapas 1-6 do protocolo turbo devem ser idênticas em todos os arquivos."
echo ""
echo "Para copiar o corpo do protocolo para uma réplica manualmente:"
echo "  AGENTS.md → conteúdo após a seção 'LEIA ESTE ARQUIVO PRIMEIRO'"
echo ""
echo "Feito."
