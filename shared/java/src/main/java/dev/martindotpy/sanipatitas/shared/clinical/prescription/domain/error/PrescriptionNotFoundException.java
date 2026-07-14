package dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class PrescriptionNotFoundException extends HttpProblem {
    public PrescriptionNotFoundException(UUID prescriptionId) {
        super(builder()
                .withTitle("Receta no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La receta con ID %s no existe".formatted(prescriptionId))
                .with("prescriptionId", prescriptionId));
    }
}
