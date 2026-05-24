package dev.martindotpy.sanipatitas.shared.appointment.domain.payload;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentClass;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentStatus;

public interface UpdateAppointmentPayload {
    LocalDate getDate();

    LocalTime getStartTime();

    @Nullable
    LocalTime getEndTime();

    AppointmentStatus getStatus();

    @Nullable
    AppointmentClass getAppointmentClass();

    @Nullable
    String getReason();

    @Nullable
    String getNotes();

    UUID getPatientId();

    UUID getClientId();

    UUID getVeterinarianId();
}
