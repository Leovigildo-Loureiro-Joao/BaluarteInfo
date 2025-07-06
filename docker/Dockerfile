# Dockerfile
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . /app

# Pré-instala dependências Maven
RUN ./mvnw dependency:resolve

CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-Xms256m -Xmx512m"]

