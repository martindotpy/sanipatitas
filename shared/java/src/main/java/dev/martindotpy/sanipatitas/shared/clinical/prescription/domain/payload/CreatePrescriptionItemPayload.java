package dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload;

import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface CreatePrescriptionItemPayload {
    @Nullable
    UUID getId();

    String getMedicationName();

    @Nullable
    String getDosage();

    @Nullable
    String getFrequency();

    @Nullable
    String getDuration();

    @Nullable
    String getRoute();

    @Nullable
    String getNotes();
}
