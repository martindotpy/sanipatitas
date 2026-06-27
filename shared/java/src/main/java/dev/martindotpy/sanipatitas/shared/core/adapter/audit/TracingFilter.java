package dev.martindotpy.sanipatitas.shared.core.adapter.audit;

import java.io.IOException;

import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.slf4j.MDC;

import com.github.f4b6a3.uuid.UuidCreator;

// Setea correlation_id, who y role en MDC al inicio de cada request
// Los limpia al final. Asi TODOS los logs del request tienen contexto.
@Provider
@ApplicationScoped
@Priority(Priorities.AUTHENTICATION + 100)
public class TracingFilter implements ContainerRequestFilter, ContainerResponseFilter {

    @Inject
    JsonWebToken token;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String correlationId = requestContext.getHeaderString("X-Correlation-Id");

        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UuidCreator.getTimeOrderedEpoch().toString();
        }

        requestContext.setProperty("sanipatitas.correlation-id", correlationId);

        MDC.put("correlation_id", correlationId);
        MDC.put("who", currentUser());
        MDC.put("role", currentRole());
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        responseContext.getHeaders().putSingle("X-Correlation-Id",
                requestContext.getProperty("sanipatitas.correlation-id").toString());

        MDC.remove("correlation_id");
        MDC.remove("who");
        MDC.remove("role");
    }

    private String currentUser() {
        try {
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
            Object role = token.getClaim("role");

            if (role == null) {
                return "unknown";
            }

            return role.toString();
        } catch (RuntimeException exception) {
            return "unknown";
        }
    }
}
