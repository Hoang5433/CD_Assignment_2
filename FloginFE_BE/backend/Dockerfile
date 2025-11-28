FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package
RUN apt-get update && apt-get install -y curl  # <-- thêm dòng này
RUN cp target/$(ls target/*.jar | head -1 | xargs basename) app.jar


EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
