package dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteProcedurePort {
    Uni<Void> deleteById(UUID id);
}
