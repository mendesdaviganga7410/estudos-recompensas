#!/bin/bash

echo "=========================================="
echo "   INICIANDO AUTOMAÇÃO DO GIT (PUSH)      "
echo "=========================================="
echo ""

# 1. Adiciona todas as modificações
echo "[1/3] Adicionando modificações..."
git add .

# 2. Pergunta o nome da modificação
echo ""
read -p "[2/3] Digite a mensagem do seu commit: " msg

# Verifica se o usuário não digitou nada
if [ -z "$msg" ]; then
    echo ""
    echo "[ERRO] A mensagem do commit não pode ser vazia!"
    exit 1
fi

# Faz o commit com a mensagem digitada
git commit -m "$msg"

# 3. Faz o push automático
echo ""
echo "[3/3] Enviando para a nuvem..."
git push

echo ""
echo "=========================================="
echo "   SUCESSO! Seu código está na nuvem.     "
echo "=========================================="
echo ""
