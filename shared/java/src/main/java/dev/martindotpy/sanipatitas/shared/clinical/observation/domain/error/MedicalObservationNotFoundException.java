package dev.martindotpy.sanipatitas.shared.clinical.observation.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class MedicalObservationNotFoundException extends HttpProblem {
    public MedicalObservationNotFoundException(UUID medicalObservationId) {
        super(builder()
                .withTitle("Observacion medica no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La observacion medica con ID %s no existe".formatted(medicalObservationId))
                .with("medicalObservationId", medicalObservationId));
    }
}