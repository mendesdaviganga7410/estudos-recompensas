#!/bin/bash

echo "=========================================="
echo "   INICIANDO AUTOMAÇÃO DO GIT (SYNC)      "
echo "=========================================="
echo ""

# 1. Baixa as atualizações da nuvem antes de enviar (evita erros de sincronização)
echo "[1/5] Sincronizando com a nuvem (Pull)..."
git pull --rebase origin main || git pull --rebase

# 2. Compila o TypeScript com Vite
echo ""
echo "[2/5] Compilando TypeScript (Vite build)..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERRO] Build falhou. Corrija os erros antes de enviar."
    exit 1
fi

# 3. Adiciona TODAS as modificações (Trackeds, Untrackeds e Deletados)
echo ""
echo "[3/5] Adicionando modificações..."
git add -A

# Verifica se existe algo para "comitar"
if git diff-index --quiet HEAD --; then
    echo "Nenhuma alteração encontrada para enviar."
    exit 0
fi

# 4. Pergunta o nome da modificação
echo ""
read -p "[4/5] Digite a mensagem do seu commit: " msg

# Verifica se o usuário não digitou nada
if [ -z "$msg" ]; then
    echo ""
    echo "[ERRO] A mensagem do commit não pode ser vazia!"
    exit 1
fi

# Faz o commit com a mensagem digitada
git commit -m "$msg"

# 5. Faz o push automático
echo ""
echo "[5/5] Enviando para a nuvem..."
git push

echo ""
echo "=========================================="
echo "   SUCESSO! Seu código está na nuvem.     "
echo "=========================================="
echo ""
