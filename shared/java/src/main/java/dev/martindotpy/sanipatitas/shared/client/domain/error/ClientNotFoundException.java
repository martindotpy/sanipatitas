package dev.martindotpy.sanipatitas.shared.client.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ClientNotFoundException extends HttpProblem {
    public ClientNotFoundException(UUID clientId) {
        super(builder()
                .withTitle("Cliente no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El cliente con ID %s no existe".formatted(clientId))
                .with("clientId", clientId));
    }
}
