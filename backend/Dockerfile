FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080

# Force cloud profile and debug logging
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-Dspring.profiles.active=cloud", "-Dlogging.level.root=DEBUG", "-jar", "app.jar"]
