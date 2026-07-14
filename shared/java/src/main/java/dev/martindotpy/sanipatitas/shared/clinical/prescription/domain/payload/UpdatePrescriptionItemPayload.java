package dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload;

import org.jspecify.annotations.Nullable;

public interface UpdatePrescriptionItemPayload {
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
