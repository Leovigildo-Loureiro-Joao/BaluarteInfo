# Dockerfile
FROM eclipse-temurin:21-jdk

ARG UID=1000
ARG GID=1000
# Cria usuário com UID/GID certos
RUN addgroup --gid ${GID} devgroup && \
    adduser --disabled-password --gecos '' --uid ${UID} --gid ${GID} devuser
USER devuser

WORKDIR /app

COPY . /app

# 🔑 Garantir permissão de execução do Maven Wrapper
RUN chmod +x mvnw

# Pré-instala dependências Maven
RUN ./mvnw dependency:resolve

CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-Xms256m -Xmx512m"]


