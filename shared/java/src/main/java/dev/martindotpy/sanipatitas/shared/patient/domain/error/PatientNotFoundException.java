package dev.martindotpy.sanipatitas.shared.patient.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class PatientNotFoundException extends HttpProblem {
    public PatientNotFoundException(UUID patientId) {
        super(builder()
                .withTitle("Paciente no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El paciente con ID %s no existe".formatted(patientId))
                .with("patientId", patientId));
    }
}
