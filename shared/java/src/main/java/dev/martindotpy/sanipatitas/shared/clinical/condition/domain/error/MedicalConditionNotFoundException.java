package dev.martindotpy.sanipatitas.shared.clinical.condition.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class MedicalConditionNotFoundException extends HttpProblem {
    public MedicalConditionNotFoundException(UUID medicalConditionId) {
        super(builder()
                .withTitle("Condición médica no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La condición médica con ID %s no existe".formatted(medicalConditionId))
                .with("medicalConditionId", medicalConditionId));
    }
}
