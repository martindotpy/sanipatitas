package dev.martindotpy.sanipatitas.ehr.application.usecase.observation;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.clinical.observation.application.port.DeleteMedicalObservationPort;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.error.MedicalObservationNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.repository.MedicalObservationRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteMedicalObservationUseCase implements DeleteMedicalObservationPort {
    private final MedicalObservationRepository medicalObservationRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return medicalObservationRepository.findById(id)
                .onItem().ifNull().failWith(() -> new MedicalObservationNotFoundException(id))
                .call(medicalObservationRepository::delete)
                .replaceWithVoid();
    }
}