package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port.DeleteImmunizationPort;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.error.ImmunizationNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.repository.ImmunizationRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteImmunizationUseCase implements DeleteImmunizationPort {
    private final ImmunizationRepository immunizationRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return immunizationRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ImmunizationNotFoundException(id))
                .call(immunizationRepository::delete)
                .replaceWithVoid();
    }
}
