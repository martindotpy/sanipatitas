package dev.martindotpy.sanipatitas.inventory.adapter.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateProductCategoryPayload;
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
public class UpdateProductCategoryRequest implements UpdateProductCategoryPayload {
    @NotBlank
    @Size(max = 255)
    private String name;

    @Nullable
    @Size(max = 1000)
    private String description;
}
