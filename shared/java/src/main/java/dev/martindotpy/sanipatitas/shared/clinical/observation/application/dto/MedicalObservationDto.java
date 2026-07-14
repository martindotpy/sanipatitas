package dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationStatus;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.user.application.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MedicalObservationDto {
    @NotNull
    private final UUID id;

    @Nullable
    private final String code;

    @NotBlank
    @Size(max = 2000)
    private final String value;

    @Nullable
    private final String unit;

    @Nullable
    private final String interpretation;

    @Nullable
    private final String bodySite;

    @Nullable
    private final String method;

    @Nullable
    private final String referenceRange;

    @Nullable
    private final ObservationCategory category;

    @NotNull
    private final ObservationStatus status;

    @Nullable
    private final LocalDateTime issuedDate;

    @NotNull
    private final LocalDateTime createdAt;

    @NotNull
    private final LocalDateTime updatedAt;

    @NotNull
    private final PatientDto patient;

    @NotNull
    private final UserDto veterinarian;
}