package dev.martindotpy.sanipatitas.shared.appointment.application.dto;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotNull;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AppointmentStatsDto {
    @NotNull
    private final long appointmentsToday;
    @NotNull
    private final Map<AppointmentStatus, Long> appointmentsTodayByStatus;
    @NotNull
    private final long appointmentsThisMonth;
    @NotNull
    private final List<AppointmentDto> upcomingAppointments;
}
