package dev.martindotpy.sanipatitas.shared.payment.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteBillingItemPort {
    Uni<Void> deleteById(UUID id);
}
