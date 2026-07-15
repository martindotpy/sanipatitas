package dev.martindotpy.sanipatitas.client.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.appointment.domain.repository.AppointmentRepository;
import dev.martindotpy.sanipatitas.shared.client.application.port.DeleteClientPort;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientHasAssociatedDataException;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientNotFoundException;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteClientUseCase implements DeleteClientPort {
    private final ClientRepository clientRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillingRepository billingRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return clientRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ClientNotFoundException(id))
                .chain(client -> Uni.combine().all()
                        .unis(
                                patientRepository.count("client.id", id),
                                appointmentRepository.count("client.id", id),
                                billingRepository.count("clientId", id))
                        .asTuple()
                        .chain(tuple -> {
                            long associated = tuple.getItem1() + tuple.getItem2() + tuple.getItem3();
                            if (associated > 0) {
                                return Uni.createFrom().failure(new ClientHasAssociatedDataException(id));
                            }
                            return clientRepository.delete(client).replaceWithVoid();
                        }));
    }
}
