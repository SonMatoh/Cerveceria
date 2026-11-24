# =============================================================================
# La Taberna de Snorlax — Backend Spring Boot (Dockerfile para Render)
# Contexto de build: raíz del monorepo
# =============================================================================

# Etapa 1: Compilar con Maven y Java 21
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar solo el pom primero para cachear dependencias
COPY backend/pom.xml .
RUN mvn dependency:go-offline -DskipTests

# Copiar el resto del código y compilar
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecutar solo con Java (imagen más liviana)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el JAR generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Puerto que usa Spring Boot
EXPOSE 8080

# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]

# Evitar reinicios por falta de RAM
ENV JAVA_TOOL_OPTIONS="-Xmx256m -Xms128m"
ENTRYPOINT ["java", "-jar", "app.jar"]