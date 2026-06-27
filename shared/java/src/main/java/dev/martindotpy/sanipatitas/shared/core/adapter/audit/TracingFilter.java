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

        // Store property first (even if user/role resolution fails later)
        requestContext.setProperty("sanipatitas.correlation-id", correlationId);
        MDC.put("correlation_id", correlationId);

        try {
            MDC.put("who", resolveUser());
            MDC.put("role", resolveRole());
        } catch (Exception e) {
            MDC.put("who", "anonymous");
            MDC.put("role", "unknown");
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        Object correlationId = requestContext.getProperty("sanipatitas.correlation-id");

        if (correlationId != null) {
            responseContext.getHeaders().putSingle("X-Correlation-Id", correlationId.toString());
        }

        MDC.remove("correlation_id");
        MDC.remove("who");
        MDC.remove("role");
    }

    private String resolveUser() {
        try {
            String subject = token.getSubject();

            if (subject == null || subject.isBlank()) {
                return "anonymous";
            }

            return subject;
        } catch (Exception e) {
            return "anonymous";
        }
    }

    private String resolveRole() {
        try {
            Object role = token.getClaim("role");

            if (role == null) {
                return "unknown";
            }

            return role.toString();
        } catch (Exception e) {
            return "unknown";
        }
    }
}
