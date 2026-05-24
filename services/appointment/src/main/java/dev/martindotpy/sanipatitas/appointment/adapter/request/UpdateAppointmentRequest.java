package dev.martindotpy.sanipatitas.appointment.adapter.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.appointment.domain.payload.UpdateAppointmentPayload;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentClass;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAppointmentRequest implements UpdateAppointmentPayload {
    @NotNull
    private LocalDate date;
    @NotNull
    private LocalTime startTime;
    @Nullable
    private LocalTime endTime;
    @NotNull
    private AppointmentStatus status;
    @Nullable
    private AppointmentClass appointmentClass;
    @Nullable
    @Size(max = 2000)
    private String reason;
    @Nullable
    @Size(max = 2000)
    private String notes;

    @NotNull
    private UUID patientId;
    @NotNull
    private UUID clientId;
    @NotNull
    private UUID veterinarianId;
}
