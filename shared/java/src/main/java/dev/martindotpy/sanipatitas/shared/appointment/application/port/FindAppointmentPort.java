package dev.martindotpy.sanipatitas.shared.appointment.application.port;

import java.time.LocalDate;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindAppointmentPort {
    Uni<PageResult<AppointmentDto>> findByDateRange(@Nullable LocalDate from, @Nullable LocalDate to, int page, int size);

    Uni<AppointmentDto> findById(UUID id);
}
