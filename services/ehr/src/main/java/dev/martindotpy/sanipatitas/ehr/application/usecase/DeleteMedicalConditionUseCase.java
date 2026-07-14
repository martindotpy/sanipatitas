package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.DeleteMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.error.MedicalConditionNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.repository.MedicalConditionRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteMedicalConditionUseCase implements DeleteMedicalConditionPort {
    private final MedicalConditionRepository medicalConditionRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return medicalConditionRepository.findById(id)
                .onItem().ifNull().failWith(() -> new MedicalConditionNotFoundException(id))
                .call(medicalConditionRepository::delete)
                .replaceWithVoid();
    }
}
