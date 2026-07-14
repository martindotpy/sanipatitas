package dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ImmunizationNotFoundException extends HttpProblem {
    public ImmunizationNotFoundException(UUID immunizationId) {
        super(builder()
                .withTitle("Inmunizacion no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La inmunización con ID %s no existe".formatted(immunizationId))
                .with("immunizationId", immunizationId));
    }
}
