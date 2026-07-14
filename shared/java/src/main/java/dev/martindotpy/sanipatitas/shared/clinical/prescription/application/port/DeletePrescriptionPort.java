package dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeletePrescriptionPort {
    Uni<Void> deleteById(UUID id);
}
