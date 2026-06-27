package dev.martindotpy.sanipatitas.breed.application.usecase;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.breed.application.mapper.BreedMapper;
import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.breed.application.port.FindBreedPort;
import dev.martindotpy.sanipatitas.shared.breed.domain.error.BreedNotFoundException;
import dev.martindotpy.sanipatitas.shared.breed.domain.repository.BreedRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindBreedUseCase implements FindBreedPort {
    private final BreedRepository breedRepository;

    private final BreedMapper breedMapper;

    @Override
    public Uni<PageResult<BreedDto>> search(String search, int page, int size, @Nullable List<UUID> speciesIds) {
        var pagination = Page.of(page, size);

        var breedQuery = breedRepository.findBySpecies(speciesIds, search, pagination);
        var breedCountQuery = breedRepository.countBySpecies(speciesIds, search);

        return Uni.combine().all()
                .unis(breedQuery, breedCountQuery)
                .with((breeds, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        breeds.stream()
                                .map(breedMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<BreedDto> findById(UUID id) {
        return breedRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BreedNotFoundException(id))
                .map(breedMapper::toDto);
    }
}
