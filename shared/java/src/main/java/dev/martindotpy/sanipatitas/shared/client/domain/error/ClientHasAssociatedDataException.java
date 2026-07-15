package dev.martindotpy.sanipatitas.shared.client.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ClientHasAssociatedDataException extends HttpProblem {
    public ClientHasAssociatedDataException(UUID clientId) {
        super(builder()
                .withTitle("Cliente tiene datos asociados")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("No se puede eliminar el cliente porque tiene pacientes, citas o facturas asociadas. "
                        + "Elimine o reasigne esos registros antes de eliminar el cliente.")
                .with("clientId", clientId));
    }
}
