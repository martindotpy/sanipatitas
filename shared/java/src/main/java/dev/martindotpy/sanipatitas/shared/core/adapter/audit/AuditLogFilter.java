package dev.martindotpy.sanipatitas.shared.core.adapter.audit;

import java.io.IOException;
import java.time.Instant;
import java.util.Set;

import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;
import org.slf4j.MDC;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.f4b6a3.uuid.UuidCreator;

@Provider
@ApplicationScoped
@Priority(Priorities.USER)
public class AuditLogFilter implements ContainerRequestFilter, ContainerResponseFilter {
    private static final Logger log = Logger.getLogger("sanipatitas.audit");
    private static final String STARTED_AT_PROPERTY = "sanipatitas.audit.started-at";
    private static final Set<String> CRITICAL_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");

    @Inject
    ObjectMapper objectMapper;

    @Inject
    JsonWebToken token;

    @ConfigProperty(name = "sanipatitas.service.name", defaultValue = "unknown")
    String serviceName;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        requestContext.setProperty(STARTED_AT_PROPERTY, System.nanoTime());
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        if (!isCritical(requestContext)) {
            return;
        }

        String correlationId = correlationId(requestContext);
        responseContext.getHeaders().putSingle("X-Correlation-Id", correlationId);

        AuditLogEntry entry = new AuditLogEntry(
                Instant.now().toString(),
                serviceName,
                correlationId,
                currentUser(),
                currentRole(),
                action(requestContext),
                resourceType(requestContext),
                resourceId(requestContext),
                requestContext.getMethod(),
                requestContext.getUriInfo().getPath(),
                responseContext.getStatus(),
                durationMs(requestContext));

        log.info(toJson(entry));
    }

    private boolean isCritical(ContainerRequestContext requestContext) {
        return CRITICAL_METHODS.contains(requestContext.getMethod());
    }

    private String correlationId(ContainerRequestContext requestContext) {
        Object property = requestContext.getProperty("sanipatitas.correlation-id");

        if (property instanceof String correlationId && !correlationId.isBlank()) {
            return correlationId;
        }

        return UuidCreator.getTimeOrderedEpoch().toString();
    }

    private String currentUser() {
        try {
            Object who = MDC.get("who");

            if (who != null && !who.toString().isBlank()) {
                return who.toString();
            }

            String subject = token.getSubject();

            if (subject == null || subject.isBlank()) {
                return "anonymous";
            }

            return subject;
        } catch (RuntimeException exception) {
            return "anonymous";
        }
    }

    private String currentRole() {
        try {
            Object role = MDC.get("role");

            if (role != null && !role.toString().isBlank()) {
                return role.toString();
            }

            Object claim = token.getClaim("role");

            if (claim == null) {
                return "unknown";
            }

            return claim.toString();
        } catch (RuntimeException exception) {
            return "unknown";
        }
    }

    private String action(ContainerRequestContext requestContext) {
        return switch (requestContext.getMethod()) {
            case "POST" -> "CREATE";
            case "PUT", "PATCH" -> "UPDATE";
            case "DELETE" -> "DELETE";
            default -> "UNKNOWN";
        };
    }

    private String resourceType(ContainerRequestContext requestContext) {
        String[] segments = requestContext.getUriInfo().getPath().split("/");

        if (segments.length < 2) {
            return "unknown";
        }

        return segments[1];
    }

    private String resourceId(ContainerRequestContext requestContext) {
        String[] segments = requestContext.getUriInfo().getPath().split("/");
        String candidate = segments.length == 0 ? "" : segments[segments.length - 1];

        if (candidate.isBlank() || candidate.equals(resourceType(requestContext))) {
            return null;
        }

        return candidate;
    }

    private long durationMs(ContainerRequestContext requestContext) {
        Object startedAt = requestContext.getProperty(STARTED_AT_PROPERTY);

        if (!(startedAt instanceof Long startedAtNanos)) {
            return 0L;
        }

        return (System.nanoTime() - startedAtNanos) / 1_000_000L;
    }

    private String toJson(AuditLogEntry entry) {
        try {
            return objectMapper.writeValueAsString(entry);
        } catch (JsonProcessingException exception) {
            return "{\"event\":\"audit_serialization_failed\"}";
        }
    }

    private record AuditLogEntry(
            String when,
            String service,
            String correlationId,
            String who,
            String role,
            String action,
            String resourceType,
            String resourceId,
            String method,
            String path,
            int status,
            long durationMs) {}
}
