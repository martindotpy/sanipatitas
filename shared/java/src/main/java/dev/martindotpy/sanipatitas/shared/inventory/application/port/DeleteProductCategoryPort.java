package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteProductCategoryPort {
    Uni<Void> deleteById(UUID id);
}
