package dev.martindotpy.sanipatitas.shared.patient.domain.payload;

import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface CreateSpeciesPayload {
    @Nullable
    UUID getId();

    String getName();

    String getDescription();
}
