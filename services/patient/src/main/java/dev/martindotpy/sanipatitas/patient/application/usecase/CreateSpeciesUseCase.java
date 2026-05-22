package dev.martindotpy.sanipatitas.patient.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.patient.application.mapper.SpeciesMapper;
import dev.martindotpy.sanipatitas.shared.patient.application.adapter.CreateSpeciesPort;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.CreateSpeciesPayload;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.SpeciesRepository;
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
        var newSpecies = speciesMapper.from(payload).build();

        return speciesRepository.persist(newSpecies)
                .map(speciesMapper::toDto);
    }
}
