#!/bin/bash

# ================================
# RUN.SH PLUS ULTRA
# Para rodar sua aplicação JavaFX com Maven, sem IDE pesada
# ================================

# ⚡ Passo 1: Limpeza do build antigo
echo "🧹 Limpando arquivos antigos..."
mvn clean

# ⚡ Passo 2: Compilação
echo "🔨 Compilando o projeto..."
mvn compile

# ⚡ Passo 3: Execução JavaFX
echo "🚀 Iniciando sua aplicação JavaFX..."
mvn javafx:run -e

# ⚡ Passo 4: Status final
echo "✅ Finalizado. Código rodou sem depender de IDE!"
