FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/*.jar app.jar
COPY uploads /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=$SPRING_PROFILES_ACTIVE", "app.jar"]
