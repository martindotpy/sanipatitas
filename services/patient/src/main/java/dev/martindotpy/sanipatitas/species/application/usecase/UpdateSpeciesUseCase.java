package dev.martindotpy.sanipatitas.species.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.species.application.port.UpdateSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.domain.error.SpeciesNotFoundException;
import dev.martindotpy.sanipatitas.shared.species.domain.payload.UpdateSpeciesPayload;
import dev.martindotpy.sanipatitas.shared.species.domain.repository.SpeciesRepository;
import dev.martindotpy.sanipatitas.species.application.mapper.SpeciesMapper;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateSpeciesUseCase implements UpdateSpeciesPort {
    private final SpeciesRepository speciesRepository;

    private final SpeciesMapper speciesMapper;

    @Override
    public Uni<SpeciesDto> update(UUID id, UpdateSpeciesPayload payload) {
        var newSpecies = speciesMapper.from(id, payload)
                .build();

        return speciesRepository.findById(id)
                .onItem().ifNull().failWith(() -> new SpeciesNotFoundException(id))
                .replaceWith(speciesRepository.update(newSpecies))
                .map(speciesMapper::toDto);
    }
}
