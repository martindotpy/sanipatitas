package dev.martindotpy.sanipatitas.ehr.adapter.request;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.CreatePrescriptionItemPayload;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.CreatePrescriptionPayload;
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
public class CreatePrescriptionRequest implements CreatePrescriptionPayload {
    @Nullable
    private UUID id;

    @NotNull
    private OffsetDateTime issueDate;

    @Nullable
    private OffsetDateTime expirationDate;

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
    private List<CreatePrescriptionItemRequest> items;

    @Override
    public List<? extends CreatePrescriptionItemPayload> getItems() {
        return items;
    }
}
