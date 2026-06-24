#!/bin/bash

echo "=========================================="
echo "   INICIANDO AUTOMAÇÃO DO GIT (SYNC)      "
echo "=========================================="
echo ""

# 1. Baixa as atualizações da nuvem antes de enviar (evita erros de sincronização)
echo "[1/4] Sincronizando com a nuvem (Pull)..."
git pull --rebase origin main || git pull --rebase

# 2. Adiciona TODAS as modificações (Trackeds, Untrackeds e Deletados)
echo ""
echo "[2/4] Adicionando modificações..."
git add -A

# Verifica se existe algo para "comitar"
if git diff-index --quiet HEAD --; then
    echo "Nenhuma alteração encontrada para enviar."
    exit 0
fi

# 3. Pergunta o nome da modificação
echo ""
read -p "[3/4] Digite a mensagem do seu commit: " msg

# Verifica se o usuário não digitou nada
if [ -z "$msg" ]; then
    echo ""
    echo "[ERRO] A mensagem do commit não pode ser vazia!"
    exit 1
fi

# Faz o commit com a mensagem digitada
git commit -m "$msg"

# 4. Faz o push automático
echo ""
echo "[4/4] Enviando para a nuvem..."
git push

echo ""
echo "=========================================="
echo "   SUCESSO! Seu código está na nuvem.     "
echo "=========================================="
echo ""
