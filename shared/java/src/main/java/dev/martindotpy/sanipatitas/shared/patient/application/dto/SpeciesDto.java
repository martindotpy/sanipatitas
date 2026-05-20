package dev.martindotpy.sanipatitas.shared.patient.application.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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
    @Size(max = 2000)
    private final String description;
}
