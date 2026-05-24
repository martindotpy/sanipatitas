package dev.martindotpy.sanipatitas.shared.breed.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteBreedPort {
    Uni<Void> deleteById(UUID id);
}
