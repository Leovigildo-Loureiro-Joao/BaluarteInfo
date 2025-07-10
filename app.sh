#!/bin/bash

# ================================
# RUN.SH PLUS ULTRA
# Para rodar sua aplicação JavaFX com Maven, sem IDE pesada
# ================================

# ⚡ Passo 1: Limpeza do build antigo
cd admin

echo "🧹 Limpando arquivos antigos..."
mvn clean

# ⚡ Passo 2: Compilação
echo "🔨 Compilando o projeto..."
mvn compile

# ...existing code...
echo "🚀 Iniciando sua aplicação JavaFX..."
MAVEN_OPTS="-Xmx512m" mvn javafx:run -e
# ...existing code...

# ⚡ Passo 4: Status final
echo "✅ Finalizado. Código rodou sem depender de IDE!"
