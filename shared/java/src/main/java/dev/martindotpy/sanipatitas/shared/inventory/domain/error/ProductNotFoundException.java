package dev.martindotpy.sanipatitas.shared.inventory.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ProductNotFoundException extends HttpProblem {
    public ProductNotFoundException(UUID productId) {
        super(builder()
                .withTitle("Producto no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El producto con ID %s no existe".formatted(productId))
                .with("productId", productId));
    }
}
