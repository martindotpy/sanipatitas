package dev.martindotpy.sanipatitas.patient.application.usecase;

import java.util.Optional;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.constraints.NotNull;

import dev.martindotpy.sanipatitas.patient.application.mapper.SpeciesMapper;
import dev.martindotpy.sanipatitas.shared.patient.application.adapter.FindSpeciesPort;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.SpeciesNotFoundException;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.SpeciesRepository;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@ApplicationScoped
@RequiredArgsConstructor
public final class FindSpeciesUseCase implements FindSpeciesPort {
    private final SpeciesRepository speciesRepository;

    private final SpeciesMapper speciesMapper;

    @Override
    public Uni<SpeciesDto> findById(@NotNull UUID id) {
        return speciesRepository.findById(id)
                .map(Optional::ofNullable)
                .map(opt -> opt.orElseThrow(() -> new SpeciesNotFoundException(id)))
                .map(speciesMapper::toDto);
    }
}
