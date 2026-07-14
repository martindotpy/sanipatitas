package dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload;

import java.time.LocalDateTime;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureStatus;

public interface CreateProcedurePayload {
    @Nullable
    UUID getId();

    @Nullable
    String getCode();

    String getName();

    @Nullable
    ProcedureCategory getCategory();

    @Nullable
    String getReason();

    @Nullable
    String getOutcome();

    @Nullable
    String getComplications();

    @Nullable
    LocalDateTime getPerformedDate();

    @Nullable
    ProcedureStatus getStatus();

    UUID getPatientId();

    UUID getVeterinarianId();
}
