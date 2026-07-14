package dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.PrescriptionStatus;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.user.application.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PrescriptionDto {
    @NotNull
    private final UUID id;

    @NotNull
    private final LocalDateTime issueDate;

    @Nullable
    private final LocalDateTime expirationDate;

    @Nullable
    private final String notes;

    @NotNull
    private final PrescriptionStatus status;

    @NotNull
    private final LocalDateTime createdAt;

    @NotNull
    private final LocalDateTime updatedAt;

    @NotNull
    private final PatientDto patient;

    @NotNull
    private final UserDto veterinarian;

    @NotNull
    private final List<PrescriptionItemDto> items;
}
