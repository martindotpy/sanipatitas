package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteSupplierPort {
    Uni<Void> deleteById(UUID id);
}
