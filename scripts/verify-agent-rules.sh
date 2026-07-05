#!/bin/bash
# verify-agent-rules.sh — Verifica integridade das réplicas de AGENTS.md
# Uso: npm run verify-agents

ROOT="$(dirname "$(dirname "$(realpath "$0")")")"
AGENTS_DIR="$ROOT/agents"
MASTER="$ROOT/AGENTS.md"
REQUIRED=(
  "$ROOT/AGENTS.md"
  "$AGENTS_DIR/CLAUDE.md"
  "$AGENTS_DIR/AI.md"
  "$AGENTS_DIR/.cursorrules"
  "$AGENTS_DIR/.windsurfrules"
  "$AGENTS_DIR/copilot-instructions.md"
)

ERRORS=0

echo "=== Verificação de Entry Points ==="

for file in "${REQUIRED[@]}"; do
  if [ -f "$file" ]; then
    # Verifica se menciona os 6 docs obrigatórios
    HAS_CONST=$(grep -c "AI_CONSTITUTION" "$file" 2>/dev/null || true)
    HAS_PRODUCT=$(grep -c "PRODUCT" "$file" 2>/dev/null || true)
    HAS_ARCH=$(grep -c "ARCHITECTURE" "$file" 2>/dev/null || true)
    HAS_KNOWN=$(grep -c "KNOWN_ISSUES" "$file" 2>/dev/null || true)
    HAS_ROAD=$(grep -c "ROADMAP" "$file" 2>/dev/null || true)
    HAS_IDEAS=$(grep -c "IDEAS" "$file" 2>/dev/null || true)

    if [ "$HAS_CONST" -eq 0 ] || [ "$HAS_PRODUCT" -eq 0 ] || [ "$HAS_ARCH" -eq 0 ]; then
      echo "  ⚠ $file: faltando referência a documentos obrigatórios"
      ERRORS=$((ERRORS + 1))
    else
      echo "  ✓ $file"
    fi

    # Aviso se faltam docs situacionais
    [ "$HAS_KNOWN" -eq 0 ] && echo "    ⚠ KNOWN_ISSUES.md não referenciado"
    [ "$HAS_ROAD" -eq 0 ] && echo "    ⚠ ROADMAP.md não referenciado"
    [ "$HAS_IDEAS" -eq 0 ] && echo "    ⚠ IDEAS.md não referenciado"
  else
    echo "  ✗ AUSENTE: $file"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ Todos os entry points estão presentes e referenciam os docs corretos."
else
  echo "❌ $ERRORS problema(s) encontrado(s). Corrija antes de prosseguir."
fi

exit $ERRORS
