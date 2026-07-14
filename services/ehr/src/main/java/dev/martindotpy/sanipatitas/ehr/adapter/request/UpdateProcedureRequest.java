package dev.martindotpy.sanipatitas.ehr.adapter.request;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload.UpdateProcedurePayload;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureStatus;
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
public class UpdateProcedureRequest implements UpdateProcedurePayload {
    @Nullable
    @Size(max = 20)
    private String code;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Nullable
    private ProcedureCategory category;

    @Nullable
    @Size(max = 2000)
    private String reason;

    @Nullable
    @Size(max = 2000)
    private String outcome;

    @Nullable
    @Size(max = 2000)
    private String complications;

    @Nullable
    private LocalDateTime performedDate;

    @Nullable
    private ProcedureStatus status;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID veterinarianId;
}
