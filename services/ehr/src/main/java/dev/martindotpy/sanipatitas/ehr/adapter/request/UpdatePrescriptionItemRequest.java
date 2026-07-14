package dev.martindotpy.sanipatitas.ehr.adapter.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.UpdatePrescriptionItemPayload;
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
public class UpdatePrescriptionItemRequest implements UpdatePrescriptionItemPayload {
    @NotBlank
    @Size(max = 255)
    private String medicationName;

    @Nullable
    @Size(max = 100)
    private String dosage;

    @Nullable
    @Size(max = 100)
    private String frequency;

    @Nullable
    @Size(max = 100)
    private String duration;

    @Nullable
    @Size(max = 100)
    private String route;

    @Nullable
    @Size(max = 2000)
    private String notes;
}
