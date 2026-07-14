package dev.martindotpy.sanipatitas.shared.clinical.condition.domain.payload;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionSeverity;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionStatus;

public interface CreateMedicalConditionPayload {
    @Nullable
    UUID getId();

    String getName();

    @Nullable
    String getCode();

    @Nullable
    String getDescription();

    @Nullable
    OffsetDateTime getOnsetDate();

    @Nullable
    ConditionStatus getStatus();

    @Nullable
    ConditionSeverity getSeverity();

    UUID getPatientId();

    UUID getVeterinarianId();
}
