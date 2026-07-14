package dev.martindotpy.sanipatitas.ehr.adapter.request;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.payload.UpdateMedicalConditionPayload;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionSeverity;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionStatus;
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
public class UpdateMedicalConditionRequest implements UpdateMedicalConditionPayload {
    @NotBlank
    @Size(max = 255)
    private String name;

    @Nullable
    @Size(max = 20)
    private String code;

    @Nullable
    @Size(max = 2000)
    private String description;

    @Nullable
    private OffsetDateTime onsetDate;

    @Nullable
    private ConditionStatus status;

    @Nullable
    private ConditionSeverity severity;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID veterinarianId;
}
