package dev.martindotpy.sanipatitas.species.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.species.application.port.DeleteSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.domain.error.SpeciesNotFoundException;
import dev.martindotpy.sanipatitas.shared.species.domain.repository.SpeciesRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteSpeciesUseCase implements DeleteSpeciesPort {
    private final SpeciesRepository speciesRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return speciesRepository.findById(id)
                .onItem().ifNull().failWith(() -> new SpeciesNotFoundException(id))
                .call(speciesRepository::delete)
                .replaceWithVoid();
    }
}
