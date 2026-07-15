package dev.martindotpy.sanipatitas.shared.clinical.immunization.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationRoute;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationStatus;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.user.application.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ImmunizationDto {
    @NotNull
    private final UUID id;

    @Nullable
    private final String vaccineCode;

    @NotBlank
    @Size(max = 255)
    private final String vaccineName;

    @Nullable
    private final String manufacturer;

    @Nullable
    private final String lotNumber;

    @Nullable
    private final OffsetDateTime expirationDate;

    @NotNull
    private final OffsetDateTime administrationDate;

    @Nullable
    private final String doseNumber;

    @Nullable
    private final String doseUnit;

    @Nullable
    private final ImmunizationRoute route;

    @Nullable
    private final String site;

    @Nullable
    private final String reaction;

    @NotNull
    private final ImmunizationStatus status;

    @NotNull
    private final OffsetDateTime createdAt;

    @NotNull
    private final OffsetDateTime updatedAt;

    @NotNull
    private final PatientDto patient;

    @NotNull
    private final UserDto veterinarian;
}
