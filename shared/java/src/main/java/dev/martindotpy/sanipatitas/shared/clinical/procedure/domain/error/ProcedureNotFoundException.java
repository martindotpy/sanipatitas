package dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ProcedureNotFoundException extends HttpProblem {
    public ProcedureNotFoundException(UUID procedureId) {
        super(builder()
                .withTitle("Procedimiento no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El procedimiento con ID %s no existe".formatted(procedureId))
                .with("procedureId", procedureId));
    }
}
