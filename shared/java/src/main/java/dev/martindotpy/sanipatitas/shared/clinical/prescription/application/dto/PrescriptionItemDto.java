package dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PrescriptionItemDto {
    @NotNull
    private final UUID id;

    @NotBlank
    private final String medicationName;

    @Nullable
    private final String dosage;

    @Nullable
    private final String frequency;

    @Nullable
    private final String duration;

    @Nullable
    private final String route;

    @Nullable
    private final String notes;

    @NotNull
    private final LocalDateTime createdAt;

    @NotNull
    private final LocalDateTime updatedAt;
}
