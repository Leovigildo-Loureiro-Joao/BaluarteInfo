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

# Opcional: habilita JMX remoto (útil para IntelliJ "Live data"/VisualVM/JConsole).
# Exemplo: ENABLE_JMX=true JMX_PORT=10000 ./run.sh
JMX_ARGS=""
if [ "${ENABLE_JMX:-false}" = "true" ]; then
  JMX_PORT="${JMX_PORT:-10000}"
  JMX_HOSTNAME="${JMX_HOSTNAME:-127.0.0.1}"
  JMX_ARGS="-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=true -Dcom.sun.management.jmxremote.port=${JMX_PORT} -Dcom.sun.management.jmxremote.rmi.port=${JMX_PORT} -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false -Djava.rmi.server.hostname=${JMX_HOSTNAME}"
fi

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xms128m -Xmx256m ${JMX_ARGS}" &
API_PID=$!
echo "✅ API iniciada em background! PID: $API_PID"
cd ../admin

echo "🚀 Iniciando sua aplicação JavaFX..."
MAVEN_OPTS="-Xmx512m" mvn javafx:run -e &
APP_PID=$!
echo "✅ App JavaFX iniciado em background! PID: $APP_PID"

# ⚡ Passo 4: Aguarda ambos terminarem

trap 'echo -e "\nEncerrando processos..."; kill $API_PID $APP_PID; exit' SIGINT SIGTERM

wait $API_PID
wait $APP_PID

echo "✅ Finalizado. API e App rodaram juntos sem depender de IDE!"



