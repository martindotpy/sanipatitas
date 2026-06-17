ARG TZ=America/Lima

FROM eclipse-temurin:25-jdk-ubi10-minimal AS build

ARG TZ

ENV TZ=${TZ}

WORKDIR /app

# Maven wrapper
COPY .mvn/ .mvn/
COPY --chmod=0755 mvnw ./

# Dependencies layer (cached unless POMs change)
COPY pom.xml checkstyle-suppressions.xml spotbugs-exclude.xml ./
COPY shared/java/pom.xml ./shared/java/pom.xml
COPY services/patient/pom.xml ./services/patient/pom.xml
COPY services/appointment/pom.xml ./services/appointment/pom.xml

RUN --mount=type=cache,target=/root/.m2/repository \
  ./mvnw -B -pl services/patient -am dependency:go-offline

# Build layer (cached unless sources change)
COPY shared/java/src shared/java/src
COPY services/patient/src services/patient/src

RUN --mount=type=cache,target=/root/.m2/repository \
  ./mvnw -B -pl services/patient -am package -DskipTests


FROM gcr.io/distroless/java25 AS runtime

# Add wget for ready endpoint healthcheck
COPY --from=busybox /lib/* /lib/
COPY --from=busybox /lib64/* /lib64/
COPY --from=busybox /bin/wget /bin/

WORKDIR /app

ARG TZ

ENV TZ=${TZ}

COPY --chown=185 --from=build /app/services/patient/target/quarkus-app/lib/ lib/
COPY --chown=185 --from=build /app/services/patient/target/quarkus-app/*.jar .
COPY --chown=185 --from=build /app/services/patient/target/quarkus-app/app/ app/
COPY --chown=185 --from=build /app/services/patient/target/quarkus-app/quarkus/ quarkus/

EXPOSE 8080
USER 185

ENTRYPOINT [ "java", "-jar", "quarkus-run.jar", "-Dquarkus.http.host=0.0.0.0", "-Djava.util.logging.manager=org.jboss.logmanager.LogManager", "-XX:+UnlockExperimentalVMOptions", "-XX:+EnableJVMCI"]

HEALTHCHECK --interval=120s --timeout=5s --start-period=10s \
  CMD ["/bin/wget", "--spider", "--timeout=5", "http://localhost:8080/q/health/ready"]
