package dev.martindotpy.sanipatitas.shared.core.adapter.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkiverse.resteasy.problem.HttpProblem;

/**
 * Global exception mapper that catches Hibernate constraint violations
 * (duplicate unique keys, foreign key violations, etc.) and returns
 * a proper 409 Conflict response instead of a generic 500.
 */
@Provider
public class ConstraintViolationExceptionMapper
        implements ExceptionMapper<ConstraintViolationException> {

    private static final Logger log = LoggerFactory.getLogger(ConstraintViolationExceptionMapper.class);

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        String sqlState = exception.getSQLState();
        String message = exception.getMessage();

        // SQL State codes: 23505 = unique violation, 23503 = foreign key violation
        String title = switch (sqlState) {
            case "23505" -> "Registro duplicado";
            case "23503" -> "Violación de integridad referencial";
            default -> "Error de integridad de datos";
        };

        String detail = extractDetail(message, sqlState);

        log.warn("Constraint violation: SQLState={}, title={}", sqlState, title);

        var problem = HttpProblem.builder()
                .withTitle(title)
                .withStatus(Response.Status.CONFLICT)
                .withDetail(detail)
                .build();

        return Response.status(Response.Status.CONFLICT)
                .type("application/problem+json")
                .entity(problem)
                .build();
    }

    private String extractDetail(String message, String sqlState) {
        if (message == null) {
            return "Error de integridad de datos en la base de datos.";
        }

        // Extract meaningful part from Hibernate's verbose error message
        int errorIdx = message.indexOf("ERROR:");
        if (errorIdx >= 0) {
            int bracketIdx = message.indexOf(']', errorIdx);
            if (bracketIdx > errorIdx) {
                return message.substring(errorIdx + 6, bracketIdx).trim();
            }
            return message.substring(errorIdx + 6).trim();
        }

        return "Error de integridad de datos (SQLState: " + sqlState + ").";
    }
}
