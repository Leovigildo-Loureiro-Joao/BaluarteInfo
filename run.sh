#!/bin/bash
# filepath: /home/devpro/Documentos/GitHub/BaluarteInfo/run.sh

# ================================
# RUN.SH PLUS ULTRA
# Roda API (Spring Boot) e App JavaFX juntos, sem IDE pesada
# ================================

# ⚡ Passo 1: Limpeza do build antigo

cd api
echo "iniciando a api..."
export $(cat .env | xargs)
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xms128m -Xmx256m" &
API_PID=$!
echo "✅ API iniciada em background! PID: $API_PID"
cd ../admin

echo "🚀 Iniciando sua aplicação JavaFX..."
MAVEN_OPTS="-Xmx512m" mvn javafx:run -e &
APP_PID=$!
echo "✅ App JavaFX iniciado em background! PID: $APP_PID"

# ⚡ Passo 4: Aguarda ambos terminarem

trap 'echo -e "\nEncerrando processos..."; kill $API_PID $ADMIN_PID; exit' SIGINT SIGTERM

wait $API_PID
wait $APP_PID

echo "✅ Finalizado. API e App rodaram juntos sem depender de IDE!"




