package dev.martindotpy.sanipatitas.shared.inventory.application.dto;

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
public class SupplierDto {
    @NotNull private final UUID id;
    @NotBlank private final String name;
    @Nullable private final String ruc;
    @Nullable private final String contactName;
    @Nullable private final String contactPhone;
    @Nullable private final String email;
    @Nullable private final String address;
    @NotNull private final LocalDateTime createdAt;
    @NotNull private final LocalDateTime updatedAt;
}
