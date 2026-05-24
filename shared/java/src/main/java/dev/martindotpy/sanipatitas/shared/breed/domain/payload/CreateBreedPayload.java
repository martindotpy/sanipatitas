package dev.martindotpy.sanipatitas.shared.breed.domain.payload;

import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface CreateBreedPayload {
    @Nullable
    UUID getId();

    String getName();

    @Nullable
    String getDescription();

    UUID getSpeciesId();
}
