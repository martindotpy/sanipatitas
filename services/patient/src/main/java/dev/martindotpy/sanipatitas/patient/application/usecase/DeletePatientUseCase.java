package dev.martindotpy.sanipatitas.patient.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.patient.application.port.DeletePatientPort;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.PatientNotFoundException;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeletePatientUseCase implements DeletePatientPort {
    private final PatientRepository patientRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return patientRepository.findById(id)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(id))
                .call(patientRepository::delete)
                .replaceWithVoid();
    }
}
