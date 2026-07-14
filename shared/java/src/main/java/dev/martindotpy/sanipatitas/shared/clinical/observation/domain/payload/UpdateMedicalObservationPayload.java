package dev.martindotpy.sanipatitas.shared.clinical.observation.domain.payload;

import java.time.LocalDateTime;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationStatus;

public interface UpdateMedicalObservationPayload {
    @Nullable
    String getCode();

    String getValue();

    @Nullable
    String getUnit();

    @Nullable
    String getInterpretation();

    @Nullable
    String getBodySite();

    @Nullable
    String getMethod();

    @Nullable
    String getReferenceRange();

    @Nullable
    ObservationCategory getCategory();

    @Nullable
    ObservationStatus getStatus();

    @Nullable
    LocalDateTime getIssuedDate();

    UUID getPatientId();

    UUID getVeterinarianId();
}