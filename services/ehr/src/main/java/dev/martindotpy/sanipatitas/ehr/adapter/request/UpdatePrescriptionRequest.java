package dev.martindotpy.sanipatitas.ehr.adapter.request;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.UpdatePrescriptionItemPayload;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.UpdatePrescriptionPayload;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.PrescriptionStatus;
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
public class UpdatePrescriptionRequest implements UpdatePrescriptionPayload {
    @NotNull
    private LocalDateTime issueDate;

    @Nullable
    private LocalDateTime expirationDate;

    @Nullable
    private String notes;

    @Nullable
    private PrescriptionStatus status;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID veterinarianId;

    @NotEmpty
    @Valid
    private List<UpdatePrescriptionItemRequest> items;

    @Override
    public List<? extends UpdatePrescriptionItemPayload> getItems() {
        return items;
    }
}
