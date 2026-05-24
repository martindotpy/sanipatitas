package dev.martindotpy.sanipatitas.shared.breed.application.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BreedDto {
    @NotNull
    private final UUID id;

    @NotBlank
    @Size(max = 255)
    private final String name;
    @Nullable
    @Size(max = 2000)
    private final String description;

    @NotNull
    private final SpeciesDto species;
}
