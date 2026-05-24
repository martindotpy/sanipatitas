package dev.martindotpy.sanipatitas.appointment.application.usecase;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.appointment.application.mapper.AppointmentMapper;
import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.FindAppointmentPort;
import dev.martindotpy.sanipatitas.shared.appointment.domain.error.AppointmentNotFoundException;
import dev.martindotpy.sanipatitas.shared.appointment.domain.repository.AppointmentRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindAppointmentUseCase implements FindAppointmentPort {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;

    @Override
    public Uni<PageResult<AppointmentDto>> findByDateRange(
            @Nullable LocalDate from, @Nullable LocalDate to, int page, int size) {
        var pagination = Page.of(page, size);
        var hasRange = from != null && to != null;

        var appointmentQuery = hasRange
                ? appointmentRepository.findByDateRange(from, to, pagination)
                : appointmentRepository.findAll(pagination);
        var appointmentCountQuery = hasRange
                ? appointmentRepository.countByDateRange(from, to)
                : appointmentRepository.count();

        return Uni.combine().all()
                .unis(appointmentQuery, appointmentCountQuery)
                .with((appointments, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        appointments.stream()
                                .map(appointmentMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<AppointmentDto> findById(UUID id) {
        return appointmentRepository.findById(id)
                .onItem().ifNull().failWith(() -> new AppointmentNotFoundException(id))
                .map(appointmentMapper::toDto);
    }
}
