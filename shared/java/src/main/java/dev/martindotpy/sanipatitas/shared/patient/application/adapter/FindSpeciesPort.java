package dev.martindotpy.sanipatitas.shared.patient.application.adapter;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import io.smallrye.mutiny.Uni;

public interface FindSpeciesPort {
    Uni<SpeciesDto> findById(@NotNull UUID id);
}
