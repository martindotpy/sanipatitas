package dev.martindotpy.sanipatitas.shared.appointment.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import dev.martindotpy.sanipatitas.shared.appointment.domain.payload.UpdateAppointmentPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateAppointmentPort {
    Uni<AppointmentDto> update(UUID id, UpdateAppointmentPayload payload);
}
