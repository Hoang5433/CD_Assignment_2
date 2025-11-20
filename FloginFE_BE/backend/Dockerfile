# Chọn JDK 21
FROM eclipse-temurin:21-jdk-jammy

# Tạo thư mục làm việc
WORKDIR /app

# Copy file Maven config
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Cho mvnw quyền chạy
RUN chmod +x mvnw

# Download dependency trước để cache
RUN ./mvnw dependency:go-offline -B

# Copy toàn bộ source code
COPY src src

RUN ./mvnw clean package

# Expose port backend
EXPOSE 8080

# Chạy backend
CMD ["java", "-jar", "target/*.jar"]
