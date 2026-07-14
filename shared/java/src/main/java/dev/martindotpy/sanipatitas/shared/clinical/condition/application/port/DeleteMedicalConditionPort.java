package dev.martindotpy.sanipatitas.shared.clinical.condition.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteMedicalConditionPort {
    Uni<Void> deleteById(UUID id);
}
