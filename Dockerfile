# Estágio de build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Copie apenas o pom.xml primeiro
COPY backend/pom.xml .
RUN mvn dependency:go-offline

# Agora copie o código fonte e faça o build
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Estágio de execução
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copie apenas o JAR do estágio de build
COPY --from=build /build/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Exponha a porta que a aplicação usará
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["java", "-jar", "app.jar"]