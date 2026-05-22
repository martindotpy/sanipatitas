package dev.martindotpy.sanipatitas.shared.patient.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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

    @NotNull
    private final ClientDto client;

    @NotBlank
    @Size(max = 500)
    private final String name;

    private final BreedDto breed;

    private final Gender gender;

    private final LocalDate birthDate;

    @Size(max = 50)
    private final String approximateAge;

    @Digits(integer = 3, fraction = 2)
    private final BigDecimal weightKg;

    @Size(max = 2000)
    private final String description;

    private final Boolean isSterilized;

    private final Boolean isDeceased;

    @NotNull
    private final OffsetDateTime createdAt;

    @NotNull
    private final OffsetDateTime updatedAt;
}
