package dev.martindotpy.sanipatitas.shared.inventory.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ProductHasAssociatedDataException extends HttpProblem {
    public ProductHasAssociatedDataException(UUID productId) {
        super(builder()
                .withTitle("Producto tiene datos asociados")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("No se puede eliminar el producto porque tiene registros de stock asociados. " +
                        "Elimine o reasigne los registros de stock antes de eliminar el producto.")
                .with("productId", productId));
    }
}
