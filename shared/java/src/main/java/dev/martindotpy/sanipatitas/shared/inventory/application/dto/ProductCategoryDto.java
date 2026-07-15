package dev.martindotpy.sanipatitas.shared.inventory.application.dto;

import java.time.OffsetDateTime;
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
public class ProductCategoryDto {
    @NotNull private final UUID id;
    @NotBlank private final String name;
    @Nullable private final String description;
    @NotNull private final OffsetDateTime createdAt;
    @NotNull private final OffsetDateTime updatedAt;
}
