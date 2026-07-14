package dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionSeverity;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionStatus;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.user.application.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MedicalConditionDto {
    @NotNull
    private final UUID id;

    @NotBlank
    @Size(max = 255)
    private final String name;

    @Nullable
    private final String code;

    @Nullable
    @Size(max = 2000)
    private final String description;

    @Nullable
    private final OffsetDateTime onsetDate;

    @NotNull
    private final ConditionStatus status;

    @Nullable
    private final ConditionSeverity severity;

    @NotNull
    private final OffsetDateTime createdAt;

    @NotNull
    private final OffsetDateTime updatedAt;

    @NotNull
    private final PatientDto patient;

    @NotNull
    private final UserDto veterinarian;
}
