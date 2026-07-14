package dev.martindotpy.sanipatitas.ehr.adapter.request;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.payload.UpdateMedicalObservationPayload;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationStatus;
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
public class UpdateMedicalObservationRequest implements UpdateMedicalObservationPayload {
    @Nullable
    @Size(max = 255)
    private String code;

    @NotBlank
    @Size(max = 2000)
    private String value;

    @Nullable
    @Size(max = 100)
    private String unit;

    @Nullable
    @Size(max = 255)
    private String interpretation;

    @Nullable
    @Size(max = 255)
    private String bodySite;

    @Nullable
    @Size(max = 255)
    private String method;

    @Nullable
    @Size(max = 500)
    private String referenceRange;

    @Nullable
    private ObservationCategory category;

    @Nullable
    private ObservationStatus status;

    @Nullable
    private LocalDateTime issuedDate;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID veterinarianId;
}