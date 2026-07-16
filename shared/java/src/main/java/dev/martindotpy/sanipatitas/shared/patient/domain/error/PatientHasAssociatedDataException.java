package dev.martindotpy.sanipatitas.shared.patient.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class PatientHasAssociatedDataException extends HttpProblem {
    public PatientHasAssociatedDataException(UUID patientId) {
        super(builder()
                .withTitle("Paciente tiene datos asociados")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("No se puede eliminar el paciente porque tiene citas o historial clínico asociado. "
                        + "Elimine o reasigne esos registros antes de eliminar el paciente.")
                .with("patientId", patientId));
    }
}
