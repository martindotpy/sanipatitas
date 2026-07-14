package dev.martindotpy.sanipatitas.inventory.adapter.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateSupplierPayload;
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
public class UpdateSupplierRequest implements UpdateSupplierPayload {
    @NotBlank
    @Size(max = 255)
    private String name;

    @Nullable
    @Size(max = 20)
    private String ruc;

    @Nullable
    @Size(max = 255)
    private String contactName;

    @Nullable
    @Size(max = 50)
    private String contactPhone;

    @Nullable
    @Size(max = 255)
    private String email;

    @Nullable
    @Size(max = 500)
    private String address;
}
