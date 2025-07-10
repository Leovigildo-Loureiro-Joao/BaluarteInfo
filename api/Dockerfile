FROM openjdk:21-jdk-slim

# IDs alternativos
ENV UID=1010
ENV GID=1010

# Cria grupo e usuário só se não existirem
RUN getent group ${GID} || addgroup --gid ${GID} devgroup \
    && adduser --disabled-password --gecos '' --uid ${UID} --gid ${GID} devuser

# Define diretório de trabalho
WORKDIR /app

# Copia projeto
COPY . .

# Expõe porta
EXPOSE 8080

# Executa como devuser
USER devuser

# Executa aplicação
ENTRYPOINT ["java","-jar","target/api-0.0.1-SNAPSHOT.jar"]

