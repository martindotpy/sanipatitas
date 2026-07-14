package dev.martindotpy.sanipatitas.shared.clinical.observation.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteMedicalObservationPort {
    Uni<Void> deleteById(UUID id);
}