package dev.martindotpy.sanipatitas.inventory.adapter.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateProductPayload;
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
public class CreateProductRequest implements CreateProductPayload {
    @Nullable private UUID id;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Nullable
    @Size(max = 100)
    private String code;

    @Nullable
    @Size(max = 2000)
    private String description;

    @Nullable private BigDecimal price;
    @Nullable private UUID categoryId;
    @Nullable private UUID supplierId;
}
