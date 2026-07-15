package dev.martindotpy.sanipatitas.appointment.application.usecase;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.appointment.application.mapper.AppointmentMapper;
import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentStatsDto;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.FindAppointmentStatsPort;
import dev.martindotpy.sanipatitas.shared.appointment.domain.entity.Appointment;
import dev.martindotpy.sanipatitas.shared.appointment.domain.repository.AppointmentRepository;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentStatus;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindAppointmentStatsUseCase implements FindAppointmentStatsPort {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;

    @Override
    public Uni<AppointmentStatsDto> getStats() {
        var today = LocalDate.now();
        var now = LocalTime.now();
        var monthStart = today.withDayOfMonth(1);
        var tomorrow = today.plusDays(1);
        var weekFromNow = today.plusDays(8);

        return appointmentRepository.countByDateRange(today, today)
                .chain(totalToday -> appointmentRepository.findByDateRange(today, today, Page.of(0, 200))
                        .chain(todayApps -> appointmentRepository.countByDateRange(monthStart, tomorrow)
                                .chain(monthCount -> appointmentRepository
                                        .find("status = ?1 and ((date = ?2 and startTime >= ?3) or (date > ?2 and date <= ?4)) order by date asc, startTime asc",
                                                AppointmentStatus.SCHEDULED, today, now, weekFromNow)
                                        .page(Page.of(0, 10))
                                        .list()
                                        .map(upcomingApps -> {
                                            Map<AppointmentStatus, Long> byStatus = todayApps.stream()
                                                    .collect(Collectors.groupingBy(
                                                            Appointment::getStatus,
                                                            LinkedHashMap::new,
                                                            Collectors.counting()));

                                            List<AppointmentDto> upcomingDtos = upcomingApps.stream()
                                                    .map(appointmentMapper::toDto)
                                                    .toList();

                                            return AppointmentStatsDto.builder()
                                                    .appointmentsToday(totalToday)
                                                    .appointmentsTodayByStatus(byStatus)
                                                    .appointmentsThisMonth(monthCount)
                                                    .upcomingAppointments(upcomingDtos)
                                                    .build();
                                        }))));
    }
}
