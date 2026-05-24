package dev.martindotpy.sanipatitas.shared.species.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteSpeciesPort {
    Uni<Void> deleteById(UUID id);
}
