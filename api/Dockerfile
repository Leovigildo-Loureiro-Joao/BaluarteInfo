# ============================
# ⚙️ 1️⃣ STAGE DE BUILD
# ============================
FROM maven:3.9-eclipse-temurin-21 AS build

# Define diretório de trabalho
WORKDIR /app

# Copia apenas o pom.xml primeiro (aproveita cache do Maven)
COPY pom.xml .

# Baixa dependências para acelerar build
RUN mvn dependency:go-offline

# Copia o restante do projeto
COPY src ./src

# Executa o build — para PROD, é melhor rodar testes!
RUN mvn clean package -DskipTests

# Verifica se o .jar existe — falha se não existir
RUN ls -lh target/ && \
    if [ ! -f target/*.jar ]; then echo "❌ JAR NÃO FOI GERADO!"; exit 1; fi

# ============================
# ⚙️ 2️⃣ STAGE DE RUNTIME
# ============================
FROM eclipse-temurin:21-jre

# Evita rodar como root
RUN addgroup --system spring && adduser --system --ingroup spring spring

WORKDIR /app

# Copia apenas o jar gerado do stage anterior
COPY --from=build /app/target/*.jar app.jar

# Permissão do jar para o user não-root
RUN chown spring:spring /app/app.jar

# Usa o user não-root
USER spring

# Exponha a porta — Railway vai injetar a variável PORT
EXPOSE 8080

# Entrypoint robusto
ENTRYPOINT ["java", "-Xmx512m", "-jar", "/app/app.jar"]

