package dev.martindotpy.sanipatitas.shared.appointment.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteAppointmentPort {
    Uni<Void> deleteById(UUID id);
}
