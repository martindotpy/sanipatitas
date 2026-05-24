package dev.martindotpy.sanipatitas.shared.species.domain.payload;

import org.jspecify.annotations.Nullable;

public interface UpdateSpeciesPayload {
    String getName();

    @Nullable
    String getDescription();
}
