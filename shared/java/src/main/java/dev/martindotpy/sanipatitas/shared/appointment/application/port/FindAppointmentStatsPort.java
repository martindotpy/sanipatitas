package dev.martindotpy.sanipatitas.shared.appointment.application.port;

import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentStatsDto;
import io.smallrye.mutiny.Uni;

public interface FindAppointmentStatsPort {
    Uni<AppointmentStatsDto> getStats();
}
