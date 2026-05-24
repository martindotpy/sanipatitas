package dev.martindotpy.sanipatitas.shared.appointment.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class AppointmentNotFoundException extends HttpProblem {
    public AppointmentNotFoundException(UUID appointmentId) {
        super(builder()
                .withTitle("Cita no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La cita con ID %s no existe".formatted(appointmentId))
                .with("appointmentId", appointmentId));
    }
}
