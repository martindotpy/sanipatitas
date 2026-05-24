package dev.martindotpy.sanipatitas.shared.appointment.application.port;

import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import dev.martindotpy.sanipatitas.shared.appointment.domain.payload.CreateAppointmentPayload;
import io.smallrye.mutiny.Uni;

public interface CreateAppointmentPort {
    Uni<AppointmentDto> create(CreateAppointmentPayload payload);
}
