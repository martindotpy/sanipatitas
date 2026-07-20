package dev.martindotpy.sanipatitas.species.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.breed.domain.repository.BreedRepository;
import dev.martindotpy.sanipatitas.shared.species.application.port.DeleteSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.domain.error.SpeciesHasAssociatedDataException;
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
    private final BreedRepository breedRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return speciesRepository.findById(id)
                .onItem().ifNull().failWith(() -> new SpeciesNotFoundException(id))
                .chain(species -> breedRepository.count("species.id", id)
                        .chain(count -> {
                            if (count > 0) {
                                return Uni.createFrom().failure(new SpeciesHasAssociatedDataException(id));
                            }
                            return speciesRepository.delete(species).replaceWithVoid();
                        }));
    }
}
