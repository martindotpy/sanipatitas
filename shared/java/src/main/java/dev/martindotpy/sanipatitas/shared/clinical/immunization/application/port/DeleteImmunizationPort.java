package dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteImmunizationPort {
    Uni<Void> deleteById(UUID id);
}
