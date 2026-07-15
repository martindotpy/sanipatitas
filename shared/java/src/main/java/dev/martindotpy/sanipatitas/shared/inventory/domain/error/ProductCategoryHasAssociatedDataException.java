package dev.martindotpy.sanipatitas.shared.inventory.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ProductCategoryHasAssociatedDataException extends HttpProblem {
    public ProductCategoryHasAssociatedDataException(UUID categoryId) {
        super(builder()
                .withTitle("Categoría tiene productos asociados")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("No se puede eliminar la categoría porque tiene productos asociados. " +
                        "Elimine o reasigne los productos antes de eliminar la categoría.")
                .with("categoryId", categoryId));
    }
}
