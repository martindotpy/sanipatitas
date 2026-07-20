package dev.martindotpy.sanipatitas.shared.species.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class SpeciesHasAssociatedDataException extends HttpProblem {
    public SpeciesHasAssociatedDataException(UUID speciesId) {
        super(builder()
                .withTitle("Especie tiene datos asociados")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("No se puede eliminar la especie porque tiene razas asociadas. "
                        + "Elimine las razas antes de eliminar la especie.")
                .with("speciesId", speciesId));
    }
}
