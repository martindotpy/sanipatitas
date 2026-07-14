package dev.martindotpy.sanipatitas.shared.inventory.application.dto;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class InventoryStatsDto {
    @NotNull
    private final long totalProducts;
    @NotNull
    private final long totalCategories;
    @NotNull
    private final long totalSuppliers;
    @NotNull
    private final long lowStockCount;
    @NotNull
    private final long totalStockValue;
    @NotNull
    private final long totalStockQuantity;
}
