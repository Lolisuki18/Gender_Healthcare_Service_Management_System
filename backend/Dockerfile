FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.config.name=application,application-cloud", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}", "app.jar"]
