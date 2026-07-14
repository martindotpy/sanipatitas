package dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureStatus;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.user.application.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProcedureDto {
    @NotNull
    private final UUID id;

    @Nullable
    private final String code;

    @NotBlank
    @Size(max = 255)
    private final String name;

    @Nullable
    private final ProcedureCategory category;

    @Nullable
    @Size(max = 2000)
    private final String reason;

    @Nullable
    @Size(max = 2000)
    private final String outcome;

    @Nullable
    @Size(max = 2000)
    private final String complications;

    @Nullable
    private final LocalDateTime performedDate;

    @NotNull
    private final ProcedureStatus status;

    @NotNull
    private final LocalDateTime createdAt;

    @NotNull
    private final LocalDateTime updatedAt;

    @NotNull
    private final PatientDto patient;

    @NotNull
    private final UserDto veterinarian;
}
