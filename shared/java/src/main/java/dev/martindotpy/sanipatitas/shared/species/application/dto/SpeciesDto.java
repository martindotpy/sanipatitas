package dev.martindotpy.sanipatitas.shared.species.application.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpeciesDto {
    @NotNull
    private final UUID id;

    @NotBlank
    @Size(max = 255)
    private final String name;
    @Nullable
    @Size(max = 2000)
    private final String description;
}
