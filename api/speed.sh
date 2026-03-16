#!/bin/bash

set -euo pipefail

export $(cat .env | xargs)

# Opcional: habilita JMX remoto (útil para IntelliJ "Live data"/VisualVM/JConsole).
# Exemplo: ENABLE_JMX=true JMX_PORT=10000 ./speed.sh
JMX_ARGS=""
if [ "${ENABLE_JMX:-false}" = "true" ]; then
  JMX_PORT="${JMX_PORT:-10000}"
  JMX_HOSTNAME="${JMX_HOSTNAME:-127.0.0.1}"
  JMX_ARGS="-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=true -Dcom.sun.management.jmxremote.port=${JMX_PORT} -Dcom.sun.management.jmxremote.rmi.port=${JMX_PORT} -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false -Djava.rmi.server.hostname=${JMX_HOSTNAME}"
fi

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xms128m -Xmx256m ${JMX_ARGS}"
