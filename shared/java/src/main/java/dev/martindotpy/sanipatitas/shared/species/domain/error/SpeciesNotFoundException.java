package dev.martindotpy.sanipatitas.shared.species.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class SpeciesNotFoundException extends HttpProblem {
    public SpeciesNotFoundException(UUID speciesId) {
        super(builder()
                .withTitle("Especie no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La especie con ID %s no existe".formatted(speciesId))
                .with("speciesId", speciesId));
    }
}
