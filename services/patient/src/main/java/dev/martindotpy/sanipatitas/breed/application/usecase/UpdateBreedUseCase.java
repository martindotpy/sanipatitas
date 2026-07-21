package dev.martindotpy.sanipatitas.breed.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.breed.application.mapper.BreedMapper;
import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.breed.application.port.UpdateBreedPort;
import dev.martindotpy.sanipatitas.shared.breed.domain.error.BreedNotFoundException;
import dev.martindotpy.sanipatitas.shared.breed.domain.payload.UpdateBreedPayload;
import dev.martindotpy.sanipatitas.shared.breed.domain.repository.BreedRepository;
import dev.martindotpy.sanipatitas.shared.species.domain.error.SpeciesNotFoundException;
import dev.martindotpy.sanipatitas.shared.species.domain.repository.SpeciesRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateBreedUseCase implements UpdateBreedPort {
    private final BreedRepository breedRepository;
    private final SpeciesRepository speciesRepository;

    private final BreedMapper breedMapper;

    @Override
    public Uni<BreedDto> update(UUID id, UpdateBreedPayload payload) {
        var speciesId = payload.getSpeciesId();

        // Sequential loads — parallel Uni.combine breaks Hibernate Reactive session state
        return breedRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BreedNotFoundException(id))
                .chain(existing -> speciesRepository.findById(speciesId)
                        .onItem().ifNull().failWith(() -> new SpeciesNotFoundException(speciesId))
                        .map(species -> {
                            existing.setName(payload.getName());
                            existing.setDescription(payload.getDescription());
                            existing.setSpecies(species);
                            return existing;
                        }))
                .map(breedMapper::toDto);
    }
}
