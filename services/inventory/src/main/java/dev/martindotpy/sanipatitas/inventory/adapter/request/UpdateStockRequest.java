package dev.martindotpy.sanipatitas.inventory.adapter.request;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateStockPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStockRequest implements UpdateStockPayload {
    @NotNull
    private UUID productId;

    @Min(0)
    private int quantity;

    @Nullable
    private String location;

    @Nullable
    @Min(0)
    private Integer minStock;
}
