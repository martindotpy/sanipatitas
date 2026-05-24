package dev.martindotpy.sanipatitas.shared.appointment.application.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentClass;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentStatus;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.user.application.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AppointmentDto {
    @NotNull
    private final UUID id;

    @NotNull
    private final LocalDate date;
    @NotNull
    private final LocalTime startTime;
    @Nullable
    private final LocalTime endTime;
    @NotNull
    private final AppointmentStatus status;
    @NotNull
    private final AppointmentClass appointmentClass;
    @Nullable
    @Size(max = 2000)
    private final String reason;
    @Nullable
    @Size(max = 2000)
    private final String notes;

    @NotNull
    private final OffsetDateTime createdAt;
    @NotNull
    private final OffsetDateTime updatedAt;

    @NotNull
    private final PatientDto patient;
    @NotNull
    private final ClientDto client;
    @NotNull
    private final UserDto veterinarian;
}
