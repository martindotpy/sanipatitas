package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port.DeletePrescriptionPort;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.error.PrescriptionNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.repository.PrescriptionRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeletePrescriptionUseCase implements DeletePrescriptionPort {
    private final PrescriptionRepository prescriptionRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return prescriptionRepository.findById(id)
                .onItem().ifNull().failWith(() -> new PrescriptionNotFoundException(id))
                .call(prescriptionRepository::delete)
                .replaceWithVoid();
    }
}
