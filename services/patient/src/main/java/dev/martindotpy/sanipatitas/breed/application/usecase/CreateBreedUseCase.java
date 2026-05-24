package dev.martindotpy.sanipatitas.breed.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.breed.application.mapper.BreedMapper;
import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.breed.application.port.CreateBreedPort;
import dev.martindotpy.sanipatitas.shared.breed.domain.payload.CreateBreedPayload;
import dev.martindotpy.sanipatitas.shared.breed.domain.repository.BreedRepository;
import dev.martindotpy.sanipatitas.shared.species.domain.error.SpeciesNotFoundException;
import dev.martindotpy.sanipatitas.shared.species.domain.repository.SpeciesRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateBreedUseCase implements CreateBreedPort {
    private final BreedRepository breedRepository;
    private final SpeciesRepository speciesRepository;

    private final BreedMapper breedMapper;

    @Override
    public Uni<BreedDto> create(CreateBreedPayload payload) {
        var speciesId = payload.getSpeciesId();
        var newBreedBuilder = breedMapper.from(payload);

        return speciesRepository.findById(speciesId)
                .onItem().ifNull().failWith(() -> new SpeciesNotFoundException(speciesId))
                .map(species -> {
                    @SuppressWarnings("null")
                    var newBreed = newBreedBuilder
                            .species(species)
                            .build();

                    return newBreed;
                })
                .chain(breedRepository::persist)
                .map(breedMapper::toDto);
    }
}
