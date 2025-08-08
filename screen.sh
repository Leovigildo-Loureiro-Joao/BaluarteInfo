#!/bin/bash

SESSION="plusultra"

API_PATH="api"
ADMIN_PATH="admin"
FRONTEND_PATH=""

echo "🛠️  Iniciando sessão '$SESSION' com screen..."

# Cria nova sessão em segundo plano
screen -dmS $SESSION

# Janela: API Spring Boot
screen -S $SESSION -X screen -t api
screen -S $SESSION -p api -X stuff "cd $API_PATH && export $(cat .env | xargs)
mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Xms128m -Xmx256m'"

# Janela: JavaFX Admin App
screen -S $SESSION -X screen -t admin
screen -S $SESSION -p admin -X stuff "cd $ADMIN_PATH  && MAVEN_OPTS="-Xmx512m" mvn javafx:run"

# Janela: Frontend React (opcional)
if [ -d "$FRONTEND_PATH" ]; then
    screen -S $SESSION -X screen -t frontend
    screen -S $SESSION -p frontend -X stuff "cd $FRONTEND_PATH && npm start\n"
else
    echo "⚠️  Diretório do frontend não encontrado: $FRONTEND_PATH"
fi

echo "✅ Tudo iniciado. Usa: screen -r $SESSION para ver."

