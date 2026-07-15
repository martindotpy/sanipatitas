package dev.martindotpy.sanipatitas.ehr.adapter.request;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.payload.UpdateImmunizationPayload;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationRoute;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationStatus;
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
public class UpdateImmunizationRequest implements UpdateImmunizationPayload {
    @Nullable
    @Size(max = 100)
    private String vaccineCode;

    @NotBlank
    @Size(max = 255)
    private String vaccineName;

    @Nullable
    @Size(max = 255)
    private String manufacturer;

    @Nullable
    @Size(max = 255)
    private String lotNumber;

    @Nullable
    private OffsetDateTime expirationDate;

    @NotNull
    private OffsetDateTime administrationDate;

    @Nullable
    @Size(max = 50)
    private String doseNumber;

    @Nullable
    @Size(max = 50)
    private String doseUnit;

    @Nullable
    private ImmunizationRoute route;

    @Nullable
    @Size(max = 255)
    private String site;

    @Nullable
    @Size(max = 2000)
    private String reaction;

    @Nullable
    private ImmunizationStatus status;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID veterinarianId;
}
