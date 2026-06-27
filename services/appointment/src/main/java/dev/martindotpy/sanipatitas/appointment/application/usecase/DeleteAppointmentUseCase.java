package dev.martindotpy.sanipatitas.appointment.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.appointment.application.service.AppointmentEvent;
import dev.martindotpy.sanipatitas.appointment.application.service.AppointmentEventService;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.DeleteAppointmentPort;
import dev.martindotpy.sanipatitas.shared.appointment.domain.error.AppointmentNotFoundException;
import dev.martindotpy.sanipatitas.shared.appointment.domain.repository.AppointmentRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteAppointmentUseCase implements DeleteAppointmentPort {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentEventService eventService;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return appointmentRepository.findById(id)
                .onItem().ifNull().failWith(() -> new AppointmentNotFoundException(id))
                .invoke(() -> eventService.publish(new AppointmentEvent(id, AppointmentEvent.Type.DELETED)))
                .call(appointmentRepository::delete)
                .replaceWithVoid();
    }
}
