package dev.martindotpy.sanipatitas.shared.user.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class UserNotFoundException extends HttpProblem {
    public UserNotFoundException(UUID userId) {
        super(builder()
                .withTitle("Usuario no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El usuario con ID %s no existe".formatted(userId))
                .with("userId", userId));
    }
}
