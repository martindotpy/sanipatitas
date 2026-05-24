package dev.martindotpy.sanipatitas.species.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.species.application.port.CreateSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.domain.payload.CreateSpeciesPayload;
import dev.martindotpy.sanipatitas.shared.species.domain.repository.SpeciesRepository;
import dev.martindotpy.sanipatitas.species.application.mapper.SpeciesMapper;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateSpeciesUseCase implements CreateSpeciesPort {
    private final SpeciesRepository speciesRepository;

    private final SpeciesMapper speciesMapper;

    @Override
    public Uni<SpeciesDto> create(CreateSpeciesPayload payload) {
        var newSpecies = speciesMapper.from(payload)
                .build();

        return speciesRepository.persist(newSpecies)
                .map(speciesMapper::toDto);
    }
}
