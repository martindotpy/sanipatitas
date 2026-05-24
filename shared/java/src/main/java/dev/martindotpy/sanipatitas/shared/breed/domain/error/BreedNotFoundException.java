package dev.martindotpy.sanipatitas.shared.breed.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class BreedNotFoundException extends HttpProblem {
    public BreedNotFoundException(UUID breedId) {
        super(builder()
                .withTitle("Raza no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La raza con ID %s no existe".formatted(breedId))
                .with("breedId", breedId));
    }
}
