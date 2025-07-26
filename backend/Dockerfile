FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080

# Force cloud profile and override database configuration directly
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-Dspring.profiles.active=cloud", "-Dspring.datasource.url=${DB_URL}", "-Dspring.datasource.username=${DB_USERNAME}", "-Dspring.datasource.password=${DB_PASSWORD}", "-Dlogging.level.root=DEBUG", "-jar", "app.jar"]
