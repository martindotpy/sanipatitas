package dev.martindotpy.sanipatitas.shared.patient.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeletePatientPort {
    Uni<Void> deleteById(UUID id);
}
