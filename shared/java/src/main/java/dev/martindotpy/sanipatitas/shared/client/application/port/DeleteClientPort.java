package dev.martindotpy.sanipatitas.shared.client.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteClientPort {
    Uni<Void> deleteById(UUID id);
}
