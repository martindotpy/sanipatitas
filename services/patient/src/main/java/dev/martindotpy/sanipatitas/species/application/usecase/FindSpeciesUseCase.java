package dev.martindotpy.sanipatitas.species.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.species.application.port.FindSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.domain.error.SpeciesNotFoundException;
import dev.martindotpy.sanipatitas.shared.species.domain.repository.SpeciesRepository;
import dev.martindotpy.sanipatitas.species.application.mapper.SpeciesMapper;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindSpeciesUseCase implements FindSpeciesPort {
    private final SpeciesRepository speciesRepository;

    private final SpeciesMapper speciesMapper;

    @Override
    public Uni<PageResult<SpeciesDto>> search(String search, int page, int size) {
        var pagination = Page.of(page, size);
        var hasSearch = search != null && !search.isBlank();

        var speciesQuery = hasSearch ? speciesRepository.search(search, pagination)
                : speciesRepository.findAll(pagination);
        var speciesCountQuery = hasSearch ? speciesRepository.count(search) : speciesRepository.count();

        return Uni.combine().all()
                .unis(speciesQuery, speciesCountQuery)
                .with((species, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        species.stream()
                                .map(speciesMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<SpeciesDto> findById(UUID id) {
        return speciesRepository.findById(id)
                .onItem().ifNull().failWith(() -> new SpeciesNotFoundException(id))
                .map(speciesMapper::toDto);
    }
}
