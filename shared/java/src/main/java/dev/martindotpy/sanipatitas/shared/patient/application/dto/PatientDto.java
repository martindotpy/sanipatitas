package dev.martindotpy.sanipatitas.shared.patient.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PatientDto {
    @NotNull
    private final UUID id;

    @NotBlank
    @Size(max = 500)
    private final String name;
    @Nullable
    private final Gender gender;
    @Nullable
    private final LocalDate birthDate;
    @Nullable
    @Size(max = 50)
    private final String approximateAge;
    @Nullable
    @Digits(integer = 3, fraction = 2)
    private final BigDecimal weightKg;
    @Nullable
    @Size(max = 2000)
    private final String description;
    @Nullable
    private final Boolean isSterilized;
    @Nullable
    private final Boolean isDeceased;

    @NotNull
    private final OffsetDateTime createdAt;
    @NotNull
    private final OffsetDateTime updatedAt;

    @Nullable
    private final BreedDto breed;
    @NotNull
    private final ClientDto client;
}
